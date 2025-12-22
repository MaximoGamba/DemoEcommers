-- =============================================
-- DATOS DE DEMO PARA E-COMMERCE DE ROPA MASCULINA
-- =============================================
-- Nota: Con spring.jpa.hibernate.ddl-auto=create-drop las tablas 
-- se crean vacías al inicio, no necesitamos DELETE.

-- =============================================
-- USUARIO DEMO (Para checkout sin registro real)
-- =============================================
INSERT INTO usuarios (id, nombre, apellido, email, password, telefono, direccion, ciudad, codigo_postal, rol, activo, fecha_registro, fecha_actualizacion) VALUES
(1, 'Usuario', 'Demo', 'demo@menstyle.com', 'demo123', '1155667788', 'Av. Corrientes 1234, Piso 5', 'Buenos Aires', '1414', 'CLIENTE', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(2, 'Admin', 'Sistema', 'admin@menstyle.com', 'admin123', '1122334455', 'Av. Santa Fe 5678', 'Buenos Aires', '1425', 'ADMIN', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- =============================================
-- CATEGORÍAS
-- =============================================
INSERT INTO categorias (id, nombre, descripcion, activa, orden_visualizacion, fecha_creacion, fecha_actualizacion) VALUES
(1, 'Remeras', 'Remeras y camisetas para hombre', true, 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(2, 'Pantalones', 'Pantalones, jeans y bermudas', true, 2, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(3, 'Camperas', 'Camperas, buzos y abrigos', true, 3, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(4, 'Camisas', 'Camisas formales y casuales', true, 4, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- =============================================
-- TALLES
-- =============================================
INSERT INTO talles (id, nombre, descripcion, orden_visualizacion, activo) VALUES
(1, 'S', 'Small - Talle chico', 1, true),
(2, 'M', 'Medium - Talle mediano', 2, true),
(3, 'L', 'Large - Talle grande', 3, true),
(4, 'XL', 'Extra Large - Talle extra grande', 4, true),
(5, 'XXL', 'Double Extra Large', 5, true);

-- =============================================
-- PRODUCTOS
-- =============================================

-- Remeras (categoria_id = 1)
INSERT INTO productos (id, nombre, descripcion, precio, precio_oferta, imagen_principal_url, sku, marca, material, activo, destacado, categoria_id, fecha_creacion, fecha_actualizacion) VALUES
(1, 'Remera Básica Algodón', 'Remera clásica de algodón 100%, perfecta para el día a día. Corte regular, cuello redondo.', 12999.00, NULL, 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400', 'REM-BAS-001', 'Urban Style', 'Algodón 100%', true, true, 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

(2, 'Remera Estampada Street', 'Remera con estampado urbano moderno. Algodón peinado de alta calidad.', 15999.00, 12999.00, 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=400', 'REM-EST-002', 'Street Wear', 'Algodón peinado', true, true, 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

(3, 'Remera Deportiva Dry-Fit', 'Remera deportiva con tecnología de secado rápido. Ideal para entrenar.', 18999.00, NULL, 'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=400', 'REM-DEP-003', 'SportMax', 'Poliéster Dry-Fit', true, false, 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- Pantalones (categoria_id = 2)
INSERT INTO productos (id, nombre, descripcion, precio, precio_oferta, imagen_principal_url, sku, marca, material, activo, destacado, categoria_id, fecha_creacion, fecha_actualizacion) VALUES
(4, 'Jean Slim Fit Azul', 'Jean slim fit clásico azul oscuro. Denim de alta calidad con elastano para mayor comodidad.', 34999.00, 29999.00, 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=400', 'PAN-JEA-001', 'Denim Co.', 'Denim 98% Algodón, 2% Elastano', true, true, 2, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

(5, 'Pantalón Chino Beige', 'Pantalón chino casual color beige. Perfecto para ocasiones semi-formales.', 28999.00, NULL, 'https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=400', 'PAN-CHI-002', 'Classic Men', 'Algodón 100%', true, false, 2, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

(6, 'Jogger Urbano Negro', 'Jogger cómodo para uso diario. Con puños elásticos y bolsillos laterales.', 24999.00, NULL, 'https://images.unsplash.com/photo-1552902865-b72c031ac5ea?w=400', 'PAN-JOG-003', 'Urban Style', 'Algodón French Terry', true, false, 2, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- Camperas (categoria_id = 3)
INSERT INTO productos (id, nombre, descripcion, precio, precio_oferta, imagen_principal_url, sku, marca, material, activo, destacado, categoria_id, fecha_creacion, fecha_actualizacion) VALUES
(7, 'Campera de Cuero Clásica', 'Campera de cuero sintético premium. Estilo motociclista atemporal.', 89999.00, 74999.00, 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400', 'CAM-CUE-001', 'Leather Bros', 'Cuero sintético premium', true, true, 3, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

(8, 'Hoodie Oversize Gris', 'Buzo con capucha oversize. Súper cómodo y abrigado para el invierno.', 32999.00, NULL, 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=400', 'CAM-HOO-002', 'Street Wear', 'Algodón French Terry 320gr', true, true, 3, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

(9, 'Campera Puffer Negra', 'Campera inflable ultraliviana. Relleno sintético térmico.', 54999.00, 44999.00, 'https://images.unsplash.com/photo-1544923246-77307dd628b1?w=400', 'CAM-PUF-003', 'Winter Pro', 'Nylon con relleno sintético', true, false, 3, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- Camisas (categoria_id = 4)
INSERT INTO productos (id, nombre, descripcion, precio, precio_oferta, imagen_principal_url, sku, marca, material, activo, destacado, categoria_id, fecha_creacion, fecha_actualizacion) VALUES
(10, 'Camisa Oxford Celeste', 'Camisa Oxford clásica. Perfecta para la oficina o eventos formales.', 27999.00, NULL, 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=400', 'CAM-OXF-001', 'Classic Men', 'Algodón Oxford', true, false, 4, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- =============================================
-- VARIANTES DE PRODUCTOS (Stock por talle)
-- =============================================

-- Variantes para Remera Básica Algodón (producto_id = 1)
INSERT INTO producto_variantes (id, producto_id, talle_id, color, codigo_color, stock, stock_minimo, sku, activo, fecha_creacion, fecha_actualizacion) VALUES
(1, 1, 1, 'Negro', '#000000', 15, 5, 'REM-BAS-001-S-NEG', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(2, 1, 2, 'Negro', '#000000', 20, 5, 'REM-BAS-001-M-NEG', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(3, 1, 3, 'Negro', '#000000', 18, 5, 'REM-BAS-001-L-NEG', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(4, 1, 4, 'Negro', '#000000', 10, 5, 'REM-BAS-001-XL-NEG', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(5, 1, 1, 'Blanco', '#FFFFFF', 12, 5, 'REM-BAS-001-S-BLA', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(6, 1, 2, 'Blanco', '#FFFFFF', 25, 5, 'REM-BAS-001-M-BLA', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(7, 1, 3, 'Blanco', '#FFFFFF', 22, 5, 'REM-BAS-001-L-BLA', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(8, 1, 4, 'Blanco', '#FFFFFF', 8, 5, 'REM-BAS-001-XL-BLA', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- Variantes para Remera Estampada Street (producto_id = 2)
INSERT INTO producto_variantes (id, producto_id, talle_id, color, codigo_color, stock, stock_minimo, sku, activo, fecha_creacion, fecha_actualizacion) VALUES
(9, 2, 1, 'Negro', '#000000', 8, 5, 'REM-EST-002-S-NEG', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(10, 2, 2, 'Negro', '#000000', 15, 5, 'REM-EST-002-M-NEG', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(11, 2, 3, 'Negro', '#000000', 12, 5, 'REM-EST-002-L-NEG', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(12, 2, 4, 'Negro', '#000000', 5, 5, 'REM-EST-002-XL-NEG', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- Variantes para Remera Deportiva (producto_id = 3)
INSERT INTO producto_variantes (id, producto_id, talle_id, color, codigo_color, stock, stock_minimo, sku, activo, fecha_creacion, fecha_actualizacion) VALUES
(13, 3, 2, 'Azul', '#0066CC', 10, 5, 'REM-DEP-003-M-AZU', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(14, 3, 3, 'Azul', '#0066CC', 12, 5, 'REM-DEP-003-L-AZU', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(15, 3, 4, 'Azul', '#0066CC', 8, 5, 'REM-DEP-003-XL-AZU', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- Variantes para Jean Slim Fit (producto_id = 4)
INSERT INTO producto_variantes (id, producto_id, talle_id, color, codigo_color, stock, stock_minimo, sku, activo, fecha_creacion, fecha_actualizacion) VALUES
(16, 4, 1, 'Azul Oscuro', '#1a3a5c', 6, 3, 'PAN-JEA-001-S-AZO', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(17, 4, 2, 'Azul Oscuro', '#1a3a5c', 14, 3, 'PAN-JEA-001-M-AZO', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(18, 4, 3, 'Azul Oscuro', '#1a3a5c', 18, 3, 'PAN-JEA-001-L-AZO', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(19, 4, 4, 'Azul Oscuro', '#1a3a5c', 10, 3, 'PAN-JEA-001-XL-AZO', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- Variantes para Pantalón Chino (producto_id = 5)
INSERT INTO producto_variantes (id, producto_id, talle_id, color, codigo_color, stock, stock_minimo, sku, activo, fecha_creacion, fecha_actualizacion) VALUES
(20, 5, 2, 'Beige', '#D4B896', 10, 3, 'PAN-CHI-002-M-BEI', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(21, 5, 3, 'Beige', '#D4B896', 15, 3, 'PAN-CHI-002-L-BEI', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(22, 5, 4, 'Beige', '#D4B896', 8, 3, 'PAN-CHI-002-XL-BEI', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- Variantes para Jogger Urbano (producto_id = 6)
INSERT INTO producto_variantes (id, producto_id, talle_id, color, codigo_color, stock, stock_minimo, sku, activo, fecha_creacion, fecha_actualizacion) VALUES
(23, 6, 1, 'Negro', '#000000', 12, 5, 'PAN-JOG-003-S-NEG', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(24, 6, 2, 'Negro', '#000000', 20, 5, 'PAN-JOG-003-M-NEG', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(25, 6, 3, 'Negro', '#000000', 18, 5, 'PAN-JOG-003-L-NEG', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(26, 6, 4, 'Negro', '#000000', 10, 5, 'PAN-JOG-003-XL-NEG', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- Variantes para Campera de Cuero (producto_id = 7)
INSERT INTO producto_variantes (id, producto_id, talle_id, color, codigo_color, stock, stock_minimo, sku, activo, fecha_creacion, fecha_actualizacion) VALUES
(27, 7, 2, 'Negro', '#000000', 5, 2, 'CAM-CUE-001-M-NEG', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(28, 7, 3, 'Negro', '#000000', 8, 2, 'CAM-CUE-001-L-NEG', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(29, 7, 4, 'Negro', '#000000', 4, 2, 'CAM-CUE-001-XL-NEG', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(30, 7, 2, 'Marrón', '#5C4033', 3, 2, 'CAM-CUE-001-M-MAR', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(31, 7, 3, 'Marrón', '#5C4033', 6, 2, 'CAM-CUE-001-L-MAR', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- Variantes para Hoodie Oversize (producto_id = 8)
INSERT INTO producto_variantes (id, producto_id, talle_id, color, codigo_color, stock, stock_minimo, sku, activo, fecha_creacion, fecha_actualizacion) VALUES
(32, 8, 2, 'Gris', '#808080', 15, 5, 'CAM-HOO-002-M-GRI', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(33, 8, 3, 'Gris', '#808080', 20, 5, 'CAM-HOO-002-L-GRI', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(34, 8, 4, 'Gris', '#808080', 12, 5, 'CAM-HOO-002-XL-GRI', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(35, 8, 5, 'Gris', '#808080', 8, 5, 'CAM-HOO-002-XXL-GRI', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- Variantes para Campera Puffer (producto_id = 9)
INSERT INTO producto_variantes (id, producto_id, talle_id, color, codigo_color, stock, stock_minimo, sku, activo, fecha_creacion, fecha_actualizacion) VALUES
(36, 9, 2, 'Negro', '#000000', 6, 3, 'CAM-PUF-003-M-NEG', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(37, 9, 3, 'Negro', '#000000', 10, 3, 'CAM-PUF-003-L-NEG', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(38, 9, 4, 'Negro', '#000000', 5, 3, 'CAM-PUF-003-XL-NEG', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- Variantes para Camisa Oxford (producto_id = 10)
INSERT INTO producto_variantes (id, producto_id, talle_id, color, codigo_color, stock, stock_minimo, sku, activo, fecha_creacion, fecha_actualizacion) VALUES
(39, 10, 1, 'Celeste', '#87CEEB', 8, 3, 'CAM-OXF-001-S-CEL', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(40, 10, 2, 'Celeste', '#87CEEB', 12, 3, 'CAM-OXF-001-M-CEL', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(41, 10, 3, 'Celeste', '#87CEEB', 15, 3, 'CAM-OXF-001-L-CEL', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(42, 10, 4, 'Celeste', '#87CEEB', 10, 3, 'CAM-OXF-001-XL-CEL', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- =============================================
-- CUPONES DE DESCUENTO
-- =============================================
-- Cupón 1: 10% de descuento sin restricciones
INSERT INTO cupones (id, codigo, descripcion, tipo_descuento, valor_descuento, monto_minimo, descuento_maximo, fecha_inicio, fecha_fin, usos_maximos, usos_actuales, activo, fecha_creacion, fecha_actualizacion) VALUES
(1, 'BIENVENIDA10', '10% de descuento en tu primera compra', 'PORCENTAJE', 10.00, NULL, NULL, CURRENT_TIMESTAMP, TIMESTAMPADD(YEAR, 1, CURRENT_TIMESTAMP), 100, 0, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- Cupón 2: $5000 de descuento fijo
INSERT INTO cupones (id, codigo, descripcion, tipo_descuento, valor_descuento, monto_minimo, descuento_maximo, fecha_inicio, fecha_fin, usos_maximos, usos_actuales, activo, fecha_creacion, fecha_actualizacion) VALUES
(2, 'DESC5000', 'Descuento fijo de $5000 en compras mayores a $30000', 'FIJO', 5000.00, 30000.00, NULL, CURRENT_TIMESTAMP, TIMESTAMPADD(MONTH, 6, CURRENT_TIMESTAMP), 50, 0, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- Cupón 3: 15% de descuento con monto mínimo de $40000
INSERT INTO cupones (id, codigo, descripcion, tipo_descuento, valor_descuento, monto_minimo, descuento_maximo, fecha_inicio, fecha_fin, usos_maximos, usos_actuales, activo, fecha_creacion, fecha_actualizacion) VALUES
(3, 'SUPER15', '15% de descuento en compras mayores a $40000', 'PORCENTAJE', 15.00, 40000.00, NULL, CURRENT_TIMESTAMP, TIMESTAMPADD(MONTH, 3, CURRENT_TIMESTAMP), 30, 0, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- Cupón 4: 20% de descuento con límite máximo de $10000
INSERT INTO cupones (id, codigo, descripcion, tipo_descuento, valor_descuento, monto_minimo, descuento_maximo, fecha_inicio, fecha_fin, usos_maximos, usos_actuales, activo, fecha_creacion, fecha_actualizacion) VALUES
(4, 'MEGA20', '20% de descuento (máximo $10000)', 'PORCENTAJE', 20.00, NULL, 10000.00, CURRENT_TIMESTAMP, TIMESTAMPADD(MONTH, 2, CURRENT_TIMESTAMP), 20, 0, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- Cupón 5: $10000 de descuento para compras grandes
INSERT INTO cupones (id, codigo, descripcion, tipo_descuento, valor_descuento, monto_minimo, descuento_maximo, fecha_inicio, fecha_fin, usos_maximos, usos_actuales, activo, fecha_creacion, fecha_actualizacion) VALUES
(5, 'VIP10000', 'Descuento de $10000 en compras mayores a $80000', 'FIJO', 10000.00, 80000.00, NULL, CURRENT_TIMESTAMP, TIMESTAMPADD(YEAR, 1, CURRENT_TIMESTAMP), 10, 0, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);
