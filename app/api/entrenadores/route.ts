import { type NextRequest, NextResponse } from "next/server"
import { executeQuery } from "@/lib/database/config"

// GET - Obtener todos los entrenadores
export async function GET() {
  try {
    const entrenadores = await executeQuery(`
      SELECT 
        id,
        nombre,
        email,
        telefono,
        especialidades,
        certificaciones,
        experiencia_anos,
        tarifa_hora,
        activo,
        fecha_contratacion,
        calificacion_promedio,
        numero_clases_impartidas
      FROM entrenadores 
      ORDER BY nombre ASC
    `)

    return NextResponse.json({ success: true, data: entrenadores })
  } catch (error) {
    console.error("Error obteniendo entrenadores:", error)
    return NextResponse.json({ success: false, error: "Error interno del servidor" }, { status: 500 })
  }
}

// POST - Crear nuevo entrenador
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { nombre, email, telefono, especialidades, certificaciones, experiencia_anos, tarifa_hora } = body

    // Validaciones básicas
    if (!nombre || !email) {
      return NextResponse.json(
        {
          success: false,
          error: "Nombre y email son requeridos",
        },
        { status: 400 },
      )
    }

    // Verificar si el email ya existe
    const existingTrainer = await executeQuery("SELECT id FROM entrenadores WHERE email = ?", [email])
    if (Array.isArray(existingTrainer) && existingTrainer.length > 0) {
      return NextResponse.json(
        {
          success: false,
          error: "El email ya está registrado",
        },
        { status: 400 },
      )
    }

    const result = await executeQuery(
      `
      INSERT INTO entrenadores (
        nombre, email, telefono, especialidades, certificaciones, 
        experiencia_anos, tarifa_hora
      ) VALUES (?, ?, ?, ?, ?, ?, ?)
    `,
      [
        nombre,
        email,
        telefono,
        JSON.stringify(especialidades || []),
        JSON.stringify(certificaciones || []),
        experiencia_anos || 0,
        tarifa_hora || 0,
      ],
    )

    return NextResponse.json({
      success: true,
      message: "Entrenador creado exitosamente",
      data: { id: (result as any).insertId },
    })
  } catch (error) {
    console.error("Error creando entrenador:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Error interno del servidor",
      },
      { status: 500 },
    )
  }
}
