package ecommersDemo.demo.repository;

import ecommersDemo.demo.model.Usuario;
import ecommersDemo.demo.model.Usuario.Rol;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UsuarioRepository extends JpaRepository<Usuario, Long> {

    /**
     * Busca un usuario por su email.
     */
    Optional<Usuario> findByEmail(String email);

    /**
     * Verifica si existe un usuario con el email dado.
     */
    boolean existsByEmail(String email);

    /**
     * Busca usuarios por rol.
     */
    List<Usuario> findByRol(Rol rol);

    /**
     * Busca usuarios activos.
     */
    List<Usuario> findByActivoTrue();

    /**
     * Busca usuarios por rol y estado activo.
     */
    List<Usuario> findByRolAndActivoTrue(Rol rol);

    /**
     * Busca usuarios por nombre o apellido (búsqueda parcial, case-insensitive).
     */
    @Query("SELECT u FROM Usuario u WHERE LOWER(u.nombre) LIKE LOWER(CONCAT('%', :termino, '%')) " +
           "OR LOWER(u.apellido) LIKE LOWER(CONCAT('%', :termino, '%'))")
    List<Usuario> buscarPorNombreOApellido(@Param("termino") String termino);

    /**
     * Busca usuario activo por email.
     */
    Optional<Usuario> findByEmailAndActivoTrue(String email);
}

