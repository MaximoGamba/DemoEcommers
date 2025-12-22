package ecommersDemo.demo.controller;

import ecommersDemo.demo.dto.ProductoDTO;
import ecommersDemo.demo.dto.ProductoVarianteDTO;
import ecommersDemo.demo.dto.request.ProductoCreateRequest;
import ecommersDemo.demo.dto.request.ProductoUpdateRequest;
import ecommersDemo.demo.dto.request.VarianteCreateRequest;
import ecommersDemo.demo.dto.request.VarianteUpdateRequest;
import ecommersDemo.demo.dto.response.ApiResponse;
import ecommersDemo.demo.service.ProductoService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Controlador REST para la administración de productos.
 * Por ahora sin seguridad (se agregará más adelante).
 */
@RestController
@RequestMapping("/api/admin")
@CrossOrigin(origins = "*")
public class AdminProductoController {

    private final ProductoService productoService;

    public AdminProductoController(ProductoService productoService) {
        this.productoService = productoService;
    }

    // ==================== PRODUCTOS ====================

    /**
     * GET /api/admin/productos
     * Obtiene todos los productos (incluyendo inactivos).
     */
    @GetMapping("/productos")
    public ResponseEntity<ApiResponse<List<ProductoDTO>>> obtenerTodosLosProductos() {
        List<ProductoDTO> productos = productoService.obtenerTodosLosProductos();
        return ResponseEntity.ok(ApiResponse.success(productos));
    }

    /**
     * GET /api/admin/productos/{id}
     * Obtiene un producto específico con todas sus variantes.
     */
    @GetMapping("/productos/{id}")
    public ResponseEntity<ApiResponse<ProductoDTO>> obtenerProducto(@PathVariable Long id) {
        ProductoDTO producto = productoService.obtenerProductoAdmin(id);
        return ResponseEntity.ok(ApiResponse.success(producto));
    }

    /**
     * POST /api/admin/productos
     * Crea un nuevo producto.
     */
    @PostMapping("/productos")
    public ResponseEntity<ApiResponse<ProductoDTO>> crearProducto(@RequestBody ProductoCreateRequest request) {
        ProductoDTO producto = productoService.crearProducto(request);
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(ApiResponse.success("Producto creado exitosamente", producto));
    }

    /**
     * PUT /api/admin/productos/{id}
     * Actualiza un producto existente.
     */
    @PutMapping("/productos/{id}")
    public ResponseEntity<ApiResponse<ProductoDTO>> actualizarProducto(
            @PathVariable Long id,
            @RequestBody ProductoUpdateRequest request) {
        ProductoDTO producto = productoService.actualizarProducto(id, request);
        return ResponseEntity.ok(ApiResponse.success("Producto actualizado exitosamente", producto));
    }

    /**
     * DELETE /api/admin/productos/{id}
     * Elimina (desactiva) un producto.
     */
    @DeleteMapping("/productos/{id}")
    public ResponseEntity<ApiResponse<Void>> eliminarProducto(@PathVariable Long id) {
        productoService.eliminarProducto(id);
        return ResponseEntity.ok(ApiResponse.success("Producto eliminado exitosamente"));
    }

    // ==================== VARIANTES ====================

    /**
     * GET /api/admin/productos/{id}/variantes
     * Obtiene las variantes de un producto.
     */
    @GetMapping("/productos/{id}/variantes")
    public ResponseEntity<ApiResponse<List<ProductoVarianteDTO>>> obtenerVariantes(@PathVariable Long id) {
        List<ProductoVarianteDTO> variantes = productoService.obtenerVariantesProducto(id);
        return ResponseEntity.ok(ApiResponse.success(variantes));
    }

    /**
     * POST /api/admin/productos/{id}/variantes
     * Agrega una variante a un producto.
     */
    @PostMapping("/productos/{id}/variantes")
    public ResponseEntity<ApiResponse<ProductoVarianteDTO>> agregarVariante(
            @PathVariable Long id,
            @RequestBody VarianteCreateRequest request) {
        ProductoVarianteDTO variante = productoService.agregarVariante(id, request);
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(ApiResponse.success("Variante agregada exitosamente", variante));
    }

    /**
     * PUT /api/admin/variantes/{id}
     * Actualiza una variante existente.
     */
    @PutMapping("/variantes/{id}")
    public ResponseEntity<ApiResponse<ProductoVarianteDTO>> actualizarVariante(
            @PathVariable Long id,
            @RequestBody VarianteUpdateRequest request) {
        ProductoVarianteDTO variante = productoService.actualizarVariante(id, request);
        return ResponseEntity.ok(ApiResponse.success("Variante actualizada exitosamente", variante));
    }
}

