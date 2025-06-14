-- =====================================================
-- SCRIPT DE INICIALIZACIÓN PARA DOCKER MYSQL
-- Sistema de Gestión de Gimnasio
-- Se ejecuta automáticamente al crear el contenedor
-- =====================================================

USE gym_management;

-- =====================================================
-- TABLA DE USUARIOS
-- =====================================================
CREATE TABLE usuarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    telefono VARCHAR(20),
    tipo ENUM('administrador', 'recepcionista', 'miembro') NOT NULL,
    activo BOOLEAN DEFAULT TRUE,
    fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_nacimiento DATE,
    
    -- Campos específicos para miembros
    tipo_membresia ENUM('basica', 'premium', 'vip') DEFAULT NULL,
    fecha_vencimiento_membresia DATE DEFAULT NULL,
    estado_membresia ENUM('activa', 'vencida', 'suspendida') DEFAULT NULL,
    
    -- Campos específicos para recepcionistas
    turno ENUM('mañana', 'tarde', 'noche') DEFAULT NULL,
    fecha_contratacion DATE DEFAULT NULL,
    
    -- Campos específicos para administradores
    nivel_acceso ENUM('super', 'general') DEFAULT NULL,
    
    INDEX idx_email (email),
    INDEX idx_tipo (tipo),
    INDEX idx_activo (activo)
) ENGINE=InnoDB;

-- =====================================================
-- TABLA DE ENTRENADORES
-- =====================================================
CREATE TABLE entrenadores (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    telefono VARCHAR(20),
    especialidades JSON COMMENT 'Array de especialidades del entrenador',
    certificaciones JSON COMMENT 'Array de certificaciones del entrenador',
    experiencia_anos INT DEFAULT 0,
    tarifa_hora DECIMAL(10,2) DEFAULT 0.00,
    activo BOOLEAN DEFAULT TRUE,
    fecha_contratacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    calificacion_promedio DECIMAL(3,2) DEFAULT 0.00,
    numero_clases_impartidas INT DEFAULT 0,
    
    INDEX idx_email (email),
    INDEX idx_activo (activo)
) ENGINE=InnoDB;

-- =====================================================
-- TABLA DE CLASES
-- =====================================================
CREATE TABLE clases (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    descripcion TEXT,
    duracion_minutos INT NOT NULL,
    capacidad_maxima INT NOT NULL,
    nivel ENUM('principiante', 'intermedio', 'avanzado') NOT NULL,
    equipo_necesario JSON COMMENT 'Array de equipos necesarios',
    activa BOOLEAN DEFAULT TRUE,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    INDEX idx_nombre (nombre),
    INDEX idx_nivel (nivel),
    INDEX idx_activa (activa)
) ENGINE=InnoDB;

-- =====================================================
-- TABLA DE HORARIOS DE CLASES
-- =====================================================
CREATE TABLE horarios_clases (
    id INT AUTO_INCREMENT PRIMARY KEY,
    clase_id INT NOT NULL,
    entrenador_id INT NOT NULL,
    fecha DATE NOT NULL,
    hora_inicio TIME NOT NULL,
    hora_fin TIME NOT NULL,
    salon VARCHAR(50),
    estado ENUM('programada', 'en_curso', 'completada', 'cancelada') DEFAULT 'programada',
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (clase_id) REFERENCES clases(id) ON DELETE CASCADE,
    FOREIGN KEY (entrenador_id) REFERENCES entrenadores(id) ON DELETE CASCADE,
    
    INDEX idx_fecha (fecha),
    INDEX idx_estado (estado),
    INDEX idx_entrenador_fecha (entrenador_id, fecha),
    UNIQUE KEY unique_entrenador_horario (entrenador_id, fecha, hora_inicio)
) ENGINE=InnoDB;

