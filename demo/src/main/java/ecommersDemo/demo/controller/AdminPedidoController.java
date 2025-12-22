package ecommersDemo.demo.controller;

import ecommersDemo.demo.dto.PedidoDTO;
import ecommersDemo.demo.dto.request.CambiarEstadoPedidoRequest;
import ecommersDemo.demo.dto.response.ApiResponse;
import ecommersDemo.demo.model.Pedido.EstadoPedido;
import ecommersDemo.demo.service.PedidoService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Controlador REST para la administración de pedidos.
 * Por ahora sin seguridad (se agregará más adelante).
 */
@RestController
@RequestMapping("/api/admin/pedidos")
@CrossOrigin(origins = "*")
public class AdminPedidoController {

    private final PedidoService pedidoService;

    public AdminPedidoController(PedidoService pedidoService) {
        this.pedidoService = pedidoService;
    }

    // ==================== LISTAR PEDIDOS ====================

    /**
     * GET /api/admin/pedidos
     * Obtiene todos los pedidos con paginación.
     */
    @GetMapping
    public ResponseEntity<ApiResponse<Page<PedidoDTO>>> obtenerTodosLosPedidos(
            @PageableDefault(size = 20, sort = "fechaPedido", direction = Sort.Direction.DESC) Pageable pageable,
            @RequestParam(required = false) EstadoPedido estado) {
        
        Page<PedidoDTO> pedidos;
        
        if (estado != null) {
            pedidos = pedidoService.obtenerPedidosPorEstado(estado, pageable);
        } else {
            pedidos = pedidoService.obtenerTodosLosPedidos(pageable);
        }
        
        return ResponseEntity.ok(ApiResponse.success(pedidos));
    }

    /**
     * GET /api/admin/pedidos/pendientes
     * Obtiene los pedidos pendientes de procesar.
     */
    @GetMapping("/pendientes")
    public ResponseEntity<ApiResponse<List<PedidoDTO>>> obtenerPedidosPendientes() {
        List<PedidoDTO> pedidos = pedidoService.obtenerPedidosPendientes();
        return ResponseEntity.ok(ApiResponse.success(pedidos));
    }

    /**
     * GET /api/admin/pedidos/recientes
     * Obtiene los últimos 10 pedidos.
     */
    @GetMapping("/recientes")
    public ResponseEntity<ApiResponse<List<PedidoDTO>>> obtenerPedidosRecientes() {
        List<PedidoDTO> pedidos = pedidoService.obtenerUltimosPedidos();
        return ResponseEntity.ok(ApiResponse.success(pedidos));
    }

    // ==================== OBTENER PEDIDO ====================

    /**
     * GET /api/admin/pedidos/{id}
     * Obtiene el detalle de un pedido.
     */
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<PedidoDTO>> obtenerPedido(@PathVariable Long id) {
        PedidoDTO pedido = pedidoService.obtenerPedidoAdmin(id);
        return ResponseEntity.ok(ApiResponse.success(pedido));
    }

    /**
     * GET /api/admin/pedidos/numero/{numeroPedido}
     * Obtiene un pedido por su número.
     */
    @GetMapping("/numero/{numeroPedido}")
    public ResponseEntity<ApiResponse<PedidoDTO>> obtenerPedidoPorNumero(
            @PathVariable String numeroPedido) {
        PedidoDTO pedido = pedidoService.obtenerPedidoPorNumeroAdmin(numeroPedido);
        return ResponseEntity.ok(ApiResponse.success(pedido));
    }

    // ==================== CAMBIAR ESTADO ====================

    /**
     * PUT /api/admin/pedidos/{id}/estado
     * Cambia el estado de un pedido.
     */
    @PutMapping("/{id}/estado")
    public ResponseEntity<ApiResponse<PedidoDTO>> cambiarEstado(
            @PathVariable Long id,
            @RequestBody CambiarEstadoPedidoRequest request) {
        
        PedidoDTO pedido = pedidoService.cambiarEstadoPedido(id, request);
        return ResponseEntity.ok(ApiResponse.success(
                "Estado del pedido actualizado a " + pedido.getEstado(), pedido));
    }

    // ==================== ESTADÍSTICAS ====================

