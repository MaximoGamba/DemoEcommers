package ecommersDemo.demo.model;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "producto_variantes", 
       uniqueConstraints = @UniqueConstraint(columnNames = {"producto_id", "talle_id", "color"}))
public class ProductoVariante {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "producto_id", nullable = false)
    private Producto producto;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "talle_id", nullable = false)
    private Talle talle;

    @Column(length = 50)
    private String color;

    @Column(name = "codigo_color", length = 7)
    private String codigoColor; // Código hexadecimal del color (ej: #FF0000)

    @Column(nullable = false)
    private Integer stock = 0;

    @Column(name = "stock_minimo")
    private Integer stockMinimo = 5;

    @Column(unique = true, length = 100)
    private String sku;

    @Column(name = "precio_adicional", precision = 10, scale = 2)
    private BigDecimal precioAdicional; // Precio adicional por esta variante

    @Column(name = "imagen_url", length = 500)
    private String imagenUrl;

    @Column(nullable = false)
    private Boolean activo = true;

    @Column(name = "fecha_creacion", nullable = false, updatable = false)
    private LocalDateTime fechaCreacion;

    @Column(name = "fecha_actualizacion")
    private LocalDateTime fechaActualizacion;

    // Constructor vacío requerido por JPA
    public ProductoVariante() {
    }

    public ProductoVariante(Producto producto, Talle talle, Integer stock) {
        this.producto = producto;
        this.talle = talle;
        this.stock = stock;
    }

    public ProductoVariante(Producto producto, Talle talle, String color, Integer stock) {
        this.producto = producto;
        this.talle = talle;
        this.color = color;
        this.stock = stock;
    }

    @PrePersist
    protected void onCreate() {
        this.fechaCreacion = LocalDateTime.now();
        this.fechaActualizacion = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        this.fechaActualizacion = LocalDateTime.now();
    }

    // Métodos de utilidad
    public boolean tieneStock() {
        return stock != null && stock > 0;
    }

    public boolean tieneStockSuficiente(int cantidad) {
        return stock != null && stock >= cantidad;
    }

    public boolean stockBajo() {
        return stock != null && stockMinimo != null && stock <= stockMinimo;
    }

    public void decrementarStock(int cantidad) {
        if (stock != null && stock >= cantidad) {
            this.stock -= cantidad;
        } else {
            throw new IllegalStateException("Stock insuficiente");
        }
    }

    public void incrementarStock(int cantidad) {
        this.stock = (this.stock != null ? this.stock : 0) + cantidad;
    }

    public BigDecimal getPrecioTotal() {
        BigDecimal precioBase = producto != null ? producto.getPrecioFinal() : BigDecimal.ZERO;
        BigDecimal adicional = precioAdicional != null ? precioAdicional : BigDecimal.ZERO;
        return precioBase.add(adicional);
    }

    public String getDescripcionCompleta() {
        StringBuilder sb = new StringBuilder();
        if (producto != null) {
            sb.append(producto.getNombre());
        }
        if (talle != null) {
            sb.append(" - Talle: ").append(talle.getNombre());
        }
        if (color != null && !color.isEmpty()) {
            sb.append(" - Color: ").append(color);
        }
        return sb.toString();
    }

    // Getters y Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Producto getProducto() {
        return producto;
    }

    public void setProducto(Producto producto) {
        this.producto = producto;
    }

    public Talle getTalle() {
        return talle;
    }

    public void setTalle(Talle talle) {
        this.talle = talle;
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

    public LocalDateTime getFechaCreacion() {
        return fechaCreacion;
    }

    public LocalDateTime getFechaActualizacion() {
        return fechaActualizacion;
    }
}

