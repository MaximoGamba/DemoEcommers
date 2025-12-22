package ecommersDemo.demo.service;

import ecommersDemo.demo.dto.ProductoDTO;
import ecommersDemo.demo.dto.ProductoVarianteDTO;
import ecommersDemo.demo.dto.request.ProductoCreateRequest;
import ecommersDemo.demo.dto.request.ProductoUpdateRequest;
import ecommersDemo.demo.dto.request.VarianteCreateRequest;
import ecommersDemo.demo.dto.request.VarianteUpdateRequest;
import ecommersDemo.demo.dto.request.ImagenRequest;
import ecommersDemo.demo.exception.BadRequestException;
import ecommersDemo.demo.exception.DuplicateResourceException;
import ecommersDemo.demo.exception.ResourceNotFoundException;
import ecommersDemo.demo.model.Categoria;
import ecommersDemo.demo.model.Producto;
import ecommersDemo.demo.model.ProductoImagen;
import ecommersDemo.demo.model.ProductoVariante;
import ecommersDemo.demo.model.Talle;
import ecommersDemo.demo.repository.ProductoRepository;
import ecommersDemo.demo.repository.ProductoVarianteRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional(readOnly = true)
public class ProductoService {

    private final ProductoRepository productoRepository;
    private final ProductoVarianteRepository varianteRepository;
    private final CategoriaService categoriaService;
    private final TalleService talleService;

    public ProductoService(ProductoRepository productoRepository,
                          ProductoVarianteRepository varianteRepository,
                          CategoriaService categoriaService,
                          TalleService talleService) {
        this.productoRepository = productoRepository;
        this.varianteRepository = varianteRepository;
        this.categoriaService = categoriaService;
        this.talleService = talleService;
    }

    // ==================== CATÁLOGO PÚBLICO ====================

    /**
     * Obtiene todos los productos activos para el catálogo público.
     */
    public List<ProductoDTO> obtenerProductosActivos() {
        return productoRepository.findByActivoTrue()
                .stream()
                .map(ProductoDTO::new)
                .collect(Collectors.toList());
    }

    /**
     * Obtiene productos activos con paginación.
     */
    public Page<ProductoDTO> obtenerProductosActivosPaginados(Pageable pageable) {
        return productoRepository.findByActivoTrue(pageable)
                .map(ProductoDTO::new);
    }

    /**
     * Obtiene un producto por ID (solo si está activo) con sus variantes.
     */
    public ProductoDTO obtenerProductoPublico(Long id) {
        Producto producto = productoRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Producto", "id", id));
        
        if (!producto.getActivo()) {
            throw new ResourceNotFoundException("Producto", "id", id);
        }
        
        return new ProductoDTO(producto, true);
    }

    /**
     * Obtiene productos por categoría.
     */
    public Page<ProductoDTO> obtenerProductosPorCategoria(Long categoriaId, Pageable pageable) {
        return productoRepository.findByCategoriaIdAndActivoTrue(categoriaId, pageable)
                .map(ProductoDTO::new);
    }

    /**
     * Obtiene productos destacados.
     */
    public List<ProductoDTO> obtenerProductosDestacados() {
        return productoRepository.findByDestacadoTrueAndActivoTrue()
                .stream()
                .map(ProductoDTO::new)
                .collect(Collectors.toList());
    }

    /**
     * Obtiene productos en oferta.
     */
    public List<ProductoDTO> obtenerProductosEnOferta() {
        return productoRepository.findProductosEnOferta()
                .stream()
                .map(ProductoDTO::new)
                .collect(Collectors.toList());
    }

    /**
     * Obtiene productos relacionados a un producto específico.
     * Busca productos de la misma categoría, excluyendo el producto actual.
     */
    public List<ProductoDTO> obtenerProductosRelacionados(Long productoId) {
        Producto producto = obtenerEntidadPorId(productoId);
        
        if (producto.getCategoria() == null) {
            return List.of();
        }

        // Obtener hasta 6 productos relacionados de la misma categoría
        Pageable pageable = org.springframework.data.domain.PageRequest.of(0, 6);
        return productoRepository.findProductosRelacionados(
                producto.getCategoria().getId(), 
                productoId, 
                pageable
        ).stream()
        .map(ProductoDTO::new)
        .collect(Collectors.toList());
    }

    /**
     * Busca productos por término.
     */
    public Page<ProductoDTO> buscarProductos(String termino, Pageable pageable) {
        return productoRepository.buscarProductos(termino, pageable)
                .map(ProductoDTO::new);
    }

    // ==================== ADMINISTRACIÓN ====================

    /**
     * Obtiene todos los productos (incluyendo inactivos) para administración.
     */
    public List<ProductoDTO> obtenerTodosLosProductos() {
        return productoRepository.findAll()
                .stream()
                .map(p -> new ProductoDTO(p, true))
                .collect(Collectors.toList());
    }

