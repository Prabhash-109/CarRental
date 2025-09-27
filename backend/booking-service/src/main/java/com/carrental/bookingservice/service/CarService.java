package com.carrental.bookingservice.service;

import com.carrental.bookingservice.dto.CarDto;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.ResourceAccessException;
import org.springframework.web.client.RestTemplate;

import java.math.BigDecimal;
import java.util.Map;

@Service
public class CarService {

    private static final Logger logger = LoggerFactory.getLogger(CarService.class);

    @Autowired
    private RestTemplate restTemplate;

    @Value("${car.service.url:http://localhost:8081}")
    private String carServiceUrl;

    // Fetches from car-service public endpoint and maps fields to our CarDto
    public CarDto getCarById(Long carId) {
        try {
            String url = carServiceUrl + "/api/cars/public/" + carId;
            logger.info("Fetching car details from: {}", url);

            @SuppressWarnings("unchecked")
            Map<String, Object> response = restTemplate.getForObject(url, Map.class);
            if (response == null) return null;

            CarDto dto = new CarDto();
            dto.setId(((Number) response.get("id")).longValue());
            // Map brand -> make
            dto.setMake((String) response.get("brand"));
            dto.setModel((String) response.get("model"));
            Object yearObj = response.get("year");
            if (yearObj instanceof Number) dto.setYear(((Number) yearObj).intValue());
            dto.setColor((String) response.get("color"));
            // Map rentPrice -> pricePerDay
            Object price = response.get("rentPrice");
            if (price instanceof Number) {
                dto.setPricePerDay(new BigDecimal(((Number) price).toString()));
            } else if (price instanceof String) {
                dto.setPricePerDay(new BigDecimal((String) price));
            }
            dto.setStatus((String) response.get("status"));
            dto.setDescription((String) response.get("description"));
            dto.setImageUrl((String) response.get("imageUrl"));
            return dto;
        } catch (ResourceAccessException e) {
            logger.error("Failed to connect to car service: {}", e.getMessage());
            return null;
        } catch (Exception e) {
            logger.error("Error fetching car details: {}", e.getMessage());
            return null;
        }
    }

    // Update car status via car-service admin status endpoint
    public boolean updateCarStatus(Long carId, String status) {
        try {
            String url = carServiceUrl + "/api/cars/admin/" + carId + "/status?status=" + status;
            logger.info("Updating car status via: {}", url);
            ResponseEntity<Map> resp = restTemplate.exchange(url, HttpMethod.PUT, HttpEntity.EMPTY, Map.class);
            return resp.getStatusCode().is2xxSuccessful();
        } catch (Exception e) {
            logger.error("Failed to update car status: {}", e.getMessage());
            return false;
        }
    }
}