package ecommersDemo.demo.dto.request;

import java.math.BigDecimal;
import java.util.List;

/**
 * DTO para actualizar un producto existente.
 */
public class ProductoUpdateRequest {

    private String nombre;
    private String descripcion;
    private BigDecimal precio;
    private BigDecimal precioOferta;
    private String imagenPrincipalUrl;
    private String sku;
    private String marca;
    private String material;
    private Long categoriaId;
    private Boolean activo;
    private Boolean destacado;
    private List<ImagenRequest> imagenes;

    // Constructor vacío
    public ProductoUpdateRequest() {
    }

    // Getters y Setters
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

    public Long getCategoriaId() {
        return categoriaId;
    }

    public void setCategoriaId(Long categoriaId) {
        this.categoriaId = categoriaId;
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

    public List<ImagenRequest> getImagenes() {
        return imagenes;
    }

    public void setImagenes(List<ImagenRequest> imagenes) {
        this.imagenes = imagenes;
    }
}

