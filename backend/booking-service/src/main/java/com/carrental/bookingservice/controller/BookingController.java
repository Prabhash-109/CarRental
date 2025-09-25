package com.carrental.bookingservice.controller;

import com.carrental.bookingservice.dto.BookingRequest;
import com.carrental.bookingservice.entity.Booking;
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

    @PutMapping("/admin/{id}/status")
    public ResponseEntity<Booking> updateBookingStatus(@PathVariable Long id, @RequestParam String status) {
        Booking booking = bookingService.updateBookingStatus(id, status);
        return ResponseEntity.ok(booking);
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
