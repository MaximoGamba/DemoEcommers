package ecommersDemo.demo.service;

import ecommersDemo.demo.dto.CategoriaDTO;
import ecommersDemo.demo.exception.ResourceNotFoundException;
import ecommersDemo.demo.model.Categoria;
import ecommersDemo.demo.repository.CategoriaRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional(readOnly = true)
public class CategoriaService {

    private final CategoriaRepository categoriaRepository;

    public CategoriaService(CategoriaRepository categoriaRepository) {
        this.categoriaRepository = categoriaRepository;
    }

    /**
     * Obtiene todas las categorías activas ordenadas.
     */
    public List<CategoriaDTO> obtenerCategoriasActivas() {
        return categoriaRepository.findByActivaTrueOrderByOrdenVisualizacionAsc()
                .stream()
                .map(CategoriaDTO::new)
                .collect(Collectors.toList());
    }

    /**
     * Obtiene todas las categorías (para admin).
     */
    public List<CategoriaDTO> obtenerTodasLasCategorias() {
        return categoriaRepository.findAllByOrderByOrdenVisualizacionAsc()
                .stream()
                .map(CategoriaDTO::new)
                .collect(Collectors.toList());
    }

    /**
     * Obtiene una categoría por ID.
     */
    public CategoriaDTO obtenerCategoriaPorId(Long id) {
        Categoria categoria = categoriaRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Categoría", "id", id));
        return new CategoriaDTO(categoria);
    }

    /**
     * Obtiene la entidad Categoria por ID (para uso interno).
     */
    public Categoria obtenerEntidadPorId(Long id) {
        return categoriaRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Categoría", "id", id));
    }
}