    /**
     * GET /api/admin/pedidos/estadisticas
     * Obtiene estadísticas de pedidos.
     */
    @GetMapping("/estadisticas")
    public ResponseEntity<ApiResponse<Map<String, Object>>> obtenerEstadisticas() {
        Map<String, Object> stats = new HashMap<>();
        
        stats.put("pendientes", pedidoService.contarPedidosPorEstado(EstadoPedido.PENDIENTE));
        stats.put("confirmados", pedidoService.contarPedidosPorEstado(EstadoPedido.CONFIRMADO));
        stats.put("pagados", pedidoService.contarPedidosPorEstado(EstadoPedido.PAGADO));
        stats.put("enPreparacion", pedidoService.contarPedidosPorEstado(EstadoPedido.EN_PREPARACION));
        stats.put("enviados", pedidoService.contarPedidosPorEstado(EstadoPedido.ENVIADO));
        stats.put("entregados", pedidoService.contarPedidosPorEstado(EstadoPedido.ENTREGADO));
        stats.put("cancelados", pedidoService.contarPedidosPorEstado(EstadoPedido.CANCELADO));
        
        return ResponseEntity.ok(ApiResponse.success(stats));
    }

    // ==================== ACCIONES RÁPIDAS ====================

    /**
     * PUT /api/admin/pedidos/{id}/confirmar
     * Confirma un pedido pendiente.
     */
    @PutMapping("/{id}/confirmar")
    public ResponseEntity<ApiResponse<PedidoDTO>> confirmarPedido(@PathVariable Long id) {
        CambiarEstadoPedidoRequest request = new CambiarEstadoPedidoRequest();
        request.setNuevoEstado(EstadoPedido.CONFIRMADO);
        
        PedidoDTO pedido = pedidoService.cambiarEstadoPedido(id, request);
        return ResponseEntity.ok(ApiResponse.success("Pedido confirmado", pedido));
    }

    /**
     * PUT /api/admin/pedidos/{id}/marcar-pagado
     * Marca un pedido como pagado.
     */
    @PutMapping("/{id}/marcar-pagado")
    public ResponseEntity<ApiResponse<PedidoDTO>> marcarComoPagado(@PathVariable Long id) {
        CambiarEstadoPedidoRequest request = new CambiarEstadoPedidoRequest();
        request.setNuevoEstado(EstadoPedido.PAGADO);
        
        PedidoDTO pedido = pedidoService.cambiarEstadoPedido(id, request);
        return ResponseEntity.ok(ApiResponse.success("Pedido marcado como pagado", pedido));
    }

    /**
     * PUT /api/admin/pedidos/{id}/preparar
     * Marca un pedido como en preparación.
     */
    @PutMapping("/{id}/preparar")
    public ResponseEntity<ApiResponse<PedidoDTO>> prepararPedido(@PathVariable Long id) {
        CambiarEstadoPedidoRequest request = new CambiarEstadoPedidoRequest();
        request.setNuevoEstado(EstadoPedido.EN_PREPARACION);
        
        PedidoDTO pedido = pedidoService.cambiarEstadoPedido(id, request);
        return ResponseEntity.ok(ApiResponse.success("Pedido en preparación", pedido));
    }

    /**
     * PUT /api/admin/pedidos/{id}/enviar
     * Marca un pedido como enviado.
     */
    @PutMapping("/{id}/enviar")
    public ResponseEntity<ApiResponse<PedidoDTO>> enviarPedido(@PathVariable Long id) {
        CambiarEstadoPedidoRequest request = new CambiarEstadoPedidoRequest();
        request.setNuevoEstado(EstadoPedido.ENVIADO);
        
        PedidoDTO pedido = pedidoService.cambiarEstadoPedido(id, request);
        return ResponseEntity.ok(ApiResponse.success("Pedido enviado", pedido));
    }

    /**
     * PUT /api/admin/pedidos/{id}/entregar
     * Marca un pedido como entregado.
     */
    @PutMapping("/{id}/entregar")
    public ResponseEntity<ApiResponse<PedidoDTO>> entregarPedido(@PathVariable Long id) {
        CambiarEstadoPedidoRequest request = new CambiarEstadoPedidoRequest();
        request.setNuevoEstado(EstadoPedido.ENTREGADO);
        
        PedidoDTO pedido = pedidoService.cambiarEstadoPedido(id, request);
        return ResponseEntity.ok(ApiResponse.success("Pedido entregado", pedido));
    }

    /**
     * PUT /api/admin/pedidos/{id}/cancelar
     * Cancela un pedido.
     */
    @PutMapping("/{id}/cancelar")
    public ResponseEntity<ApiResponse<PedidoDTO>> cancelarPedido(@PathVariable Long id) {
        CambiarEstadoPedidoRequest request = new CambiarEstadoPedidoRequest();
        request.setNuevoEstado(EstadoPedido.CANCELADO);
        
        PedidoDTO pedido = pedidoService.cambiarEstadoPedido(id, request);
        return ResponseEntity.ok(ApiResponse.success("Pedido cancelado", pedido));
    }
}