-- =====================================================
-- TABLA DE INSCRIPCIONES
-- =====================================================
CREATE TABLE inscripciones (
    id INT AUTO_INCREMENT PRIMARY KEY,
    miembro_id INT NOT NULL,
    horario_clase_id INT NOT NULL,
    fecha_inscripcion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    estado ENUM('activa', 'cancelada', 'completada', 'no_asistio') DEFAULT 'activa',
    observaciones TEXT,
    calificacion_clase INT CHECK (calificacion_clase >= 1 AND calificacion_clase <= 5),
    comentario_clase TEXT,
    fecha_cancelacion TIMESTAMP NULL,
    
    FOREIGN KEY (miembro_id) REFERENCES usuarios(id) ON DELETE CASCADE,
    FOREIGN KEY (horario_clase_id) REFERENCES horarios_clases(id) ON DELETE CASCADE,
    
    INDEX idx_miembro (miembro_id),
    INDEX idx_horario (horario_clase_id),
    INDEX idx_estado (estado),
    UNIQUE KEY unique_inscripcion (miembro_id, horario_clase_id)
) ENGINE=InnoDB;

-- =====================================================
-- TABLA DE ASIGNACIONES ENTRENADOR-MIEMBRO
-- =====================================================
CREATE TABLE asignaciones_entrenador (
    id INT AUTO_INCREMENT PRIMARY KEY,
    miembro_id INT NOT NULL,
    entrenador_id INT NOT NULL,
    fecha_asignacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_inicio DATE NOT NULL,
    fecha_fin DATE,
    activa BOOLEAN DEFAULT TRUE,
    notas TEXT,
    costo_sesion DECIMAL(10,2) DEFAULT 0.00,
    
    FOREIGN KEY (miembro_id) REFERENCES usuarios(id) ON DELETE CASCADE,
    FOREIGN KEY (entrenador_id) REFERENCES entrenadores(id) ON DELETE CASCADE,
    
    INDEX idx_miembro (miembro_id),
    INDEX idx_entrenador (entrenador_id),
    INDEX idx_activa (activa),
    INDEX idx_fechas (fecha_inicio, fecha_fin)
) ENGINE=InnoDB;

-- =====================================================
-- TABLA DE PROGRESO FÍSICO
-- =====================================================
CREATE TABLE progreso_fisico (
    id INT AUTO_INCREMENT PRIMARY KEY,
    miembro_id INT NOT NULL,
    fecha_medicion DATE NOT NULL,
    peso DECIMAL(5,2),
    altura DECIMAL(5,2),
    grasa_corporal DECIMAL(5,2),
    masa_muscular DECIMAL(5,2),
    imc DECIMAL(5,2),
    circunferencia_cintura DECIMAL(5,2),
    circunferencia_pecho DECIMAL(5,2),
    circunferencia_brazo DECIMAL(5,2),
    observaciones TEXT,
    
    FOREIGN KEY (miembro_id) REFERENCES usuarios(id) ON DELETE CASCADE,
    
    INDEX idx_miembro (miembro_id),
    INDEX idx_fecha (fecha_medicion),
    UNIQUE KEY unique_miembro_fecha (miembro_id, fecha_medicion)
) ENGINE=InnoDB;

-- =====================================================
-- TABLA DE PAGOS
-- =====================================================
CREATE TABLE pagos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    miembro_id INT NOT NULL,
    monto DECIMAL(10,2) NOT NULL,
    concepto VARCHAR(200) NOT NULL,
    metodo_pago ENUM('efectivo', 'tarjeta', 'transferencia', 'cheque') NOT NULL,
    fecha_pago TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    procesado_por INT COMMENT 'ID del recepcionista que procesó el pago',
    numero_recibo VARCHAR(50),
    estado ENUM('pendiente', 'completado', 'cancelado') DEFAULT 'completado',
    
    FOREIGN KEY (miembro_id) REFERENCES usuarios(id) ON DELETE CASCADE,
    FOREIGN KEY (procesado_por) REFERENCES usuarios(id) ON DELETE SET NULL,
    
    INDEX idx_miembro (miembro_id),
    INDEX idx_fecha (fecha_pago),
    INDEX idx_estado (estado),
    INDEX idx_recibo (numero_recibo)
) ENGINE=InnoDB;

