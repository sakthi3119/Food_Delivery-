package com.fooddelivery.deliveryservice.controller;

import com.fooddelivery.deliveryservice.model.Delivery;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.concurrent.atomic.AtomicInteger;

/**
 * DELIVERY CONTROLLER
 * HLD: Manages delivery operations
 * 
 * Production Flow:
 * 1. Receive delivery request
 * 2. Find available delivery partners (geo-location based)
 * 3. Assign to nearest partner
 * 4. Track real-time location
 * 5. Update delivery status
 */
@RestController
@RequestMapping("/delivery")
@CrossOrigin(origins = "*")
public class DeliveryController {
    
    // In-memory storage (HLD - No database)
    private List<Delivery> deliveryDb = new ArrayList<>();
    private AtomicInteger deliveryCounter = new AtomicInteger(1);
    
    /**
     * GET /delivery/{orderId}
     * Fetch delivery status for an order
     */
    @GetMapping("/{orderId}")
    public ResponseEntity<?> getDeliveryStatus(@PathVariable Integer orderId) {
        // HLD: Find delivery by order ID
        // Production: Database query with caching
        Delivery delivery = deliveryDb.stream()
            .filter(d -> d.getOrderId().equals(orderId))
            .findFirst()
            .orElse(null);
            
        if (delivery == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(Map.of("error", "Delivery not found for order"));
        }
        
        return ResponseEntity.ok(delivery);
    }
    
    /**
     * POST /delivery/assign
     * Assign delivery partner to order
     * 
     * Request Body: { "orderId": 1, "deliveryAddress": "123 Main St" }
     */
    @PostMapping("/assign")
    public ResponseEntity<?> assignDelivery(@RequestBody Map<String, Object> request) {
        // HLD: Extract request data
        Integer orderId = (Integer) request.get("orderId");
        String deliveryAddress = (String) request.get("deliveryAddress");
        String pickupAddress = (String) request.getOrDefault("pickupAddress", "Restaurant Location");
        
        // HLD: Mock delivery partner assignment
        // Production: Algorithm to find nearest available partner
        Integer partnerId = 501;  // Mock partner ID
        String partnerName = "John Delivery";
        
        Delivery delivery = new Delivery(
            deliveryCounter.getAndIncrement(),
            orderId,
            partnerId,
            partnerName,
            "ASSIGNED",
            pickupAddress,
            deliveryAddress,
            "25-30 min",
            LocalDateTime.now().toString()
        );
        
        deliveryDb.add(delivery);
        
        return ResponseEntity.status(HttpStatus.CREATED).body(delivery);
    }
    
    /**
     * PUT /delivery/{orderId}/status
     * Update delivery status (called by delivery partner app or internal service)
     * 
     * Request Body: { "status": "PICKED_UP" }
     */
    @PutMapping("/{orderId}/status")
    public ResponseEntity<?> updateDeliveryStatus(
            @PathVariable Integer orderId,
            @RequestBody Map<String, String> request) {
        
        // HLD: Find and update delivery status
        Delivery delivery = deliveryDb.stream()
            .filter(d -> d.getOrderId().equals(orderId))
            .findFirst()
            .orElse(null);
            
        if (delivery == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(Map.of("error", "Delivery not found"));
        }
        
        String newStatus = request.get("status");
        delivery.setStatus(newStatus);
        
        return ResponseEntity.ok(Map.of(
            "message", "Delivery status updated",
            "orderId", orderId,
            "status", newStatus
        ));
    }
    
    /**
     * GET /delivery
     * Get all deliveries (for admin/monitoring)
     */
    @GetMapping
    public ResponseEntity<List<Delivery>> getAllDeliveries() {
        return ResponseEntity.ok(deliveryDb);
    }
}
