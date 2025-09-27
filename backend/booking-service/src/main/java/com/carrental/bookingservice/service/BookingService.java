package com.carrental.bookingservice.service;

import com.carrental.bookingservice.dto.BookingRequest;
import com.carrental.bookingservice.dto.CarDto;
import com.carrental.bookingservice.entity.Booking;
import com.carrental.bookingservice.entity.BookingStatus;
import com.carrental.bookingservice.entity.User;
import com.carrental.bookingservice.repository.BookingRepository;
import com.carrental.bookingservice.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class BookingService {

    private static final Logger logger = LoggerFactory.getLogger(BookingService.class);

    @Autowired
    private BookingRepository bookingRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private CarService carService;

    @Autowired
    private UserService userService;

    public List<Booking> getAllBookings() {
        return bookingRepository.findAll();
    }

    public List<Booking> getBookingsByUser(Long userId) {
        return bookingRepository.findByUserId(userId);
    }

    public List<Booking> getBookingsByUsername(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return bookingRepository.findByUserId(user.getId());
    }

    public List<Booking> getBookingsByCar(Long carId) {
        return bookingRepository.findByCarId(carId);
    }

    public List<Booking> getBookingsByStatus(BookingStatus status) {
        return bookingRepository.findByStatus(status);
    }

    public Optional<Booking> getBookingById(Long id) {
        return bookingRepository.findById(id);
    }

    public Booking createBooking(BookingRequest request, String username) {
        User user = userService.getOrCreateUser(username);

        // Check for conflicting bookings
        List<Booking> conflictingBookings = bookingRepository.findConflictingBookings(
                request.getCarId(), request.getStartDate(), request.getEndDate());

        if (!conflictingBookings.isEmpty()) {
            // Log conflicting bookings for debugging
            logger.info("Found {} conflicting bookings for car {} from {} to {}", 
                    conflictingBookings.size(), request.getCarId(), 
                    request.getStartDate(), request.getEndDate());
            
            for (Booking conflict : conflictingBookings) {
                logger.info("Conflicting booking ID {}: {} to {} (Status: {})", 
                        conflict.getId(), conflict.getStartDate(), 
                        conflict.getEndDate(), conflict.getStatus());
            }
            
            throw new RuntimeException("Car is not available for the selected dates");
        }

        Booking booking = new Booking();
        booking.setCarId(request.getCarId());
        booking.setUser(user);
        booking.setStartDate(request.getStartDate());
        booking.setEndDate(request.getEndDate());
        booking.setTotalAmount(request.getTotalAmount());
        booking.setStatus(BookingStatus.PENDING);
        booking.setNotes(request.getNotes());

        // Fetch car details from car service
        CarDto carDto = carService.getCarById(request.getCarId());
        if (carDto != null) {
            booking.setCarMake(carDto.getMake());
            booking.setCarModel(carDto.getModel());
            booking.setCarYear(carDto.getYear());
            booking.setCarPricePerDay(carDto.getPricePerDay());
            booking.setCarImageUrl(carDto.getImageUrl());
        }

        return bookingRepository.save(booking);
    }

    public Booking updateBookingStatus(Long id, BookingStatus status) {
        Booking booking = bookingRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Booking not found"));

        booking.setStatus(status);
        return bookingRepository.save(booking);
    }

    public Booking updateBooking(Long id, BookingRequest request, String username) {
        Booking booking = bookingRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Booking not found"));

        // Check if the user owns this booking
        if (!booking.getUser().getUsername().equals(username)) {
            throw new RuntimeException("You can only update your own bookings");
        }

        // Check for conflicting bookings (excluding current booking)
        List<Booking> conflictingBookings = bookingRepository.findConflictingBookings(
                request.getCarId(), request.getStartDate(), request.getEndDate());

        conflictingBookings.removeIf(b -> b.getId().equals(id));
        if (!conflictingBookings.isEmpty()) {
            throw new RuntimeException("Car is not available for the selected dates");
        }

        booking.setCarId(request.getCarId());
        booking.setStartDate(request.getStartDate());
        booking.setEndDate(request.getEndDate());
        booking.setTotalAmount(request.getTotalAmount());
        booking.setNotes(request.getNotes());

        return bookingRepository.save(booking);
    }

    public void deleteBooking(Long id, String username) {
        Booking booking = bookingRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Booking not found"));

        // Check if the user owns this booking
        if (!booking.getUser().getUsername().equals(username)) {
            throw new RuntimeException("You can only delete your own bookings");
        }

        bookingRepository.delete(booking);
    }

    public void returnCar(Long id, String username) {
        Booking booking = bookingRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Booking not found"));

        // Check if the user owns this booking
        if (!booking.getUser().getUsername().equals(username)) {
            throw new RuntimeException("You can only return your own rental");
        }

        // Check if booking is ACCEPTED (currently rented)
        if (booking.getStatus() != BookingStatus.ACCEPTED) {
            throw new RuntimeException("Only accepted rentals can be returned");
        }

        // Mark car as AVAILABLE again
        try {
            carService.updateCarStatus(booking.getCarId(), "AVAILABLE");
        } catch (Exception e) {
            throw new RuntimeException("Failed to update car status");
        }

        // Remove the booking from database (rental completed)
        bookingRepository.delete(booking);
    }

    public boolean isCarAvailable(Long carId, LocalDate startDate, LocalDate endDate) {
        List<Booking> conflictingBookings = bookingRepository.findConflictingBookings(
                carId, startDate, endDate);
        return conflictingBookings.isEmpty();
    }

    // Agent methods
    public List<Booking> getAllPendingBookings() {
        return bookingRepository.findByStatus(BookingStatus.PENDING);
    }

    public Booking acceptBooking(Long bookingId) {
        Booking booking = updateBookingStatus(bookingId, BookingStatus.ACCEPTED);
        // Mark car as RENTED in car-service
        try {
            carService.updateCarStatus(booking.getCarId(), "RENTED");
        } catch (Exception ignored) {}
        return booking;
    }

    public Booking rejectBooking(Long bookingId) {
        return updateBookingStatus(bookingId, BookingStatus.REJECTED);
    }

    public Booking completeBooking(Long bookingId) {
        Booking booking = updateBookingStatus(bookingId, BookingStatus.COMPLETED);
        // Mark car as AVAILABLE again
        try {
            carService.updateCarStatus(booking.getCarId(), "AVAILABLE");
        } catch (Exception ignored) {}
        return booking;
    }

    // Return ACCEPTED bookings where the car belongs to the given agent username
    public List<Booking> getAcceptedBookingsForAgent(String agentUsername) {
        List<Booking> accepted = bookingRepository.findByStatus(BookingStatus.ACCEPTED);
        return accepted.stream().filter(b -> {
            try {
                String owner = userService.getCarAgentUsername(b.getCarId());
                return agentUsername.equals(owner);
            } catch (Exception e) {
                return false;
            }
        }).collect(Collectors.toList());
    }

    // Get count of rented cars for agent dashboard
    public long getRentedCarsCount() {
        return bookingRepository.countByStatus(BookingStatus.ACCEPTED);
    }

    // Get count of pending bookings for agent dashboard
    public long getPendingBookingsCount() {
        return bookingRepository.countByStatus(BookingStatus.PENDING);
    }
}
