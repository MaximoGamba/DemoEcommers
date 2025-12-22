package ecommersDemo.demo.repository;

import ecommersDemo.demo.model.Carrito;
import ecommersDemo.demo.model.ItemCarrito;
import ecommersDemo.demo.model.ProductoVariante;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ItemCarritoRepository extends JpaRepository<ItemCarrito, Long> {

    /**
     * Busca items por carrito.
     */
    List<ItemCarrito> findByCarrito(Carrito carrito);

    /**
     * Busca items por carrito ID.
     */
    List<ItemCarrito> findByCarritoId(Long carritoId);

    /**
     * Busca un item específico en un carrito por variante de producto.
     */
    Optional<ItemCarrito> findByCarritoAndProductoVariante(Carrito carrito, ProductoVariante productoVariante);

    /**
     * Busca un item por carrito ID y variante ID.
     */
    Optional<ItemCarrito> findByCarritoIdAndProductoVarianteId(Long carritoId, Long productoVarianteId);

    /**
     * Verifica si existe un item con la variante dada en el carrito.
     */
    boolean existsByCarritoIdAndProductoVarianteId(Long carritoId, Long productoVarianteId);

    /**
     * Cuenta los items en un carrito.
     */
    long countByCarritoId(Long carritoId);

    /**
     * Elimina todos los items de un carrito.
     */
    @Modifying
    @Query("DELETE FROM ItemCarrito ic WHERE ic.carrito.id = :carritoId")
    int eliminarItemsDelCarrito(@Param("carritoId") Long carritoId);

    /**
     * Elimina un item específico del carrito.
     */
    @Modifying
    @Query("DELETE FROM ItemCarrito ic WHERE ic.carrito.id = :carritoId AND ic.productoVariante.id = :varianteId")
    int eliminarItemDelCarrito(@Param("carritoId") Long carritoId, @Param("varianteId") Long varianteId);

    /**
     * Actualiza la cantidad de un item.
     */
    @Modifying
    @Query("UPDATE ItemCarrito ic SET ic.cantidad = :cantidad WHERE ic.id = :itemId")
    int actualizarCantidad(@Param("itemId") Long itemId, @Param("cantidad") Integer cantidad);

    /**
     * Busca items que contienen una variante específica (para validar stock).
     */
    List<ItemCarrito> findByProductoVarianteId(Long productoVarianteId);
}

