package ecommersDemo.demo.service;

import ecommersDemo.demo.dto.CarritoDTO;
import ecommersDemo.demo.dto.request.ActualizarCantidadRequest;
import ecommersDemo.demo.dto.request.AgregarItemCarritoRequest;
import ecommersDemo.demo.exception.BadRequestException;
import ecommersDemo.demo.exception.ResourceNotFoundException;
import ecommersDemo.demo.exception.StockInsuficienteException;
import ecommersDemo.demo.model.Carrito;
import ecommersDemo.demo.model.ItemCarrito;
import ecommersDemo.demo.model.ProductoVariante;
import ecommersDemo.demo.model.Usuario;
import ecommersDemo.demo.repository.CarritoRepository;
import ecommersDemo.demo.repository.ItemCarritoRepository;
import ecommersDemo.demo.repository.ProductoVarianteRepository;
import ecommersDemo.demo.repository.UsuarioRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Service
@Transactional(readOnly = true)
public class CarritoService {

    private final CarritoRepository carritoRepository;
    private final ItemCarritoRepository itemCarritoRepository;
    private final ProductoVarianteRepository varianteRepository;
    private final UsuarioRepository usuarioRepository;

    public CarritoService(CarritoRepository carritoRepository,
                         ItemCarritoRepository itemCarritoRepository,
                         ProductoVarianteRepository varianteRepository,
                         UsuarioRepository usuarioRepository) {
        this.carritoRepository = carritoRepository;
        this.itemCarritoRepository = itemCarritoRepository;
        this.varianteRepository = varianteRepository;
        this.usuarioRepository = usuarioRepository;
    }

    // ==================== OBTENER CARRITO ====================

    /**
     * Obtiene el carrito de un usuario autenticado.
     */
    public CarritoDTO obtenerCarritoPorUsuario(Long usuarioId) {
        Carrito carrito = carritoRepository.findByUsuarioId(usuarioId)
                .orElseGet(() -> crearCarritoParaUsuario(usuarioId));
        return new CarritoDTO(carrito);
    }

    /**
     * Obtiene el carrito por session ID (usuarios anónimos).
     */
    public CarritoDTO obtenerCarritoPorSession(String sessionId) {
        Carrito carrito = carritoRepository.findBySessionId(sessionId)
                .orElseGet(() -> crearCarritoAnonimo(sessionId));
        return new CarritoDTO(carrito);
    }

    /**
     * Obtiene el carrito por ID.
     */
    public CarritoDTO obtenerCarritoPorId(Long carritoId) {
        Carrito carrito = obtenerEntidadCarrito(carritoId);
        return new CarritoDTO(carrito);
    }

    // ==================== AGREGAR ITEM ====================

    /**
     * Agrega un item al carrito del usuario.
     */
    @Transactional
    public CarritoDTO agregarItemPorUsuario(Long usuarioId, AgregarItemCarritoRequest request) {
        Carrito carrito = carritoRepository.findByUsuarioId(usuarioId)
                .orElseGet(() -> crearCarritoParaUsuario(usuarioId));
        return agregarItemAlCarrito(carrito, request);
    }

    /**
     * Agrega un item al carrito por session.
     */
    @Transactional
    public CarritoDTO agregarItemPorSession(String sessionId, AgregarItemCarritoRequest request) {
        Carrito carrito = carritoRepository.findBySessionId(sessionId)
                .orElseGet(() -> crearCarritoAnonimo(sessionId));
        return agregarItemAlCarrito(carrito, request);
    }

