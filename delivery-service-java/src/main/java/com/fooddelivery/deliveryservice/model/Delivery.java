package com.fooddelivery.deliveryservice.model;

/**
 * Delivery Entity
 * HLD: Represents a delivery assignment
 */
public class Delivery {
    private Integer id;
    private Integer orderId;
    private Integer deliveryPartnerId;
    private String deliveryPartnerName;
    private String status;  // SEARCHING, ASSIGNED, PICKED_UP, ON_THE_WAY, DELIVERED
    private String pickupAddress;
    private String deliveryAddress;
    private String estimatedTime;
    private String createdAt;
    
    // Constructors
    public Delivery() {}
    
    public Delivery(Integer id, Integer orderId, Integer deliveryPartnerId, 
                    String deliveryPartnerName, String status, 
                    String pickupAddress, String deliveryAddress, 
                    String estimatedTime, String createdAt) {
        this.id = id;
        this.orderId = orderId;
        this.deliveryPartnerId = deliveryPartnerId;
        this.deliveryPartnerName = deliveryPartnerName;
        this.status = status;
        this.pickupAddress = pickupAddress;
        this.deliveryAddress = deliveryAddress;
        this.estimatedTime = estimatedTime;
        this.createdAt = createdAt;
    }
    
    // Getters and Setters
    public Integer getId() { return id; }
    public void setId(Integer id) { this.id = id; }
    
    public Integer getOrderId() { return orderId; }
    public void setOrderId(Integer orderId) { this.orderId = orderId; }
    
    public Integer getDeliveryPartnerId() { return deliveryPartnerId; }
    public void setDeliveryPartnerId(Integer deliveryPartnerId) { 
        this.deliveryPartnerId = deliveryPartnerId; 
    }
    
    public String getDeliveryPartnerName() { return deliveryPartnerName; }
    public void setDeliveryPartnerName(String deliveryPartnerName) { 
        this.deliveryPartnerName = deliveryPartnerName; 
    }
    
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    
    public String getPickupAddress() { return pickupAddress; }
    public void setPickupAddress(String pickupAddress) { 
        this.pickupAddress = pickupAddress; 
    }
    
    public String getDeliveryAddress() { return deliveryAddress; }
    public void setDeliveryAddress(String deliveryAddress) { 
        this.deliveryAddress = deliveryAddress; 
    }
    
    public String getEstimatedTime() { return estimatedTime; }
    public void setEstimatedTime(String estimatedTime) { 
        this.estimatedTime = estimatedTime; 
    }
    
    public String getCreatedAt() { return createdAt; }
    public void setCreatedAt(String createdAt) { this.createdAt = createdAt; }
}
