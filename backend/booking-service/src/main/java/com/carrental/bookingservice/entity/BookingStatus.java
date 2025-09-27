package com.carrental.bookingservice.entity;

public enum BookingStatus {
    PENDING("PENDING"),
    ACCEPTED("ACCEPTED"),
    REJECTED("REJECTED"),
    COMPLETED("COMPLETED"),
    CANCELLED("CANCELLED");

    private final String value;

    BookingStatus(String value) {
        this.value = value;
    }

    public String getValue() {
        return value;
    }

    @Override
    public String toString() {
        return value;
    }
}