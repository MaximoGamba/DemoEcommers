package ecommersDemo.demo.dto;

import ecommersDemo.demo.model.Pedido;
import ecommersDemo.demo.model.Pedido.EstadoPedido;
import ecommersDemo.demo.model.Pedido.MetodoPago;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

public class PedidoDTO {

    private Long id;
    private String numeroPedido;
    private Long usuarioId;
    private String usuarioNombre;
    private String usuarioEmail;
    private EstadoPedido estado;
    private BigDecimal subtotal;
    private BigDecimal costoEnvio;
    private BigDecimal descuento;
    private BigDecimal total;
    private String direccionEnvio;
    private String ciudadEnvio;
    private String codigoPostalEnvio;
    private String telefonoContacto;
    private String notas;
    private MetodoPago metodoPago;
    private String referenciaPago;
    private LocalDateTime fechaPedido;
    private LocalDateTime fechaEnvio;
    private LocalDateTime fechaEntrega;
    private Integer cantidadItems;
    private List<DetallePedidoDTO> detalles;

    public PedidoDTO() {
    }

    public PedidoDTO(Pedido pedido) {
        this.id = pedido.getId();
        this.numeroPedido = pedido.getNumeroPedido();
        this.estado = pedido.getEstado();
        this.subtotal = pedido.getSubtotal();
        this.costoEnvio = pedido.getCostoEnvio();
        this.descuento = pedido.getDescuento();
        this.total = pedido.getTotal();
        this.direccionEnvio = pedido.getDireccionEnvio();
        this.ciudadEnvio = pedido.getCiudadEnvio();
        this.codigoPostalEnvio = pedido.getCodigoPostalEnvio();
        this.telefonoContacto = pedido.getTelefonoContacto();
        this.notas = pedido.getNotas();
        this.metodoPago = pedido.getMetodoPago();
        this.referenciaPago = pedido.getReferenciaPago();
        this.fechaPedido = pedido.getFechaPedido();
        this.fechaEnvio = pedido.getFechaEnvio();
        this.fechaEntrega = pedido.getFechaEntrega();
        this.cantidadItems = pedido.getCantidadItems();

        if (pedido.getUsuario() != null) {
            this.usuarioId = pedido.getUsuario().getId();
            this.usuarioNombre = pedido.getUsuario().getNombreCompleto();
            this.usuarioEmail = pedido.getUsuario().getEmail();
        }
    }

    public PedidoDTO(Pedido pedido, boolean incluirDetalles) {
        this(pedido);
        if (incluirDetalles && pedido.getDetalles() != null) {
            this.detalles = pedido.getDetalles().stream()
                    .map(DetallePedidoDTO::new)
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

    public String getNumeroPedido() {
        return numeroPedido;
    }

    public void setNumeroPedido(String numeroPedido) {
        this.numeroPedido = numeroPedido;
    }

    public Long getUsuarioId() {
        return usuarioId;
    }

    public void setUsuarioId(Long usuarioId) {
        this.usuarioId = usuarioId;
    }

    public String getUsuarioNombre() {
        return usuarioNombre;
    }

    public void setUsuarioNombre(String usuarioNombre) {
        this.usuarioNombre = usuarioNombre;
    }

    public String getUsuarioEmail() {
        return usuarioEmail;
    }

    public void setUsuarioEmail(String usuarioEmail) {
        this.usuarioEmail = usuarioEmail;
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

    public void setFechaPedido(LocalDateTime fechaPedido) {
        this.fechaPedido = fechaPedido;
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

    public Integer getCantidadItems() {
        return cantidadItems;
    }

    public void setCantidadItems(Integer cantidadItems) {
        this.cantidadItems = cantidadItems;
    }

    public List<DetallePedidoDTO> getDetalles() {
        return detalles;
    }

    public void setDetalles(List<DetallePedidoDTO> detalles) {
        this.detalles = detalles;
    }
}

