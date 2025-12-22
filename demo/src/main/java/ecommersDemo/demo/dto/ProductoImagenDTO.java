package ecommersDemo.demo.dto;

import ecommersDemo.demo.model.ProductoImagen;

public class ProductoImagenDTO {

    private Long id;
    private String url;
    private String descripcion;
    private Integer orden;
    private Boolean esPrincipal;

    // Constructor vacío
    public ProductoImagenDTO() {
    }

    // Constructor desde entidad
    public ProductoImagenDTO(ProductoImagen imagen) {
        this.id = imagen.getId();
        this.url = imagen.getUrl();
        this.descripcion = imagen.getDescripcion();
        this.orden = imagen.getOrden();
        this.esPrincipal = imagen.getEsPrincipal();
    }

    // Getters y Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getUrl() {
        return url;
    }

    public void setUrl(String url) {
        this.url = url;
    }

    public String getDescripcion() {
        return descripcion;
    }

    public void setDescripcion(String descripcion) {
        this.descripcion = descripcion;
    }

    public Integer getOrden() {
        return orden;
    }

    public void setOrden(Integer orden) {
        this.orden = orden;
    }

    public Boolean getEsPrincipal() {
        return esPrincipal;
    }

    public void setEsPrincipal(Boolean esPrincipal) {
        this.esPrincipal = esPrincipal;
    }
}


