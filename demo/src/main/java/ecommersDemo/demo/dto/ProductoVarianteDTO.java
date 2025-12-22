package ecommersDemo.demo.dto;

import ecommersDemo.demo.model.ProductoVariante;
import java.math.BigDecimal;

public class ProductoVarianteDTO {

    private Long id;
    private Long productoId;
    private Long talleId;
    private String talleNombre;
    private String color;
    private String codigoColor;
    private Integer stock;
    private Integer stockMinimo;
    private String sku;
    private BigDecimal precioAdicional;
    private String imagenUrl;
    private Boolean activo;
    private BigDecimal precioTotal;
    private Boolean disponible;

    // Constructor vacío
    public ProductoVarianteDTO() {
    }

    // Constructor desde entidad
    public ProductoVarianteDTO(ProductoVariante variante) {
        this.id = variante.getId();
        this.productoId = variante.getProducto() != null ? variante.getProducto().getId() : null;
        this.talleId = variante.getTalle() != null ? variante.getTalle().getId() : null;
        this.talleNombre = variante.getTalle() != null ? variante.getTalle().getNombre() : null;
        this.color = variante.getColor();
        this.codigoColor = variante.getCodigoColor();
        this.stock = variante.getStock();
        this.stockMinimo = variante.getStockMinimo();
        this.sku = variante.getSku();
        this.precioAdicional = variante.getPrecioAdicional();
        this.imagenUrl = variante.getImagenUrl();
        this.activo = variante.getActivo();
        this.precioTotal = variante.getPrecioTotal();
        this.disponible = variante.tieneStock();
    }

    // Getters y Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getProductoId() {
        return productoId;
    }

    public void setProductoId(Long productoId) {
        this.productoId = productoId;
    }

    public Long getTalleId() {
        return talleId;
    }

    public void setTalleId(Long talleId) {
        this.talleId = talleId;
    }

    public String getTalleNombre() {
        return talleNombre;
    }

    public void setTalleNombre(String talleNombre) {
        this.talleNombre = talleNombre;
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

    public BigDecimal getPrecioTotal() {
        return precioTotal;
    }

    public void setPrecioTotal(BigDecimal precioTotal) {
        this.precioTotal = precioTotal;
    }

    public Boolean getDisponible() {
        return disponible;
    }

    public void setDisponible(Boolean disponible) {
        this.disponible = disponible;
    }
}

