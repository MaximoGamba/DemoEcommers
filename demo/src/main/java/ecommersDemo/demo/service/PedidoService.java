package ecommersDemo.demo.service;

import ecommersDemo.demo.dto.PedidoDTO;
import ecommersDemo.demo.dto.request.CambiarEstadoPedidoRequest;
import ecommersDemo.demo.dto.request.CrearPedidoRequest;
import ecommersDemo.demo.exception.BadRequestException;
import ecommersDemo.demo.exception.CarritoVacioException;
import ecommersDemo.demo.exception.ResourceNotFoundException;
import ecommersDemo.demo.exception.StockInsuficienteException;
import ecommersDemo.demo.model.*;
import ecommersDemo.demo.model.Pedido.EstadoPedido;
import ecommersDemo.demo.repository.CarritoRepository;
import ecommersDemo.demo.repository.ItemCarritoRepository;
import ecommersDemo.demo.repository.PedidoRepository;
import ecommersDemo.demo.repository.ProductoVarianteRepository;
import ecommersDemo.demo.repository.UsuarioRepository;
import ecommersDemo.demo.dto.ValidarCuponResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional(readOnly = true)
public class PedidoService {

    private final PedidoRepository pedidoRepository;
    private final CarritoRepository carritoRepository;
    private final ItemCarritoRepository itemCarritoRepository;
    private final ProductoVarianteRepository varianteRepository;
    private final UsuarioRepository usuarioRepository;
    private final CuponService cuponService;

    public PedidoService(PedidoRepository pedidoRepository,
                        CarritoRepository carritoRepository,
                        ItemCarritoRepository itemCarritoRepository,
                        ProductoVarianteRepository varianteRepository,
                        UsuarioRepository usuarioRepository,
                        CuponService cuponService) {
        this.pedidoRepository = pedidoRepository;
        this.carritoRepository = carritoRepository;
        this.itemCarritoRepository = itemCarritoRepository;
        this.varianteRepository = varianteRepository;
        this.usuarioRepository = usuarioRepository;
        this.cuponService = cuponService;
    }

    // ==================== CREAR PEDIDO ====================

