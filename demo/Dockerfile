# Dockerfile para Spring Boot en Render
FROM maven:3.9-eclipse-temurin-21 AS build

# Establecer directorio de trabajo
WORKDIR /app

# Copiar archivos de configuración de Maven (para cachear dependencias)
COPY pom.xml .
COPY .mvn .mvn
COPY mvnw .

# Dar permisos de ejecución a mvnw
RUN chmod +x ./mvnw

# Descargar dependencias (esto se cachea si pom.xml no cambia)
RUN ./mvnw dependency:go-offline -B || true

# Copiar el código fuente
COPY src ./src

# Construir la aplicación
RUN ./mvnw clean package -DskipTests

# Imagen final más pequeña
FROM eclipse-temurin:21-jre-alpine

WORKDIR /app

# Copiar el JAR construido
COPY --from=build /app/target/demo-0.0.1-SNAPSHOT.jar app.jar

# Render asigna un puerto dinámico, exponemos el rango común
EXPOSE 8080

# Comando para iniciar la aplicación
# Render inyecta PORT automáticamente como variable de entorno
# Spring Boot leerá PORT desde application.properties (server.port=${PORT:8080})
ENTRYPOINT ["sh", "-c", "java -jar app.jar"]

