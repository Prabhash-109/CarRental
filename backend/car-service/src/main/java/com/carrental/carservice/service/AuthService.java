package com.carrental.carservice.service;

import com.carrental.carservice.dto.LoginRequest;
import com.carrental.carservice.dto.RegisterRequest;
import com.carrental.carservice.entity.User;
import com.carrental.carservice.repository.UserRepository;
import com.carrental.carservice.util.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@Service
public class AuthService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtUtil jwtUtil;

    public Map<String, Object> register(RegisterRequest request) {
        Map<String, Object> response = new HashMap<>();

        if (userRepository.existsByUsername(request.getUsername())) {
            response.put("success", false);
            response.put("message", "Username is already taken!");
            return response;
        }

        if (userRepository.existsByEmail(request.getEmail())) {
            response.put("success", false);
            response.put("message", "Email is already in use!");
            return response;
        }

        User user = new User();
        user.setUsername(request.getUsername());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setFirstName(request.getFirstName());
        user.setLastName(request.getLastName());
        user.setRole(request.getRole());
        user.setPhoneNumber(request.getPhoneNumber());

        userRepository.save(user);

        String token = jwtUtil.generateToken(user.getUsername(), user.getRole());

        response.put("success", true);
        response.put("message", "User registered successfully!");
        response.put("token", token);
        response.put("user", user);

        return response;
    }

    public Map<String, Object> login(LoginRequest request) {
        Map<String, Object> response = new HashMap<>();

        Optional<User> userOptional = userRepository.findByUsername(request.getUsername());
        if (userOptional.isEmpty()) {
            response.put("success", false);
            response.put("message", "User not found!");
            return response;
        }

        User user = userOptional.get();
        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            response.put("success", false);
            response.put("message", "Invalid password!");
            return response;
        }

        String token = jwtUtil.generateToken(user.getUsername(), user.getRole());

        response.put("success", true);
        response.put("message", "Login successful!");
        response.put("token", token);
        response.put("user", user);

        return response;
    }
}
