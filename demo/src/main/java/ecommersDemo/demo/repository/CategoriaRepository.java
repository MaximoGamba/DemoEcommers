package ecommersDemo.demo.repository;

import ecommersDemo.demo.model.Categoria;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CategoriaRepository extends JpaRepository<Categoria, Long> {

    /**
     * Busca una categoría por su nombre exacto.
     */
    Optional<Categoria> findByNombre(String nombre);

    /**
     * Verifica si existe una categoría con el nombre dado.
     */
    boolean existsByNombre(String nombre);

    /**
     * Busca categorías activas ordenadas por orden de visualización.
     */
    List<Categoria> findByActivaTrueOrderByOrdenVisualizacionAsc();

    /**
     * Busca todas las categorías ordenadas por orden de visualización.
     */
    List<Categoria> findAllByOrderByOrdenVisualizacionAsc();

    /**
     * Busca categorías por nombre (búsqueda parcial, case-insensitive).
     */
    List<Categoria> findByNombreContainingIgnoreCase(String nombre);

    /**
     * Cuenta los productos activos por categoría.
     */
    @Query("SELECT c FROM Categoria c LEFT JOIN FETCH c.productos p WHERE c.activa = true AND p.activo = true")
    List<Categoria> findCategoriasConProductosActivos();
}

