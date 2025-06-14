import { type NextRequest, NextResponse } from "next/server"
import { executeQuery } from "@/lib/database/config"

// GET - Obtener horarios de clases
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const fecha = searchParams.get("fecha")

    let query = `
      SELECT 
        hc.id,
        hc.fecha,
        hc.hora_inicio,
        hc.hora_fin,
        hc.salon,
        hc.estado,
        c.nombre as clase_nombre,
        c.descripcion as clase_descripcion,
        c.duracion_minutos,
        c.capacidad_maxima,
        c.nivel,
        e.nombre as entrenador_nombre,
        e.especialidades,
        COUNT(i.id) as inscritos
      FROM horarios_clases hc
      JOIN clases c ON hc.clase_id = c.id
      JOIN entrenadores e ON hc.entrenador_id = e.id
      LEFT JOIN inscripciones i ON hc.id = i.horario_clase_id AND i.estado = 'activa'
      WHERE hc.estado = 'programada'
    `

    const params: any[] = []

    if (fecha) {
      query += " AND hc.fecha = ?"
      params.push(fecha)
    } else {
      query += " AND hc.fecha >= CURDATE()"
    }

    query += " GROUP BY hc.id ORDER BY hc.fecha ASC, hc.hora_inicio ASC"

    const horarios = await executeQuery(query, params)

    return NextResponse.json({ success: true, data: horarios })
  } catch (error) {
    console.error("Error obteniendo horarios:", error)
    return NextResponse.json({ success: false, error: "Error interno del servidor" }, { status: 500 })
  }
}

// POST - Crear nuevo horario de clase
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { clase_id, entrenador_id, fecha, hora_inicio, hora_fin, salon } = body

    // Validaciones básicas
    if (!clase_id || !entrenador_id || !fecha || !hora_inicio || !hora_fin) {
      return NextResponse.json(
        {
          success: false,
          error: "Todos los campos son requeridos",
        },
        { status: 400 },
      )
    }

    // Verificar conflictos de horario del entrenador
    const conflictos = await executeQuery(
      `
      SELECT id FROM horarios_clases 
      WHERE entrenador_id = ? 
      AND fecha = ? 
      AND estado = 'programada'
      AND (
        (hora_inicio <= ? AND hora_fin > ?) OR
        (hora_inicio < ? AND hora_fin >= ?) OR
        (hora_inicio >= ? AND hora_fin <= ?)
      )
    `,
      [entrenador_id, fecha, hora_inicio, hora_inicio, hora_fin, hora_fin, hora_inicio, hora_fin],
    )

    if (Array.isArray(conflictos) && conflictos.length > 0) {
      return NextResponse.json(
        {
          success: false,
          error: "El entrenador ya tiene una clase programada en ese horario",
        },
        { status: 400 },
      )
    }

    const result = await executeQuery(
      `
      INSERT INTO horarios_clases (
        clase_id, entrenador_id, fecha, hora_inicio, hora_fin, salon
      ) VALUES (?, ?, ?, ?, ?, ?)
    `,
      [clase_id, entrenador_id, fecha, hora_inicio, hora_fin, salon],
    )

    return NextResponse.json({
      success: true,
      message: "Horario creado exitosamente",
      data: { id: (result as any).insertId },
    })
  } catch (error) {
    console.error("Error creando horario:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Error interno del servidor",
      },
      { status: 500 },
    )
  }
}