-- =====================================================
-- TABLA DE SESIONES DE ENTRENAMIENTO
-- =====================================================
CREATE TABLE sesiones_entrenamiento (
    id INT AUTO_INCREMENT PRIMARY KEY,
    asignacion_id INT NOT NULL,
    fecha_sesion DATE NOT NULL,
    hora_inicio TIME NOT NULL,
    hora_fin TIME,
    estado ENUM('programada', 'completada', 'cancelada', 'no_asistio') DEFAULT 'programada',
    notas_entrenador TEXT,
    ejercicios_realizados JSON,
    calificacion_miembro INT CHECK (calificacion_miembro >= 1 AND calificacion_miembro <= 5),
    
    FOREIGN KEY (asignacion_id) REFERENCES asignaciones_entrenador(id) ON DELETE CASCADE,
    
    INDEX idx_asignacion (asignacion_id),
    INDEX idx_fecha (fecha_sesion),
    INDEX idx_estado (estado)
) ENGINE=InnoDB;

-- =====================================================
-- INSERTAR DATOS DE EJEMPLO
-- =====================================================

-- Usuarios de ejemplo
INSERT INTO usuarios (nombre, email, password, tipo, nivel_acceso) VALUES
('Juan Carlos Administrador', 'admin@gym.com', 'admin123', 'administrador', 'super'),
('Ana María Supervisora', 'supervisor@gym.com', 'super123', 'administrador', 'general');

INSERT INTO usuarios (nombre, email, password, tipo, turno, fecha_contratacion) VALUES
('María González Recepcionista', 'recep@gym.com', 'recep123', 'recepcionista', 'mañana', CURDATE()),
('Carlos Pérez Recepcionista', 'recep2@gym.com', 'recep456', 'recepcionista', 'tarde', CURDATE());

INSERT INTO usuarios (nombre, email, password, telefono, tipo, fecha_nacimiento, tipo_membresia, fecha_vencimiento_membresia, estado_membresia) VALUES
('Carlos López Miembro', 'miembro@gym.com', 'miembro123', '+1234567890', 'miembro', '1990-03-15', 'premium', DATE_ADD(CURDATE(), INTERVAL 12 MONTH), 'activa'),
('Laura Martínez', 'laura@email.com', 'laura123', '+1234567891', 'miembro', '1985-07-22', 'basica', DATE_ADD(CURDATE(), INTERVAL 6 MONTH), 'activa'),
('Roberto Silva', 'roberto@email.com', 'roberto123', '+1234567892', 'miembro', '1988-11-10', 'vip', DATE_ADD(CURDATE(), INTERVAL 24 MONTH), 'activa'),
('Ana García', 'ana.miembro@email.com', 'ana123', '+1234567893', 'miembro', '1992-05-18', 'premium', DATE_ADD(CURDATE(), INTERVAL 12 MONTH), 'activa'),
('Pedro Ramírez', 'pedro@email.com', 'pedro123', '+1234567894', 'miembro', '1987-09-03', 'basica', DATE_ADD(CURDATE(), INTERVAL 3 MONTH), 'activa');

-- Entrenadores de ejemplo
INSERT INTO entrenadores (nombre, email, telefono, especialidades, certificaciones, experiencia_anos, tarifa_hora) VALUES
('Ana García Fitness', 'ana.garcia@gym.com', '+1234567897', 
 JSON_ARRAY('Yoga', 'Pilates', 'Stretching', 'Meditación'), 
 JSON_ARRAY('Certificación Internacional de Yoga', 'Instructor de Pilates Nivel 2', 'Mindfulness Coach'), 
 5, 50.00),

('Carlos López CrossFit', 'carlos.lopez@gym.com', '+1234567898', 
 JSON_ARRAY('CrossFit', 'Functional Training', 'HIIT', 'Powerlifting'), 
 JSON_ARRAY('CrossFit Level 2 Trainer', 'Functional Movement Screen', 'Olympic Lifting Coach'), 
 8, 60.00),

('María Rodríguez Dance', 'maria.rodriguez@gym.com', '+1234567899', 
 JSON_ARRAY('Zumba', 'Dance Fitness', 'Aeróbicos', 'Baile Latino'), 
 JSON_ARRAY('Zumba Instructor License', 'Aerobics Instructor Certification', 'Latin Dance Specialist'), 
 6, 45.00),

