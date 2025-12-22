package ecommersDemo.demo.model;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "carritos")
public class Carrito {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "session_id", unique = true, length = 100)
    private String sessionId; // Para carritos de usuarios no autenticados

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "usuario_id")
    private Usuario usuario; // Opcional: puede ser null para carritos anónimos

    @OneToMany(mappedBy = "carrito", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<ItemCarrito> items = new ArrayList<>();

    @Column(name = "fecha_creacion", nullable = false, updatable = false)
    private LocalDateTime fechaCreacion;

    @Column(name = "fecha_actualizacion")
    private LocalDateTime fechaActualizacion;

    @Column(name = "fecha_expiracion")
    private LocalDateTime fechaExpiracion; // Para limpiar carritos abandonados

    // Constructor vacío requerido por JPA
    public Carrito() {
    }

    public Carrito(Usuario usuario) {
        this.usuario = usuario;
    }

    public Carrito(String sessionId) {
        this.sessionId = sessionId;
    }

    @PrePersist
    protected void onCreate() {
        this.fechaCreacion = LocalDateTime.now();
        this.fechaActualizacion = LocalDateTime.now();
        if (this.sessionId == null && this.usuario == null) {
            this.sessionId = UUID.randomUUID().toString();
        }
        // Carritos expiran en 7 días por defecto
        this.fechaExpiracion = LocalDateTime.now().plusDays(7);
    }

    @PreUpdate
    protected void onUpdate() {
        this.fechaActualizacion = LocalDateTime.now();
        // Renovar expiración al actualizar
        this.fechaExpiracion = LocalDateTime.now().plusDays(7);
    }

    // Métodos de utilidad
    public BigDecimal getTotal() {
        return items.stream()
                .map(ItemCarrito::getSubtotal)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
    }

    public int getCantidadItems() {
        return items.stream()
                .mapToInt(ItemCarrito::getCantidad)
                .sum();
    }

    public int getCantidadProductosDistintos() {
        return items.size();
    }

    public boolean estaVacio() {
        return items.isEmpty();
    }

    public boolean haExpirado() {
        return fechaExpiracion != null && LocalDateTime.now().isAfter(fechaExpiracion);
    }

    // Helpers para manejo de items
    public void agregarItem(ItemCarrito item) {
        items.add(item);
        item.setCarrito(this);
    }

    public void removerItem(ItemCarrito item) {
        items.remove(item);
        item.setCarrito(null);
    }

    public void vaciar() {
        items.clear();
    }

    public ItemCarrito buscarItem(ProductoVariante variante) {
        return items.stream()
                .filter(item -> item.getProductoVariante().getId().equals(variante.getId()))
                .findFirst()
                .orElse(null);
    }

    // Getters y Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getSessionId() {
        return sessionId;
    }

    public void setSessionId(String sessionId) {
        this.sessionId = sessionId;
    }

    public Usuario getUsuario() {
        return usuario;
    }

    public void setUsuario(Usuario usuario) {
        this.usuario = usuario;
    }

    public List<ItemCarrito> getItems() {
        return items;
    }

    public void setItems(List<ItemCarrito> items) {
        this.items = items;
    }

    public LocalDateTime getFechaCreacion() {
        return fechaCreacion;
    }

    public LocalDateTime getFechaActualizacion() {
        return fechaActualizacion;
    }

    public LocalDateTime getFechaExpiracion() {
        return fechaExpiracion;
    }

    public void setFechaExpiracion(LocalDateTime fechaExpiracion) {
        this.fechaExpiracion = fechaExpiracion;
    }
}

