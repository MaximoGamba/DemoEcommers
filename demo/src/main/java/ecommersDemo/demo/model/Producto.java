package ecommersDemo.demo.model;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "productos")
public class Producto {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 200)
    private String nombre;

    @Column(length = 2000)
    private String descripcion;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal precio;

    @Column(name = "precio_oferta", precision = 10, scale = 2)
    private BigDecimal precioOferta;

    @Column(name = "imagen_principal_url", length = 500)
    private String imagenPrincipalUrl;

    @Column(unique = true, length = 50)
    private String sku;

    @Column(length = 100)
    private String marca;

    @Column(length = 100)
    private String material;

    @Column(nullable = false)
    private Boolean activo = true;

    @Column(nullable = false)
    private Boolean destacado = false;

    @Column(name = "fecha_creacion", nullable = false, updatable = false)
    private LocalDateTime fechaCreacion;

    @Column(name = "fecha_actualizacion")
    private LocalDateTime fechaActualizacion;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "categoria_id", nullable = false)
    private Categoria categoria;

    @OneToMany(mappedBy = "producto", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<ProductoVariante> variantes = new ArrayList<>();

    @OneToMany(mappedBy = "producto", cascade = CascadeType.ALL, orphanRemoval = true)
    @OrderBy("orden ASC")
    private List<ProductoImagen> imagenes = new ArrayList<>();

    // Constructor vacío requerido por JPA
    public Producto() {
    }

    public Producto(String nombre, BigDecimal precio, Categoria categoria) {
        this.nombre = nombre;
        this.precio = precio;
        this.categoria = categoria;
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
    public BigDecimal getPrecioFinal() {
        return precioOferta != null ? precioOferta : precio;
    }

    public boolean tieneOferta() {
        return precioOferta != null && precioOferta.compareTo(precio) < 0;
    }

    public int getStockTotal() {
        return variantes.stream()
                .mapToInt(ProductoVariante::getStock)
                .sum();
    }

    public boolean tieneStock() {
        return getStockTotal() > 0;
    }

    // Helper para agregar variante
    public void agregarVariante(ProductoVariante variante) {
        variantes.add(variante);
        variante.setProducto(this);
    }

    public void removerVariante(ProductoVariante variante) {
        variantes.remove(variante);
        variante.setProducto(null);
    }

    // Getters y Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getNombre() {
        return nombre;
    }

    public void setNombre(String nombre) {
        this.nombre = nombre;
    }

    public String getDescripcion() {
        return descripcion;
    }

    public void setDescripcion(String descripcion) {
        this.descripcion = descripcion;
    }

    public BigDecimal getPrecio() {
        return precio;
    }

    public void setPrecio(BigDecimal precio) {
        this.precio = precio;
    }

    public BigDecimal getPrecioOferta() {
        return precioOferta;
    }

    public void setPrecioOferta(BigDecimal precioOferta) {
        this.precioOferta = precioOferta;
    }

    public String getImagenPrincipalUrl() {
        return imagenPrincipalUrl;
    }

    public void setImagenPrincipalUrl(String imagenPrincipalUrl) {
        this.imagenPrincipalUrl = imagenPrincipalUrl;
    }

    public String getSku() {
        return sku;
    }

    public void setSku(String sku) {
        this.sku = sku;
    }

    public String getMarca() {
        return marca;
    }

    public void setMarca(String marca) {
        this.marca = marca;
    }

    public String getMaterial() {
        return material;
    }

    public void setMaterial(String material) {
        this.material = material;
    }

    public Boolean getActivo() {
        return activo;
    }

    public void setActivo(Boolean activo) {
        this.activo = activo;
    }

    public Boolean getDestacado() {
        return destacado;
    }

    public void setDestacado(Boolean destacado) {
        this.destacado = destacado;
    }

    public LocalDateTime getFechaCreacion() {
        return fechaCreacion;
    }

    public LocalDateTime getFechaActualizacion() {
        return fechaActualizacion;
    }

    public Categoria getCategoria() {
        return categoria;
    }

    public void setCategoria(Categoria categoria) {
        this.categoria = categoria;
    }

    public List<ProductoVariante> getVariantes() {
        return variantes;
    }

    public void setVariantes(List<ProductoVariante> variantes) {
        this.variantes = variantes;
    }

    public List<ProductoImagen> getImagenes() {
        return imagenes;
    }

    public void setImagenes(List<ProductoImagen> imagenes) {
        this.imagenes = imagenes;
    }

    // Helper para agregar imagen
    public void agregarImagen(ProductoImagen imagen) {
        imagenes.add(imagen);
        imagen.setProducto(this);
    }

    public void removerImagen(ProductoImagen imagen) {
        imagenes.remove(imagen);
        imagen.setProducto(null);
    }
}

