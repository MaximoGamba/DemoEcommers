package ecommersDemo.demo.repository;

import ecommersDemo.demo.model.Carrito;
import ecommersDemo.demo.model.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface CarritoRepository extends JpaRepository<Carrito, Long> {

    /**
     * Busca el carrito de un usuario.
     */
    Optional<Carrito> findByUsuario(Usuario usuario);

    /**
     * Busca el carrito de un usuario por su ID.
     */
    Optional<Carrito> findByUsuarioId(Long usuarioId);

    /**
     * Busca un carrito por session ID (para usuarios anónimos).
     */
    Optional<Carrito> findBySessionId(String sessionId);

    /**
     * Verifica si un usuario tiene un carrito.
     */
    boolean existsByUsuarioId(Long usuarioId);

    /**
     * Busca carritos expirados.
     */
    @Query("SELECT c FROM Carrito c WHERE c.fechaExpiracion < :fechaActual")
    List<Carrito> findCarritosExpirados(@Param("fechaActual") LocalDateTime fechaActual);

    /**
     * Busca carritos anónimos (sin usuario).
     */
    @Query("SELECT c FROM Carrito c WHERE c.usuario IS NULL")
    List<Carrito> findCarritosAnonimos();

    /**
     * Busca carritos abandonados (sin actualizar en X días).
     */
    @Query("SELECT c FROM Carrito c WHERE c.fechaActualizacion < :fechaLimite")
    List<Carrito> findCarritosAbandonados(@Param("fechaLimite") LocalDateTime fechaLimite);

    /**
     * Elimina carritos expirados.
     */
    @Modifying
    @Query("DELETE FROM Carrito c WHERE c.fechaExpiracion < :fechaActual")
    int eliminarCarritosExpirados(@Param("fechaActual") LocalDateTime fechaActual);

    /**
     * Busca carritos no vacíos.
     */
    @Query("SELECT DISTINCT c FROM Carrito c JOIN c.items i WHERE SIZE(c.items) > 0")
    List<Carrito> findCarritosNoVacios();
}

