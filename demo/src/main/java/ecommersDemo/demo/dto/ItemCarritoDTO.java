package ecommersDemo.demo.dto;

import ecommersDemo.demo.model.ItemCarrito;
import java.math.BigDecimal;

public class ItemCarritoDTO {

    private Long id;
    private Long productoVarianteId;
    private String productoNombre;
    private String talleNombre;
    private String color;
    private String imagenUrl;
    private Integer cantidad;
    private BigDecimal precioUnitario;
    private BigDecimal subtotal;
    private Integer stockDisponible;
    private Boolean stockSuficiente;

    public ItemCarritoDTO() {
    }

    public ItemCarritoDTO(ItemCarrito item) {
        this.id = item.getId();
        this.cantidad = item.getCantidad();
        this.precioUnitario = item.getPrecioUnitario();
        this.subtotal = item.getSubtotal();
        
        if (item.getProductoVariante() != null) {
            this.productoVarianteId = item.getProductoVariante().getId();
            this.color = item.getProductoVariante().getColor();
            this.imagenUrl = item.getProductoVariante().getImagenUrl();
            this.stockDisponible = item.getProductoVariante().getStock();
            this.stockSuficiente = item.tieneStockSuficiente();
            
            if (item.getProductoVariante().getProducto() != null) {
                this.productoNombre = item.getProductoVariante().getProducto().getNombre();
                if (this.imagenUrl == null) {
                    this.imagenUrl = item.getProductoVariante().getProducto().getImagenPrincipalUrl();
                }
            }
            if (item.getProductoVariante().getTalle() != null) {
                this.talleNombre = item.getProductoVariante().getTalle().getNombre();
            }
        }
    }

    // Getters y Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getProductoVarianteId() {
        return productoVarianteId;
    }

    public void setProductoVarianteId(Long productoVarianteId) {
        this.productoVarianteId = productoVarianteId;
    }

    public String getProductoNombre() {
        return productoNombre;
    }

    public void setProductoNombre(String productoNombre) {
        this.productoNombre = productoNombre;
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

    public String getImagenUrl() {
        return imagenUrl;
    }

    public void setImagenUrl(String imagenUrl) {
        this.imagenUrl = imagenUrl;
    }

    public Integer getCantidad() {
        return cantidad;
    }

    public void setCantidad(Integer cantidad) {
        this.cantidad = cantidad;
    }

    public BigDecimal getPrecioUnitario() {
        return precioUnitario;
    }

    public void setPrecioUnitario(BigDecimal precioUnitario) {
        this.precioUnitario = precioUnitario;
    }

    public BigDecimal getSubtotal() {
        return subtotal;
    }

    public void setSubtotal(BigDecimal subtotal) {
        this.subtotal = subtotal;
    }

    public Integer getStockDisponible() {
        return stockDisponible;
    }

    public void setStockDisponible(Integer stockDisponible) {
        this.stockDisponible = stockDisponible;
    }

    public Boolean getStockSuficiente() {
        return stockSuficiente;
    }

    public void setStockSuficiente(Boolean stockSuficiente) {
        this.stockSuficiente = stockSuficiente;
    }
}