    /**
     * Crea un pedido a partir del carrito del usuario.
     */
    @Transactional
    public PedidoDTO crearPedidoDesdeCarrito(Long usuarioId, CrearPedidoRequest request) {
        // Validaciones
        if (request.getDireccionEnvio() == null || request.getDireccionEnvio().trim().isEmpty()) {
            throw new BadRequestException("La dirección de envío es obligatoria");
        }
        if (request.getCiudadEnvio() == null || request.getCiudadEnvio().trim().isEmpty()) {
            throw new BadRequestException("La ciudad de envío es obligatoria");
        }
        if (request.getMetodoPago() == null) {
            throw new BadRequestException("El método de pago es obligatorio");
        }

        // Obtener usuario
        Usuario usuario = usuarioRepository.findById(usuarioId)
                .orElseThrow(() -> new ResourceNotFoundException("Usuario", "id", usuarioId));

        // Obtener carrito
        Carrito carrito = carritoRepository.findByUsuarioId(usuarioId)
                .orElseThrow(() -> new ResourceNotFoundException("Carrito", "usuarioId", usuarioId));

        if (carrito.estaVacio()) {
            throw new CarritoVacioException("No se puede crear un pedido con el carrito vacío");
        }

        // Validar stock de todos los items
        for (ItemCarrito item : carrito.getItems()) {
            ProductoVariante variante = item.getProductoVariante();
            if (!variante.tieneStockSuficiente(item.getCantidad())) {
                throw new StockInsuficienteException(
                        variante.getId(),
                        item.getCantidad(),
                        variante.getStock());
            }
        }

        // Crear pedido
        Pedido pedido = new Pedido(usuario);
        pedido.setDireccionEnvio(request.getDireccionEnvio().trim());
        pedido.setCiudadEnvio(request.getCiudadEnvio().trim());
        pedido.setCodigoPostalEnvio(request.getCodigoPostalEnvio());
        pedido.setTelefonoContacto(request.getTelefonoContacto() != null 
                ? request.getTelefonoContacto() : usuario.getTelefono());
        pedido.setNotas(request.getNotas());
        pedido.setMetodoPago(request.getMetodoPago());
        pedido.setEstado(EstadoPedido.PENDIENTE);

        // Crear detalles del pedido desde los items del carrito
        for (ItemCarrito item : carrito.getItems()) {
            DetallePedido detalle = new DetallePedido(
                    pedido,
                    item.getProductoVariante(),
                    item.getCantidad());
            pedido.agregarDetalle(detalle);

            // Decrementar stock
            ProductoVariante variante = item.getProductoVariante();
            variante.decrementarStock(item.getCantidad());
            varianteRepository.save(variante);
        }

        // Calcular subtotal antes de aplicar cupón
        pedido.calcularTotales();
        BigDecimal subtotal = pedido.getSubtotal();

        // Validar y aplicar cupón si se proporciona
        if (request.getCodigoCupon() != null && !request.getCodigoCupon().trim().isEmpty()) {
            ValidarCuponResponse validacionCupon = cuponService.validarCupon(
                    request.getCodigoCupon().trim().toUpperCase(), 
                    subtotal);
            
            if (validacionCupon.getValido()) {
                pedido.setDescuento(validacionCupon.getDescuentoAplicable());
                // Incrementar uso del cupón
                cuponService.incrementarUsoCupon(request.getCodigoCupon().trim().toUpperCase());
            } else {
                throw new BadRequestException("Cupón inválido: " + validacionCupon.getMensaje());
            }
        }

        // Recalcular totales con el descuento aplicado
        pedido.calcularTotales();

        // Guardar pedido
        pedido = pedidoRepository.save(pedido);

        // Vaciar carrito
        itemCarritoRepository.eliminarItemsDelCarrito(carrito.getId());

        return new PedidoDTO(pedido, true);
    }

    // ==================== OBTENER PEDIDOS USUARIO ====================

    /**
     * Obtiene los pedidos de un usuario con paginación.
     */
    public Page<PedidoDTO> obtenerPedidosUsuario(Long usuarioId, Pageable pageable) {
        return pedidoRepository.findByUsuarioId(usuarioId, pageable)
                .map(PedidoDTO::new);
    }

    /**
     * Obtiene los pedidos de un usuario ordenados por fecha.
     */
    public List<PedidoDTO> obtenerPedidosUsuarioLista(Long usuarioId) {
        return pedidoRepository.findByUsuarioIdOrderByFechaPedidoDesc(usuarioId)
                .stream()
                .map(PedidoDTO::new)
                .collect(Collectors.toList());
    }

    /**
     * Obtiene un pedido específico de un usuario.
     */
    public PedidoDTO obtenerPedidoUsuario(Long usuarioId, Long pedidoId) {
        Pedido pedido = pedidoRepository.findById(pedidoId)
                .orElseThrow(() -> new ResourceNotFoundException("Pedido", "id", pedidoId));

        // Verificar que el pedido pertenece al usuario
        if (!pedido.getUsuario().getId().equals(usuarioId)) {
            throw new ResourceNotFoundException("Pedido", "id", pedidoId);
        }

        return new PedidoDTO(pedido, true);
    }

    /**
     * Obtiene un pedido por su número.
     */
    public PedidoDTO obtenerPedidoPorNumero(Long usuarioId, String numeroPedido) {
        Pedido pedido = pedidoRepository.findByNumeroPedido(numeroPedido)
                .orElseThrow(() -> new ResourceNotFoundException("Pedido", "número", numeroPedido));

        // Verificar que el pedido pertenece al usuario
        if (!pedido.getUsuario().getId().equals(usuarioId)) {
            throw new ResourceNotFoundException("Pedido", "número", numeroPedido);
        }

        return new PedidoDTO(pedido, true);
    }

