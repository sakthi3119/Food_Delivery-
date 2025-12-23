package com.fooddelivery.deliveryservice.controller;

import com.fooddelivery.deliveryservice.model.Payment;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.concurrent.atomic.AtomicInteger;

/**
 * PAYMENT CONTROLLER
 * HLD: Manages payment processing
 * 
 * Production Flow:
 * 1. Validate payment details
 * 2. Integrate with payment gateway (Stripe, Razorpay, etc.)
 * 3. Process transaction
 * 4. Handle success/failure
 * 5. Send confirmation
 */
@RestController
@RequestMapping("/payments")
@CrossOrigin(origins = "*")
public class PaymentController {
    
    // In-memory storage (HLD - No database)
    private List<Payment> paymentDb = new ArrayList<>();
    private AtomicInteger paymentCounter = new AtomicInteger(1);
    
    /**
     * POST /payments
     * Process payment for an order
     * 
     * Request Body: { 
     *   "orderId": 1, 
     *   "amount": 25.99, 
     *   "paymentMethod": "CARD" 
     * }
     */
    @PostMapping
    public ResponseEntity<?> processPayment(@RequestBody Map<String, Object> request) {
        // HLD: Extract payment details
        Integer orderId = (Integer) request.get("orderId");
        Double amount = ((Number) request.get("amount")).doubleValue();
        String paymentMethod = (String) request.get("paymentMethod");
        
        // HLD: Mock payment processing
        // Production: Call payment gateway API (Stripe, Razorpay, etc.)
        String transactionId = "TXN" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();
        
        Payment payment = new Payment(
            paymentCounter.getAndIncrement(),
            orderId,
            amount,
            paymentMethod,
            "SUCCESS",  // Mock success (in production: actual gateway response)
            transactionId,
            LocalDateTime.now().toString()
        );
        
        paymentDb.add(payment);
        
        return ResponseEntity.status(HttpStatus.CREATED).body(payment);
    }
    
    /**
     * GET /payments/{orderId}
     * Get payment status for an order
     */
    @GetMapping("/{orderId}")
    public ResponseEntity<?> getPaymentStatus(@PathVariable Integer orderId) {
        // HLD: Find payment by order ID
        Payment payment = paymentDb.stream()
            .filter(p -> p.getOrderId().equals(orderId))
            .findFirst()
            .orElse(null);
            
        if (payment == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(Map.of("error", "Payment not found for order"));
        }
        
        return ResponseEntity.ok(payment);
    }
    
    /**
     * GET /payments
     * Get all payments (for admin/monitoring)
     */
    @GetMapping
    public ResponseEntity<List<Payment>> getAllPayments() {
        return ResponseEntity.ok(paymentDb);
    }
    
    /**
     * POST /payments/{orderId}/refund
     * Process refund for an order
     * 
     * Request Body: { "reason": "Order cancelled" }
     */
    @PostMapping("/{orderId}/refund")
    public ResponseEntity<?> processRefund(
            @PathVariable Integer orderId,
            @RequestBody Map<String, String> request) {
        
        // HLD: Find original payment
        Payment payment = paymentDb.stream()
            .filter(p -> p.getOrderId().equals(orderId))
            .findFirst()
            .orElse(null);
            
        if (payment == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(Map.of("error", "Payment not found"));
        }
        
        // HLD: Mock refund processing
        // Production: Call payment gateway refund API
        String refundId = "REF" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();
        
        return ResponseEntity.ok(Map.of(
            "message", "Refund processed successfully",
            "orderId", orderId,
            "refundId", refundId,
            "amount", payment.getAmount(),
            "reason", request.get("reason")
        ));
    }
}
