package ecommersDemo.demo.model;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "pedidos")
public class Pedido {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "numero_pedido", nullable = false, unique = true, length = 50)
    private String numeroPedido;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "usuario_id", nullable = false)
    private Usuario usuario;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 30)
    private EstadoPedido estado = EstadoPedido.PENDIENTE;

    @Column(nullable = false, precision = 12, scale = 2)
    private BigDecimal subtotal;

    @Column(name = "costo_envio", precision = 10, scale = 2)
    private BigDecimal costoEnvio = BigDecimal.ZERO;

    @Column(precision = 10, scale = 2)
    private BigDecimal descuento = BigDecimal.ZERO;

    @Column(nullable = false, precision = 12, scale = 2)
    private BigDecimal total;

    // Dirección de envío (copiada del usuario al momento del pedido)
    @Column(name = "direccion_envio", nullable = false, length = 255)
    private String direccionEnvio;

    @Column(name = "ciudad_envio", nullable = false, length = 100)
    private String ciudadEnvio;

    @Column(name = "codigo_postal_envio", length = 10)
    private String codigoPostalEnvio;

    @Column(name = "telefono_contacto", length = 20)
    private String telefonoContacto;

    @Column(length = 500)
    private String notas;

    @Enumerated(EnumType.STRING)
    @Column(name = "metodo_pago", length = 50)
    private MetodoPago metodoPago;

    @Column(name = "referencia_pago", length = 100)
    private String referenciaPago;

    @Column(name = "fecha_pedido", nullable = false, updatable = false)
    private LocalDateTime fechaPedido;

    @Column(name = "fecha_actualizacion")
    private LocalDateTime fechaActualizacion;

    @Column(name = "fecha_envio")
    private LocalDateTime fechaEnvio;

    @Column(name = "fecha_entrega")
    private LocalDateTime fechaEntrega;

    @OneToMany(mappedBy = "pedido", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<DetallePedido> detalles = new ArrayList<>();

    public enum EstadoPedido {
        PENDIENTE,
        CONFIRMADO,
        PAGADO,
        EN_PREPARACION,
        ENVIADO,
        ENTREGADO,
        CANCELADO,
        DEVUELTO
    }

    public enum MetodoPago {
        TARJETA_CREDITO,
        TARJETA_DEBITO,
        TRANSFERENCIA,
        MERCADO_PAGO,
        EFECTIVO_CONTRA_ENTREGA
    }

    // Constructor vacío requerido por JPA
    public Pedido() {
    }

    public Pedido(Usuario usuario) {
        this.usuario = usuario;
        this.generarNumeroPedido();
    }

    @PrePersist
    protected void onCreate() {
        this.fechaPedido = LocalDateTime.now();
        this.fechaActualizacion = LocalDateTime.now();
        if (this.numeroPedido == null) {
            this.generarNumeroPedido();
        }
    }

    @PreUpdate
    protected void onUpdate() {
        this.fechaActualizacion = LocalDateTime.now();
    }

    // Métodos de utilidad
    private void generarNumeroPedido() {
        // Formato: PED-YYYYMMDD-XXXXX (ej: PED-20251210-00001)
        String fecha = java.time.LocalDate.now().toString().replace("-", "");
        String random = String.format("%05d", (int) (Math.random() * 100000));
        this.numeroPedido = "PED-" + fecha + "-" + random;
    }

    public void calcularTotales() {
        this.subtotal = detalles.stream()
                .map(DetallePedido::getSubtotal)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        
        BigDecimal costoEnvioActual = this.costoEnvio != null ? this.costoEnvio : BigDecimal.ZERO;
        BigDecimal descuentoActual = this.descuento != null ? this.descuento : BigDecimal.ZERO;
        
        this.total = this.subtotal.add(costoEnvioActual).subtract(descuentoActual);
    }

    public int getCantidadItems() {
        return detalles.stream()
                .mapToInt(DetallePedido::getCantidad)
                .sum();
    }

    public boolean puedeSerCancelado() {
        return estado == EstadoPedido.PENDIENTE || estado == EstadoPedido.CONFIRMADO;
    }

    public boolean estaFinalizado() {
        return estado == EstadoPedido.ENTREGADO || 
               estado == EstadoPedido.CANCELADO || 
               estado == EstadoPedido.DEVUELTO;
    }

    // Helpers para manejo de detalles
    public void agregarDetalle(DetallePedido detalle) {
        detalles.add(detalle);
        detalle.setPedido(this);
    }

    public void removerDetalle(DetallePedido detalle) {
        detalles.remove(detalle);
        detalle.setPedido(null);
    }

    // Getters y Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getNumeroPedido() {
        return numeroPedido;
    }

    public void setNumeroPedido(String numeroPedido) {
        this.numeroPedido = numeroPedido;
    }

    public Usuario getUsuario() {
        return usuario;
    }

    public void setUsuario(Usuario usuario) {
        this.usuario = usuario;
    }

    public EstadoPedido getEstado() {
        return estado;
    }

    public void setEstado(EstadoPedido estado) {
        this.estado = estado;
    }

    public BigDecimal getSubtotal() {
        return subtotal;
    }

    public void setSubtotal(BigDecimal subtotal) {
        this.subtotal = subtotal;
    }

    public BigDecimal getCostoEnvio() {
        return costoEnvio;
    }

    public void setCostoEnvio(BigDecimal costoEnvio) {
        this.costoEnvio = costoEnvio;
    }

    public BigDecimal getDescuento() {
        return descuento;
    }

    public void setDescuento(BigDecimal descuento) {
        this.descuento = descuento;
    }

    public BigDecimal getTotal() {
        return total;
    }

    public void setTotal(BigDecimal total) {
        this.total = total;
    }

    public String getDireccionEnvio() {
        return direccionEnvio;
    }

    public void setDireccionEnvio(String direccionEnvio) {
        this.direccionEnvio = direccionEnvio;
    }

    public String getCiudadEnvio() {
        return ciudadEnvio;
    }

    public void setCiudadEnvio(String ciudadEnvio) {
        this.ciudadEnvio = ciudadEnvio;
    }

    public String getCodigoPostalEnvio() {
        return codigoPostalEnvio;
    }

    public void setCodigoPostalEnvio(String codigoPostalEnvio) {
        this.codigoPostalEnvio = codigoPostalEnvio;
    }

    public String getTelefonoContacto() {
        return telefonoContacto;
    }

    public void setTelefonoContacto(String telefonoContacto) {
        this.telefonoContacto = telefonoContacto;
    }

    public String getNotas() {
        return notas;
    }

    public void setNotas(String notas) {
        this.notas = notas;
    }

    public MetodoPago getMetodoPago() {
        return metodoPago;
    }

    public void setMetodoPago(MetodoPago metodoPago) {
        this.metodoPago = metodoPago;
    }

    public String getReferenciaPago() {
        return referenciaPago;
    }

    public void setReferenciaPago(String referenciaPago) {
        this.referenciaPago = referenciaPago;
    }

    public LocalDateTime getFechaPedido() {
        return fechaPedido;
    }

    public LocalDateTime getFechaActualizacion() {
        return fechaActualizacion;
    }

    public LocalDateTime getFechaEnvio() {
        return fechaEnvio;
    }

    public void setFechaEnvio(LocalDateTime fechaEnvio) {
        this.fechaEnvio = fechaEnvio;
    }

    public LocalDateTime getFechaEntrega() {
        return fechaEntrega;
    }

    public void setFechaEntrega(LocalDateTime fechaEntrega) {
        this.fechaEntrega = fechaEntrega;
    }

    public List<DetallePedido> getDetalles() {
        return detalles;
    }

    public void setDetalles(List<DetallePedido> detalles) {
        this.detalles = detalles;
    }
}

