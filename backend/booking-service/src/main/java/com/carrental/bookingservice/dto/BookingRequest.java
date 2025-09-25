package com.carrental.bookingservice.dto;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.math.BigDecimal;
import java.time.LocalDate;

public class BookingRequest {
    @NotNull
    private Long carId;

    @NotNull
    private LocalDate startDate;

    @NotNull
    private LocalDate endDate;

    @NotNull
    private BigDecimal totalAmount;

    @Size(max = 500)
    private String notes;

    public BookingRequest() {}

    public BookingRequest(Long carId, LocalDate startDate, LocalDate endDate, 
                         BigDecimal totalAmount, String notes) {
        this.carId = carId;
        this.startDate = startDate;
        this.endDate = endDate;
        this.totalAmount = totalAmount;
        this.notes = notes;
    }

    // Getters and Setters
    public Long getCarId() {
        return carId;
    }

    public void setCarId(Long carId) {
        this.carId = carId;
    }

    public LocalDate getStartDate() {
        return startDate;
    }

    public void setStartDate(LocalDate startDate) {
        this.startDate = startDate;
    }

    public LocalDate getEndDate() {
        return endDate;
    }

    public void setEndDate(LocalDate endDate) {
        this.endDate = endDate;
    }

    public BigDecimal getTotalAmount() {
        return totalAmount;
    }

    public void setTotalAmount(BigDecimal totalAmount) {
        this.totalAmount = totalAmount;
    }

    public String getNotes() {
        return notes;
    }

    public void setNotes(String notes) {
        this.notes = notes;
    }
}
