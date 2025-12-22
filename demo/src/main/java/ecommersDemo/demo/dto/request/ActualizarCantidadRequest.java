package ecommersDemo.demo.dto.request;

/**
 * DTO para actualizar la cantidad de un item en el carrito.
 */
public class ActualizarCantidadRequest {

    private Integer cantidad;

    public ActualizarCantidadRequest() {
    }

    public ActualizarCantidadRequest(Integer cantidad) {
        this.cantidad = cantidad;
    }

    public Integer getCantidad() {
        return cantidad;
    }

    public void setCantidad(Integer cantidad) {
        this.cantidad = cantidad;
    }
}

