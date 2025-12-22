package ecommersDemo.demo.dto.request;

/**
 * DTO para agregar un item al carrito.
 */
public class AgregarItemCarritoRequest {

    private Long productoVarianteId;
    private Integer cantidad;

    public AgregarItemCarritoRequest() {
    }

    public AgregarItemCarritoRequest(Long productoVarianteId, Integer cantidad) {
        this.productoVarianteId = productoVarianteId;
        this.cantidad = cantidad;
    }

    public Long getProductoVarianteId() {
        return productoVarianteId;
    }

    public void setProductoVarianteId(Long productoVarianteId) {
        this.productoVarianteId = productoVarianteId;
    }

    public Integer getCantidad() {
        return cantidad;
    }

    public void setCantidad(Integer cantidad) {
        this.cantidad = cantidad;
    }
}

