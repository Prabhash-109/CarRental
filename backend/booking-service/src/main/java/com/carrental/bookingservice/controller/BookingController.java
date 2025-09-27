package com.carrental.bookingservice.controller;

import com.carrental.bookingservice.dto.BookingRequest;
import com.carrental.bookingservice.entity.Booking;
import com.carrental.bookingservice.entity.BookingStatus;
import com.carrental.bookingservice.service.BookingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/bookings")
@CrossOrigin(origins = "*")
public class BookingController {

    @Autowired
    private BookingService bookingService;

    @GetMapping("/test")
    public ResponseEntity<String> test() {
        return ResponseEntity.ok("Booking service is working!");
    }

    @GetMapping("/debug/all")
    public ResponseEntity<List<Booking>> getAllBookingsDebug() {
        List<Booking> bookings = bookingService.getAllBookings();
        return ResponseEntity.ok(bookings);
    }

    @GetMapping("/user/my-bookings")
    public ResponseEntity<List<Booking>> getMyBookings(Authentication authentication) {
        String username = authentication.getName();
        List<Booking> bookings = bookingService.getBookingsByUsername(username);
        return ResponseEntity.ok(bookings);
    }

    @GetMapping("/admin/all")
    public ResponseEntity<List<Booking>> getAllBookings() {
        List<Booking> bookings = bookingService.getAllBookings();
        return ResponseEntity.ok(bookings);
    }

    @GetMapping("/admin/car/{carId}")
    public ResponseEntity<List<Booking>> getBookingsByCar(@PathVariable Long carId) {
        List<Booking> bookings = bookingService.getBookingsByCar(carId);
        return ResponseEntity.ok(bookings);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Booking> getBookingById(@PathVariable Long id) {
        Optional<Booking> booking = bookingService.getBookingById(id);
        return booking.map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
    }

    @PostMapping("/user/create")
    public ResponseEntity<Booking> createBooking(@Valid @RequestBody BookingRequest request, 
                                               Authentication authentication) {
        String username = authentication.getName();
        Booking booking = bookingService.createBooking(request, username);
        return ResponseEntity.ok(booking);
    }

    @PutMapping("/user/{id}")
    public ResponseEntity<Booking> updateBooking(@PathVariable Long id, @Valid @RequestBody BookingRequest request, 
                                               Authentication authentication) {
        String username = authentication.getName();
        Booking booking = bookingService.updateBooking(id, request, username);
        return ResponseEntity.ok(booking);
    }

    @DeleteMapping("/user/{id}")
    public ResponseEntity<Void> deleteBooking(@PathVariable Long id, Authentication authentication) {
        String username = authentication.getName();
        bookingService.deleteBooking(id, username);
        return ResponseEntity.ok().build();
    }

    @PutMapping("/user/{id}/return")
    public ResponseEntity<String> returnCar(@PathVariable Long id, Authentication authentication) {
        try {
            String username = authentication.getName();
            bookingService.returnCar(id, username);
            return ResponseEntity.ok("Car returned successfully and booking completed!");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        }
    }

    @PutMapping("/admin/{id}/status")
    public ResponseEntity<Booking> updateBookingStatus(@PathVariable Long id, @RequestParam String status) {
        try {
            BookingStatus bookingStatus = BookingStatus.valueOf(status.toUpperCase());
            Booking booking = bookingService.updateBookingStatus(id, bookingStatus);
            return ResponseEntity.ok(booking);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    // New Agent endpoints
    @GetMapping("/agent/pending")
    public ResponseEntity<List<Booking>> getPendingBookings() {
        List<Booking> bookings = bookingService.getAllPendingBookings();
        return ResponseEntity.ok(bookings);
    }

    @PutMapping("/agent/{id}/accept")
    public ResponseEntity<Booking> acceptBooking(@PathVariable Long id) {
        Booking booking = bookingService.acceptBooking(id);
        return ResponseEntity.ok(booking);
    }

    @PutMapping("/agent/{id}/reject")
    public ResponseEntity<Booking> rejectBooking(@PathVariable Long id) {
        Booking booking = bookingService.rejectBooking(id);
        return ResponseEntity.ok(booking);
    }

    @PutMapping("/agent/{id}/complete")
    public ResponseEntity<Booking> completeBooking(@PathVariable Long id) {
        Booking booking = bookingService.completeBooking(id);
        return ResponseEntity.ok(booking);
    }

    // List of accepted bookings for the logged-in agent
    @GetMapping("/agent/rented")
    public ResponseEntity<List<Booking>> getAgentAcceptedBookings(Authentication authentication) {
        String username = authentication.getName();
        List<Booking> bookings = bookingService.getAcceptedBookingsForAgent(username);
        return ResponseEntity.ok(bookings);
    }

    // Dashboard statistics endpoints
    @GetMapping("/agent/stats/rented-count")
    public ResponseEntity<Long> getRentedCarsCount() {
        long count = bookingService.getRentedCarsCount();
        return ResponseEntity.ok(count);
    }

    @GetMapping("/agent/stats/pending-count")
    public ResponseEntity<Long> getPendingBookingsCount() {
        long count = bookingService.getPendingBookingsCount();
        return ResponseEntity.ok(count);
    }

    @GetMapping("/check-availability")
    public ResponseEntity<Boolean> checkAvailability(@RequestParam Long carId, 
                                                   @RequestParam String startDate, 
                                                   @RequestParam String endDate) {
        // This would need proper date parsing in a real application
        boolean available = bookingService.isCarAvailable(carId, null, null);
        return ResponseEntity.ok(available);
    }

}
