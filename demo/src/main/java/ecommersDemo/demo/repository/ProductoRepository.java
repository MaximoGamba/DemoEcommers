package ecommersDemo.demo.repository;

import ecommersDemo.demo.model.Categoria;
import ecommersDemo.demo.model.Producto;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

@Repository
public interface ProductoRepository extends JpaRepository<Producto, Long> {

    /**
     * Busca un producto por su SKU.
     */
    Optional<Producto> findBySku(String sku);

    /**
     * Verifica si existe un producto con el SKU dado.
     */
    boolean existsBySku(String sku);

    /**
     * Busca productos activos.
     */
    List<Producto> findByActivoTrue();

    /**
     * Busca productos activos con paginación.
     */
    Page<Producto> findByActivoTrue(Pageable pageable);

    /**
     * Busca productos por categoría.
     */
    List<Producto> findByCategoria(Categoria categoria);

    /**
     * Busca productos activos por categoría.
     */
    List<Producto> findByCategoriaAndActivoTrue(Categoria categoria);

    /**
     * Busca productos activos por categoría con paginación.
     */
    Page<Producto> findByCategoriaIdAndActivoTrue(Long categoriaId, Pageable pageable);

    /**
     * Busca productos destacados activos.
     */
    List<Producto> findByDestacadoTrueAndActivoTrue();

    /**
     * Busca productos con ofertas activas.
     */
    @Query("SELECT p FROM Producto p WHERE p.activo = true AND p.precioOferta IS NOT NULL AND p.precioOferta < p.precio")
    List<Producto> findProductosEnOferta();

    /**
     * Busca productos por nombre (búsqueda parcial, case-insensitive).
     */
    List<Producto> findByNombreContainingIgnoreCaseAndActivoTrue(String nombre);

    /**
     * Búsqueda de productos por nombre o descripción.
     */
    @Query("SELECT p FROM Producto p WHERE p.activo = true AND " +
           "(LOWER(p.nombre) LIKE LOWER(CONCAT('%', :termino, '%')) OR " +
           "LOWER(p.descripcion) LIKE LOWER(CONCAT('%', :termino, '%')))")
    Page<Producto> buscarProductos(@Param("termino") String termino, Pageable pageable);

    /**
     * Busca productos por rango de precio.
     */
    @Query("SELECT p FROM Producto p WHERE p.activo = true AND " +
           "COALESCE(p.precioOferta, p.precio) BETWEEN :precioMin AND :precioMax")
    List<Producto> findByRangoPrecio(@Param("precioMin") BigDecimal precioMin, 
                                      @Param("precioMax") BigDecimal precioMax);

    /**
     * Busca productos por marca.
     */
    List<Producto> findByMarcaAndActivoTrue(String marca);

    /**
     * Obtiene las marcas disponibles.
     */
    @Query("SELECT DISTINCT p.marca FROM Producto p WHERE p.activo = true AND p.marca IS NOT NULL ORDER BY p.marca")
    List<String> findMarcasDisponibles();

    /**
     * Busca productos con stock disponible.
     */
    @Query("SELECT DISTINCT p FROM Producto p " +
           "JOIN p.variantes v WHERE p.activo = true AND v.activo = true AND v.stock > 0")
    List<Producto> findProductosConStock();

    /**
     * Productos más recientes.
     */
    List<Producto> findTop10ByActivoTrueOrderByFechaCreacionDesc();

    /**
     * Busca productos relacionados por categoría (excluyendo el producto actual).
     */
    @Query("SELECT p FROM Producto p WHERE p.activo = true AND p.categoria.id = :categoriaId AND p.id != :productoId ORDER BY p.fechaCreacion DESC")
    List<Producto> findProductosRelacionados(@Param("categoriaId") Long categoriaId, @Param("productoId") Long productoId, Pageable pageable);
}