('Diego Fernández Strength', 'diego.fernandez@gym.com', '+1234567800', 
 JSON_ARRAY('Musculación', 'Powerlifting', 'Bodybuilding', 'Nutrición Deportiva'), 
 JSON_ARRAY('Personal Trainer Certification', 'Nutrition Specialist', 'Strength & Conditioning Coach'), 
 10, 65.00);

-- Clases de ejemplo
INSERT INTO clases (nombre, descripcion, duracion_minutos, capacidad_maxima, nivel, equipo_necesario) VALUES
('Yoga Matutino', 'Clase de yoga para comenzar el día con energía y relajación. Ideal para todos los niveles.', 60, 15, 'principiante', 
 JSON_ARRAY('Mat de yoga', 'Bloques de yoga', 'Correas de yoga')),

('CrossFit Intensivo', 'Entrenamiento funcional de alta intensidad. Combina cardio, fuerza y resistencia.', 45, 12, 'avanzado', 
 JSON_ARRAY('Kettlebells', 'Barras olímpicas', 'Cajas de salto', 'Cuerdas de batalla')),

('Zumba Fitness', 'Baile fitness divertido y energético. Quema calorías mientras te diviertes bailando.', 50, 20, 'intermedio', 
 JSON_ARRAY('Sistema de sonido', 'Micrófono inalámbrico')),

('Pilates Core', 'Fortalecimiento del core y mejora de la postura a través del método Pilates.', 55, 10, 'intermedio', 
 JSON_ARRAY('Mat de pilates', 'Pelotas de pilates', 'Bandas elásticas', 'Magic Circle')),

('Spinning', 'Ciclismo indoor con música motivadora. Excelente ejercicio cardiovascular.', 45, 16, 'intermedio', 
 JSON_ARRAY('Bicicletas estáticas', 'Toallas', 'Botellas de agua')),

('Musculación Principiantes', 'Introducción al entrenamiento con pesas. Técnica y fundamentos básicos.', 60, 8, 'principiante', 
 JSON_ARRAY('Mancuernas', 'Barras', 'Máquinas de musculación', 'Bancos')),

('HIIT Cardio', 'Entrenamiento de intervalos de alta intensidad para quemar grasa rápidamente.', 30, 15, 'avanzado', 
 JSON_ARRAY('Cronómetro', 'Conos', 'Escalones', 'Cuerdas para saltar'));

-- Horarios de clases de ejemplo (próximos 7 días)
INSERT INTO horarios_clases (clase_id, entrenador_id, fecha, hora_inicio, hora_fin, salon) VALUES
-- Hoy
(1, 1, CURDATE(), '08:00:00', '09:00:00', 'Salón A'),
(3, 3, CURDATE(), '19:00:00', '19:50:00', 'Salón B'),
(5, 2, CURDATE(), '20:00:00', '20:45:00', 'Salón Spinning'),

-- Mañana
(2, 2, DATE_ADD(CURDATE(), INTERVAL 1 DAY), '18:00:00', '18:45:00', 'Área Funcional'),
(4, 1, DATE_ADD(CURDATE(), INTERVAL 1 DAY), '10:00:00', '10:55:00', 'Salón A'),
(6, 4, DATE_ADD(CURDATE(), INTERVAL 1 DAY), '16:00:00', '17:00:00', 'Área de Pesas'),

-- Pasado mañana
(1, 1, DATE_ADD(CURDATE(), INTERVAL 2 DAY), '08:00:00', '09:00:00', 'Salón A'),
(7, 2, DATE_ADD(CURDATE(), INTERVAL 2 DAY), '07:00:00', '07:30:00', 'Área Funcional'),
(3, 3, DATE_ADD(CURDATE(), INTERVAL 2 DAY), '19:00:00', '19:50:00', 'Salón B'),

-- Resto de la semana
(2, 2, DATE_ADD(CURDATE(), INTERVAL 3 DAY), '18:00:00', '18:45:00', 'Área Funcional'),
(4, 1, DATE_ADD(CURDATE(), INTERVAL 3 DAY), '10:00:00', '10:55:00', 'Salón A'),
(5, 2, DATE_ADD(CURDATE(), INTERVAL 4 DAY), '19:00:00', '19:45:00', 'Salón Spinning'),
(6, 4, DATE_ADD(CURDATE(), INTERVAL 5 DAY), '16:00:00', '17:00:00', 'Área de Pesas'),
(1, 1, DATE_ADD(CURDATE(), INTERVAL 6 DAY), '08:00:00', '09:00:00', 'Salón A');

