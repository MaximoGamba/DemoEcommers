package ecommersDemo.demo.dto;

import ecommersDemo.demo.model.Cupon;
import java.math.BigDecimal;
import java.time.LocalDateTime;

/**
 * DTO para representar un cupón.
 */
public class CuponDTO {

    private Long id;
    private String codigo;
    private String descripcion;
    private String tipoDescuento;
    private BigDecimal valorDescuento;
    private BigDecimal montoMinimo;
    private BigDecimal descuentoMaximo;
    private LocalDateTime fechaInicio;
    private LocalDateTime fechaFin;
    private Integer usosMaximos;
    private Integer usosActuales;
    private Boolean activo;

    public CuponDTO() {
    }

    public CuponDTO(Cupon cupon) {
        this.id = cupon.getId();
        this.codigo = cupon.getCodigo();
        this.descripcion = cupon.getDescripcion();
        this.tipoDescuento = cupon.getTipoDescuento().name();
        this.valorDescuento = cupon.getValorDescuento();
        this.montoMinimo = cupon.getMontoMinimo();
        this.descuentoMaximo = cupon.getDescuentoMaximo();
        this.fechaInicio = cupon.getFechaInicio();
        this.fechaFin = cupon.getFechaFin();
        this.usosMaximos = cupon.getUsosMaximos();
        this.usosActuales = cupon.getUsosActuales();
        this.activo = cupon.getActivo();
    }

    // Getters y Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getCodigo() {
        return codigo;
    }

    public void setCodigo(String codigo) {
        this.codigo = codigo;
    }

    public String getDescripcion() {
        return descripcion;
    }

    public void setDescripcion(String descripcion) {
        this.descripcion = descripcion;
    }

    public String getTipoDescuento() {
        return tipoDescuento;
    }

    public void setTipoDescuento(String tipoDescuento) {
        this.tipoDescuento = tipoDescuento;
    }

    public BigDecimal getValorDescuento() {
        return valorDescuento;
    }

    public void setValorDescuento(BigDecimal valorDescuento) {
        this.valorDescuento = valorDescuento;
    }

    public BigDecimal getMontoMinimo() {
        return montoMinimo;
    }

    public void setMontoMinimo(BigDecimal montoMinimo) {
        this.montoMinimo = montoMinimo;
    }

    public BigDecimal getDescuentoMaximo() {
        return descuentoMaximo;
    }

    public void setDescuentoMaximo(BigDecimal descuentoMaximo) {
        this.descuentoMaximo = descuentoMaximo;
    }

    public LocalDateTime getFechaInicio() {
        return fechaInicio;
    }

    public void setFechaInicio(LocalDateTime fechaInicio) {
        this.fechaInicio = fechaInicio;
    }

    public LocalDateTime getFechaFin() {
        return fechaFin;
    }

    public void setFechaFin(LocalDateTime fechaFin) {
        this.fechaFin = fechaFin;
    }

    public Integer getUsosMaximos() {
        return usosMaximos;
    }

    public void setUsosMaximos(Integer usosMaximos) {
        this.usosMaximos = usosMaximos;
    }

    public Integer getUsosActuales() {
        return usosActuales;
    }

    public void setUsosActuales(Integer usosActuales) {
        this.usosActuales = usosActuales;
    }

    public Boolean getActivo() {
        return activo;
    }

    public void setActivo(Boolean activo) {
        this.activo = activo;
    }
}















