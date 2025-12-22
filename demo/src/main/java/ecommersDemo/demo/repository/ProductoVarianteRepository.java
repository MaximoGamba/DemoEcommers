package ecommersDemo.demo.repository;

import ecommersDemo.demo.model.Producto;
import ecommersDemo.demo.model.ProductoVariante;
import ecommersDemo.demo.model.Talle;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ProductoVarianteRepository extends JpaRepository<ProductoVariante, Long> {

    /**
     * Busca una variante por su SKU.
     */
    Optional<ProductoVariante> findBySku(String sku);

    /**
     * Verifica si existe una variante con el SKU dado.
     */
    boolean existsBySku(String sku);

    /**
     * Busca variantes por producto.
     */
    List<ProductoVariante> findByProducto(Producto producto);

    /**
     * Busca variantes activas por producto.
     */
    List<ProductoVariante> findByProductoAndActivoTrue(Producto producto);

    /**
     * Busca variantes por producto ID.
     */
    List<ProductoVariante> findByProductoId(Long productoId);

    /**
     * Busca variantes activas con stock por producto.
     */
    @Query("SELECT pv FROM ProductoVariante pv WHERE pv.producto.id = :productoId " +
           "AND pv.activo = true AND pv.stock > 0")
    List<ProductoVariante> findVariantesDisponibles(@Param("productoId") Long productoId);

    /**
     * Busca una variante específica por producto, talle y color.
     */
    Optional<ProductoVariante> findByProductoAndTalleAndColor(Producto producto, Talle talle, String color);

    /**
     * Busca variante por producto ID, talle ID y color.
     */
    Optional<ProductoVariante> findByProductoIdAndTalleIdAndColor(Long productoId, Long talleId, String color);

    /**
     * Busca variantes por talle.
     */
    List<ProductoVariante> findByTalle(Talle talle);

    /**
     * Busca variantes con stock bajo.
     */
    @Query("SELECT pv FROM ProductoVariante pv WHERE pv.activo = true AND pv.stock <= pv.stockMinimo AND pv.stock > 0")
    List<ProductoVariante> findVariantesConStockBajo();

    /**
     * Busca variantes sin stock.
     */
    @Query("SELECT pv FROM ProductoVariante pv WHERE pv.activo = true AND pv.stock = 0")
    List<ProductoVariante> findVariantesSinStock();

    /**
     * Obtiene los colores disponibles para un producto.
     */
    @Query("SELECT DISTINCT pv.color FROM ProductoVariante pv " +
           "WHERE pv.producto.id = :productoId AND pv.activo = true AND pv.stock > 0 AND pv.color IS NOT NULL")
    List<String> findColoresDisponiblesPorProducto(@Param("productoId") Long productoId);

    /**
     * Actualiza el stock de una variante.
     */
    @Modifying
    @Query("UPDATE ProductoVariante pv SET pv.stock = :nuevoStock WHERE pv.id = :varianteId")
    int actualizarStock(@Param("varianteId") Long varianteId, @Param("nuevoStock") Integer nuevoStock);

    /**
     * Decrementa el stock de una variante.
     */
    @Modifying
    @Query("UPDATE ProductoVariante pv SET pv.stock = pv.stock - :cantidad WHERE pv.id = :varianteId AND pv.stock >= :cantidad")
    int decrementarStock(@Param("varianteId") Long varianteId, @Param("cantidad") Integer cantidad);
}

