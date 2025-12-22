package ecommersDemo.demo.model;

import jakarta.persistence.*;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "talles")
public class Talle {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true, length = 20)
    private String nombre;

    @Column(length = 100)
    private String descripcion;

    @Column(name = "orden_visualizacion")
    private Integer ordenVisualizacion = 0;

    @Column(nullable = false)
    private Boolean activo = true;

    @OneToMany(mappedBy = "talle")
    private List<ProductoVariante> variantes = new ArrayList<>();

    // Constructor vacío requerido por JPA
    public Talle() {
    }

    public Talle(String nombre) {
        this.nombre = nombre;
    }

    public Talle(String nombre, Integer ordenVisualizacion) {
        this.nombre = nombre;
        this.ordenVisualizacion = ordenVisualizacion;
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

    public List<ProductoVariante> getVariantes() {
        return variantes;
    }

    public void setVariantes(List<ProductoVariante> variantes) {
        this.variantes = variantes;
    }
}

