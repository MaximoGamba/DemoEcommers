package ecommersDemo.demo.dto;

import ecommersDemo.demo.model.Producto;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

public class ProductoDTO {

    private Long id;
    private String nombre;
    private String descripcion;
    private BigDecimal precio;
    private BigDecimal precioOferta;
    private BigDecimal precioFinal;
    private String imagenPrincipalUrl;
    private String sku;
    private String marca;
    private String material;
    private Boolean activo;
    private Boolean destacado;
    private Boolean tieneOferta;
    private Boolean tieneStock;
    private Integer stockTotal;
    private Long categoriaId;
    private String categoriaNombre;
    private LocalDateTime fechaCreacion;
    private List<ProductoVarianteDTO> variantes;
    private List<ProductoImagenDTO> imagenes;

    // Constructor vacío
    public ProductoDTO() {
    }

    // Constructor desde entidad (sin variantes)
    public ProductoDTO(Producto producto) {
        this.id = producto.getId();
        this.nombre = producto.getNombre();
        this.descripcion = producto.getDescripcion();
        this.precio = producto.getPrecio();
        this.precioOferta = producto.getPrecioOferta();
        this.precioFinal = producto.getPrecioFinal();
        this.imagenPrincipalUrl = producto.getImagenPrincipalUrl();
        this.sku = producto.getSku();
        this.marca = producto.getMarca();
        this.material = producto.getMaterial();
        this.activo = producto.getActivo();
        this.destacado = producto.getDestacado();
        this.tieneOferta = producto.tieneOferta();
        this.tieneStock = producto.tieneStock();
        this.stockTotal = producto.getStockTotal();
        this.fechaCreacion = producto.getFechaCreacion();
        
        if (producto.getCategoria() != null) {
            this.categoriaId = producto.getCategoria().getId();
            this.categoriaNombre = producto.getCategoria().getNombre();
        }
        
        // Incluir imágenes siempre
        if (producto.getImagenes() != null) {
            this.imagenes = producto.getImagenes().stream()
                    .map(ProductoImagenDTO::new)
                    .collect(Collectors.toList());
        }
    }

    // Constructor desde entidad (con variantes)
    public ProductoDTO(Producto producto, boolean incluirVariantes) {
        this(producto);
        if (incluirVariantes && producto.getVariantes() != null) {
            this.variantes = producto.getVariantes().stream()
                    .map(ProductoVarianteDTO::new)
                    .collect(Collectors.toList());
        }
        // Siempre incluir imágenes
        if (producto.getImagenes() != null) {
            this.imagenes = producto.getImagenes().stream()
                    .map(ProductoImagenDTO::new)
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

    public BigDecimal getPrecioFinal() {
        return precioFinal;
    }

    public void setPrecioFinal(BigDecimal precioFinal) {
        this.precioFinal = precioFinal;
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

    public Boolean getTieneOferta() {
        return tieneOferta;
    }

    public void setTieneOferta(Boolean tieneOferta) {
        this.tieneOferta = tieneOferta;
    }

    public Boolean getTieneStock() {
        return tieneStock;
    }

    public void setTieneStock(Boolean tieneStock) {
        this.tieneStock = tieneStock;
    }

    public Integer getStockTotal() {
        return stockTotal;
    }

    public void setStockTotal(Integer stockTotal) {
        this.stockTotal = stockTotal;
    }

    public Long getCategoriaId() {
        return categoriaId;
    }

    public void setCategoriaId(Long categoriaId) {
        this.categoriaId = categoriaId;
    }

    public String getCategoriaNombre() {
        return categoriaNombre;
    }

    public void setCategoriaNombre(String categoriaNombre) {
        this.categoriaNombre = categoriaNombre;
    }

    public LocalDateTime getFechaCreacion() {
        return fechaCreacion;
    }

    public void setFechaCreacion(LocalDateTime fechaCreacion) {
        this.fechaCreacion = fechaCreacion;
    }

    public List<ProductoVarianteDTO> getVariantes() {
        return variantes;
    }

    public void setVariantes(List<ProductoVarianteDTO> variantes) {
        this.variantes = variantes;
    }

    public List<ProductoImagenDTO> getImagenes() {
        return imagenes;
    }

    public void setImagenes(List<ProductoImagenDTO> imagenes) {
        this.imagenes = imagenes;
    }
}

