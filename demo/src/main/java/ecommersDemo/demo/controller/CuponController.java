package ecommersDemo.demo.controller;

import ecommersDemo.demo.dto.response.ApiResponse;
import ecommersDemo.demo.dto.ValidarCuponResponse;
import ecommersDemo.demo.service.CuponService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;

@RestController
@RequestMapping("/api/cupones")
@CrossOrigin(origins = "*")
public class CuponController {

    private final CuponService cuponService;

    public CuponController(CuponService cuponService) {
        this.cuponService = cuponService;
    }

    /**
     * POST /api/cupones/validar
     * Valida un cupón y calcula el descuento aplicable.
     */
    @PostMapping("/validar")
    public ResponseEntity<ApiResponse<ValidarCuponResponse>> validarCupon(
            @RequestParam String codigo,
            @RequestParam BigDecimal montoCompra) {
        
        ValidarCuponResponse response = cuponService.validarCupon(codigo, montoCompra);
        return ResponseEntity.ok(ApiResponse.success(response));
    }
}