    /**
     * Obtiene un producto por ID (para admin).
     */
    public ProductoDTO obtenerProductoAdmin(Long id) {
        Producto producto = obtenerEntidadPorId(id);
        return new ProductoDTO(producto, true);
    }

    /**
     * Crea un nuevo producto.
     */
    @Transactional
    public ProductoDTO crearProducto(ProductoCreateRequest request) {
        // Validaciones
        if (request.getNombre() == null || request.getNombre().trim().isEmpty()) {
            throw new BadRequestException("El nombre del producto es obligatorio");
        }
        if (request.getPrecio() == null) {
            throw new BadRequestException("El precio del producto es obligatorio");
        }
        if (request.getCategoriaId() == null) {
            throw new BadRequestException("La categoría es obligatoria");
        }

        // Verificar SKU duplicado
        if (request.getSku() != null && !request.getSku().trim().isEmpty()) {
            if (productoRepository.existsBySku(request.getSku())) {
                throw new DuplicateResourceException("Producto", "SKU", request.getSku());
            }
        }

        // Obtener categoría
        Categoria categoria = categoriaService.obtenerEntidadPorId(request.getCategoriaId());

        // Crear producto
        Producto producto = new Producto();
        producto.setNombre(request.getNombre().trim());
        producto.setDescripcion(request.getDescripcion());
        producto.setPrecio(request.getPrecio());
        producto.setPrecioOferta(request.getPrecioOferta());
        producto.setImagenPrincipalUrl(request.getImagenPrincipalUrl());
        producto.setSku(request.getSku());
        producto.setMarca(request.getMarca());
        producto.setMaterial(request.getMaterial());
        producto.setCategoria(categoria);
        producto.setDestacado(request.getDestacado() != null ? request.getDestacado() : false);
        producto.setActivo(true);

        producto = productoRepository.save(producto);

        // Procesar imágenes adicionales
        if (request.getImagenes() != null && !request.getImagenes().isEmpty()) {
            int orden = 0;
            for (ImagenRequest imgRequest : request.getImagenes()) {
                if (imgRequest.getUrl() != null && !imgRequest.getUrl().trim().isEmpty()) {
                    ProductoImagen imagen = new ProductoImagen();
                    imagen.setProducto(producto);
                    imagen.setUrl(imgRequest.getUrl().trim());
                    imagen.setDescripcion(imgRequest.getDescripcion());
                    imagen.setOrden(imgRequest.getOrden() != null ? imgRequest.getOrden() : orden);
                    imagen.setEsPrincipal(imgRequest.getEsPrincipal() != null ? imgRequest.getEsPrincipal() : false);
                    producto.agregarImagen(imagen);
                    orden++;
                }
            }
            producto = productoRepository.save(producto);
        }

        return new ProductoDTO(producto, true);
    }

    /**
     * Actualiza un producto existente.
     */
    @Transactional
    public ProductoDTO actualizarProducto(Long id, ProductoUpdateRequest request) {
        Producto producto = obtenerEntidadPorId(id);

        // Verificar SKU duplicado si se está cambiando
        if (request.getSku() != null && !request.getSku().equals(producto.getSku())) {
            if (productoRepository.existsBySku(request.getSku())) {
                throw new DuplicateResourceException("Producto", "SKU", request.getSku());
            }
        }

        // Actualizar campos si vienen en el request
        if (request.getNombre() != null) {
            producto.setNombre(request.getNombre().trim());
        }
        if (request.getDescripcion() != null) {
            producto.setDescripcion(request.getDescripcion());
        }
        if (request.getPrecio() != null) {
            producto.setPrecio(request.getPrecio());
        }
        if (request.getPrecioOferta() != null) {
            producto.setPrecioOferta(request.getPrecioOferta());
        }
        if (request.getImagenPrincipalUrl() != null) {
            producto.setImagenPrincipalUrl(request.getImagenPrincipalUrl());
        }
        if (request.getSku() != null) {
            producto.setSku(request.getSku());
        }
        if (request.getMarca() != null) {
            producto.setMarca(request.getMarca());
        }
        if (request.getMaterial() != null) {
            producto.setMaterial(request.getMaterial());
        }
        if (request.getCategoriaId() != null) {
            Categoria categoria = categoriaService.obtenerEntidadPorId(request.getCategoriaId());
            producto.setCategoria(categoria);
        }
        if (request.getActivo() != null) {
            producto.setActivo(request.getActivo());
        }
        if (request.getDestacado() != null) {
            producto.setDestacado(request.getDestacado());
        }

        // Procesar imágenes adicionales si se proporcionan
        if (request.getImagenes() != null) {
            // Eliminar imágenes existentes si se está actualizando
            producto.getImagenes().clear();
            
            int orden = 0;
            for (ImagenRequest imgRequest : request.getImagenes()) {
                if (imgRequest.getUrl() != null && !imgRequest.getUrl().trim().isEmpty()) {
                    ProductoImagen imagen = new ProductoImagen();
                    imagen.setProducto(producto);
                    imagen.setUrl(imgRequest.getUrl().trim());
                    imagen.setDescripcion(imgRequest.getDescripcion());
                    imagen.setOrden(imgRequest.getOrden() != null ? imgRequest.getOrden() : orden);
                    imagen.setEsPrincipal(imgRequest.getEsPrincipal() != null ? imgRequest.getEsPrincipal() : false);
                    producto.agregarImagen(imagen);
                    orden++;
                }
            }
        }

        producto = productoRepository.save(producto);
        return new ProductoDTO(producto, true);
    }

