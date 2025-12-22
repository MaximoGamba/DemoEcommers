package ecommersDemo.demo.dto;

import ecommersDemo.demo.model.Talle;

public class TalleDTO {

    private Long id;
    private String nombre;
    private String descripcion;
    private Integer ordenVisualizacion;
    private Boolean activo;

    // Constructor vacío
    public TalleDTO() {
    }

    // Constructor desde entidad
    public TalleDTO(Talle talle) {
        this.id = talle.getId();
        this.nombre = talle.getNombre();
        this.descripcion = talle.getDescripcion();
        this.ordenVisualizacion = talle.getOrdenVisualizacion();
        this.activo = talle.getActivo();
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

    public Integer getOrdenVisualizacion() {
        return ordenVisualizacion;
    }

    public void setOrdenVisualizacion(Integer ordenVisualizacion) {
        this.ordenVisualizacion = ordenVisualizacion;
    }

    public Boolean getActivo() {
        return activo;
    }

    public void setActivo(Boolean activo) {
        this.activo = activo;
    }
}

