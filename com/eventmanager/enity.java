package com.example.eventmanager.model;

import javax.persistence.Entity;
import javax.persistence.Id;

@Entity
public class Event {

    @Id
    private String slug;
    private String title;
    private String description;
    private String created;
    private String startTime;
    private String endTime;
    private boolean isDeleted = false; // For soft delete

    // Getters and Setters
    public String getSlug() {
    	return slug; 
    	}
    public void setSlug(String slug) {
    	this.slug = slug; 
    	}
    public String getTitle() { 
    	return title; 
    	}
    public void setTitle(String title) { 
    	this.title = title; 
    	}
    public String getDescription() { 
    	return description; 
    	}
    public void setDescription(String description) { 
    	this.description = description; }
    public String getCreated() { 
    	return created; 
    	}
    public void setCreated(String created) { 
    	this.created = created; 
    	}
    public String getStartTime() { 
    	return startTime; 
    	}
    public void setStartTime(String startTime) { 
    	this.startTime = startTime;
    	
    }
    public String getEndTime() { 
    	
    return endTime;
    }
    public void setEndTime(String endTime) { 
    	this.endTime = endTime;
    	}
    public boolean isDeleted() { 
    	return isDeleted; 
    	}
    public void setDeleted(boolean deleted) { 
    	isDeleted = deleted; 
    	}
}