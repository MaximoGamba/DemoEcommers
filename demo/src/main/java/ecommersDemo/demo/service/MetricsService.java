package ecommersDemo.demo.service;

import ecommersDemo.demo.model.Pedido;
import ecommersDemo.demo.model.Pedido.EstadoPedido;
import ecommersDemo.demo.model.Usuario;
import ecommersDemo.demo.repository.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.*;
import java.util.stream.Collectors;

/**
 * Servicio para calcular métricas avanzadas del dashboard admin.
 * Similar a TiendaNube/Shopify.
 */
@Service
@Transactional(readOnly = true)
public class MetricsService {

    private final PedidoRepository pedidoRepository;
    private final DetallePedidoRepository detallePedidoRepository;
    private final UsuarioRepository usuarioRepository;
    @SuppressWarnings("unused")
    private final ProductoRepository productoRepository;
    @SuppressWarnings("unused")
    private final CategoriaRepository categoriaRepository;

    public MetricsService(
            PedidoRepository pedidoRepository,
            DetallePedidoRepository detallePedidoRepository,
            UsuarioRepository usuarioRepository,
            ProductoRepository productoRepository,
            CategoriaRepository categoriaRepository) {
        this.pedidoRepository = pedidoRepository;
        this.detallePedidoRepository = detallePedidoRepository;
        this.usuarioRepository = usuarioRepository;
        this.productoRepository = productoRepository;
        this.categoriaRepository = categoriaRepository;
    }

    /**
     * Obtiene métricas de ventas por período con comparativa.
     */
    public Map<String, Object> obtenerMetricasVentas(String periodo) {
        Map<String, Object> metricas = new HashMap<>();

        // Calcular fechas según período
        LocalDateTime[] fechasActual = calcularFechasPeriodo(periodo, false);
        LocalDateTime[] fechasAnterior = calcularFechasPeriodo(periodo, true);

        // Métricas del período actual
        BigDecimal ventasActual = pedidoRepository.calcularTotalVentas(fechasActual[0], fechasActual[1]);
        long pedidosActual = contarPedidosCompletados(fechasActual[0], fechasActual[1]);
        BigDecimal ticketPromedioActual = calcularTicketPromedio(fechasActual[0], fechasActual[1]);

        // Métricas del período anterior
        BigDecimal ventasAnterior = pedidoRepository.calcularTotalVentas(fechasAnterior[0], fechasAnterior[1]);
        long pedidosAnterior = contarPedidosCompletados(fechasAnterior[0], fechasAnterior[1]);
        BigDecimal ticketPromedioAnterior = calcularTicketPromedio(fechasAnterior[0], fechasAnterior[1]);

        // Calcular cambios porcentuales
        double cambioVentas = calcularCambioPorcentual(ventasActual, ventasAnterior);
        double cambioPedidos = calcularCambioPorcentual(
                BigDecimal.valueOf(pedidosActual),
                BigDecimal.valueOf(pedidosAnterior));
        double cambioTicket = calcularCambioPorcentual(ticketPromedioActual, ticketPromedioAnterior);

        metricas.put("ventas", ventasActual);
        metricas.put("ventasAnterior", ventasAnterior);
        metricas.put("cambioVentas", cambioVentas);
        metricas.put("pedidos", pedidosActual);
        metricas.put("pedidosAnterior", pedidosAnterior);
        metricas.put("cambioPedidos", cambioPedidos);
        metricas.put("ticketPromedio", ticketPromedioActual);
        metricas.put("ticketPromedioAnterior", ticketPromedioAnterior);
        metricas.put("cambioTicket", cambioTicket);
        metricas.put("periodo", periodo);

        return metricas;
    }

