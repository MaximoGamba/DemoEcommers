package ecommersDemo.demo.dto;

import ecommersDemo.demo.model.Categoria;

public class CategoriaDTO {

    private Long id;
    private String nombre;
    private String descripcion;
    private String imagenUrl;
    private Boolean activa;
    private Integer ordenVisualizacion;
    private Integer cantidadProductos;

    // Constructor vacío
    public CategoriaDTO() {
    }

    // Constructor desde entidad
    public CategoriaDTO(Categoria categoria) {
        this.id = categoria.getId();
        this.nombre = categoria.getNombre();
        this.descripcion = categoria.getDescripcion();
        this.imagenUrl = categoria.getImagenUrl();
        this.activa = categoria.getActiva();
        this.ordenVisualizacion = categoria.getOrdenVisualizacion();
        this.cantidadProductos = categoria.getCantidadProductos();
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

    public String getImagenUrl() {
        return imagenUrl;
    }

    public void setImagenUrl(String imagenUrl) {
        this.imagenUrl = imagenUrl;
    }

    public Boolean getActiva() {
        return activa;
    }

    public void setActiva(Boolean activa) {
        this.activa = activa;
    }

    public Integer getOrdenVisualizacion() {
        return ordenVisualizacion;
    }

    public void setOrdenVisualizacion(Integer ordenVisualizacion) {
        this.ordenVisualizacion = ordenVisualizacion;
    }

    public Integer getCantidadProductos() {
        return cantidadProductos;
    }

    public void setCantidadProductos(Integer cantidadProductos) {
        this.cantidadProductos = cantidadProductos;
    }
}