    // ==================== CANCELAR PEDIDO USUARIO ====================

    /**
     * Cancela un pedido del usuario (solo si está en estado cancelable).
     */
    @Transactional
    public PedidoDTO cancelarPedidoUsuario(Long usuarioId, Long pedidoId) {
        Pedido pedido = pedidoRepository.findById(pedidoId)
                .orElseThrow(() -> new ResourceNotFoundException("Pedido", "id", pedidoId));

        // Verificar que el pedido pertenece al usuario
        if (!pedido.getUsuario().getId().equals(usuarioId)) {
            throw new ResourceNotFoundException("Pedido", "id", pedidoId);
        }

        if (!pedido.puedeSerCancelado()) {
            throw new BadRequestException(
                    "El pedido no puede ser cancelado. Estado actual: " + pedido.getEstado());
        }

        // Restaurar stock
        restaurarStock(pedido);

        // Cambiar estado
        pedido.setEstado(EstadoPedido.CANCELADO);
        pedido = pedidoRepository.save(pedido);

        return new PedidoDTO(pedido, true);
    }

    // ==================== ADMINISTRACIÓN DE PEDIDOS ====================

    /**
     * Obtiene todos los pedidos con paginación (admin).
     */
    public Page<PedidoDTO> obtenerTodosLosPedidos(Pageable pageable) {
        return pedidoRepository.findAll(pageable)
                .map(PedidoDTO::new);
    }

    /**
     * Obtiene pedidos por estado (admin).
     */
    public Page<PedidoDTO> obtenerPedidosPorEstado(EstadoPedido estado, Pageable pageable) {
        return pedidoRepository.findByEstado(estado, pageable)
                .map(PedidoDTO::new);
    }

    /**
     * Obtiene pedidos pendientes de procesar (admin).
     */
    public List<PedidoDTO> obtenerPedidosPendientes() {
        return pedidoRepository.findPedidosPendientes()
                .stream()
                .map(PedidoDTO::new)
                .collect(Collectors.toList());
    }

    /**
     * Obtiene un pedido por ID (admin).
     */
    public PedidoDTO obtenerPedidoAdmin(Long pedidoId) {
        Pedido pedido = pedidoRepository.findById(pedidoId)
                .orElseThrow(() -> new ResourceNotFoundException("Pedido", "id", pedidoId));
        return new PedidoDTO(pedido, true);
    }

    /**
     * Obtiene un pedido por número (admin).
     */
    public PedidoDTO obtenerPedidoPorNumeroAdmin(String numeroPedido) {
        Pedido pedido = pedidoRepository.findByNumeroPedido(numeroPedido)
                .orElseThrow(() -> new ResourceNotFoundException("Pedido", "número", numeroPedido));
        return new PedidoDTO(pedido, true);
    }

    /**
     * Cambia el estado de un pedido (admin).
     */
    @Transactional
    public PedidoDTO cambiarEstadoPedido(Long pedidoId, CambiarEstadoPedidoRequest request) {
        if (request.getNuevoEstado() == null) {
            throw new BadRequestException("El nuevo estado es obligatorio");
        }

        Pedido pedido = pedidoRepository.findById(pedidoId)
                .orElseThrow(() -> new ResourceNotFoundException("Pedido", "id", pedidoId));

        EstadoPedido estadoActual = pedido.getEstado();
        EstadoPedido nuevoEstado = request.getNuevoEstado();

        // Validar transición de estado
        validarTransicionEstado(estadoActual, nuevoEstado);

        // Si se cancela, restaurar stock
        if (nuevoEstado == EstadoPedido.CANCELADO && !pedido.estaFinalizado()) {
            restaurarStock(pedido);
        }

        // Actualizar fechas según el nuevo estado
        actualizarFechasSegunEstado(pedido, nuevoEstado);

        pedido.setEstado(nuevoEstado);
        pedido = pedidoRepository.save(pedido);

        return new PedidoDTO(pedido, true);
    }