    /**
     * Elimina un producto (soft delete).
     */
    @Transactional
    public void eliminarProducto(Long id) {
        Producto producto = obtenerEntidadPorId(id);
        producto.setActivo(false);
        productoRepository.save(producto);
    }

    // ==================== VARIANTES ====================

    /**
     * Agrega una variante a un producto.
     */
    @Transactional
    public ProductoVarianteDTO agregarVariante(Long productoId, VarianteCreateRequest request) {
        Producto producto = obtenerEntidadPorId(productoId);

        // Validaciones
        if (request.getTalleId() == null) {
            throw new BadRequestException("El talle es obligatorio");
        }
        if (request.getStock() == null || request.getStock() < 0) {
            throw new BadRequestException("El stock debe ser un número positivo");
        }

        Talle talle = talleService.obtenerEntidadPorId(request.getTalleId());

        // Verificar que no exista ya una variante con ese talle y color
        String color = request.getColor() != null ? request.getColor().trim() : null;
        varianteRepository.findByProductoIdAndTalleIdAndColor(productoId, request.getTalleId(), color)
                .ifPresent(v -> {
                    throw new DuplicateResourceException(
                            "Ya existe una variante con ese talle y color para este producto");
                });

        // Verificar SKU duplicado
        if (request.getSku() != null && !request.getSku().trim().isEmpty()) {
            if (varianteRepository.existsBySku(request.getSku())) {
                throw new DuplicateResourceException("Variante", "SKU", request.getSku());
            }
        }

        // Crear variante
        ProductoVariante variante = new ProductoVariante();
        variante.setProducto(producto);
        variante.setTalle(talle);
        variante.setColor(color);
        variante.setCodigoColor(request.getCodigoColor());
        variante.setStock(request.getStock());
        variante.setStockMinimo(request.getStockMinimo() != null ? request.getStockMinimo() : 5);
        variante.setSku(request.getSku());
        variante.setPrecioAdicional(request.getPrecioAdicional());
        variante.setImagenUrl(request.getImagenUrl());
        variante.setActivo(true);

        variante = varianteRepository.save(variante);
        return new ProductoVarianteDTO(variante);
    }

    /**
     * Actualiza una variante existente.
     */
    @Transactional
    public ProductoVarianteDTO actualizarVariante(Long varianteId, VarianteUpdateRequest request) {
        ProductoVariante variante = varianteRepository.findById(varianteId)
                .orElseThrow(() -> new ResourceNotFoundException("Variante", "id", varianteId));

        // Verificar SKU duplicado si se está cambiando
        if (request.getSku() != null && !request.getSku().equals(variante.getSku())) {
            if (varianteRepository.existsBySku(request.getSku())) {
                throw new DuplicateResourceException("Variante", "SKU", request.getSku());
            }
        }

        // Actualizar talle si viene en el request
        if (request.getTalleId() != null) {
            Talle talle = talleService.obtenerEntidadPorId(request.getTalleId());
            variante.setTalle(talle);
        }

        // Actualizar campos
        if (request.getColor() != null) {
            variante.setColor(request.getColor().trim());
        }
        if (request.getCodigoColor() != null) {
            variante.setCodigoColor(request.getCodigoColor());
        }
        if (request.getStock() != null) {
            variante.setStock(request.getStock());
        }
        if (request.getStockMinimo() != null) {
            variante.setStockMinimo(request.getStockMinimo());
        }
        if (request.getSku() != null) {
            variante.setSku(request.getSku());
        }
        if (request.getPrecioAdicional() != null) {
            variante.setPrecioAdicional(request.getPrecioAdicional());
        }
        if (request.getImagenUrl() != null) {
            variante.setImagenUrl(request.getImagenUrl());
        }
        if (request.getActivo() != null) {
            variante.setActivo(request.getActivo());
        }

        variante = varianteRepository.save(variante);
        return new ProductoVarianteDTO(variante);
    }

    /**
     * Obtiene las variantes de un producto.
     */
    public List<ProductoVarianteDTO> obtenerVariantesProducto(Long productoId) {
        return varianteRepository.findByProductoId(productoId)
                .stream()
                .map(ProductoVarianteDTO::new)
                .collect(Collectors.toList());
    }

    // ==================== MÉTODOS AUXILIARES ====================

    /**
     * Obtiene la entidad Producto por ID (para uso interno).
     */
    private Producto obtenerEntidadPorId(Long id) {
        return productoRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Producto", "id", id));
    }
}

