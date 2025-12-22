package ecommersDemo.demo.model;

import jakarta.persistence.*;
import java.math.BigDecimal;

@Entity
@Table(name = "detalles_pedido")
public class DetallePedido {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "pedido_id", nullable = false)
    private Pedido pedido;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "producto_variante_id", nullable = false)
    private ProductoVariante productoVariante;

    @Column(nullable = false)
    private Integer cantidad;

    @Column(name = "precio_unitario", nullable = false, precision = 10, scale = 2)
    private BigDecimal precioUnitario; // Precio al momento de la compra

    @Column(nullable = false, precision = 12, scale = 2)
    private BigDecimal subtotal;

    // Datos del producto al momento de la compra (para historial)
    @Column(name = "nombre_producto", nullable = false, length = 200)
    private String nombreProducto;

    @Column(name = "talle_nombre", length = 20)
    private String talleNombre;

    @Column(name = "color", length = 50)
    private String color;

    @Column(name = "sku_variante", length = 100)
    private String skuVariante;

    // Constructor vacío requerido por JPA
    public DetallePedido() {
    }

    public DetallePedido(Pedido pedido, ProductoVariante productoVariante, Integer cantidad) {
        this.pedido = pedido;
        this.productoVariante = productoVariante;
        this.cantidad = cantidad;
        this.precioUnitario = productoVariante.getPrecioTotal();
        this.calcularSubtotal();
        this.capturarDatosProducto();
    }

    // Métodos de utilidad
    public void calcularSubtotal() {
        if (precioUnitario != null && cantidad != null) {
            this.subtotal = precioUnitario.multiply(BigDecimal.valueOf(cantidad));
        } else {
            this.subtotal = BigDecimal.ZERO;
        }
    }

    /**
     * Captura los datos del producto al momento de la compra.
     * Esto es importante para mantener el historial aunque el producto cambie.
     */
    private void capturarDatosProducto() {
        if (productoVariante != null) {
            if (productoVariante.getProducto() != null) {
                this.nombreProducto = productoVariante.getProducto().getNombre();
            }
            if (productoVariante.getTalle() != null) {
                this.talleNombre = productoVariante.getTalle().getNombre();
            }
            this.color = productoVariante.getColor();
            this.skuVariante = productoVariante.getSku();
        }
    }

    public String getDescripcionCompleta() {
        StringBuilder sb = new StringBuilder(nombreProducto);
        if (talleNombre != null && !talleNombre.isEmpty()) {
            sb.append(" - Talle: ").append(talleNombre);
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

    public Pedido getPedido() {
        return pedido;
    }

    public void setPedido(Pedido pedido) {
        this.pedido = pedido;
    }

    public ProductoVariante getProductoVariante() {
        return productoVariante;
    }

    public void setProductoVariante(ProductoVariante productoVariante) {
        this.productoVariante = productoVariante;
        if (productoVariante != null) {
            this.capturarDatosProducto();
        }
    }

    public Integer getCantidad() {
        return cantidad;
    }

    public void setCantidad(Integer cantidad) {
        this.cantidad = cantidad;
        this.calcularSubtotal();
    }

    public BigDecimal getPrecioUnitario() {
        return precioUnitario;
    }

    public void setPrecioUnitario(BigDecimal precioUnitario) {
        this.precioUnitario = precioUnitario;
        this.calcularSubtotal();
    }

    public BigDecimal getSubtotal() {
        return subtotal;
    }

    public void setSubtotal(BigDecimal subtotal) {
        this.subtotal = subtotal;
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
}

