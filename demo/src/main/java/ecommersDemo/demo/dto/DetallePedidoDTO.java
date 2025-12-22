package ecommersDemo.demo.dto;

import ecommersDemo.demo.model.DetallePedido;
import java.math.BigDecimal;

public class DetallePedidoDTO {

    private Long id;
    private Long productoVarianteId;
    private String nombreProducto;
    private String talleNombre;
    private String color;
    private String skuVariante;
    private Integer cantidad;
    private BigDecimal precioUnitario;
    private BigDecimal subtotal;

    public DetallePedidoDTO() {
    }

    public DetallePedidoDTO(DetallePedido detalle) {
        this.id = detalle.getId();
        this.productoVarianteId = detalle.getProductoVariante() != null 
                ? detalle.getProductoVariante().getId() : null;
        this.nombreProducto = detalle.getNombreProducto();
        this.talleNombre = detalle.getTalleNombre();
        this.color = detalle.getColor();
        this.skuVariante = detalle.getSkuVariante();
        this.cantidad = detalle.getCantidad();
        this.precioUnitario = detalle.getPrecioUnitario();
        this.subtotal = detalle.getSubtotal();
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

    public String getNombreProducto() {
        return nombreProducto;
    }

    public void setNombreProducto(String nombreProducto) {
        this.nombreProducto = nombreProducto;
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

    public String getSkuVariante() {
        return skuVariante;
    }

    public void setSkuVariante(String skuVariante) {
        this.skuVariante = skuVariante;
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
}

