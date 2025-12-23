package com.fooddelivery.deliveryservice.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

/**
 * HEALTH CHECK & ROOT CONTROLLER
 */
@RestController
public class HealthController {
    
    @GetMapping("/health")
    public ResponseEntity<?> healthCheck() {
        return ResponseEntity.ok(Map.of(
            "status", "healthy",
            "service", "delivery-service"
        ));
    }
    
    @GetMapping("/")
    public ResponseEntity<?> root() {
        return ResponseEntity.ok(Map.of(
            "message", "Delivery Service - Food Delivery System",
            "version", "1.0.0",
            "endpoints", Map.of(
                "delivery", "/delivery",
                "payments", "/payments"
            )
        ));
    }
}
