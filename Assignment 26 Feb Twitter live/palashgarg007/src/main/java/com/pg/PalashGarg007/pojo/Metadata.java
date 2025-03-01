package com.pg.PalashGarg007.pojo;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@JsonIgnoreProperties(ignoreUnknown = true)
public class Metadata {
    private int pages;
    private int stockLeft;
    private double price;
    private double discount;
    private int edition;

    // Getters and Setters
    public int getPages() { return pages; }
    public void setPages(int pages) { this.pages = pages; }

    public int getStockLeft() { return stockLeft; }
    public void setStockLeft(int stockLeft) { this.stockLeft = stockLeft; }

    public double getPrice() { return price; }
    public void setPrice(double price) { this.price = price; }

    public double getDiscount() { return discount; }
    public void setDiscount(double discount) { this.discount = discount; }

    public int getEdition() { return edition; }
    public void setEdition(int edition) { this.edition = edition; }

}

