package com.carrental.carservice.service;

import com.carrental.carservice.dto.CarRequest;
import com.carrental.carservice.entity.Car;
import com.carrental.carservice.entity.User;
import com.carrental.carservice.repository.CarRepository;
import com.carrental.carservice.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class CarService {

    @Autowired
    private CarRepository carRepository;

    @Autowired
    private UserRepository userRepository;

    public List<Car> getAllCars() {
        return carRepository.findAll();
    }

    public List<Car> getAvailableCars() {
        return carRepository.findByStatus("AVAILABLE");
    }

    public List<Car> getCarsByAgent(Long agentId) {
        return carRepository.findByAgentId(agentId);
    }

    public List<Car> getCarsByAgentUsername(String username) {
        User agent = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Agent not found"));
        return carRepository.findByAgentId(agent.getId());
    }

    public List<Car> searchCars(String brand, String fuelType, String transmission, 
                               Double minPrice, Double maxPrice) {
        return carRepository.findAvailableCarsWithFilters(brand, fuelType, transmission, minPrice, maxPrice);
    }

    public Optional<Car> getCarById(Long id) {
        return carRepository.findById(id);
    }

    public Car createCar(CarRequest request, String username) {
        User agent = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Agent not found"));

        Car car = new Car();
        car.setName(request.getName());
        car.setModel(request.getModel());
        car.setYear(request.getYear());
        car.setBrand(request.getBrand());
        car.setRentPrice(request.getRentPrice());
        car.setFuelType(request.getFuelType());
        car.setTransmission(request.getTransmission());
        car.setMileage(request.getMileage());
        car.setColor(request.getColor());
        car.setStatus("AVAILABLE");
        car.setDescription(request.getDescription());
        car.setImageUrl(request.getImageUrl());
        car.setAgent(agent);

        return carRepository.save(car);
    }

    public Car updateCar(Long id, CarRequest request, String username) {
        Car car = carRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Car not found"));

        // Check if the user is the agent who owns this car
        if (!car.getAgent().getUsername().equals(username)) {
            throw new RuntimeException("You can only update your own cars");
        }

        car.setName(request.getName());
        car.setModel(request.getModel());
        car.setYear(request.getYear());
        car.setBrand(request.getBrand());
        car.setRentPrice(request.getRentPrice());
        car.setFuelType(request.getFuelType());
        car.setTransmission(request.getTransmission());
        car.setMileage(request.getMileage());
        car.setColor(request.getColor());
        car.setDescription(request.getDescription());
        car.setImageUrl(request.getImageUrl());

        return carRepository.save(car);
    }

    public void deleteCar(Long id, String username) {
        Car car = carRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Car not found"));

        // Check if the user is the agent who owns this car
        if (!car.getAgent().getUsername().equals(username)) {
            throw new RuntimeException("You can only delete your own cars");
        }

        carRepository.delete(car);
    }

    public Car updateCarStatus(Long id, String status) {
        Car car = carRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Car not found"));

        car.setStatus(status);
        return carRepository.save(car);
    }
}
