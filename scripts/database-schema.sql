-- Crear base de datos
CREATE DATABASE IF NOT EXISTS gym_management;
USE gym_management;

-- Tabla de usuarios (administradores, recepcionistas, miembros)
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
    tipo_membresia ENUM('basica', 'premium', 'vip') DEFAULT 'basica',
    fecha_vencimiento_membresia DATE,
    estado_membresia ENUM('activa', 'vencida', 'suspendida') DEFAULT 'activa',
    
    -- Campos específicos para recepcionistas
    turno ENUM('mañana', 'tarde', 'noche') DEFAULT 'mañana',
    fecha_contratacion DATE,
    
    -- Campos específicos para administradores
    nivel_acceso ENUM('super', 'general') DEFAULT 'general'
);

-- Tabla de entrenadores
CREATE TABLE entrenadores (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    telefono VARCHAR(20),
    especialidades JSON, -- Array de especialidades
    certificaciones JSON, -- Array de certificaciones
    experiencia_anos INT DEFAULT 0,
    tarifa_hora DECIMAL(10,2) DEFAULT 0.00,
    activo BOOLEAN DEFAULT TRUE,
    fecha_contratacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    calificacion_promedio DECIMAL(3,2) DEFAULT 0.00,
    numero_clases_impartidas INT DEFAULT 0
);

-- Tabla de clases/actividades
CREATE TABLE clases (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    descripcion TEXT,
    duracion_minutos INT NOT NULL,
    capacidad_maxima INT NOT NULL,
    nivel ENUM('principiante', 'intermedio', 'avanzado') NOT NULL,
    equipo_necesario JSON, -- Array de equipos necesarios
    activa BOOLEAN DEFAULT TRUE,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de horarios de clases
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
    
    -- Índice único para evitar conflictos de horario
    UNIQUE KEY unique_entrenador_horario (entrenador_id, fecha, hora_inicio)
);

-- Tabla de inscripciones a clases
CREATE TABLE inscripciones (
    id INT AUTO_INCREMENT PRIMARY KEY,
    miembro_id INT NOT NULL,
    horario_clase_id INT NOT NULL,
    fecha_inscripcion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    estado ENUM('activa', 'cancelada', 'completada', 'no_asistio') DEFAULT 'activa',
    observaciones TEXT,
    calificacion_clase INT CHECK (calificacion_clase >= 1 AND calificacion_clase <= 5),
    comentario_clase TEXT,
    
    FOREIGN KEY (miembro_id) REFERENCES usuarios(id) ON DELETE CASCADE,
    FOREIGN KEY (horario_clase_id) REFERENCES horarios_clases(id) ON DELETE CASCADE,
    
    -- Un miembro no puede inscribirse dos veces a la misma clase
    UNIQUE KEY unique_inscripcion (miembro_id, horario_clase_id)
);

-- Tabla de asignaciones entrenador-miembro (entrenamientos personales)
CREATE TABLE asignaciones_entrenador (
    id INT AUTO_INCREMENT PRIMARY KEY,
    miembro_id INT NOT NULL,
    entrenador_id INT NOT NULL,
    fecha_asignacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_inicio DATE NOT NULL,
    fecha_fin DATE,
    activa BOOLEAN DEFAULT TRUE,
    notas TEXT,
    
    FOREIGN KEY (miembro_id) REFERENCES usuarios(id) ON DELETE CASCADE,
    FOREIGN KEY (entrenador_id) REFERENCES entrenadores(id) ON DELETE CASCADE
);

-- Tabla de progreso físico de miembros
CREATE TABLE progreso_fisico (
    id INT AUTO_INCREMENT PRIMARY KEY,
    miembro_id INT NOT NULL,
    fecha_medicion DATE NOT NULL,
    peso DECIMAL(5,2),
    altura DECIMAL(5,2),
    grasa_corporal DECIMAL(5,2),
    masa_muscular DECIMAL(5,2),
    imc DECIMAL(5,2),
    observaciones TEXT,
    
    FOREIGN KEY (miembro_id) REFERENCES usuarios(id) ON DELETE CASCADE
);

-- Tabla de pagos
CREATE TABLE pagos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    miembro_id INT NOT NULL,
    monto DECIMAL(10,2) NOT NULL,
    concepto VARCHAR(200) NOT NULL,
    metodo_pago ENUM('efectivo', 'tarjeta', 'transferencia') NOT NULL,
    fecha_pago TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    procesado_por INT, -- ID del recepcionista que procesó el pago
    
    FOREIGN KEY (miembro_id) REFERENCES usuarios(id) ON DELETE CASCADE,
    FOREIGN KEY (procesado_por) REFERENCES usuarios(id) ON DELETE SET NULL
);

