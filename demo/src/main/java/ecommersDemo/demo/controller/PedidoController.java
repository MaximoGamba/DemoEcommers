package ecommersDemo.demo.controller;

import ecommersDemo.demo.dto.PedidoDTO;
import ecommersDemo.demo.dto.request.CrearPedidoRequest;
import ecommersDemo.demo.dto.response.ApiResponse;
import ecommersDemo.demo.service.PedidoService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Controlador REST para pedidos de usuarios.
 * 
 * Cuando se implemente autenticación, el usuario se obtendrá del token.
 * Por ahora se pasa como header X-User-Id.
 */
@RestController
@RequestMapping("/api/pedidos")
@CrossOrigin(origins = "*")
public class PedidoController {

    private final PedidoService pedidoService;

    public PedidoController(PedidoService pedidoService) {
        this.pedidoService = pedidoService;
    }

    // ==================== CREAR PEDIDO ====================

    /**
     * POST /api/pedidos
     * Crea un nuevo pedido a partir del carrito del usuario.
     */
    @PostMapping
    public ResponseEntity<ApiResponse<PedidoDTO>> crearPedido(
            @RequestHeader("X-User-Id") Long usuarioId,
            @RequestBody CrearPedidoRequest request) {
        
        PedidoDTO pedido = pedidoService.crearPedidoDesdeCarrito(usuarioId, request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Pedido creado exitosamente", pedido));
    }

    // ==================== LISTAR PEDIDOS ====================

    /**
     * GET /api/pedidos
     * Obtiene los pedidos del usuario con paginación.
     */
    @GetMapping
    public ResponseEntity<ApiResponse<Page<PedidoDTO>>> obtenerPedidos(
            @RequestHeader("X-User-Id") Long usuarioId,
            @PageableDefault(size = 10, sort = "fechaPedido", direction = Sort.Direction.DESC) Pageable pageable) {
        
        Page<PedidoDTO> pedidos = pedidoService.obtenerPedidosUsuario(usuarioId, pageable);
        return ResponseEntity.ok(ApiResponse.success(pedidos));
    }

    /**
     * GET /api/pedidos/lista
     * Obtiene todos los pedidos del usuario como lista (sin paginación).
     */
    @GetMapping("/lista")
    public ResponseEntity<ApiResponse<List<PedidoDTO>>> obtenerPedidosLista(
            @RequestHeader("X-User-Id") Long usuarioId) {
        
        List<PedidoDTO> pedidos = pedidoService.obtenerPedidosUsuarioLista(usuarioId);
        return ResponseEntity.ok(ApiResponse.success(pedidos));
    }

    // ==================== OBTENER PEDIDO ====================

    /**
     * GET /api/pedidos/{id}
     * Obtiene el detalle de un pedido específico.
     */
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<PedidoDTO>> obtenerPedido(
            @RequestHeader("X-User-Id") Long usuarioId,
            @PathVariable Long id) {
        
        PedidoDTO pedido = pedidoService.obtenerPedidoUsuario(usuarioId, id);
        return ResponseEntity.ok(ApiResponse.success(pedido));
    }

    /**
     * GET /api/pedidos/numero/{numeroPedido}
     * Obtiene un pedido por su número.
     */
    @GetMapping("/numero/{numeroPedido}")
    public ResponseEntity<ApiResponse<PedidoDTO>> obtenerPedidoPorNumero(
            @RequestHeader("X-User-Id") Long usuarioId,
            @PathVariable String numeroPedido) {
        
        PedidoDTO pedido = pedidoService.obtenerPedidoPorNumero(usuarioId, numeroPedido);
        return ResponseEntity.ok(ApiResponse.success(pedido));
    }

    // ==================== CANCELAR PEDIDO ====================

    /**
     * PUT /api/pedidos/{id}/cancelar
     * Cancela un pedido (solo si está en estado cancelable).
     */
    @PutMapping("/{id}/cancelar")
    public ResponseEntity<ApiResponse<PedidoDTO>> cancelarPedido(
            @RequestHeader("X-User-Id") Long usuarioId,
            @PathVariable Long id) {
        
        PedidoDTO pedido = pedidoService.cancelarPedidoUsuario(usuarioId, id);
        return ResponseEntity.ok(ApiResponse.success("Pedido cancelado exitosamente", pedido));
    }
}

