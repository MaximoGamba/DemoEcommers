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

# Descargar dependencias
RUN ./mvnw dependency:go-offline -B || true

# Copiar el código fuente
COPY src ./src

# Construir la aplicación
RUN ./mvnw clean package -DskipTests

# Imagen final más liviana
FROM eclipse-temurin:21-jre-alpine

WORKDIR /app

# Copiar el JAR construido
COPY --from=build /app/target/demo-0.0.1-SNAPSHOT.jar app.jar

# Render asigna el puerto dinámicamente
EXPOSE 8080

# Iniciar la aplicación
ENTRYPOINT ["sh", "-c", "java -jar app.jar"]