    /**
     * Lógica común para agregar item al carrito.
     */
    private CarritoDTO agregarItemAlCarrito(Carrito carrito, AgregarItemCarritoRequest request) {
        // Validaciones
        if (request.getProductoVarianteId() == null) {
            throw new BadRequestException("El ID de la variante del producto es obligatorio");
        }
        if (request.getCantidad() == null || request.getCantidad() < 1) {
            throw new BadRequestException("La cantidad debe ser al menos 1");
        }

        // Obtener variante
        ProductoVariante variante = varianteRepository.findById(request.getProductoVarianteId())
                .orElseThrow(() -> new ResourceNotFoundException("Variante", "id", request.getProductoVarianteId()));

        // Verificar que está activa
        if (!variante.getActivo()) {
            throw new BadRequestException("Esta variante del producto no está disponible");
        }

        // Verificar stock
        if (!variante.tieneStockSuficiente(request.getCantidad())) {
            throw new StockInsuficienteException(
                    variante.getId(), 
                    request.getCantidad(), 
                    variante.getStock());
        }

        // Buscar si ya existe el item en el carrito
        Optional<ItemCarrito> itemExistente = itemCarritoRepository
                .findByCarritoIdAndProductoVarianteId(carrito.getId(), variante.getId());

        if (itemExistente.isPresent()) {
            // Actualizar cantidad
            ItemCarrito item = itemExistente.get();
            int nuevaCantidad = item.getCantidad() + request.getCantidad();
            
            // Verificar stock para la nueva cantidad
            if (!variante.tieneStockSuficiente(nuevaCantidad)) {
                throw new StockInsuficienteException(
                        variante.getId(), 
                        nuevaCantidad, 
                        variante.getStock());
            }
            
            item.setCantidad(nuevaCantidad);
            item.setPrecioUnitario(variante.getPrecioTotal());
            itemCarritoRepository.save(item);
        } else {
            // Crear nuevo item
            ItemCarrito nuevoItem = new ItemCarrito(carrito, variante, request.getCantidad());
            carrito.agregarItem(nuevoItem);
            itemCarritoRepository.save(nuevoItem);
        }

        // Recargar carrito
        carrito = carritoRepository.findById(carrito.getId()).orElse(carrito);
        return new CarritoDTO(carrito);
    }

    // ==================== ACTUALIZAR CANTIDAD ====================

    /**
     * Actualiza la cantidad de un item en el carrito.
     */
    @Transactional
    public CarritoDTO actualizarCantidadItem(Long itemId, ActualizarCantidadRequest request) {
        if (request.getCantidad() == null || request.getCantidad() < 0) {
            throw new BadRequestException("La cantidad debe ser un número positivo o cero");
        }

        ItemCarrito item = itemCarritoRepository.findById(itemId)
                .orElseThrow(() -> new ResourceNotFoundException("Item del carrito", "id", itemId));

        // Si la cantidad es 0, eliminar el item
        if (request.getCantidad() == 0) {
            Long carritoId = item.getCarrito().getId();
            itemCarritoRepository.delete(item);
            return obtenerCarritoPorId(carritoId);
        }

        // Verificar stock
        ProductoVariante variante = item.getProductoVariante();
        if (!variante.tieneStockSuficiente(request.getCantidad())) {
            throw new StockInsuficienteException(
                    variante.getId(), 
                    request.getCantidad(), 
                    variante.getStock());
        }

        item.setCantidad(request.getCantidad());
        item.setPrecioUnitario(variante.getPrecioTotal());
        itemCarritoRepository.save(item);

        return obtenerCarritoPorId(item.getCarrito().getId());
    }

    // ==================== ELIMINAR ITEM ====================

    /**
     * Elimina un item del carrito.
     */
    @Transactional
    public CarritoDTO eliminarItem(Long itemId) {
        ItemCarrito item = itemCarritoRepository.findById(itemId)
                .orElseThrow(() -> new ResourceNotFoundException("Item del carrito", "id", itemId));

        Long carritoId = item.getCarrito().getId();
        itemCarritoRepository.delete(item);
        
        return obtenerCarritoPorId(carritoId);
    }

    // ==================== VACIAR CARRITO ====================

    /**
     * Vacía el carrito del usuario.
     */
    @Transactional
    public CarritoDTO vaciarCarritoPorUsuario(Long usuarioId) {
        Carrito carrito = carritoRepository.findByUsuarioId(usuarioId)
                .orElseThrow(() -> new ResourceNotFoundException("Carrito", "usuarioId", usuarioId));
        
        itemCarritoRepository.eliminarItemsDelCarrito(carrito.getId());
        carrito.getItems().clear();
        
        return new CarritoDTO(carrito);
    }

