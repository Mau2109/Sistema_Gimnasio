/**
 * Tipos y clases relacionadas con las clases del gimnasio
 * Define la estructura de las clases, horarios e inscripciones
 */

/**
 * Interfaz para definir una clase del gimnasio
 */
export interface IClase {
  id: string
  nombre: string
  descripcion: string
  duracion: number // en minutos
  capacidadMaxima: number
  nivel: "principiante" | "intermedio" | "avanzado"
  activa: boolean
}

/**
 * Clase que representa una clase/actividad del gimnasio
 */
export class Clase implements IClase {
  public id: string
  public nombre: string
  public descripcion: string
  public duracion: number
  public capacidadMaxima: number
  public nivel: "principiante" | "intermedio" | "avanzado"
  public activa: boolean
  public equipoNecesario: string[]
  public fechaCreacion: Date

  /**
   * Constructor de la clase Clase
   * @param id - Identificador único de la clase
   * @param nombre - Nombre de la clase
   * @param descripcion - Descripción detallada de la clase
   * @param duracion - Duración en minutos
   * @param capacidadMaxima - Número máximo de participantes
   * @param nivel - Nivel de dificultad de la clase
   */
  constructor(
    id: string,
    nombre: string,
    descripcion: string,
    duracion: number,
    capacidadMaxima: number,
    nivel: "principiante" | "intermedio" | "avanzado",
  ) {
    this.id = id
    this.nombre = nombre
    this.descripcion = descripcion
    this.duracion = duracion
    this.capacidadMaxima = capacidadMaxima
    this.nivel = nivel
    this.activa = true
    this.equipoNecesario = []
    this.fechaCreacion = new Date()
  }

  /**
   * Activa la clase para que esté disponible
   */
  activar(): void {
    this.activa = true
  }

  /**
   * Desactiva la clase
   */
  desactivar(): void {
    this.activa = false
  }

  /**
   * Actualiza la información de la clase
   * @param datos - Nuevos datos de la clase
   */
  actualizar(datos: Partial<IClase>): void {
    Object.assign(this, datos)
  }

  /**
   * Agrega equipo necesario para la clase
   * @param equipo - Nombre del equipo
   */
  agregarEquipo(equipo: string): void {
    if (!this.equipoNecesario.includes(equipo)) {
      this.equipoNecesario.push(equipo)
    }
  }

  /**
   * Remueve equipo de la lista de necesarios
   * @param equipo - Nombre del equipo a remover
   */
  removerEquipo(equipo: string): void {
    this.equipoNecesario = this.equipoNecesario.filter((e) => e !== equipo)
  }

  /**
   * Convierte la clase a objeto plano
   */
  toJSON(): object {
    return {
      id: this.id,
      nombre: this.nombre,
      descripcion: this.descripcion,
      duracion: this.duracion,
      capacidadMaxima: this.capacidadMaxima,
      nivel: this.nivel,
      activa: this.activa,
      equipoNecesario: this.equipoNecesario,
      fechaCreacion: this.fechaCreacion,
    }
  }
}

/**
 * Clase que representa un horario específico de una clase
 */
export class HorarioClase {
  public id: string
  public claseId: string
  public entrenadorId: string
  public fecha: Date
  public horaInicio: string
  public horaFin: string
  public salon: string
  public inscripciones: string[] // IDs de miembros inscritos
  public estado: "programada" | "en_curso" | "completada" | "cancelada"

  /**
   * Constructor de HorarioClase
   * @param id - Identificador único del horario
   * @param claseId - ID de la clase asociada
   * @param entrenadorId - ID del entrenador asignado
   * @param fecha - Fecha de la clase
   * @param horaInicio - Hora de inicio (formato HH:MM)
   * @param horaFin - Hora de fin (formato HH:MM)
   * @param salon - Salón donde se realizará la clase
   */
  constructor(
    id: string,
    claseId: string,
    entrenadorId: string,
    fecha: Date,
    horaInicio: string,
    horaFin: string,
    salon: string,
  ) {
    this.id = id
    this.claseId = claseId
    this.entrenadorId = entrenadorId
    this.fecha = fecha
    this.horaInicio = horaInicio
    this.horaFin = horaFin
    this.salon = salon
    this.inscripciones = []
    this.estado = "programada"
  }

  /**
   * Verifica si hay cupo disponible
   * @param capacidadMaxima - Capacidad máxima de la clase
   */
  tieneCupoDisponible(capacidadMaxima: number): boolean {
    return this.inscripciones.length < capacidadMaxima
  }

  /**
   * Agrega una inscripción al horario
   * @param miembroId - ID del miembro a inscribir
   * @param capacidadMaxima - Capacidad máxima de la clase
   */
  agregarInscripcion(miembroId: string, capacidadMaxima: number): boolean {
    if (this.tieneCupoDisponible(capacidadMaxima) && !this.inscripciones.includes(miembroId)) {
      this.inscripciones.push(miembroId)
      return true
    }
    return false
  }

  /**
   * Remueve una inscripción del horario
   * @param miembroId - ID del miembro a desinscribir
   */
  removerInscripcion(miembroId: string): boolean {
    const index = this.inscripciones.indexOf(miembroId)
    if (index > -1) {
      this.inscripciones.splice(index, 1)
      return true
    }
    return false
  }

  /**
   * Marca la clase como iniciada
   */
  iniciarClase(): void {
    this.estado = "en_curso"
  }

  /**
   * Marca la clase como completada
   */
  completarClase(): void {
    this.estado = "completada"
  }

  /**
   * Cancela la clase
   */
  cancelarClase(): void {
    this.estado = "cancelada"
  }
}
