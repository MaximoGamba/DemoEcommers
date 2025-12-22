package ecommersDemo.demo.service;

import ecommersDemo.demo.dto.TalleDTO;
import ecommersDemo.demo.exception.ResourceNotFoundException;
import ecommersDemo.demo.model.Talle;
import ecommersDemo.demo.repository.TalleRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional(readOnly = true)
public class TalleService {

    private final TalleRepository talleRepository;

    public TalleService(TalleRepository talleRepository) {
        this.talleRepository = talleRepository;
    }

    /**
     * Obtiene todos los talles activos ordenados.
     */
    public List<TalleDTO> obtenerTallesActivos() {
        return talleRepository.findByActivoTrueOrderByOrdenVisualizacionAsc()
                .stream()
                .map(TalleDTO::new)
                .collect(Collectors.toList());
    }

    /**
     * Obtiene todos los talles (para admin).
     */
    public List<TalleDTO> obtenerTodosLosTalles() {
        return talleRepository.findAllByOrderByOrdenVisualizacionAsc()
                .stream()
                .map(TalleDTO::new)
                .collect(Collectors.toList());
    }

    /**
     * Obtiene un talle por ID.
     */
    public TalleDTO obtenerTallePorId(Long id) {
        Talle talle = talleRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Talle", "id", id));
        return new TalleDTO(talle);
    }

    /**
     * Obtiene la entidad Talle por ID (para uso interno).
     */
    public Talle obtenerEntidadPorId(Long id) {
        return talleRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Talle", "id", id));
    }

    /**
     * Obtiene los talles disponibles para un producto específico.
     */
    public List<TalleDTO> obtenerTallesDisponiblesPorProducto(Long productoId) {
        return talleRepository.findTallesDisponiblesPorProducto(productoId)
                .stream()
                .map(TalleDTO::new)
                .collect(Collectors.toList());
    }
}