    /**
     * Vacía el carrito por session.
     */
    @Transactional
    public CarritoDTO vaciarCarritoPorSession(String sessionId) {
        Carrito carrito = carritoRepository.findBySessionId(sessionId)
                .orElseThrow(() -> new ResourceNotFoundException("Carrito", "sessionId", sessionId));
        
        itemCarritoRepository.eliminarItemsDelCarrito(carrito.getId());
        carrito.getItems().clear();
        
        return new CarritoDTO(carrito);
    }

    // ==================== TRANSFERIR CARRITO ====================

    /**
     * Transfiere el carrito anónimo a un usuario autenticado.
     */
    @Transactional
    public CarritoDTO transferirCarritoAUsuario(String sessionId, Long usuarioId) {
        Optional<Carrito> carritoAnonimo = carritoRepository.findBySessionId(sessionId);
        
        if (carritoAnonimo.isEmpty() || carritoAnonimo.get().estaVacio()) {
            // No hay carrito anónimo o está vacío, retornar carrito del usuario
            return obtenerCarritoPorUsuario(usuarioId);
        }

        Usuario usuario = usuarioRepository.findById(usuarioId)
                .orElseThrow(() -> new ResourceNotFoundException("Usuario", "id", usuarioId));

        Optional<Carrito> carritoUsuario = carritoRepository.findByUsuarioId(usuarioId);

        if (carritoUsuario.isPresent()) {
            // Fusionar carritos: agregar items del anónimo al del usuario
            Carrito destino = carritoUsuario.get();
            Carrito origen = carritoAnonimo.get();

            for (ItemCarrito itemOrigen : origen.getItems()) {
                Optional<ItemCarrito> itemExistente = itemCarritoRepository
                        .findByCarritoIdAndProductoVarianteId(
                                destino.getId(), 
                                itemOrigen.getProductoVariante().getId());

                if (itemExistente.isPresent()) {
                    // Sumar cantidades
                    ItemCarrito item = itemExistente.get();
                    item.setCantidad(item.getCantidad() + itemOrigen.getCantidad());
                    itemCarritoRepository.save(item);
                } else {
                    // Crear nuevo item en el carrito destino
                    ItemCarrito nuevoItem = new ItemCarrito(
                            destino, 
                            itemOrigen.getProductoVariante(), 
                            itemOrigen.getCantidad());
                    destino.agregarItem(nuevoItem);
                    itemCarritoRepository.save(nuevoItem);
                }
            }

            // Eliminar carrito anónimo
            carritoRepository.delete(origen);
            
            return new CarritoDTO(destino);
        } else {
            // Asignar el carrito anónimo al usuario
            Carrito carrito = carritoAnonimo.get();
            carrito.setUsuario(usuario);
            carrito.setSessionId(null);
            carritoRepository.save(carrito);
            
            return new CarritoDTO(carrito);
        }
    }

    // ==================== MÉTODOS AUXILIARES ====================

    /**
     * Crea un carrito nuevo para un usuario.
     */
    @Transactional
    private Carrito crearCarritoParaUsuario(Long usuarioId) {
        Usuario usuario = usuarioRepository.findById(usuarioId)
                .orElseThrow(() -> new ResourceNotFoundException("Usuario", "id", usuarioId));
        
        Carrito carrito = new Carrito(usuario);
        return carritoRepository.save(carrito);
    }

    /**
     * Crea un carrito anónimo con session ID.
     */
    @Transactional
    private Carrito crearCarritoAnonimo(String sessionId) {
        Carrito carrito = new Carrito(sessionId);
        return carritoRepository.save(carrito);
    }

    /**
     * Obtiene la entidad Carrito por ID.
     */
    public Carrito obtenerEntidadCarrito(Long carritoId) {
        return carritoRepository.findById(carritoId)
                .orElseThrow(() -> new ResourceNotFoundException("Carrito", "id", carritoId));
    }

    /**
     * Obtiene la entidad Carrito por usuario ID.
     */
    public Carrito obtenerEntidadCarritoPorUsuario(Long usuarioId) {
        return carritoRepository.findByUsuarioId(usuarioId)
                .orElseThrow(() -> new ResourceNotFoundException("Carrito", "usuarioId", usuarioId));
    }
}

