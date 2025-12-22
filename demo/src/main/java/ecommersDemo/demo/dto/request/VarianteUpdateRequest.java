package ecommersDemo.demo.dto.request;

import java.math.BigDecimal;

/**
 * DTO para actualizar una variante de producto existente.
 */
public class VarianteUpdateRequest {

    private Long talleId;
    private String color;
    private String codigoColor;
    private Integer stock;
    private Integer stockMinimo;
    private String sku;
    private BigDecimal precioAdicional;
    private String imagenUrl;
    private Boolean activo;

    // Constructor vacío
    public VarianteUpdateRequest() {
    }

    // Getters y Setters
    public Long getTalleId() {
        return talleId;
    }

    public void setTalleId(Long talleId) {
        this.talleId = talleId;
    }

    public String getColor() {
        return color;
    }

    public void setColor(String color) {
        this.color = color;
    }

    public String getCodigoColor() {
        return codigoColor;
    }

    public void setCodigoColor(String codigoColor) {
        this.codigoColor = codigoColor;
    }

    public Integer getStock() {
        return stock;
    }

    public void setStock(Integer stock) {
        this.stock = stock;
    }

    public Integer getStockMinimo() {
        return stockMinimo;
    }

    public void setStockMinimo(Integer stockMinimo) {
        this.stockMinimo = stockMinimo;
    }

    public String getSku() {
        return sku;
    }

    public void setSku(String sku) {
        this.sku = sku;
    }

    public BigDecimal getPrecioAdicional() {
        return precioAdicional;
    }

    public void setPrecioAdicional(BigDecimal precioAdicional) {
        this.precioAdicional = precioAdicional;
    }

    public String getImagenUrl() {
        return imagenUrl;
    }

    public void setImagenUrl(String imagenUrl) {
        this.imagenUrl = imagenUrl;
    }

    public Boolean getActivo() {
        return activo;
    }

    public void setActivo(Boolean activo) {
        this.activo = activo;
    }
}

