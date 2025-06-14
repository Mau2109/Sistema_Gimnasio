import { type NextRequest, NextResponse } from "next/server"
import { executeQuery } from "@/lib/database/config"

// GET - Obtener todos los usuarios
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const tipo = searchParams.get("tipo")

    let query = "SELECT * FROM usuarios WHERE 1=1"
    const params: any[] = []

    if (tipo) {
      query += " AND tipo = ?"
      params.push(tipo)
    }

    query += " ORDER BY fecha_registro DESC"

    const usuarios = await executeQuery(query, params)

    return NextResponse.json({ success: true, data: usuarios })
  } catch (error) {
    console.error("Error obteniendo usuarios:", error)
    return NextResponse.json({ success: false, error: "Error interno del servidor" }, { status: 500 })
  }
}

// POST - Crear nuevo usuario
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { nombre, email, password, telefono, tipo, fecha_nacimiento, tipo_membresia, turno, nivel_acceso } = body

    // Validaciones básicas
    if (!nombre || !email || !password || !tipo) {
      return NextResponse.json(
        {
          success: false,
          error: "Nombre, email, password y tipo son requeridos",
        },
        { status: 400 },
      )
    }

    // Verificar si el email ya existe
    const existingUser = await executeQuery("SELECT id FROM usuarios WHERE email = ?", [email])
    if (Array.isArray(existingUser) && existingUser.length > 0) {
      return NextResponse.json(
        {
          success: false,
          error: "El email ya está registrado",
        },
        { status: 400 },
      )
    }

    // Preparar query de inserción
    let query = `
      INSERT INTO usuarios (nombre, email, password, telefono, tipo, fecha_nacimiento
    `
    const values = [nombre, email, password, telefono, tipo, fecha_nacimiento]
    let placeholders = "?, ?, ?, ?, ?, ?"

    // Agregar campos específicos según el tipo
    if (tipo === "miembro" && tipo_membresia) {
      query += ", tipo_membresia, fecha_vencimiento_membresia, estado_membresia"
      placeholders += ", ?, ?, ?"
      values.push(tipo_membresia, new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), "activa")
    }

    if (tipo === "recepcionista" && turno) {
      query += ", turno, fecha_contratacion"
      placeholders += ", ?, ?"
      values.push(turno, new Date())
    }

    if (tipo === "administrador" && nivel_acceso) {
      query += ", nivel_acceso"
      placeholders += ", ?"
      values.push(nivel_acceso)
    }

    query += `) VALUES (${placeholders})`

    const result = await executeQuery(query, values)

    return NextResponse.json({
      success: true,
      message: "Usuario creado exitosamente",
      data: { id: (result as any).insertId },
    })
  } catch (error) {
    console.error("Error creando usuario:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Error interno del servidor",
      },
      { status: 500 },
    )
  }
}
