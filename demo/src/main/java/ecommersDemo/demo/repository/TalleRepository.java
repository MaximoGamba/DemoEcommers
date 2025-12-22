package ecommersDemo.demo.repository;

import ecommersDemo.demo.model.Talle;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface TalleRepository extends JpaRepository<Talle, Long> {

    /**
     * Busca un talle por su nombre exacto.
     */
    Optional<Talle> findByNombre(String nombre);

    /**
     * Verifica si existe un talle con el nombre dado.
     */
    boolean existsByNombre(String nombre);

    /**
     * Busca talles activos ordenados por orden de visualización.
     */
    List<Talle> findByActivoTrueOrderByOrdenVisualizacionAsc();

    /**
     * Busca todos los talles ordenados por orden de visualización.
     */
    List<Talle> findAllByOrderByOrdenVisualizacionAsc();

    /**
     * Busca talles disponibles para un producto específico.
     */
    @Query("SELECT DISTINCT t FROM Talle t " +
           "JOIN ProductoVariante pv ON pv.talle = t " +
           "WHERE pv.producto.id = :productoId AND pv.stock > 0 AND pv.activo = true " +
           "ORDER BY t.ordenVisualizacion")
    List<Talle> findTallesDisponiblesPorProducto(@Param("productoId") Long productoId);
}