    /**
     * Obtiene datos de ventas en el tiempo para gráficos.
     */
    public Map<String, Object> obtenerVentasEnTiempo(int dias) {
        Map<String, Object> datos = new HashMap<>();
        LocalDateTime fechaFin = LocalDateTime.now();
        LocalDateTime fechaInicio = fechaFin.minusDays(dias);

        List<Pedido> pedidos = pedidoRepository.findPedidosPorRangoFecha(fechaInicio, fechaFin);

        // Agrupar por día
        Map<LocalDate, BigDecimal> ventasPorDia = pedidos.stream()
                .filter(p -> !p.getEstado().equals(EstadoPedido.CANCELADO))
                .collect(Collectors.groupingBy(
                        p -> p.getFechaPedido().toLocalDate(),
                        Collectors.reducing(
                                BigDecimal.ZERO,
                                Pedido::getTotal,
                                BigDecimal::add)));

        // Crear lista ordenada de fechas
        List<Map<String, Object>> puntos = new ArrayList<>();
        LocalDate fecha = fechaInicio.toLocalDate();
        while (!fecha.isAfter(fechaFin.toLocalDate())) {
            Map<String, Object> punto = new HashMap<>();
            punto.put("fecha", fecha.toString());
            punto.put("ventas", ventasPorDia.getOrDefault(fecha, BigDecimal.ZERO));
            punto.put("pedidos", contarPedidosPorDia(pedidos, fecha));
            puntos.add(punto);
            fecha = fecha.plusDays(1);
        }

        datos.put("puntos", puntos);
        datos.put("totalVentas", ventasPorDia.values().stream()
                .reduce(BigDecimal.ZERO, BigDecimal::add));
        datos.put("totalPedidos", pedidos.stream()
                .filter(p -> !p.getEstado().equals(EstadoPedido.CANCELADO))
                .count());

        return datos;
    }

    /**
     * Obtiene los productos más vendidos.
     */
    public Map<String, Object> obtenerProductosMasVendidos(int limite) {
        Map<String, Object> resultado = new HashMap<>();

        // Productos más vendidos por cantidad
        List<Object[]> productosPorCantidad = detallePedidoRepository.findProductosMasVendidos();
        List<Map<String, Object>> topPorCantidad = productosPorCantidad.stream()
                .limit(limite)
                .map(arr -> {
                    Map<String, Object> item = new HashMap<>();
                    item.put("nombre", arr[0]);
                    item.put("cantidadVendida", arr[1]);
                    return item;
                })
                .collect(Collectors.toList());

        resultado.put("porCantidad", topPorCantidad);

        // TODO: Agregar productos más vendidos por ingresos
        // Esto requeriría una query adicional

        return resultado;
    }

    /**
     * Obtiene métricas por categoría.
     */
    public Map<String, Object> obtenerMetricasCategorias() {
        Map<String, Object> resultado = new HashMap<>();

        // Por ahora retornamos estructura básica
        // TODO: Implementar cálculo de ventas por categoría
        resultado.put("categorias", new ArrayList<>());

        return resultado;
    }

    /**
     * Obtiene métricas de clientes.
     */
    public Map<String, Object> obtenerMetricasClientes(String periodo) {
        Map<String, Object> metricas = new HashMap<>();

        LocalDateTime[] fechas = calcularFechasPeriodo(periodo, false);

        // Contar clientes únicos que hicieron pedidos en el período
        long clientesConPedidos = pedidoRepository.findPedidosPorRangoFecha(fechas[0], fechas[1])
                .stream()
                .map(p -> p.getUsuario().getId())
                .distinct()
                .count();

        // Total de clientes registrados
        long totalClientes = usuarioRepository.findByRol(Usuario.Rol.CLIENTE).size();

        metricas.put("clientesConPedidos", clientesConPedidos);
        metricas.put("totalClientes", totalClientes);
        metricas.put("periodo", periodo);

        return metricas;
    }

