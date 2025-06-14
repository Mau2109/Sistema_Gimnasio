/**
 * Tipos y clases relacionadas con las inscripciones a clases del gimnasio
 * Maneja el proceso de inscripción de miembros a clases específicas
 */

/**
 * Estados posibles de una inscripción
 */
export type EstadoInscripcion = "activa" | "cancelada" | "completada" | "no_asistio"

/**
 * Interfaz para definir una inscripción
 */
export interface IInscripcionClase {
  id: string
  miembroId: string
  horarioClaseId: string
  fechaInscripcion: Date
  estado: EstadoInscripcion
  observaciones?: string
}

/**
 * Clase que representa una inscripción de un miembro a una clase específica
 */
export class InscripcionClase implements IInscripcionClase {
  public id: string
  public miembroId: string
  public horarioClaseId: string
  public fechaInscripcion: Date
  public estado: EstadoInscripcion
  public observaciones?: string
  public fechaCancelacion?: Date
  public motivoCancelacion?: string
  public calificacionClase?: number
  public comentarioClase?: string

  /**
   * Constructor de la clase InscripcionClase
   * @param id - Identificador único de la inscripción
   * @param miembroId - ID del miembro inscrito
   * @param horarioClaseId - ID del horario de clase
   * @param observaciones - Observaciones adicionales (opcional)
   */
  constructor(id: string, miembroId: string, horarioClaseId: string, observaciones?: string) {
    this.id = id
    this.miembroId = miembroId
    this.horarioClaseId = horarioClaseId
    this.fechaInscripcion = new Date()
    this.estado = "activa"
    this.observaciones = observaciones
  }

  /**
   * Cancela la inscripción
   * @param motivo - Motivo de la cancelación
   */
  cancelar(motivo?: string): void {
    this.estado = "cancelada"
    this.fechaCancelacion = new Date()
    this.motivoCancelacion = motivo
  }

  /**
   * Marca la inscripción como completada (el miembro asistió)
   */
  marcarComoCompletada(): void {
    this.estado = "completada"
  }

  /**
   * Marca que el miembro no asistió a la clase
   */
  marcarNoAsistio(): void {
    this.estado = "no_asistio"
  }

  /**
   * Agrega una calificación y comentario sobre la clase
   * @param calificacion - Calificación de 1 a 5
   * @param comentario - Comentario opcional sobre la clase
   */
  calificarClase(calificacion: number, comentario?: string): void {
    if (this.estado === "completada") {
      this.calificacionClase = Math.max(1, Math.min(5, calificacion)) // Asegurar que esté entre 1 y 5
      this.comentarioClase = comentario
    }
  }

  /**
   * Actualiza las observaciones de la inscripción
   * @param observaciones - Nuevas observaciones
   */
  actualizarObservaciones(observaciones: string): void {
    this.observaciones = observaciones
  }

  /**
   * Verifica si la inscripción puede ser cancelada
   * @param horasAnticipacion - Horas mínimas de anticipación requeridas
   */
  puedeSerCancelada(horasAnticipacion = 2): boolean {
    if (this.estado !== "activa") {
      return false
    }

    const ahora = new Date()
    const tiempoLimite = new Date(ahora.getTime() + horasAnticipacion * 60 * 60 * 1000)

    // Aquí se debería comparar con la fecha/hora de la clase
    // Por simplicidad, asumimos que siempre se puede cancelar si está activa
    return true
  }

  /**
   * Obtiene el tiempo transcurrido desde la inscripción
   */
  getTiempoTranscurrido(): number {
    const ahora = new Date()
    return ahora.getTime() - this.fechaInscripcion.getTime()
  }

  /**
   * Convierte la inscripción a objeto plano
   */
  toJSON(): object {
    return {
      id: this.id,
      miembroId: this.miembroId,
      horarioClaseId: this.horarioClaseId,
      fechaInscripcion: this.fechaInscripcion,
      estado: this.estado,
      observaciones: this.observaciones,
      fechaCancelacion: this.fechaCancelacion,
      motivoCancelacion: this.motivoCancelacion,
      calificacionClase: this.calificacionClase,
      comentarioClase: this.comentarioClase,
    }
  }
}

/**
 * Clase para gestionar múltiples inscripciones
 */
export class GestorInscripciones {
  private inscripciones: Map<string, InscripcionClase>

  constructor() {
    this.inscripciones = new Map()
  }

  /**
   * Crea una nueva inscripción
   * @param miembroId - ID del miembro
   * @param horarioClaseId - ID del horario de clase
   * @param observaciones - Observaciones opcionales
   */
  crearInscripcion(miembroId: string, horarioClaseId: string, observaciones?: string): InscripcionClase {
    const id = this.generarId()
    const inscripcion = new InscripcionClase(id, miembroId, horarioClaseId, observaciones)
    this.inscripciones.set(id, inscripcion)
    return inscripcion
  }

  /**
   * Obtiene una inscripción por su ID
   * @param id - ID de la inscripción
   */
  obtenerInscripcion(id: string): InscripcionClase | undefined {
    return this.inscripciones.get(id)
  }

  /**
   * Obtiene todas las inscripciones de un miembro
   * @param miembroId - ID del miembro
   */
  obtenerInscripcionesPorMiembro(miembroId: string): InscripcionClase[] {
    return Array.from(this.inscripciones.values()).filter((inscripcion) => inscripcion.miembroId === miembroId)
  }

  /**
   * Obtiene todas las inscripciones para un horario de clase
   * @param horarioClaseId - ID del horario de clase
   */
  obtenerInscripcionesPorHorario(horarioClaseId: string): InscripcionClase[] {
    return Array.from(this.inscripciones.values()).filter(
      (inscripcion) => inscripcion.horarioClaseId === horarioClaseId,
    )
  }

  /**
   * Obtiene inscripciones por estado
   * @param estado - Estado de las inscripciones a buscar
   */
  obtenerInscripcionesPorEstado(estado: EstadoInscripcion): InscripcionClase[] {
    return Array.from(this.inscripciones.values()).filter((inscripcion) => inscripcion.estado === estado)
  }

  /**
   * Cancela una inscripción
   * @param id - ID de la inscripción
   * @param motivo - Motivo de la cancelación
   */
  cancelarInscripcion(id: string, motivo?: string): boolean {
    const inscripcion = this.inscripciones.get(id)
    if (inscripcion && inscripcion.puedeSerCancelada()) {
      inscripcion.cancelar(motivo)
      return true
    }
    return false
  }

  /**
   * Genera un ID único para las inscripciones
   */
  private generarId(): string {
    return `inscripcion_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  }

  /**
   * Obtiene estadísticas de inscripciones
   */
  obtenerEstadisticas(): {
    total: number
    activas: number
    completadas: number
    canceladas: number
    noAsistieron: number
  } {
    const inscripcionesArray = Array.from(this.inscripciones.values())

    return {
      total: inscripcionesArray.length,
      activas: inscripcionesArray.filter((i) => i.estado === "activa").length,
      completadas: inscripcionesArray.filter((i) => i.estado === "completada").length,
      canceladas: inscripcionesArray.filter((i) => i.estado === "cancelada").length,
      noAsistieron: inscripcionesArray.filter((i) => i.estado === "no_asistio").length,
    }
  }
}
