package com.fooddelivery.deliveryservice.model;

/**
 * Payment Entity
 * HLD: Represents a payment transaction
 */
public class Payment {
    private Integer id;
    private Integer orderId;
    private Double amount;
    private String paymentMethod;  // CARD, UPI, WALLET, COD
    private String status;  // PENDING, PROCESSING, SUCCESS, FAILED
    private String transactionId;
    private String createdAt;
    
    // Constructors
    public Payment() {}
    
    public Payment(Integer id, Integer orderId, Double amount, 
                   String paymentMethod, String status, 
                   String transactionId, String createdAt) {
        this.id = id;
        this.orderId = orderId;
        this.amount = amount;
        this.paymentMethod = paymentMethod;
        this.status = status;
        this.transactionId = transactionId;
        this.createdAt = createdAt;
    }
    
    // Getters and Setters
    public Integer getId() { return id; }
    public void setId(Integer id) { this.id = id; }
    
    public Integer getOrderId() { return orderId; }
    public void setOrderId(Integer orderId) { this.orderId = orderId; }
    
    public Double getAmount() { return amount; }
    public void setAmount(Double amount) { this.amount = amount; }
    
    public String getPaymentMethod() { return paymentMethod; }
    public void setPaymentMethod(String paymentMethod) { 
        this.paymentMethod = paymentMethod; 
    }
    
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    
    public String getTransactionId() { return transactionId; }
    public void setTransactionId(String transactionId) { 
        this.transactionId = transactionId; 
    }
    
    public String getCreatedAt() { return createdAt; }
    public void setCreatedAt(String createdAt) { this.createdAt = createdAt; }
}
