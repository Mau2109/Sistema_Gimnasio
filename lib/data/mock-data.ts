/**
 * Datos simulados para el sistema de gestión de gimnasio
 * En un entorno de producción, estos datos vendrían de una base de datos real
 */

import { Administrador, Miembro, Recepcionista } from "@/lib/types/usuario"
import { Entrenador, HorarioDisponible } from "@/lib/types/entrenador"
import { Clase, HorarioClase } from "@/lib/types/clase"
import { InscripcionClase } from "@/lib/types/inscripcion"

/**
 * Usuarios de ejemplo para el sistema
 */
export const usuariosEjemplo = {
  administradores: [
    new Administrador("admin_001", "Juan Carlos Administrador", "admin@gym.com", "+1234567890", "super"),
    new Administrador("admin_002", "Ana María Supervisora", "supervisor@gym.com", "+1234567891", "general"),
  ],

  recepcionistas: [
    new Recepcionista("recep_001", "María González Recepcionista", "recep@gym.com", "+1234567892", "mañana"),
    new Recepcionista("recep_002", "Carlos Pérez Recepcionista", "recep2@gym.com", "+1234567893", "tarde"),
  ],

  miembros: [
    new Miembro("miembro_001", "Carlos López Miembro", "miembro@gym.com", "+1234567894", "premium", 12),
    new Miembro("miembro_002", "Laura Martínez", "laura@email.com", "+1234567895", "basica", 6),
    new Miembro("miembro_003", "Roberto Silva", "roberto@email.com", "+1234567896", "vip", 24),
  ],
}

/**
 * Entrenadores de ejemplo
 */
export const entrenadoresEjemplo = [
  (() => {
    const entrenador = new Entrenador(
      "entrenador_001",
      "Ana García Fitness",
      "ana.garcia@gym.com",
      "+1234567897",
      ["Yoga", "Pilates", "Stretching"],
      5,
      50,
    )
    entrenador.agregarCertificacion("Certificación Internacional de Yoga")
    entrenador.agregarCertificacion("Instructor de Pilates Nivel 2")
    entrenador.agregarHorarioDisponible(new HorarioDisponible("lunes", "08:00", "12:00"))
    entrenador.agregarHorarioDisponible(new HorarioDisponible("miercoles", "08:00", "12:00"))
    entrenador.agregarHorarioDisponible(new HorarioDisponible("viernes", "08:00", "12:00"))
    return entrenador
  })(),

  (() => {
    const entrenador = new Entrenador(
      "entrenador_002",
      "Carlos López CrossFit",
      "carlos.lopez@gym.com",
      "+1234567898",
      ["CrossFit", "Functional Training", "HIIT"],
      8,
      60,
    )
    entrenador.agregarCertificacion("CrossFit Level 2 Trainer")
    entrenador.agregarCertificacion("Functional Movement Screen")
    entrenador.agregarHorarioDisponible(new HorarioDisponible("martes", "17:00", "21:00"))
    entrenador.agregarHorarioDisponible(new HorarioDisponible("jueves", "17:00", "21:00"))
    entrenador.agregarHorarioDisponible(new HorarioDisponible("sabado", "09:00", "13:00"))
    return entrenador
  })(),

  (() => {
    const entrenador = new Entrenador(
      "entrenador_003",
      "María Rodríguez Dance",
      "maria.rodriguez@gym.com",
      "+1234567899",
      ["Zumba", "Dance Fitness", "Aeróbicos"],
      6,
      45,
    )
    entrenador.agregarCertificacion("Zumba Instructor License")
    entrenador.agregarCertificacion("Aerobics Instructor Certification")
    entrenador.agregarHorarioDisponible(new HorarioDisponible("lunes", "18:00", "20:00"))
    entrenador.agregarHorarioDisponible(new HorarioDisponible("miercoles", "18:00", "20:00"))
    entrenador.agregarHorarioDisponible(new HorarioDisponible("viernes", "18:00", "20:00"))
    return entrenador
  })(),
]

/**
 * Clases de ejemplo
 */
export const clasesEjemplo = [
  (() => {
    const clase = new Clase(
      "clase_001",
      "Yoga Matutino",
      "Clase de yoga para comenzar el día con energía y relajación. Ideal para todos los niveles.",
      60,
      15,
      "principiante",
    )
    clase.agregarEquipo("Mat de yoga")
    clase.agregarEquipo("Bloques de yoga")
    return clase
  })(),

  (() => {
    const clase = new Clase(
      "clase_002",
      "CrossFit Intensivo",
      "Entrenamiento funcional de alta intensidad. Combina cardio, fuerza y resistencia.",
      45,
      12,
      "avanzado",
    )
    clase.agregarEquipo("Kettlebells")
    clase.agregarEquipo("Barras olímpicas")
    clase.agregarEquipo("Cajas de salto")
    return clase
  })(),

  (() => {
    const clase = new Clase(
      "clase_003",
      "Zumba Fitness",
      "Baile fitness divertido y energético. Quema calorías mientras te diviertes.",
      50,
      20,
      "intermedio",
    )
    clase.agregarEquipo("Sistema de sonido")
    return clase
  })(),

  (() => {
    const clase = new Clase(
      "clase_004",
      "Pilates Core",
      "Fortalecimiento del core y mejora de la postura a través del método Pilates.",
      55,
      10,
      "intermedio",
    )
    clase.agregarEquipo("Mat de pilates")
    clase.agregarEquipo("Pelotas de pilates")
    clase.agregarEquipo("Bandas elásticas")
    return clase
  })(),

  (() => {
    const clase = new Clase(
      "clase_005",
      "Spinning",
      "Ciclismo indoor con música motivadora. Excelente ejercicio cardiovascular.",
      45,
      16,
      "intermedio",
    )
    clase.agregarEquipo("Bicicletas estáticas")
    clase.agregarEquipo("Toallas")
    return clase
  })(),
]

