/**
 * Servicio de autenticación para el sistema de gestión de gimnasio
 * Maneja el login, logout y validación de usuarios
 */

import { type Usuario, Administrador, Miembro, Recepcionista, type TipoUsuario } from "@/lib/types/usuario"

/**
 * Interfaz para las credenciales de login
 */
interface LoginCredentials {
  email: string
  password: string
  tipo: TipoUsuario
}

/**
 * Servicio de autenticación
 * En un entorno de producción, este servicio se conectaría a una base de datos real
 * y utilizaría métodos de autenticación seguros como JWT, OAuth, etc.
 */
export class AuthService {
  private usuarios: Map<string, { usuario: Usuario; password: string }>

  constructor() {
    this.usuarios = new Map()
    this.inicializarUsuariosPrueba()
  }

  /**
   * Inicializa usuarios de prueba para demostración
   * En producción, estos datos vendrían de una base de datos
   */
  private inicializarUsuariosPrueba(): void {
    // Administrador de prueba
    const admin = new Administrador("admin_001", "Juan Carlos Administrador", "admin@gym.com", "+1234567890", "super")
    this.usuarios.set("admin@gym.com", { usuario: admin, password: "admin123" })

    // Recepcionista de prueba
    const recepcionista = new Recepcionista(
      "recep_001",
      "María González Recepcionista",
      "recep@gym.com",
      "+1234567891",
      "mañana",
    )
    this.usuarios.set("recep@gym.com", { usuario: recepcionista, password: "recep123" })

    // Miembro de prueba
    const miembro = new Miembro("miembro_001", "Carlos López Miembro", "miembro@gym.com", "+1234567892", "premium", 12)
    this.usuarios.set("miembro@gym.com", { usuario: miembro, password: "miembro123" })
  }

  /**
   * Autentica un usuario con email, contraseña y tipo
   * @param email - Email del usuario
   * @param password - Contraseña del usuario
   * @param tipo - Tipo de usuario esperado
   * @returns Promise con el usuario autenticado o null si falla
   */
  async login(email: string, password: string, tipo: TipoUsuario): Promise<Usuario | null> {
    try {
      // Simular delay de red
      await new Promise((resolve) => setTimeout(resolve, 1000))

      const userData = this.usuarios.get(email)

      if (!userData) {
        throw new Error("Usuario no encontrado")
      }

      if (userData.password !== password) {
        throw new Error("Contraseña incorrecta")
      }

      if (userData.usuario.tipo !== tipo) {
        throw new Error("Tipo de usuario incorrecto")
      }

      if (!userData.usuario.activo) {
        throw new Error("Usuario inactivo")
      }

      return userData.usuario
    } catch (error) {
      console.error("Error en login:", error)
      return null
    }
  }

  /**
   * Cierra la sesión del usuario
   * En producción, esto invalidaría tokens JWT o sesiones en el servidor
   */
  async logout(): Promise<void> {
    try {
      // Limpiar datos de sesión del localStorage
      if (typeof window !== "undefined") {
        localStorage.removeItem("usuario")
        localStorage.removeItem("token")
      }
    } catch (error) {
      console.error("Error en logout:", error)
    }
  }

  /**
   * Verifica si un usuario está autenticado
   * @returns Usuario actual o null si no está autenticado
   */
  getCurrentUser(): Usuario | null {
    try {
      if (typeof window === "undefined") return null

      const userData = localStorage.getItem("usuario")
      if (!userData) return null

      const parsedUser = JSON.parse(userData)

      // Recrear la instancia de usuario según su tipo
      switch (parsedUser.tipo) {
        case "administrador":
          return Object.assign(new Administrador("", "", "", ""), parsedUser)
        case "recepcionista":
          return Object.assign(new Recepcionista("", "", "", ""), parsedUser)
        case "miembro":
          return Object.assign(new Miembro("", "", "", ""), parsedUser)
        default:
          return null
      }
    } catch (error) {
      console.error("Error obteniendo usuario actual:", error)
      return null
    }
  }

  /**
   * Verifica si el usuario actual tiene un permiso específico
   * @param permiso - Permiso a verificar
   * @returns true si el usuario tiene el permiso
   */
  tienePermiso(permiso: string): boolean {
    const usuario = this.getCurrentUser()
    if (!usuario) return false

    return usuario.obtenerPermisos().includes(permiso)
  }

  /**
   * Registra un nuevo usuario (solo para administradores)
   * @param datosUsuario - Datos del nuevo usuario
   * @param password - Contraseña del nuevo usuario
   * @returns Usuario creado o null si falla
   */
  async registrarUsuario(
    datosUsuario: {
      nombre: string
      email: string
      telefono: string
      tipo: TipoUsuario
    },
    password: string,
  ): Promise<Usuario | null> {
    try {
      // Verificar que el usuario actual sea administrador
      const usuarioActual = this.getCurrentUser()
      if (!usuarioActual || usuarioActual.tipo !== "administrador") {
        throw new Error("Solo los administradores pueden registrar usuarios")
      }

      // Verificar que el email no esté en uso
      if (this.usuarios.has(datosUsuario.email)) {
        throw new Error("El email ya está en uso")
      }

      // Crear el nuevo usuario según su tipo
      let nuevoUsuario: Usuario
      const id = `${datosUsuario.tipo}_${Date.now()}`

      switch (datosUsuario.tipo) {
        case "administrador":
          nuevoUsuario = new Administrador(id, datosUsuario.nombre, datosUsuario.email, datosUsuario.telefono)
          break
        case "recepcionista":
          nuevoUsuario = new Recepcionista(id, datosUsuario.nombre, datosUsuario.email, datosUsuario.telefono)
          break
        case "miembro":
          nuevoUsuario = new Miembro(id, datosUsuario.nombre, datosUsuario.email, datosUsuario.telefono)
          break
        default:
          throw new Error("Tipo de usuario inválido")
      }

      // Guardar el nuevo usuario
      this.usuarios.set(datosUsuario.email, { usuario: nuevoUsuario, password })

      return nuevoUsuario
    } catch (error) {
      console.error("Error registrando usuario:", error)
      return null
    }
  }

  /**
   * Cambia la contraseña de un usuario
   * @param email - Email del usuario
   * @param passwordActual - Contraseña actual
   * @param passwordNueva - Nueva contraseña
   * @returns true si el cambio fue exitoso
   */
  async cambiarPassword(email: string, passwordActual: string, passwordNueva: string): Promise<boolean> {
    try {
      const userData = this.usuarios.get(email)

      if (!userData) {
        throw new Error("Usuario no encontrado")
      }

      if (userData.password !== passwordActual) {
        throw new Error("Contraseña actual incorrecta")
      }

      // Actualizar la contraseña
      userData.password = passwordNueva
      this.usuarios.set(email, userData)

      return true
    } catch (error) {
      console.error("Error cambiando contraseña:", error)
      return false
    }
  }

  /**
   * Obtiene todos los usuarios (solo para administradores)
   * @returns Array de usuarios o array vacío si no tiene permisos
   */
  obtenerTodosLosUsuarios(): Usuario[] {
    const usuarioActual = this.getCurrentUser()
    if (!usuarioActual || usuarioActual.tipo !== "administrador") {
      return []
    }

    return Array.from(this.usuarios.values()).map((userData) => userData.usuario)
  }
}
