package ecommersDemo.demo.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

/**
 * Excepción lanzada cuando se intenta realizar una operación con un carrito vacío.
 */
@ResponseStatus(HttpStatus.BAD_REQUEST)
public class CarritoVacioException extends RuntimeException {

    public CarritoVacioException() {
        super("El carrito está vacío");
    }

    public CarritoVacioException(String message) {
        super(message);
    }
}

