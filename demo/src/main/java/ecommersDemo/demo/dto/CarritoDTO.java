package ecommersDemo.demo.dto;

import ecommersDemo.demo.model.Carrito;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

public class CarritoDTO {

    private Long id;
    private String sessionId;
    private Long usuarioId;
    private List<ItemCarritoDTO> items;
    private Integer cantidadItems;
    private Integer cantidadProductosDistintos;
    private BigDecimal total;
    private LocalDateTime fechaCreacion;
    private LocalDateTime fechaActualizacion;

    public CarritoDTO() {
    }

    public CarritoDTO(Carrito carrito) {
        this.id = carrito.getId();
        this.sessionId = carrito.getSessionId();
        this.usuarioId = carrito.getUsuario() != null ? carrito.getUsuario().getId() : null;
        this.cantidadItems = carrito.getCantidadItems();
        this.cantidadProductosDistintos = carrito.getCantidadProductosDistintos();
        this.total = carrito.getTotal();
        this.fechaCreacion = carrito.getFechaCreacion();
        this.fechaActualizacion = carrito.getFechaActualizacion();
        
        if (carrito.getItems() != null) {
            this.items = carrito.getItems().stream()
                    .map(ItemCarritoDTO::new)
                    .collect(Collectors.toList());
        }
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

    public Long getUsuarioId() {
        return usuarioId;
    }

    public void setUsuarioId(Long usuarioId) {
        this.usuarioId = usuarioId;
    }

    public List<ItemCarritoDTO> getItems() {
        return items;
    }

    public void setItems(List<ItemCarritoDTO> items) {
        this.items = items;
    }

    public Integer getCantidadItems() {
        return cantidadItems;
    }

    public void setCantidadItems(Integer cantidadItems) {
        this.cantidadItems = cantidadItems;
    }

    public Integer getCantidadProductosDistintos() {
        return cantidadProductosDistintos;
    }

    public void setCantidadProductosDistintos(Integer cantidadProductosDistintos) {
        this.cantidadProductosDistintos = cantidadProductosDistintos;
    }

    public BigDecimal getTotal() {
        return total;
    }

    public void setTotal(BigDecimal total) {
        this.total = total;
    }

    public LocalDateTime getFechaCreacion() {
        return fechaCreacion;
    }

    public void setFechaCreacion(LocalDateTime fechaCreacion) {
        this.fechaCreacion = fechaCreacion;
    }

    public LocalDateTime getFechaActualizacion() {
        return fechaActualizacion;
    }

    public void setFechaActualizacion(LocalDateTime fechaActualizacion) {
        this.fechaActualizacion = fechaActualizacion;
    }
}

