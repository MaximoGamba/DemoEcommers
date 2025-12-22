package ecommersDemo.demo.model;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "cupones")
public class Cupon {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true, length = 50)
    private String codigo;

    @Column(nullable = false, length = 100)
    private String descripcion;

    @Enumerated(EnumType.STRING)
    @Column(name = "tipo_descuento", nullable = false, length = 20)
    private TipoDescuento tipoDescuento;

    @Column(name = "valor_descuento", nullable = false, precision = 10, scale = 2)
    private BigDecimal valorDescuento;

    @Column(name = "monto_minimo", precision = 10, scale = 2)
    private BigDecimal montoMinimo; // Monto mínimo de compra para aplicar el cupón

    @Column(name = "descuento_maximo", precision = 10, scale = 2)
    private BigDecimal descuentoMaximo; // Límite máximo de descuento (para porcentajes)

    @Column(name = "fecha_inicio", nullable = false)
    private LocalDateTime fechaInicio;

    @Column(name = "fecha_fin", nullable = false)
    private LocalDateTime fechaFin;

    @Column(name = "usos_maximos")
    private Integer usosMaximos; // Número máximo de veces que se puede usar

    @Column(name = "usos_actuales", nullable = false)
    private Integer usosActuales = 0;

    @Column(nullable = false)
    private Boolean activo = true;

    @Column(name = "fecha_creacion", nullable = false, updatable = false)
    private LocalDateTime fechaCreacion;

    @Column(name = "fecha_actualizacion")
    private LocalDateTime fechaActualizacion;

    public enum TipoDescuento {
        PORCENTAJE, // Descuento porcentual (ej: 10% = 0.10)
        FIJO        // Descuento fijo en pesos (ej: $1000)
    }

    // Constructor vacío requerido por JPA
    public Cupon() {
    }

    public Cupon(String codigo, String descripcion, TipoDescuento tipoDescuento, 
                 BigDecimal valorDescuento) {
        this.codigo = codigo;
        this.descripcion = descripcion;
        this.tipoDescuento = tipoDescuento;
        this.valorDescuento = valorDescuento;
    }

    @PrePersist
    protected void onCreate() {
        this.fechaCreacion = LocalDateTime.now();
        this.fechaActualizacion = LocalDateTime.now();
        if (this.usosActuales == null) {
            this.usosActuales = 0;
        }
    }

    @PreUpdate
    protected void onUpdate() {
        this.fechaActualizacion = LocalDateTime.now();
    }

    /**
     * Valida si el cupón puede ser aplicado.
     */
    public boolean esValido(BigDecimal montoCompra) {
        if (!activo) {
            return false;
        }

        LocalDateTime ahora = LocalDateTime.now();
        if (ahora.isBefore(fechaInicio) || ahora.isAfter(fechaFin)) {
            return false;
        }

        if (montoMinimo != null && montoCompra.compareTo(montoMinimo) < 0) {
            return false;
        }

        if (usosMaximos != null && usosActuales >= usosMaximos) {
            return false;
        }

        return true;
    }

    /**
     * Calcula el descuento a aplicar según el tipo y el monto de compra.
     */
    public BigDecimal calcularDescuento(BigDecimal montoCompra) {
        BigDecimal descuento = BigDecimal.ZERO;

        if (tipoDescuento == TipoDescuento.PORCENTAJE) {
            // Descuento porcentual
            descuento = montoCompra.multiply(valorDescuento).divide(new BigDecimal("100"));
            
            // Aplicar límite máximo si existe
            if (descuentoMaximo != null && descuento.compareTo(descuentoMaximo) > 0) {
                descuento = descuentoMaximo;
            }
        } else {
            // Descuento fijo
            descuento = valorDescuento;
            
            // El descuento fijo no puede ser mayor al monto de compra
            if (descuento.compareTo(montoCompra) > 0) {
                descuento = montoCompra;
            }
        }

        return descuento;
    }

    /**
     * Incrementa el contador de usos del cupón.
     */
    public void incrementarUso() {
        this.usosActuales++;
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

    public TipoDescuento getTipoDescuento() {
        return tipoDescuento;
    }

    public void setTipoDescuento(TipoDescuento tipoDescuento) {
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