    /**
     * Obtiene los últimos pedidos (admin dashboard).
     */
    public List<PedidoDTO> obtenerUltimosPedidos() {
        return pedidoRepository.findTop10ByOrderByFechaPedidoDesc()
                .stream()
                .map(PedidoDTO::new)
                .collect(Collectors.toList());
    }

    // ==================== ESTADÍSTICAS ====================

    /**
     * Cuenta pedidos por estado.
     */
    public long contarPedidosPorEstado(EstadoPedido estado) {
        return pedidoRepository.countByEstado(estado);
    }

    // ==================== MÉTODOS AUXILIARES ====================

    /**
     * Restaura el stock de los productos de un pedido.
     */
    private void restaurarStock(Pedido pedido) {
        for (DetallePedido detalle : pedido.getDetalles()) {
            ProductoVariante variante = detalle.getProductoVariante();
            if (variante != null) {
                variante.incrementarStock(detalle.getCantidad());
                varianteRepository.save(variante);
            }
        }
    }

    /**
     * Valida que la transición de estado sea válida.
     */
    private void validarTransicionEstado(EstadoPedido estadoActual, EstadoPedido nuevoEstado) {
        // No se puede cambiar un pedido finalizado
        if (estadoActual == EstadoPedido.ENTREGADO || 
            estadoActual == EstadoPedido.CANCELADO || 
            estadoActual == EstadoPedido.DEVUELTO) {
            throw new BadRequestException(
                    "No se puede cambiar el estado de un pedido " + estadoActual);
        }

        // Validar transiciones lógicas
        switch (estadoActual) {
            case PENDIENTE:
                if (nuevoEstado != EstadoPedido.CONFIRMADO && 
                    nuevoEstado != EstadoPedido.CANCELADO) {
                    throw new BadRequestException(
                            "Desde PENDIENTE solo se puede pasar a CONFIRMADO o CANCELADO");
                }
                break;
            case CONFIRMADO:
                if (nuevoEstado != EstadoPedido.PAGADO && 
                    nuevoEstado != EstadoPedido.CANCELADO) {
                    throw new BadRequestException(
                            "Desde CONFIRMADO solo se puede pasar a PAGADO o CANCELADO");
                }
                break;
            case PAGADO:
                if (nuevoEstado != EstadoPedido.EN_PREPARACION && 
                    nuevoEstado != EstadoPedido.CANCELADO) {
                    throw new BadRequestException(
                            "Desde PAGADO solo se puede pasar a EN_PREPARACION o CANCELADO");
                }
                break;
            case EN_PREPARACION:
                if (nuevoEstado != EstadoPedido.ENVIADO && 
                    nuevoEstado != EstadoPedido.CANCELADO) {
                    throw new BadRequestException(
                            "Desde EN_PREPARACION solo se puede pasar a ENVIADO o CANCELADO");
                }
                break;
            case ENVIADO:
                if (nuevoEstado != EstadoPedido.ENTREGADO && 
                    nuevoEstado != EstadoPedido.DEVUELTO) {
                    throw new BadRequestException(
                            "Desde ENVIADO solo se puede pasar a ENTREGADO o DEVUELTO");
                }
                break;
            default:
                break;
        }
    }

    /**
     * Actualiza las fechas del pedido según el nuevo estado.
     */
    private void actualizarFechasSegunEstado(Pedido pedido, EstadoPedido nuevoEstado) {
        switch (nuevoEstado) {
            case ENVIADO:
                pedido.setFechaEnvio(LocalDateTime.now());
                break;
            case ENTREGADO:
                pedido.setFechaEntrega(LocalDateTime.now());
                break;
            default:
                break;
        }
    }
}

