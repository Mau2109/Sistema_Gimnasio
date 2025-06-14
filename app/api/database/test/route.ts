import { NextResponse } from "next/server"
import { testConnection, executeQuery, checkDatabase, getDockerInfo } from "@/lib/database/config"

export async function GET() {
  try {
    // Verificar si la base de datos existe
    const dbExists = await checkDatabase()

    if (!dbExists) {
      return NextResponse.json({
        connected: false,
        database: "gym_management",
        tables: 0,
        message: "Base de datos 'gym_management' no encontrada. Ejecuta: docker-compose up -d",
      })
    }

    // Probar conexión
    const isConnected = await testConnection()

    if (!isConnected) {
      return NextResponse.json({
        connected: false,
        database: "gym_management",
        tables: 0,
        message: "No se pudo conectar a MySQL Docker. Verifica que el contenedor esté ejecutándose.",
      })
    }

    // Obtener información de Docker
    const dockerInfo = await getDockerInfo()

    // Contar tablas
    const tables = await executeQuery("SHOW TABLES")
    const tableCount = Array.isArray(tables) ? tables.length : 0

    // Obtener estadísticas básicas
    const stats = await executeQuery(`
      SELECT 
        (SELECT COUNT(*) FROM usuarios) as usuarios,
        (SELECT COUNT(*) FROM entrenadores) as entrenadores,
        (SELECT COUNT(*) FROM clases) as clases,
        (SELECT COUNT(*) FROM horarios_clases) as horarios
    `)

    const estadisticas = Array.isArray(stats) && stats.length > 0 ? stats[0] : null

    return NextResponse.json({
      connected: true,
      database: "gym_management",
      tables: tableCount,
      message: `Conexión exitosa a MySQL Docker. Base de datos configurada con ${tableCount} tablas.`,
      dockerInfo,
      estadisticas,
    })
  } catch (error) {
    console.error("Error probando conexión Docker:", error)
    return NextResponse.json({
      connected: false,
      database: "gym_management",
      tables: 0,
      message: "Error de conexión Docker: " + (error as Error).message,
    })
  }
}
