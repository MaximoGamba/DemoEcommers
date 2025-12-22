package ecommersDemo.demo.dto;

import java.math.BigDecimal;

/**
 * DTO para la respuesta de validación de cupón.
 */
public class ValidarCuponResponse {

    private Boolean valido;
    private String mensaje;
    private CuponDTO cupon;
    private BigDecimal descuentoAplicable;

    public ValidarCuponResponse() {
    }

    public ValidarCuponResponse(Boolean valido, String mensaje) {
        this.valido = valido;
        this.mensaje = mensaje;
    }

    public ValidarCuponResponse(Boolean valido, String mensaje, CuponDTO cupon, BigDecimal descuentoAplicable) {
        this.valido = valido;
        this.mensaje = mensaje;
        this.cupon = cupon;
        this.descuentoAplicable = descuentoAplicable;
    }

    // Getters y Setters
    public Boolean getValido() {
        return valido;
    }

    public void setValido(Boolean valido) {
        this.valido = valido;
    }

    public String getMensaje() {
        return mensaje;
    }

    public void setMensaje(String mensaje) {
        this.mensaje = mensaje;
    }

    public CuponDTO getCupon() {
        return cupon;
    }

    public void setCupon(CuponDTO cupon) {
        this.cupon = cupon;
    }

    public BigDecimal getDescuentoAplicable() {
        return descuentoAplicable;
    }

    public void setDescuentoAplicable(BigDecimal descuentoAplicable) {
        this.descuentoAplicable = descuentoAplicable;
    }
}















