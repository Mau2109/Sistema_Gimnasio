/**
 * Tipos y clases relacionadas con los usuarios del sistema de gimnasio
 * Define la jerarquía de usuarios: Administrador, Miembro y Recepcionista
 */

/**
 * Tipos de usuario disponibles en el sistema
 */
export type TipoUsuario = "administrador" | "miembro" | "recepcionista"

/**
 * Interfaz base para todos los usuarios del sistema
 */
export interface IUsuario {
  id: string
  nombre: string
  email: string
  telefono: string
  fechaRegistro: Date
  activo: boolean
  tipo: TipoUsuario
}

/**
 * Clase base abstracta Usuario
 * Define las propiedades y métodos comunes para todos los tipos de usuario
 */
export abstract class Usuario implements IUsuario {
  public id: string
  public nombre: string
  public email: string
  public telefono: string
  public fechaRegistro: Date
  public activo: boolean
  public tipo: TipoUsuario

  /**
   * Constructor de la clase Usuario
   * @param id - Identificador único del usuario
   * @param nombre - Nombre completo del usuario
   * @param email - Correo electrónico del usuario
   * @param telefono - Número de teléfono del usuario
   * @param tipo - Tipo de usuario (administrador, miembro, recepcionista)
   */
  constructor(id: string, nombre: string, email: string, telefono: string, tipo: TipoUsuario) {
    this.id = id
    this.nombre = nombre
    this.email = email
    this.telefono = telefono
    this.tipo = tipo
    this.fechaRegistro = new Date()
    this.activo = true
  }

  /**
   * Método abstracto para obtener los permisos del usuario
   * Debe ser implementado por cada clase hija
   */
  abstract obtenerPermisos(): string[]

  /**
   * Activa el usuario en el sistema
   */
  activar(): void {
    this.activo = true
  }

  /**
   * Desactiva el usuario en el sistema
   */
  desactivar(): void {
    this.activo = false
  }

  /**
   * Actualiza la información básica del usuario
   * @param nombre - Nuevo nombre del usuario
   * @param telefono - Nuevo teléfono del usuario
   */
  actualizarInformacion(nombre: string, telefono: string): void {
    this.nombre = nombre
    this.telefono = telefono
  }

  /**
   * Convierte el usuario a un objeto plano para serialización
   */
  toJSON(): object {
    return {
      id: this.id,
      nombre: this.nombre,
      email: this.email,
      telefono: this.telefono,
      fechaRegistro: this.fechaRegistro,
      activo: this.activo,
      tipo: this.tipo,
    }
  }
}

/**
 * Clase Administrador
 * Usuario con permisos completos sobre el sistema
 */
export class Administrador extends Usuario {
  public nivelAcceso: "super" | "general"

  /**
   * Constructor de la clase Administrador
   * @param id - Identificador único del administrador
   * @param nombre - Nombre completo del administrador
   * @param email - Correo electrónico del administrador
   * @param telefono - Número de teléfono del administrador
   * @param nivelAcceso - Nivel de acceso del administrador
   */
  constructor(
    id: string,
    nombre: string,
    email: string,
    telefono: string,
    nivelAcceso: "super" | "general" = "general",
  ) {
    super(id, nombre, email, telefono, "administrador")
    this.nivelAcceso = nivelAcceso
  }

  /**
   * Obtiene todos los permisos disponibles para un administrador
   * @returns Array de permisos del administrador
   */
  obtenerPermisos(): string[] {
    const permisosBase = [
      "gestionar_usuarios",
      "gestionar_clases",
      "gestionar_entrenadores",
      "ver_reportes",
      "gestionar_pagos",
      "configurar_sistema",
    ]

    if (this.nivelAcceso === "super") {
      return [...permisosBase, "gestionar_administradores", "backup_sistema"]
    }

    return permisosBase
  }

  /**
   * Crea un nuevo usuario en el sistema
   * @param datosUsuario - Datos del nuevo usuario
   */
  crearUsuario(datosUsuario: Partial<IUsuario>): void {
    // Lógica para crear usuario
    console.log("Creando usuario:", datosUsuario)
  }

  /**
   * Genera reportes del sistema
   * @param tipoReporte - Tipo de reporte a generar
   */
  generarReporte(tipoReporte: string): void {
    console.log("Generando reporte:", tipoReporte)
  }
}

/**
 * Clase Miembro
 * Usuario que utiliza los servicios del gimnasio
 */
