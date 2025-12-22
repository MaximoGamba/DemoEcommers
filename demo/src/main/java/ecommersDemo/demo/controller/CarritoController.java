package ecommersDemo.demo.controller;

import ecommersDemo.demo.dto.CarritoDTO;
import ecommersDemo.demo.dto.request.ActualizarCantidadRequest;
import ecommersDemo.demo.dto.request.AgregarItemCarritoRequest;
import ecommersDemo.demo.dto.response.ApiResponse;
import ecommersDemo.demo.service.CarritoService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

/**
 * Controlador REST para el carrito de compras.
 * 
 * Por ahora funciona con session ID para usuarios anónimos.
 * Cuando se implemente autenticación, se usará el usuario autenticado.
 */
@RestController
@RequestMapping("/api/carrito")
@CrossOrigin(origins = "*")
public class CarritoController {

    private final CarritoService carritoService;

    public CarritoController(CarritoService carritoService) {
        this.carritoService = carritoService;
    }

    // ==================== OBTENER CARRITO ====================

    /**
     * GET /api/carrito
     * Obtiene el carrito actual.
     * Por ahora usa session ID, después se adaptará para usuarios autenticados.
     */
    @GetMapping
    public ResponseEntity<ApiResponse<CarritoDTO>> obtenerCarrito(
            @RequestHeader(value = "X-Session-Id", required = false) String sessionId,
            @RequestHeader(value = "X-User-Id", required = false) Long usuarioId) {
        
        CarritoDTO carrito;
        
        if (usuarioId != null) {
            carrito = carritoService.obtenerCarritoPorUsuario(usuarioId);
        } else if (sessionId != null && !sessionId.isEmpty()) {
            carrito = carritoService.obtenerCarritoPorSession(sessionId);
        } else {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("Se requiere X-Session-Id o X-User-Id"));
        }
        
        return ResponseEntity.ok(ApiResponse.success(carrito));
    }

    // ==================== AGREGAR ITEM ====================

    /**
     * POST /api/carrito/items
     * Agrega un item al carrito.
     */
    @PostMapping("/items")
    public ResponseEntity<ApiResponse<CarritoDTO>> agregarItem(
            @RequestHeader(value = "X-Session-Id", required = false) String sessionId,
            @RequestHeader(value = "X-User-Id", required = false) Long usuarioId,
            @RequestBody AgregarItemCarritoRequest request) {
        
        CarritoDTO carrito;
        
        if (usuarioId != null) {
            carrito = carritoService.agregarItemPorUsuario(usuarioId, request);
        } else if (sessionId != null && !sessionId.isEmpty()) {
            carrito = carritoService.agregarItemPorSession(sessionId, request);
        } else {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("Se requiere X-Session-Id o X-User-Id"));
        }
        
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Producto agregado al carrito", carrito));
    }

    // ==================== ACTUALIZAR CANTIDAD ====================

    /**
     * PUT /api/carrito/items/{itemId}
     * Actualiza la cantidad de un item en el carrito.
     */
    @PutMapping("/items/{itemId}")
    public ResponseEntity<ApiResponse<CarritoDTO>> actualizarCantidad(
            @PathVariable Long itemId,
            @RequestBody ActualizarCantidadRequest request) {
        
        CarritoDTO carrito = carritoService.actualizarCantidadItem(itemId, request);
        return ResponseEntity.ok(ApiResponse.success("Cantidad actualizada", carrito));
    }

    // ==================== ELIMINAR ITEM ====================

    /**
     * DELETE /api/carrito/items/{itemId}
     * Elimina un item del carrito.
     */
    @DeleteMapping("/items/{itemId}")
    public ResponseEntity<ApiResponse<CarritoDTO>> eliminarItem(@PathVariable Long itemId) {
        CarritoDTO carrito = carritoService.eliminarItem(itemId);
        return ResponseEntity.ok(ApiResponse.success("Producto eliminado del carrito", carrito));
    }

    // ==================== VACIAR CARRITO ====================

    /**
     * DELETE /api/carrito
     * Vacía el carrito completo.
     */
    @DeleteMapping
    public ResponseEntity<ApiResponse<CarritoDTO>> vaciarCarrito(
            @RequestHeader(value = "X-Session-Id", required = false) String sessionId,
            @RequestHeader(value = "X-User-Id", required = false) Long usuarioId) {
        
        CarritoDTO carrito;
        
        if (usuarioId != null) {
            carrito = carritoService.vaciarCarritoPorUsuario(usuarioId);
        } else if (sessionId != null && !sessionId.isEmpty()) {
            carrito = carritoService.vaciarCarritoPorSession(sessionId);
        } else {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("Se requiere X-Session-Id o X-User-Id"));
        }
        
        return ResponseEntity.ok(ApiResponse.success("Carrito vaciado", carrito));
    }

    // ==================== TRANSFERIR CARRITO ====================

    /**
     * POST /api/carrito/transferir
     * Transfiere el carrito anónimo a un usuario autenticado.
     * Útil cuando el usuario hace login después de agregar items al carrito.
     */
    @PostMapping("/transferir")
    public ResponseEntity<ApiResponse<CarritoDTO>> transferirCarrito(
            @RequestHeader("X-Session-Id") String sessionId,
            @RequestHeader("X-User-Id") Long usuarioId) {
        
        CarritoDTO carrito = carritoService.transferirCarritoAUsuario(sessionId, usuarioId);
        return ResponseEntity.ok(ApiResponse.success("Carrito transferido exitosamente", carrito));
    }
}