-- Inscripciones de ejemplo
INSERT INTO inscripciones (miembro_id, horario_clase_id, observaciones) VALUES
(3, 1, 'Primera clase de yoga del miembro'),
(3, 4, 'Quiere probar CrossFit'),
(4, 3, 'Le encanta bailar'),
(5, 1, 'Miembro VIP - yoga matutino'),
(6, 5, 'Clase de pilates para mejorar postura'),
(7, 2, 'Entrenamiento intensivo');

-- Asignaciones entrenador-miembro de ejemplo
INSERT INTO asignaciones_entrenador (miembro_id, entrenador_id, fecha_inicio, fecha_fin, notas, costo_sesion) VALUES
(5, 4, CURDATE(), DATE_ADD(CURDATE(), INTERVAL 3 MONTH), 'Entrenamiento personalizado para ganar masa muscular', 65.00),
(3, 1, CURDATE(), DATE_ADD(CURDATE(), INTERVAL 2 MONTH), 'Sesiones de yoga y relajación personalizadas', 50.00),
(6, 2, DATE_ADD(CURDATE(), INTERVAL 1 DAY), DATE_ADD(CURDATE(), INTERVAL 4 MONTH), 'Preparación para competencia de CrossFit', 60.00);

-- Progreso físico de ejemplo
INSERT INTO progreso_fisico (miembro_id, fecha_medicion, peso, altura, grasa_corporal, masa_muscular, imc, circunferencia_cintura, circunferencia_pecho, circunferencia_brazo) VALUES
(3, DATE_SUB(CURDATE(), INTERVAL 90 DAY), 78.0, 175.0, 18.0, 42.0, 25.5, 85.0, 95.0, 32.0),
(3, DATE_SUB(CURDATE(), INTERVAL 60 DAY), 76.5, 175.0, 17.0, 43.0, 25.0, 83.0, 96.0, 32.5),
(3, DATE_SUB(CURDATE(), INTERVAL 30 DAY), 75.5, 175.0, 16.0, 44.0, 24.7, 81.0, 97.0, 33.0),
(3, CURDATE(), 75.0, 175.0, 15.0, 45.0, 24.5, 80.0, 98.0, 33.5),

(4, DATE_SUB(CURDATE(), INTERVAL 60 DAY), 65.0, 162.0, 22.0, 38.0, 24.8, 75.0, 88.0, 28.0),
(4, DATE_SUB(CURDATE(), INTERVAL 30 DAY), 64.0, 162.0, 21.0, 39.0, 24.4, 73.0, 89.0, 28.5),
(4, CURDATE(), 63.5, 162.0, 20.0, 40.0, 24.2, 72.0, 90.0, 29.0);

-- Pagos de ejemplo
INSERT INTO pagos (miembro_id, monto, concepto, metodo_pago, procesado_por, numero_recibo) VALUES
(3, 80.00, 'Mensualidad Premium - Marzo 2024', 'tarjeta', 3, 'REC-2024-001'),
(4, 50.00, 'Mensualidad Básica - Marzo 2024', 'efectivo', 3, 'REC-2024-002'),
(5, 120.00, 'Mensualidad VIP - Marzo 2024', 'transferencia', 4, 'REC-2024-003'),
(6, 80.00, 'Mensualidad Premium - Marzo 2024', 'tarjeta', 3, 'REC-2024-004'),
(7, 50.00, 'Mensualidad Básica - Marzo 2024', 'efectivo', 4, 'REC-2024-005'),
(3, 65.00, 'Sesión Personal con Diego', 'tarjeta', 3, 'REC-2024-006'),
(5, 50.00, 'Sesión Personal con Ana', 'efectivo', 4, 'REC-2024-007');