export class Miembro extends Usuario {
  public fechaVencimientoMembresia: Date
  public tipoMembresia: "basica" | "premium" | "vip"
  public estadoMembresia: "activa" | "vencida" | "suspendida"

  /**
   * Constructor de la clase Miembro
   * @param id - Identificador único del miembro
   * @param nombre - Nombre completo del miembro
   * @param email - Correo electrónico del miembro
   * @param telefono - Número de teléfono del miembro
   * @param tipoMembresia - Tipo de membresía del miembro
   * @param mesesMembresia - Duración de la membresía en meses
   */
  constructor(
    id: string,
    nombre: string,
    email: string,
    telefono: string,
    tipoMembresia: "basica" | "premium" | "vip" = "basica",
    mesesMembresia = 1,
  ) {
    super(id, nombre, email, telefono, "miembro")
    this.tipoMembresia = tipoMembresia
    this.fechaVencimientoMembresia = new Date()
    this.fechaVencimientoMembresia.setMonth(this.fechaVencimientoMembresia.getMonth() + mesesMembresia)
    this.estadoMembresia = "activa"
  }

  /**
   * Obtiene los permisos específicos de un miembro
   * @returns Array de permisos del miembro
   */
  obtenerPermisos(): string[] {
    const permisosBase = ["ver_clases", "inscribirse_clases", "ver_perfil", "actualizar_perfil"]

    if (this.tipoMembresia === "premium" || this.tipoMembresia === "vip") {
      permisosBase.push("acceso_premium")
    }

    if (this.tipoMembresia === "vip") {
      permisosBase.push("entrenador_personal", "acceso_vip")
    }

    return permisosBase
  }

  /**
   * Verifica si la membresía está vigente
   * @returns true si la membresía está activa y no ha vencido
   */
  esMembresiaVigente(): boolean {
    return this.estadoMembresia === "activa" && this.fechaVencimientoMembresia > new Date()
  }

  /**
   * Renueva la membresía del miembro
   * @param meses - Número de meses a renovar
   */
  renovarMembresia(meses: number): void {
    if (this.fechaVencimientoMembresia < new Date()) {
      this.fechaVencimientoMembresia = new Date()
    }
    this.fechaVencimientoMembresia.setMonth(this.fechaVencimientoMembresia.getMonth() + meses)
    this.estadoMembresia = "activa"
  }

  /**
   * Suspende la membresía del miembro
   */
  suspenderMembresia(): void {
    this.estadoMembresia = "suspendida"
  }
}

/**
 * Clase Recepcionista
 * Usuario encargado de la atención al cliente y tareas administrativas básicas
 */
export class Recepcionista extends Usuario {
  public turno: "mañana" | "tarde" | "noche"
  public fechaContratacion: Date

  /**
   * Constructor de la clase Recepcionista
   * @param id - Identificador único del recepcionista
   * @param nombre - Nombre completo del recepcionista
   * @param email - Correo electrónico del recepcionista
   * @param telefono - Número de teléfono del recepcionista
   * @param turno - Turno de trabajo del recepcionista
   */
  constructor(
    id: string,
    nombre: string,
    email: string,
    telefono: string,
    turno: "mañana" | "tarde" | "noche" = "mañana",
  ) {
    super(id, nombre, email, telefono, "recepcionista")
    this.turno = turno
    this.fechaContratacion = new Date()
  }

  /**
   * Obtiene los permisos específicos de un recepcionista
   * @returns Array de permisos del recepcionista
   */
  obtenerPermisos(): string[] {
    return [
      "gestionar_miembros",
      "procesar_pagos",
      "ver_clases",
      "inscribir_miembros_clases",
      "generar_reportes_basicos",
      "atender_consultas",
    ]
  }

  /**
   * Registra un nuevo miembro en el sistema
   * @param datosMiembro - Datos del nuevo miembro
   */
  registrarMiembro(datosMiembro: Partial<IUsuario>): void {
    console.log("Registrando nuevo miembro:", datosMiembro)
  }

  /**
   * Procesa el pago de una membresía
   * @param miembroId - ID del miembro
   * @param monto - Monto del pago
   * @param metodoPago - Método de pago utilizado
   */
  procesarPago(miembroId: string, monto: number, metodoPago: string): void {
    console.log(`Procesando pago de $${monto} para miembro ${miembroId} via ${metodoPago}`)
  }
}
