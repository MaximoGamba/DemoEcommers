package ecommersDemo.demo.controller;

import ecommersDemo.demo.dto.response.ApiResponse;
import ecommersDemo.demo.service.MetricsService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

/**
 * Controlador REST para métricas avanzadas del dashboard admin.
 * Similar a TiendaNube/Shopify.
 */
@RestController
@RequestMapping("/api/admin/metricas")
@CrossOrigin(origins = "*")
public class AdminMetricsController {

    private final MetricsService metricsService;

    public AdminMetricsController(MetricsService metricsService) {
        this.metricsService = metricsService;
    }

    /**
     * GET /api/admin/metricas/ventas
     * Obtiene métricas de ventas por período (hoy, semana, mes, año).
     * Incluye comparativa con período anterior.
     */
    @GetMapping("/ventas")
    public ResponseEntity<ApiResponse<Map<String, Object>>> obtenerMetricasVentas(
            @RequestParam(required = false, defaultValue = "mes") String periodo) {

        Map<String, Object> metricas = metricsService.obtenerMetricasVentas(periodo);
        return ResponseEntity.ok(ApiResponse.success(metricas));
    }

    /**
     * GET /api/admin/metricas/ventas-tiempo
     * Obtiene datos de ventas en el tiempo para gráficos.
     * Retorna ventas agrupadas por día/semana/mes según el período.
     */
    @GetMapping("/ventas-tiempo")
    public ResponseEntity<ApiResponse<Map<String, Object>>> obtenerVentasEnTiempo(
            @RequestParam(required = false, defaultValue = "30") int dias) {

        Map<String, Object> datos = metricsService.obtenerVentasEnTiempo(dias);
        return ResponseEntity.ok(ApiResponse.success(datos));
    }

    /**
     * GET /api/admin/metricas/productos-mas-vendidos
     * Obtiene los productos más vendidos (por cantidad y por ingresos).
     */
    @GetMapping("/productos-mas-vendidos")
    public ResponseEntity<ApiResponse<Map<String, Object>>> obtenerProductosMasVendidos(
            @RequestParam(required = false, defaultValue = "10") int limite) {

        Map<String, Object> productos = metricsService.obtenerProductosMasVendidos(limite);
        return ResponseEntity.ok(ApiResponse.success(productos));
    }

    /**
     * GET /api/admin/metricas/categorias
     * Obtiene métricas por categoría (ventas, cantidad de productos, etc.).
     */
    @GetMapping("/categorias")
    public ResponseEntity<ApiResponse<Map<String, Object>>> obtenerMetricasCategorias() {
        Map<String, Object> categorias = metricsService.obtenerMetricasCategorias();
        return ResponseEntity.ok(ApiResponse.success(categorias));
    }

    /**
     * GET /api/admin/metricas/clientes
     * Obtiene métricas de clientes (nuevos, recurrentes, ticket promedio).
     */
    @GetMapping("/clientes")
    public ResponseEntity<ApiResponse<Map<String, Object>>> obtenerMetricasClientes(
            @RequestParam(required = false, defaultValue = "mes") String periodo) {

        Map<String, Object> clientes = metricsService.obtenerMetricasClientes(periodo);
        return ResponseEntity.ok(ApiResponse.success(clientes));
    }

    /**
     * GET /api/admin/metricas/resumen
     * Obtiene un resumen completo de todas las métricas principales.
     * Útil para cargar el dashboard de una vez.
     */
    @GetMapping("/resumen")
    public ResponseEntity<ApiResponse<Map<String, Object>>> obtenerResumenMetricas() {
        Map<String, Object> resumen = metricsService.obtenerResumenCompleto();
        return ResponseEntity.ok(ApiResponse.success(resumen));
    }
}