-- Sesiones de entrenamiento de ejemplo
INSERT INTO sesiones_entrenamiento (asignacion_id, fecha_sesion, hora_inicio, hora_fin, estado, notas_entrenador, ejercicios_realizados, calificacion_miembro) VALUES
(1, DATE_SUB(CURDATE(), INTERVAL 5 DAY), '16:00:00', '17:00:00', 'completada', 
 'Excelente progreso en técnica de sentadillas. Aumentar peso la próxima sesión.',
 JSON_ARRAY('Sentadillas 3x12', 'Press banca 3x10', 'Peso muerto 3x8', 'Plancha 3x30seg'),
 5),

(1, DATE_SUB(CURDATE(), INTERVAL 2 DAY), '16:00:00', '17:00:00', 'completada',
 'Buen trabajo en el press banca. Mejorar la técnica en peso muerto.',
 JSON_ARRAY('Press banca 3x12', 'Peso muerto 3x10', 'Dominadas asistidas 3x8', 'Abdominales 3x15'),
 4),

(2, DATE_SUB(CURDATE(), INTERVAL 3 DAY), '10:00:00', '11:00:00', 'completada',
 'Sesión de yoga muy relajante. Excelente flexibilidad y concentración.',
 JSON_ARRAY('Saludo al sol', 'Posturas de equilibrio', 'Respiración pranayama', 'Relajación final'),
 5);

-- =====================================================
-- VISTAS ÚTILES PARA REPORTES
-- =====================================================

-- Vista de miembros activos con información completa
CREATE VIEW vista_miembros_activos AS
SELECT 
    u.id,
    u.nombre,
    u.email,
    u.telefono,
    u.tipo_membresia,
    u.estado_membresia,
    u.fecha_vencimiento_membresia,
    DATEDIFF(u.fecha_vencimiento_membresia, CURDATE()) as dias_restantes,
    COUNT(DISTINCT i.id) as total_inscripciones,
    COUNT(DISTINCT ae.id) as entrenamientos_personales
FROM usuarios u
LEFT JOIN inscripciones i ON u.id = i.miembro_id AND i.estado = 'activa'
LEFT JOIN asignaciones_entrenador ae ON u.id = ae.miembro_id AND ae.activa = TRUE
WHERE u.tipo = 'miembro' AND u.activo = TRUE
GROUP BY u.id;

-- Vista de clases con información del entrenador
CREATE VIEW vista_clases_programadas AS
SELECT 
    hc.id,
    c.nombre as clase,
    c.descripcion,
    c.nivel,
    c.duracion_minutos,
    c.capacidad_maxima,
    e.nombre as entrenador,
    hc.fecha,
    hc.hora_inicio,
    hc.hora_fin,
    hc.salon,
    hc.estado,
    COUNT(i.id) as inscritos,
    (c.capacidad_maxima - COUNT(i.id)) as cupos_disponibles
FROM horarios_clases hc
JOIN clases c ON hc.clase_id = c.id
JOIN entrenadores e ON hc.entrenador_id = e.id
LEFT JOIN inscripciones i ON hc.id = i.horario_clase_id AND i.estado = 'activa'
WHERE hc.fecha >= CURDATE()
GROUP BY hc.id
ORDER BY hc.fecha, hc.hora_inicio;

-- Vista de ingresos mensuales
CREATE VIEW vista_ingresos_mensuales AS
SELECT 
    YEAR(fecha_pago) as año,
    MONTH(fecha_pago) as mes,
    MONTHNAME(fecha_pago) as nombre_mes,
    COUNT(*) as total_pagos,
    SUM(monto) as total_ingresos,
    AVG(monto) as promedio_pago
FROM pagos 
WHERE estado = 'completado'
GROUP BY YEAR(fecha_pago), MONTH(fecha_pago)
ORDER BY año DESC, mes DESC;

-- =====================================================
-- MENSAJE DE CONFIRMACIÓN
-- =====================================================
SELECT 
    'Base de datos inicializada exitosamente en Docker' as estado,
    'gym_management' as base_datos,
    'localhost:3307' as puerto_externo,
    'http://localhost:8080' as phpmyadmin_url,
    (SELECT COUNT(*) FROM usuarios) as usuarios_creados,
    (SELECT COUNT(*) FROM entrenadores) as entrenadores_creados,
    (SELECT COUNT(*) FROM clases) as clases_creadas,
    (SELECT COUNT(*) FROM horarios_clases) as horarios_programados;
