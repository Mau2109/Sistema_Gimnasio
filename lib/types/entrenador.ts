/**
 * Tipos y clases relacionadas con los entrenadores del gimnasio
 * Define la estructura y funcionalidades de los entrenadores
 */

/**
 * Interfaz para definir un entrenador
 */
export interface IEntrenador {
  id: string
  nombre: string
  email: string
  telefono: string
  especialidades: string[]
  certificaciones: string[]
  experiencia: number // años de experiencia
  activo: boolean
}

/**
 * Clase que representa un entrenador del gimnasio
 */
export class Entrenador implements IEntrenador {
  public id: string
  public nombre: string
  public email: string
  public telefono: string
  public especialidades: string[]
  public certificaciones: string[]
  public experiencia: number
  public activo: boolean
  public fechaContratacion: Date
  public horarioDisponible: HorarioDisponible[]
  public tarifaHora: number
  public calificacionPromedio: number
  public numeroClasesImpartidas: number

  /**
   * Constructor de la clase Entrenador
   * @param id - Identificador único del entrenador
   * @param nombre - Nombre completo del entrenador
   * @param email - Correo electrónico del entrenador
   * @param telefono - Número de teléfono del entrenador
   * @param especialidades - Array de especialidades del entrenador
   * @param experiencia - Años de experiencia
   * @param tarifaHora - Tarifa por hora del entrenador
   */
  constructor(
    id: string,
    nombre: string,
    email: string,
    telefono: string,
    especialidades: string[],
    experiencia: number,
    tarifaHora = 0,
  ) {
    this.id = id
    this.nombre = nombre
    this.email = email
    this.telefono = telefono
    this.especialidades = especialidades
    this.certificaciones = []
    this.experiencia = experiencia
    this.activo = true
    this.fechaContratacion = new Date()
    this.horarioDisponible = []
    this.tarifaHora = tarifaHora
    this.calificacionPromedio = 0
    this.numeroClasesImpartidas = 0
  }

  /**
   * Activa el entrenador en el sistema
   */
  activar(): void {
    this.activo = true
  }

  /**
   * Desactiva el entrenador en el sistema
   */
  desactivar(): void {
    this.activo = false
  }

  /**
   * Agrega una especialidad al entrenador
   * @param especialidad - Nueva especialidad
   */
  agregarEspecialidad(especialidad: string): void {
    if (!this.especialidades.includes(especialidad)) {
      this.especialidades.push(especialidad)
    }
  }

  /**
   * Remueve una especialidad del entrenador
   * @param especialidad - Especialidad a remover
   */
  removerEspecialidad(especialidad: string): void {
    this.especialidades = this.especialidades.filter((e) => e !== especialidad)
  }

  /**
   * Agrega una certificación al entrenador
   * @param certificacion - Nueva certificación
   */
  agregarCertificacion(certificacion: string): void {
    if (!this.certificaciones.includes(certificacion)) {
      this.certificaciones.push(certificacion)
    }
  }

  /**
   * Verifica si el entrenador tiene una especialidad específica
   * @param especialidad - Especialidad a verificar
   */
  tieneEspecialidad(especialidad: string): boolean {
    return this.especialidades.includes(especialidad)
  }

  /**
   * Actualiza la información básica del entrenador
   * @param datos - Nuevos datos del entrenador
   */
  actualizarInformacion(datos: Partial<IEntrenador>): void {
    Object.assign(this, datos)
  }

  /**
   * Agrega horario disponible para el entrenador
   * @param horario - Nuevo horario disponible
   */
  agregarHorarioDisponible(horario: HorarioDisponible): void {
    this.horarioDisponible.push(horario)
  }

  /**
   * Verifica si el entrenador está disponible en un horario específico
   * @param dia - Día de la semana
   * @param hora - Hora específica
   */
  estaDisponible(dia: DiaSemana, hora: string): boolean {
    return this.horarioDisponible.some((h) => h.dia === dia && h.horaInicio <= hora && h.horaFin >= hora)
  }

  /**
   * Incrementa el contador de clases impartidas
   */
  incrementarClasesImpartidas(): void {
    this.numeroClasesImpartidas++
  }

  /**
   * Actualiza la calificación promedio del entrenador
   * @param nuevaCalificacion - Nueva calificación recibida
   */
  actualizarCalificacion(nuevaCalificacion: number): void {
    // Lógica simplificada para actualizar promedio
    const totalCalificaciones = this.numeroClasesImpartidas
    this.calificacionPromedio =
      (this.calificacionPromedio * (totalCalificaciones - 1) + nuevaCalificacion) / totalCalificaciones
  }

  /**
   * Convierte el entrenador a objeto plano
   */
  toJSON(): object {
    return {
      id: this.id,
      nombre: this.nombre,
      email: this.email,
      telefono: this.telefono,
      especialidades: this.especialidades,
      certificaciones: this.certificaciones,
      experiencia: this.experiencia,
      activo: this.activo,
      fechaContratacion: this.fechaContratacion,
      tarifaHora: this.tarifaHora,
      calificacionPromedio: this.calificacionPromedio,
      numeroClasesImpartidas: this.numeroClasesImpartidas,
    }
  }
}

/**
 * Tipo para los días de la semana
 */
export type DiaSemana = "lunes" | "martes" | "miercoles" | "jueves" | "viernes" | "sabado" | "domingo"

/**
 * Clase para definir horarios disponibles de los entrenadores
 */
export class HorarioDisponible {
  public dia: DiaSemana
  public horaInicio: string
  public horaFin: string

  /**
   * Constructor de HorarioDisponible
   * @param dia - Día de la semana
   * @param horaInicio - Hora de inicio (formato HH:MM)
   * @param horaFin - Hora de fin (formato HH:MM)
   */
  constructor(dia: DiaSemana, horaInicio: string, horaFin: string) {
    this.dia = dia
    this.horaInicio = horaInicio
    this.horaFin = horaFin
  }

  /**
   * Verifica si una hora específica está dentro del rango
   * @param hora - Hora a verificar (formato HH:MM)
   */
  incluyeHora(hora: string): boolean {
    return hora >= this.horaInicio && hora <= this.horaFin
  }
}
