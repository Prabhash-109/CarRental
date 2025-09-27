package com.carrental.bookingservice.service;

import com.carrental.bookingservice.entity.User;
import com.carrental.bookingservice.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.Map;

@Service
public class UserService {

    private static final Logger logger = LoggerFactory.getLogger(UserService.class);

    @Autowired
    private RestTemplate restTemplate;

    @Autowired
    private UserRepository userRepository;

    @Value("${car.service.url:http://localhost:8081}")
    private String carServiceUrl;

    public User getOrCreateUser(String username) {
        return userRepository.findByUsername(username).orElseGet(() -> {
            // Try to fetch user details from car service
            User userDetails = fetchUserFromCarService(username);
            if (userDetails != null) {
                return userRepository.save(userDetails);
            } else {
                // Create a basic user record as fallback
                User newUser = new User();
                newUser.setUsername(username);
                newUser.setEmail(username + "@temp.com");
                newUser.setFirstName("User");
                newUser.setLastName("Name");
                newUser.setRole("USER");
                newUser.setPassword("JWT_AUTH_USER"); // Placeholder for JWT authenticated users
                return userRepository.save(newUser);
            }
        });
    }

    @SuppressWarnings("unchecked")
    private User fetchUserFromCarService(String username) {
        try {
            String url = carServiceUrl + "/api/users/info?username=" + username;
            logger.info("Fetching user details from: {}", url);

            Map<String, Object> response = restTemplate.getForObject(url, Map.class);
            if (response != null) {
                User user = new User();
                user.setUsername((String) response.get("username"));
                user.setEmail((String) response.get("email"));
                user.setFirstName((String) response.get("firstName"));
                user.setLastName((String) response.get("lastName"));
                user.setRole((String) response.get("role"));
                user.setPhoneNumber((String) response.get("phoneNumber"));
                user.setPassword("JWT_AUTH_USER"); // Placeholder for JWT authenticated users
                return user;
            }
        } catch (Exception e) {
            logger.warn("Could not fetch user from car service: {}", e.getMessage());
        }
        return null;
    }

    public String getCarAgentUsername(Long carId) {
        try {
            String url = carServiceUrl + "/api/cars/public/" + carId + "/agent-username";
            logger.info("Fetching agent username from: {}", url);
            return restTemplate.getForObject(url, String.class);
        } catch (Exception e) {
            logger.warn("Could not fetch car agent username: {}", e.getMessage());
            return null;
        }
    }
}