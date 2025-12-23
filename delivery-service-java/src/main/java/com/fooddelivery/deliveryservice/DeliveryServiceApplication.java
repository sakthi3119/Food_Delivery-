package com.fooddelivery.deliveryservice;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

/**
 * DELIVERY SERVICE - Food Delivery System
 * Language: Java (Spring Boot)
 * 
 * Purpose: Manages delivery operations and payment processing
 * Responsibilities:
 * - Delivery partner assignment
 * - Delivery tracking
 * - Payment processing
 * - Transaction management
 * 
 * Architecture Flow:
 * API Gateway → Delivery Service ← Internal Comm Service
 */
@SpringBootApplication
public class DeliveryServiceApplication {

    public static void main(String[] args) {
        SpringApplication.run(DeliveryServiceApplication.class, args);
        System.out.println("🚚 Delivery Service running on port 8002");
    }
}