/**
 * Horarios de clases de ejemplo
 */
export const horariosEjemplo = [
  // Yoga Matutino - Lunes, Miércoles, Viernes
  new HorarioClase("horario_001", "clase_001", "entrenador_001", new Date("2024-01-15"), "08:00", "09:00", "Salón A"),
  new HorarioClase("horario_002", "clase_001", "entrenador_001", new Date("2024-01-17"), "08:00", "09:00", "Salón A"),
  new HorarioClase("horario_003", "clase_001", "entrenador_001", new Date("2024-01-19"), "08:00", "09:00", "Salón A"),

  // CrossFit - Martes, Jueves, Sábado
  new HorarioClase(
    "horario_004",
    "clase_002",
    "entrenador_002",
    new Date("2024-01-16"),
    "18:00",
    "18:45",
    "Área Funcional",
  ),
  new HorarioClase(
    "horario_005",
    "clase_002",
    "entrenador_002",
    new Date("2024-01-18"),
    "18:00",
    "18:45",
    "Área Funcional",
  ),
  new HorarioClase(
    "horario_006",
    "clase_002",
    "entrenador_002",
    new Date("2024-01-20"),
    "10:00",
    "10:45",
    "Área Funcional",
  ),

  // Zumba - Lunes, Miércoles, Viernes
  new HorarioClase("horario_007", "clase_003", "entrenador_003", new Date("2024-01-15"), "19:00", "19:50", "Salón B"),
  new HorarioClase("horario_008", "clase_003", "entrenador_003", new Date("2024-01-17"), "19:00", "19:50", "Salón B"),
  new HorarioClase("horario_009", "clase_003", "entrenador_003", new Date("2024-01-19"), "19:00", "19:50", "Salón B"),
]

/**
 * Inscripciones de ejemplo
 */
export const inscripcionesEjemplo = [
  new InscripcionClase("inscripcion_001", "miembro_001", "horario_001", "Primera clase de yoga del miembro"),
  new InscripcionClase("inscripcion_002", "miembro_001", "horario_004", "Quiere probar CrossFit"),
  new InscripcionClase("inscripcion_003", "miembro_002", "horario_007", "Le encanta bailar"),
  new InscripcionClase("inscripcion_004", "miembro_003", "horario_001", "Miembro VIP - yoga matutino"),
]

/**
 * Función para obtener datos simulados completos del gimnasio
 */
export function obtenerDatosGimnasio() {
  return {
    usuarios: usuariosEjemplo,
    entrenadores: entrenadoresEjemplo,
    clases: clasesEjemplo,
    horarios: horariosEjemplo,
    inscripciones: inscripcionesEjemplo,
    estadisticas: {
      totalMiembros: usuariosEjemplo.miembros.length,
      totalEntrenadores: entrenadoresEjemplo.length,
      totalClases: clasesEjemplo.length,
      inscripcionesActivas: inscripcionesEjemplo.filter((i) => i.estado === "activa").length,
      ingresosMensual: 15750,
      crecimientoMensual: 8.5,
    },
  }
}

/**
 * Función para buscar miembros por diferentes criterios
 * @param termino - Término de búsqueda
 * @returns Array de miembros que coinciden con la búsqueda
 */
export function buscarMiembros(termino: string): Miembro[] {
  const terminoLower = termino.toLowerCase()
  return usuariosEjemplo.miembros.filter(
    (miembro) =>
      miembro.nombre.toLowerCase().includes(terminoLower) ||
      miembro.email.toLowerCase().includes(terminoLower) ||
      miembro.telefono.includes(termino),
  )
}

/**
 * Función para obtener clases disponibles en una fecha específica
 * @param fecha - Fecha para buscar clases
 * @returns Array de horarios de clases disponibles
 */
export function obtenerClasesDisponibles(fecha: Date): HorarioClase[] {
  return horariosEjemplo.filter((horario) => {
    const fechaClase = new Date(horario.fecha)
    return fechaClase.toDateString() === fecha.toDateString() && horario.estado === "programada"
  })
}

/**
 * Función para obtener el historial de un miembro específico
 * @param miembroId - ID del miembro
 * @returns Historial de inscripciones del miembro
 */
export function obtenerHistorialMiembro(miembroId: string): InscripcionClase[] {
  return inscripcionesEjemplo.filter((inscripcion) => inscripcion.miembroId === miembroId)
}
