package ecommersDemo.demo.controller;

import ecommersDemo.demo.dto.CategoriaDTO;
import ecommersDemo.demo.dto.ProductoDTO;
import ecommersDemo.demo.dto.TalleDTO;
import ecommersDemo.demo.dto.response.ApiResponse;
import ecommersDemo.demo.service.CategoriaService;
import ecommersDemo.demo.service.ProductoService;
import ecommersDemo.demo.service.TalleService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Controlador REST para el catálogo público.
 * Endpoints accesibles sin autenticación.
 */
@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*")
public class CatalogoController {

    private final ProductoService productoService;
    private final CategoriaService categoriaService;
    private final TalleService talleService;

    public CatalogoController(ProductoService productoService,
                             CategoriaService categoriaService,
                             TalleService talleService) {
        this.productoService = productoService;
        this.categoriaService = categoriaService;
        this.talleService = talleService;
    }

    // ==================== PRODUCTOS ====================

    /**
     * GET /api/productos
     * Obtiene todos los productos activos del catálogo.
     * Soporta paginación y ordenamiento.
     */
    @GetMapping("/productos")
    public ResponseEntity<ApiResponse<Page<ProductoDTO>>> obtenerProductos(
            @PageableDefault(size = 12, sort = "fechaCreacion", direction = Sort.Direction.DESC) Pageable pageable,
            @RequestParam(required = false) Long categoriaId,
            @RequestParam(required = false) String busqueda) {
        
        Page<ProductoDTO> productos;
        
        if (busqueda != null && !busqueda.trim().isEmpty()) {
            productos = productoService.buscarProductos(busqueda.trim(), pageable);
        } else if (categoriaId != null) {
            productos = productoService.obtenerProductosPorCategoria(categoriaId, pageable);
        } else {
            productos = productoService.obtenerProductosActivosPaginados(pageable);
        }
        
        return ResponseEntity.ok(ApiResponse.success(productos));
    }

    /**
     * GET /api/productos/{id}
     * Obtiene un producto específico con sus variantes.
     */
    @GetMapping("/productos/{id}")
    public ResponseEntity<ApiResponse<ProductoDTO>> obtenerProducto(@PathVariable Long id) {
        ProductoDTO producto = productoService.obtenerProductoPublico(id);
        return ResponseEntity.ok(ApiResponse.success(producto));
    }

    /**
     * GET /api/productos/destacados
     * Obtiene los productos destacados.
     */
    @GetMapping("/productos/destacados")
    public ResponseEntity<ApiResponse<List<ProductoDTO>>> obtenerProductosDestacados() {
        List<ProductoDTO> productos = productoService.obtenerProductosDestacados();
        return ResponseEntity.ok(ApiResponse.success(productos));
    }

    /**
     * GET /api/productos/ofertas
     * Obtiene los productos en oferta.
     */
    @GetMapping("/productos/ofertas")
    public ResponseEntity<ApiResponse<List<ProductoDTO>>> obtenerProductosEnOferta() {
        List<ProductoDTO> productos = productoService.obtenerProductosEnOferta();
        return ResponseEntity.ok(ApiResponse.success(productos));
    }

    /**
     * GET /api/productos/{id}/relacionados
     * Obtiene productos relacionados al producto especificado.
     */
    @GetMapping("/productos/{id}/relacionados")
    public ResponseEntity<ApiResponse<List<ProductoDTO>>> obtenerProductosRelacionados(@PathVariable Long id) {
        List<ProductoDTO> productos = productoService.obtenerProductosRelacionados(id);
        return ResponseEntity.ok(ApiResponse.success(productos));
    }

    // ==================== CATEGORÍAS ====================

    /**
     * GET /api/categorias
     * Obtiene todas las categorías activas.
     */
    @GetMapping("/categorias")
    public ResponseEntity<ApiResponse<List<CategoriaDTO>>> obtenerCategorias() {
        List<CategoriaDTO> categorias = categoriaService.obtenerCategoriasActivas();
        return ResponseEntity.ok(ApiResponse.success(categorias));
    }

    /**
     * GET /api/categorias/{id}
     * Obtiene una categoría específica.
     */
    @GetMapping("/categorias/{id}")
    public ResponseEntity<ApiResponse<CategoriaDTO>> obtenerCategoria(@PathVariable Long id) {
        CategoriaDTO categoria = categoriaService.obtenerCategoriaPorId(id);
        return ResponseEntity.ok(ApiResponse.success(categoria));
    }

    /**
     * GET /api/categorias/{id}/productos
     * Obtiene los productos de una categoría específica.
     */
    @GetMapping("/categorias/{id}/productos")
    public ResponseEntity<ApiResponse<Page<ProductoDTO>>> obtenerProductosPorCategoria(
            @PathVariable Long id,
            @PageableDefault(size = 12, sort = "fechaCreacion", direction = Sort.Direction.DESC) Pageable pageable) {
        
        Page<ProductoDTO> productos = productoService.obtenerProductosPorCategoria(id, pageable);
        return ResponseEntity.ok(ApiResponse.success(productos));
    }

    // ==================== TALLES ====================

    /**
     * GET /api/talles
     * Obtiene todos los talles activos.
     */
    @GetMapping("/talles")
    public ResponseEntity<ApiResponse<List<TalleDTO>>> obtenerTalles() {
        List<TalleDTO> talles = talleService.obtenerTallesActivos();
        return ResponseEntity.ok(ApiResponse.success(talles));
    }

    /**
     * GET /api/talles/{id}
     * Obtiene un talle específico.
     */
    @GetMapping("/talles/{id}")
    public ResponseEntity<ApiResponse<TalleDTO>> obtenerTalle(@PathVariable Long id) {
        TalleDTO talle = talleService.obtenerTallePorId(id);
        return ResponseEntity.ok(ApiResponse.success(talle));
    }

    /**
     * GET /api/productos/{id}/talles
     * Obtiene los talles disponibles para un producto.
     */
    @GetMapping("/productos/{id}/talles")
    public ResponseEntity<ApiResponse<List<TalleDTO>>> obtenerTallesProducto(@PathVariable Long id) {
        List<TalleDTO> talles = talleService.obtenerTallesDisponiblesPorProducto(id);
        return ResponseEntity.ok(ApiResponse.success(talles));
    }
}

