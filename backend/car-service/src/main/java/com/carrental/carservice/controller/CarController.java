package com.carrental.carservice.controller;

import com.carrental.carservice.dto.CarRequest;
import com.carrental.carservice.entity.Car;
import com.carrental.carservice.service.CarService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;

import java.io.IOException;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/cars")
@CrossOrigin(origins = "*")
public class CarController {

    @Autowired
    private CarService carService;

    @GetMapping("/public/available")
    public ResponseEntity<List<Car>> getAvailableCars() {
        List<Car> cars = carService.getAvailableCars();
        return ResponseEntity.ok(cars);
    }

    @GetMapping("/public/search")
    public ResponseEntity<List<Car>> searchCars(
            @RequestParam(required = false) String brand,
            @RequestParam(required = false) String fuelType,
            @RequestParam(required = false) String transmission,
            @RequestParam(required = false) Double minPrice,
            @RequestParam(required = false) Double maxPrice) {
        List<Car> cars = carService.searchCars(brand, fuelType, transmission, minPrice, maxPrice);
        return ResponseEntity.ok(cars);
    }

    @GetMapping("/public/{id}")
    public ResponseEntity<Car> getCarById(@PathVariable Long id) {
        Optional<Car> car = carService.getCarById(id);
        return car.map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/public/{id}/agent-username")
    public ResponseEntity<String> getCarAgentUsername(@PathVariable Long id) {
        Optional<Car> car = carService.getCarById(id);
        if (car.isPresent() && car.get().getAgent() != null) {
            return ResponseEntity.ok(car.get().getAgent().getUsername());
        }
        return ResponseEntity.notFound().build();
    }

    @GetMapping("/agent/my-cars")
    public ResponseEntity<List<Car>> getMyCars(Authentication authentication) {
        String username = authentication.getName();
        List<Car> cars = carService.getCarsByAgentUsername(username);
        return ResponseEntity.ok(cars);
    }

    @PostMapping("/agent/add")
    public ResponseEntity<Car> addCar(@Valid @RequestBody CarRequest request, Authentication authentication) throws IOException {
        String username = authentication.getName();
        Car car = carService.createCar(request, username);
        return ResponseEntity.ok(car);
    }

    @PutMapping("/agent/{id}")
    public ResponseEntity<Car> updateCar(@PathVariable Long id, @Valid @RequestBody CarRequest request, 
                                       Authentication authentication) throws IOException {
        String username = authentication.getName();
        Car car = carService.updateCar(id, request, username);
        return ResponseEntity.ok(car);
    }

    @DeleteMapping("/agent/{id}")
    public ResponseEntity<Void> deleteCar(@PathVariable Long id, Authentication authentication) {
        String username = authentication.getName();
        carService.deleteCar(id, username);
        return ResponseEntity.ok().build();
    }

    @PutMapping("/admin/{id}/status")
    public ResponseEntity<Car> updateCarStatus(@PathVariable Long id, @RequestParam String status) {
        Car car = carService.updateCarStatus(id, status);
        return ResponseEntity.ok(car);
    }

}
