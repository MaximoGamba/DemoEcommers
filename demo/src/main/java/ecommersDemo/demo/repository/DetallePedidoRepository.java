package ecommersDemo.demo.repository;

import ecommersDemo.demo.model.DetallePedido;
import ecommersDemo.demo.model.Pedido;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DetallePedidoRepository extends JpaRepository<DetallePedido, Long> {

    /**
     * Busca detalles por pedido.
     */
    List<DetallePedido> findByPedido(Pedido pedido);

    /**
     * Busca detalles por pedido ID.
     */
    List<DetallePedido> findByPedidoId(Long pedidoId);

    /**
     * Busca detalles que contienen una variante específica.
     */
    List<DetallePedido> findByProductoVarianteId(Long productoVarianteId);

    /**
     * Cuenta cuántas veces se ha vendido una variante.
     */
    @Query("SELECT COALESCE(SUM(dp.cantidad), 0) FROM DetallePedido dp " +
           "JOIN dp.pedido p WHERE dp.productoVariante.id = :varianteId " +
           "AND p.estado NOT IN ('CANCELADO', 'DEVUELTO')")
    Long contarVentasPorVariante(@Param("varianteId") Long varianteId);

    /**
     * Productos más vendidos (por cantidad).
     */
    @Query("SELECT dp.nombreProducto, SUM(dp.cantidad) as totalVendido FROM DetallePedido dp " +
           "JOIN dp.pedido p WHERE p.estado NOT IN ('CANCELADO', 'DEVUELTO') " +
           "GROUP BY dp.nombreProducto ORDER BY totalVendido DESC")
    List<Object[]> findProductosMasVendidos();

    /**
     * Busca detalles por nombre de producto (historial).
     */
    List<DetallePedido> findByNombreProductoContainingIgnoreCase(String nombreProducto);
}

