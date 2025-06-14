import { type NextRequest, NextResponse } from "next/server"
import { executeQuery } from "@/lib/database/config"

// GET - Obtener todas las clases
export async function GET() {
  try {
    const clases = await executeQuery(`
      SELECT 
        id,
        nombre,
        descripcion,
        duracion_minutos,
        capacidad_maxima,
        nivel,
        equipo_necesario,
        activa,
        fecha_creacion
      FROM clases 
      WHERE activa = TRUE
      ORDER BY nombre ASC
    `)

    return NextResponse.json({ success: true, data: clases })
  } catch (error) {
    console.error("Error obteniendo clases:", error)
    return NextResponse.json({ success: false, error: "Error interno del servidor" }, { status: 500 })
  }
}

// POST - Crear nueva clase
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { nombre, descripcion, duracion_minutos, capacidad_maxima, nivel, equipo_necesario } = body

    // Validaciones básicas
    if (!nombre || !duracion_minutos || !capacidad_maxima || !nivel) {
      return NextResponse.json(
        {
          success: false,
          error: "Nombre, duración, capacidad y nivel son requeridos",
        },
        { status: 400 },
      )
    }

    const result = await executeQuery(
      `
      INSERT INTO clases (
        nombre, descripcion, duracion_minutos, capacidad_maxima, 
        nivel, equipo_necesario
      ) VALUES (?, ?, ?, ?, ?, ?)
    `,
      [nombre, descripcion, duracion_minutos, capacidad_maxima, nivel, JSON.stringify(equipo_necesario || [])],
    )

    return NextResponse.json({
      success: true,
      message: "Clase creada exitosamente",
      data: { id: (result as any).insertId },
    })
  } catch (error) {
    console.error("Error creando clase:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Error interno del servidor",
      },
      { status: 500 },
    )
  }
}
