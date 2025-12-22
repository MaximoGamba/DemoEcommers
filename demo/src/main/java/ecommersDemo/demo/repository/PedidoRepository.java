package ecommersDemo.demo.repository;

import ecommersDemo.demo.model.Pedido;
import ecommersDemo.demo.model.Pedido.EstadoPedido;
import ecommersDemo.demo.model.Usuario;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface PedidoRepository extends JpaRepository<Pedido, Long> {

    /**
     * Busca un pedido por su número.
     */
    Optional<Pedido> findByNumeroPedido(String numeroPedido);

    /**
     * Verifica si existe un pedido con el número dado.
     */
    boolean existsByNumeroPedido(String numeroPedido);

    /**
     * Busca pedidos por usuario.
     */
    List<Pedido> findByUsuario(Usuario usuario);

    /**
     * Busca pedidos por usuario ID con paginación.
     */
    Page<Pedido> findByUsuarioId(Long usuarioId, Pageable pageable);

    /**
     * Busca pedidos por usuario ordenados por fecha descendente.
     */
    List<Pedido> findByUsuarioIdOrderByFechaPedidoDesc(Long usuarioId);

    /**
     * Busca pedidos por estado.
     */
    List<Pedido> findByEstado(EstadoPedido estado);

    /**
     * Busca pedidos por estado con paginación.
     */
    Page<Pedido> findByEstado(EstadoPedido estado, Pageable pageable);

    /**
     * Busca pedidos por usuario y estado.
     */
    List<Pedido> findByUsuarioIdAndEstado(Long usuarioId, EstadoPedido estado);

    /**
     * Busca pedidos en un rango de fechas.
     */
    @Query("SELECT p FROM Pedido p WHERE p.fechaPedido BETWEEN :fechaInicio AND :fechaFin ORDER BY p.fechaPedido DESC")
    List<Pedido> findPedidosPorRangoFecha(@Param("fechaInicio") LocalDateTime fechaInicio, 
                                           @Param("fechaFin") LocalDateTime fechaFin);

    /**
     * Busca pedidos pendientes (sin procesar).
     */
    @Query("SELECT p FROM Pedido p WHERE p.estado IN ('PENDIENTE', 'CONFIRMADO', 'PAGADO') ORDER BY p.fechaPedido ASC")
    List<Pedido> findPedidosPendientes();

    /**
     * Cuenta pedidos por estado.
     */
    long countByEstado(EstadoPedido estado);

    /**
     * Calcula el total de ventas en un período.
     */
    @Query("SELECT COALESCE(SUM(p.total), 0) FROM Pedido p WHERE p.fechaPedido BETWEEN :fechaInicio AND :fechaFin " +
           "AND p.estado NOT IN ('CANCELADO', 'DEVUELTO')")
    BigDecimal calcularTotalVentas(@Param("fechaInicio") LocalDateTime fechaInicio, 
                                    @Param("fechaFin") LocalDateTime fechaFin);

    /**
     * Busca los últimos N pedidos.
     */
    List<Pedido> findTop10ByOrderByFechaPedidoDesc();

    /**
     * Busca pedidos por método de pago.
     */
    List<Pedido> findByMetodoPago(Pedido.MetodoPago metodoPago);

    /**
     * Estadísticas: cuenta pedidos por usuario.
     */
    @Query("SELECT COUNT(p) FROM Pedido p WHERE p.usuario.id = :usuarioId AND p.estado NOT IN ('CANCELADO')")
    long contarPedidosUsuario(@Param("usuarioId") Long usuarioId);

    /**
     * Estadísticas: total gastado por usuario.
     */
    @Query("SELECT COALESCE(SUM(p.total), 0) FROM Pedido p WHERE p.usuario.id = :usuarioId " +
           "AND p.estado NOT IN ('CANCELADO', 'DEVUELTO')")
    BigDecimal calcularTotalGastadoUsuario(@Param("usuarioId") Long usuarioId);
}

