package ecommersDemo.demo.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;

/**
 * Configuración de seguridad temporal.
 * Por ahora permite acceso a todos los endpoints sin autenticación.
 * TODO: Implementar autenticación JWT con roles CLIENTE y ADMIN.
 */
@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            // Deshabilitar CSRF para APIs REST
            .csrf(csrf -> csrf.disable())
            
            // Configurar sesión sin estado (para APIs REST)
            .sessionManagement(session -> 
                session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            
            // Configurar autorización de endpoints
            .authorizeHttpRequests(auth -> auth
                // Permitir acceso público al catálogo
                .requestMatchers("/api/productos/**").permitAll()
                .requestMatchers("/api/categorias/**").permitAll()
                .requestMatchers("/api/talles/**").permitAll()
                
                // Por ahora, permitir acceso al admin sin autenticación
                // TODO: Restringir a rol ADMIN cuando se implemente autenticación
                .requestMatchers("/api/admin/**").permitAll()
                
                // Cualquier otra petición requiere autenticación
                .anyRequest().permitAll()
            );

        return http.build();
    }
}

