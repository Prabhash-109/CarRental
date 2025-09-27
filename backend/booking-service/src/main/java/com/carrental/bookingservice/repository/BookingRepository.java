package com.carrental.bookingservice.repository;

import com.carrental.bookingservice.entity.Booking;
import com.carrental.bookingservice.entity.BookingStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface BookingRepository extends JpaRepository<Booking, Long> {
    List<Booking> findByUserId(Long userId);
    List<Booking> findByCarId(Long carId);
    List<Booking> findByStatus(BookingStatus status);
    long countByStatus(BookingStatus status);
    
    @Query("SELECT b FROM Booking b WHERE b.carId = :carId AND " +
           "NOT (b.endDate < :startDate OR b.startDate > :endDate) AND " +
           "b.status IN (com.carrental.bookingservice.entity.BookingStatus.PENDING, com.carrental.bookingservice.entity.BookingStatus.ACCEPTED)")
    List<Booking> findConflictingBookings(@Param("carId") Long carId,
                                         @Param("startDate") LocalDate startDate,
                                         @Param("endDate") LocalDate endDate);
}
