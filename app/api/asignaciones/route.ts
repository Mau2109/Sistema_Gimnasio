import { type NextRequest, NextResponse } from "next/server"
import { executeQuery } from "@/lib/database/config"

// GET - Obtener asignaciones entrenador-miembro
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const miembro_id = searchParams.get("miembro_id")
    const entrenador_id = searchParams.get("entrenador_id")

    let query = `
      SELECT 
        a.id,
        a.fecha_asignacion,
        a.fecha_inicio,
        a.fecha_fin,
        a.activa,
        a.notas,
        u.nombre as miembro_nombre,
        u.email as miembro_email,
        e.nombre as entrenador_nombre,
        e.email as entrenador_email,
        e.especialidades
      FROM asignaciones_entrenador a
      JOIN usuarios u ON a.miembro_id = u.id
      JOIN entrenadores e ON a.entrenador_id = e.id
      WHERE 1=1
    `

    const params: any[] = []

    if (miembro_id) {
      query += " AND a.miembro_id = ?"
      params.push(miembro_id)
    }

    if (entrenador_id) {
      query += " AND a.entrenador_id = ?"
      params.push(entrenador_id)
    }

    query += " ORDER BY a.fecha_asignacion DESC"

    const asignaciones = await executeQuery(query, params)

    return NextResponse.json({ success: true, data: asignaciones })
  } catch (error) {
    console.error("Error obteniendo asignaciones:", error)
    return NextResponse.json({ success: false, error: "Error interno del servidor" }, { status: 500 })
  }
}

// POST - Crear nueva asignación entrenador-miembro
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { miembro_id, entrenador_id, fecha_inicio, fecha_fin, notas } = body

    // Validaciones básicas
    if (!miembro_id || !entrenador_id || !fecha_inicio) {
      return NextResponse.json(
        {
          success: false,
          error: "Miembro, entrenador y fecha de inicio son requeridos",
        },
        { status: 400 },
      )
    }

    // Verificar que el miembro existe y es tipo 'miembro'
    const miembro = await executeQuery('SELECT id FROM usuarios WHERE id = ? AND tipo = "miembro"', [miembro_id])
    if (!Array.isArray(miembro) || miembro.length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: "Miembro no encontrado",
        },
        { status: 400 },
      )
    }

    // Verificar que el entrenador existe y está activo
    const entrenador = await executeQuery("SELECT id FROM entrenadores WHERE id = ? AND activo = TRUE", [entrenador_id])
    if (!Array.isArray(entrenador) || entrenador.length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: "Entrenador no encontrado o inactivo",
        },
        { status: 400 },
      )
    }

    const result = await executeQuery(
      `
      INSERT INTO asignaciones_entrenador (
        miembro_id, entrenador_id, fecha_inicio, fecha_fin, notas
      ) VALUES (?, ?, ?, ?, ?)
    `,
      [miembro_id, entrenador_id, fecha_inicio, fecha_fin, notas],
    )

    return NextResponse.json({
      success: true,
      message: "Asignación creada exitosamente",
      data: { id: (result as any).insertId },
    })
  } catch (error) {
    console.error("Error creando asignación:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Error interno del servidor",
      },
      { status: 500 },
    )
  }
}
