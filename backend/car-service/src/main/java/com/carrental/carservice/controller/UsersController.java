package com.carrental.carservice.controller;

import com.carrental.carservice.entity.User;
import com.carrental.carservice.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "*")
public class UsersController {

    @Autowired
    private UserRepository userRepository;

    @GetMapping("/info")
    public ResponseEntity<Map<String, Object>> getUserInfo(@RequestParam String username) {
        return userRepository.findByUsername(username)
                .map(user -> {
                    Map<String, Object> map = new HashMap<>();
                    map.put("id", user.getId());
                    map.put("username", user.getUsername());
                    map.put("email", user.getEmail());
                    map.put("firstName", user.getFirstName());
                    map.put("lastName", user.getLastName());
                    map.put("role", user.getRole());
                    map.put("phoneNumber", user.getPhoneNumber());
                    return ResponseEntity.ok(map);
                })
                .orElse(ResponseEntity.notFound().build());
    }
}
