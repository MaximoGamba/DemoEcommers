package ecommersDemo.demo.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

/**
 * Excepción lanzada cuando no hay stock suficiente para una operación.
 */
@ResponseStatus(HttpStatus.CONFLICT)
public class StockInsuficienteException extends RuntimeException {

    private Long productoVarianteId;
    private Integer stockSolicitado;
    private Integer stockDisponible;

    public StockInsuficienteException(String message) {
        super(message);
    }

    public StockInsuficienteException(Long productoVarianteId, Integer stockSolicitado, Integer stockDisponible) {
        super(String.format("Stock insuficiente. Solicitado: %d, Disponible: %d", 
                stockSolicitado, stockDisponible));
        this.productoVarianteId = productoVarianteId;
        this.stockSolicitado = stockSolicitado;
        this.stockDisponible = stockDisponible;
    }

    public Long getProductoVarianteId() {
        return productoVarianteId;
    }

    public Integer getStockSolicitado() {
        return stockSolicitado;
    }

    public Integer getStockDisponible() {
        return stockDisponible;
    }
}