-- Insertar datos de ejemplo
INSERT INTO usuarios (nombre, email, password, tipo, nivel_acceso) VALUES
('Juan Carlos Admin', 'admin@gym.com', 'admin123', 'administrador', 'super'),
('María González Recep', 'recep@gym.com', 'recep123', 'recepcionista', NULL),
('Carlos López Miembro', 'miembro@gym.com', 'miembro123', 'miembro', NULL);

-- Actualizar campos específicos para el miembro
UPDATE usuarios SET 
    tipo_membresia = 'premium',
    fecha_vencimiento_membresia = DATE_ADD(CURDATE(), INTERVAL 12 MONTH),
    estado_membresia = 'activa'
WHERE email = 'miembro@gym.com';

-- Insertar entrenadores de ejemplo
INSERT INTO entrenadores (nombre, email, telefono, especialidades, certificaciones, experiencia_anos, tarifa_hora) VALUES
('Ana García Fitness', 'ana.garcia@gym.com', '+1234567897', 
 JSON_ARRAY('Yoga', 'Pilates', 'Stretching'), 
 JSON_ARRAY('Certificación Internacional de Yoga', 'Instructor de Pilates Nivel 2'), 
 5, 50.00),
('Carlos López CrossFit', 'carlos.lopez@gym.com', '+1234567898', 
 JSON_ARRAY('CrossFit', 'Functional Training', 'HIIT'), 
 JSON_ARRAY('CrossFit Level 2 Trainer', 'Functional Movement Screen'), 
 8, 60.00),
('María Rodríguez Dance', 'maria.rodriguez@gym.com', '+1234567899', 
 JSON_ARRAY('Zumba', 'Dance Fitness', 'Aeróbicos'), 
 JSON_ARRAY('Zumba Instructor License', 'Aerobics Instructor Certification'), 
 6, 45.00);

-- Insertar clases de ejemplo
INSERT INTO clases (nombre, descripcion, duracion_minutos, capacidad_maxima, nivel, equipo_necesario) VALUES
('Yoga Matutino', 'Clase de yoga para comenzar el día con energía y relajación', 60, 15, 'principiante', 
 JSON_ARRAY('Mat de yoga', 'Bloques de yoga')),
('CrossFit Intensivo', 'Entrenamiento funcional de alta intensidad', 45, 12, 'avanzado', 
 JSON_ARRAY('Kettlebells', 'Barras olímpicas', 'Cajas de salto')),
('Zumba Fitness', 'Baile fitness divertido y energético', 50, 20, 'intermedio', 
 JSON_ARRAY('Sistema de sonido')),
('Pilates Core', 'Fortalecimiento del core y mejora de la postura', 55, 10, 'intermedio', 
 JSON_ARRAY('Mat de pilates', 'Pelotas de pilates', 'Bandas elásticas')),
('Spinning', 'Ciclismo indoor con música motivadora', 45, 16, 'intermedio', 
 JSON_ARRAY('Bicicletas estáticas', 'Toallas'));

-- Insertar horarios de clases de ejemplo
INSERT INTO horarios_clases (clase_id, entrenador_id, fecha, hora_inicio, hora_fin, salon) VALUES
(1, 1, CURDATE(), '08:00:00', '09:00:00', 'Salón A'),
(1, 1, DATE_ADD(CURDATE(), INTERVAL 2 DAY), '08:00:00', '09:00:00', 'Salón A'),
(2, 2, DATE_ADD(CURDATE(), INTERVAL 1 DAY), '18:00:00', '18:45:00', 'Área Funcional'),
(3, 3, CURDATE(), '19:00:00', '19:50:00', 'Salón B'),
(4, 1, DATE_ADD(CURDATE(), INTERVAL 3 DAY), '10:00:00', '10:55:00', 'Salón A'),
(5, 2, DATE_ADD(CURDATE(), INTERVAL 4 DAY), '19:00:00', '19:45:00', 'Salón Spinning');

-- Insertar progreso físico de ejemplo
INSERT INTO progreso_fisico (miembro_id, fecha_medicion, peso, altura, grasa_corporal, masa_muscular, imc) VALUES
(3, DATE_SUB(CURDATE(), INTERVAL 60 DAY), 78.0, 175.0, 18.0, 42.0, 25.5),
(3, DATE_SUB(CURDATE(), INTERVAL 30 DAY), 76.0, 175.0, 16.5, 43.0, 24.8),
(3, CURDATE(), 75.0, 175.0, 15.0, 45.0, 24.5);

SELECT 'Base de datos configurada exitosamente' as resultado;
