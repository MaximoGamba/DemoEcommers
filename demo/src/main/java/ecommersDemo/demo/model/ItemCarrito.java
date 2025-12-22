package ecommersDemo.demo.model;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "items_carrito",
       uniqueConstraints = @UniqueConstraint(columnNames = {"carrito_id", "producto_variante_id"}))
public class ItemCarrito {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "carrito_id", nullable = false)
    private Carrito carrito;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "producto_variante_id", nullable = false)
    private ProductoVariante productoVariante;

    @Column(nullable = false)
    private Integer cantidad = 1;

    @Column(name = "precio_unitario", nullable = false, precision = 10, scale = 2)
    private BigDecimal precioUnitario; // Precio al momento de agregar al carrito

    @Column(name = "fecha_agregado", nullable = false, updatable = false)
    private LocalDateTime fechaAgregado;

    @Column(name = "fecha_actualizacion")
    private LocalDateTime fechaActualizacion;

    // Constructor vacío requerido por JPA
    public ItemCarrito() {
    }

    public ItemCarrito(Carrito carrito, ProductoVariante productoVariante, Integer cantidad) {
        this.carrito = carrito;
        this.productoVariante = productoVariante;
        this.cantidad = cantidad;
        this.precioUnitario = productoVariante.getPrecioTotal();
    }

    @PrePersist
    protected void onCreate() {
        this.fechaAgregado = LocalDateTime.now();
        this.fechaActualizacion = LocalDateTime.now();
        if (this.precioUnitario == null && this.productoVariante != null) {
            this.precioUnitario = this.productoVariante.getPrecioTotal();
        }
    }

    @PreUpdate
    protected void onUpdate() {
        this.fechaActualizacion = LocalDateTime.now();
    }

    // Métodos de utilidad
    public BigDecimal getSubtotal() {
        if (precioUnitario == null || cantidad == null) {
            return BigDecimal.ZERO;
        }
        return precioUnitario.multiply(BigDecimal.valueOf(cantidad));
    }

    public void incrementarCantidad(int cantidad) {
        this.cantidad += cantidad;
    }

    public void decrementarCantidad(int cantidad) {
        this.cantidad = Math.max(0, this.cantidad - cantidad);
    }

    public boolean tieneStockSuficiente() {
        return productoVariante != null && productoVariante.tieneStockSuficiente(cantidad);
    }

    // Getters y Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Carrito getCarrito() {
        return carrito;
    }

    public void setCarrito(Carrito carrito) {
        this.carrito = carrito;
    }

    public ProductoVariante getProductoVariante() {
        return productoVariante;
    }

    public void setProductoVariante(ProductoVariante productoVariante) {
        this.productoVariante = productoVariante;
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

    public LocalDateTime getFechaAgregado() {
        return fechaAgregado;
    }

    public LocalDateTime getFechaActualizacion() {
        return fechaActualizacion;
    }
}

