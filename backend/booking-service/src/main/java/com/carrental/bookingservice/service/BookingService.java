package com.carrental.bookingservice.service;

import com.carrental.bookingservice.dto.BookingRequest;
import com.carrental.bookingservice.entity.Booking;
import com.carrental.bookingservice.entity.User;
import com.carrental.bookingservice.repository.BookingRepository;
import com.carrental.bookingservice.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Service
public class BookingService {

    @Autowired
    private BookingRepository bookingRepository;

    @Autowired
    private UserRepository userRepository;

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

    public List<Booking> getBookingsByStatus(String status) {
        return bookingRepository.findByStatus(status);
    }

    public Optional<Booking> getBookingById(Long id) {
        return bookingRepository.findById(id);
    }

    public Booking createBooking(BookingRequest request, String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Check for conflicting bookings
        List<Booking> conflictingBookings = bookingRepository.findConflictingBookings(
                request.getCarId(), request.getStartDate(), request.getEndDate());

        if (!conflictingBookings.isEmpty()) {
            throw new RuntimeException("Car is not available for the selected dates");
        }

        Booking booking = new Booking();
        booking.setCarId(request.getCarId());
        booking.setUser(user);
        booking.setStartDate(request.getStartDate());
        booking.setEndDate(request.getEndDate());
        booking.setTotalAmount(request.getTotalAmount());
        booking.setStatus("PENDING");
        booking.setNotes(request.getNotes());

        return bookingRepository.save(booking);
    }

    public Booking updateBookingStatus(Long id, String status) {
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

    public boolean isCarAvailable(Long carId, LocalDate startDate, LocalDate endDate) {
        List<Booking> conflictingBookings = bookingRepository.findConflictingBookings(
                carId, startDate, endDate);
        return conflictingBookings.isEmpty();
    }
}
