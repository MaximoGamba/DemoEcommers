package ecommersDemo.demo.repository;

import ecommersDemo.demo.model.Cupon;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface CuponRepository extends JpaRepository<Cupon, Long> {

    /**
     * Busca un cupón por su código.
     */
    Optional<Cupon> findByCodigo(String codigo);

    /**
     * Busca un cupón activo por su código.
     */
    Optional<Cupon> findByCodigoAndActivoTrue(String codigo);

    /**
     * Verifica si existe un cupón con el código dado.
     */
    boolean existsByCodigo(String codigo);
}















