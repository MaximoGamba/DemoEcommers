package ecommersDemo.demo.service;

import ecommersDemo.demo.dto.CuponDTO;
import ecommersDemo.demo.dto.ValidarCuponResponse;
import ecommersDemo.demo.exception.BadRequestException;
import ecommersDemo.demo.exception.ResourceNotFoundException;
import ecommersDemo.demo.model.Cupon;
import ecommersDemo.demo.repository.CuponRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;

@Service
public class CuponService {

    private final CuponRepository cuponRepository;

    public CuponService(CuponRepository cuponRepository) {
        this.cuponRepository = cuponRepository;
    }

    /**
     * Valida un cupón y calcula el descuento aplicable para un monto dado.
     */
    @Transactional(readOnly = true)
    public ValidarCuponResponse validarCupon(String codigo, BigDecimal montoCompra) {
        if (codigo == null || codigo.trim().isEmpty()) {
            return new ValidarCuponResponse(false, "El código de cupón es requerido");
        }

        if (montoCompra == null || montoCompra.compareTo(BigDecimal.ZERO) <= 0) {
            return new ValidarCuponResponse(false, "El monto de compra debe ser mayor a cero");
        }

        Cupon cupon = cuponRepository.findByCodigoAndActivoTrue(codigo.trim().toUpperCase())
                .orElse(null);

        if (cupon == null) {
            return new ValidarCuponResponse(false, "El código de cupón no existe o no está activo");
        }

        if (!cupon.esValido(montoCompra)) {
            // Determinar el motivo de invalidez
            String mensaje = "El cupón no es válido";
            
            if (cupon.getMontoMinimo() != null && montoCompra.compareTo(cupon.getMontoMinimo()) < 0) {
                mensaje = String.format("El monto mínimo para este cupón es $%.2f", cupon.getMontoMinimo());
            } else if (cupon.getUsosMaximos() != null && cupon.getUsosActuales() >= cupon.getUsosMaximos()) {
                mensaje = "Este cupón ha alcanzado su límite de usos";
            } else {
                java.time.LocalDateTime ahora = java.time.LocalDateTime.now();
                if (ahora.isBefore(cupon.getFechaInicio())) {
                    mensaje = "Este cupón aún no está disponible";
                } else if (ahora.isAfter(cupon.getFechaFin())) {
                    mensaje = "Este cupón ha expirado";
                }
            }
            
            return new ValidarCuponResponse(false, mensaje);
        }

        BigDecimal descuentoAplicable = cupon.calcularDescuento(montoCompra);
        CuponDTO cuponDTO = new CuponDTO(cupon);

        return new ValidarCuponResponse(true, "Cupón válido", cuponDTO, descuentoAplicable);
    }

    /**
     * Obtiene un cupón por su código.
     */
    @Transactional(readOnly = true)
    public CuponDTO obtenerCuponPorCodigo(String codigo) {
        Cupon cupon = cuponRepository.findByCodigoAndActivoTrue(codigo)
                .orElseThrow(() -> new ResourceNotFoundException("Cupón", "código", codigo));
        return new CuponDTO(cupon);
    }

    /**
     * Incrementa el contador de usos de un cupón.
     */
    @Transactional
    public void incrementarUsoCupon(String codigo) {
        Cupon cupon = cuponRepository.findByCodigo(codigo)
                .orElseThrow(() -> new ResourceNotFoundException("Cupón", "código", codigo));
        cupon.incrementarUso();
        cuponRepository.save(cupon);
    }
}















