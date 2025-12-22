package ecommersDemo.demo.dto.request;

import ecommersDemo.demo.model.Pedido.EstadoPedido;

/**
 * DTO para cambiar el estado de un pedido.
 */
public class CambiarEstadoPedidoRequest {

    private EstadoPedido nuevoEstado;
    private String comentario;

    public CambiarEstadoPedidoRequest() {
    }

    public EstadoPedido getNuevoEstado() {
        return nuevoEstado;
    }

    public void setNuevoEstado(EstadoPedido nuevoEstado) {
        this.nuevoEstado = nuevoEstado;
    }

    public String getComentario() {
        return comentario;
    }

    public void setComentario(String comentario) {
        this.comentario = comentario;
    }
}