    /**
     * Obtiene un resumen completo de todas las métricas.
     */
    public Map<String, Object> obtenerResumenCompleto() {
        Map<String, Object> resumen = new HashMap<>();

        resumen.put("ventas", obtenerMetricasVentas("mes"));
        resumen.put("ventasTiempo", obtenerVentasEnTiempo(30));
        resumen.put("productosMasVendidos", obtenerProductosMasVendidos(10));
        resumen.put("categorias", obtenerMetricasCategorias());
        resumen.put("clientes", obtenerMetricasClientes("mes"));

        return resumen;
    }

    // ==================== MÉTODOS AUXILIARES ====================

    private LocalDateTime[] calcularFechasPeriodo(String periodo, boolean anterior) {
        LocalDateTime ahora = LocalDateTime.now();
        LocalDateTime inicio, fin;

        switch (periodo.toLowerCase()) {
            case "hoy":
                inicio = ahora.with(LocalTime.MIN);
                fin = ahora.with(LocalTime.MAX);
                if (anterior) {
                    inicio = inicio.minusDays(1);
                    fin = fin.minusDays(1);
                }
                break;
            case "semana":
                inicio = ahora.toLocalDate().atStartOfDay().minusWeeks(anterior ? 1 : 0)
                        .minusDays(ahora.getDayOfWeek().getValue() - 1);
                fin = inicio.plusDays(6).with(LocalTime.MAX);
                if (anterior) {
                    inicio = inicio.minusWeeks(1);
                    fin = fin.minusWeeks(1);
                }
                break;
            case "mes":
                inicio = ahora.toLocalDate().withDayOfMonth(1).atStartOfDay().minusMonths(anterior ? 1 : 0);
                fin = inicio.plusMonths(1).minusDays(1).with(LocalTime.MAX);
                break;
            case "año":
                inicio = ahora.toLocalDate().withDayOfYear(1).atStartOfDay().minusYears(anterior ? 1 : 0);
                fin = inicio.plusYears(1).minusDays(1).with(LocalTime.MAX);
                break;
            default:
                inicio = ahora.toLocalDate().withDayOfMonth(1).atStartOfDay().minusMonths(anterior ? 1 : 0);
                fin = inicio.plusMonths(1).minusDays(1).with(LocalTime.MAX);
        }

        return new LocalDateTime[] { inicio, fin };
    }

    private long contarPedidosCompletados(LocalDateTime inicio, LocalDateTime fin) {
        return pedidoRepository.findPedidosPorRangoFecha(inicio, fin)
                .stream()
                .filter(p -> !p.getEstado().equals(EstadoPedido.CANCELADO))
                .count();
    }

    private BigDecimal calcularTicketPromedio(LocalDateTime inicio, LocalDateTime fin) {
        List<Pedido> pedidos = pedidoRepository.findPedidosPorRangoFecha(inicio, fin);
        long pedidosCompletados = pedidos.stream()
                .filter(p -> !p.getEstado().equals(EstadoPedido.CANCELADO))
                .count();

        if (pedidosCompletados == 0) {
            return BigDecimal.ZERO;
        }

        BigDecimal total = pedidos.stream()
                .filter(p -> !p.getEstado().equals(EstadoPedido.CANCELADO))
                .map(Pedido::getTotal)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        return total.divide(BigDecimal.valueOf(pedidosCompletados), 2, RoundingMode.HALF_UP);
    }

    private double calcularCambioPorcentual(BigDecimal actual, BigDecimal anterior) {
        if (anterior.compareTo(BigDecimal.ZERO) == 0) {
            return actual.compareTo(BigDecimal.ZERO) > 0 ? 100.0 : 0.0;
        }
        return actual.subtract(anterior)
                .divide(anterior, 4, RoundingMode.HALF_UP)
                .multiply(BigDecimal.valueOf(100))
                .doubleValue();
    }

    private long contarPedidosPorDia(List<Pedido> pedidos, LocalDate fecha) {
        return pedidos.stream()
                .filter(p -> p.getFechaPedido().toLocalDate().equals(fecha))
                .filter(p -> !p.getEstado().equals(EstadoPedido.CANCELADO))
                .count();
    }
}
