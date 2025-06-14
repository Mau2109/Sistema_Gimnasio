import mysql from "mysql2/promise"

const dbConfig = {
  host: "localhost",
  port: 3307, // Puerto Docker
  user: "gym_user",
  password: "gym_password",
  database: "gym_management",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  acquireTimeout: 60000,
  timeout: 60000,
}

// Pool de conexiones para mejor rendimiento
export const pool = mysql.createPool(dbConfig)

// Función para probar la conexión
export async function testConnection() {
  try {
    const connection = await pool.getConnection()
    console.log("✅ Conexión a MySQL Docker exitosa")
    console.log(`📍 Conectado a: ${dbConfig.host}:${dbConfig.port}`)
    console.log(`🗄️ Base de datos: ${dbConfig.database}`)
    console.log(`👤 Usuario: ${dbConfig.user}`)
    connection.release()
    return true
  } catch (error) {
    console.error("❌ Error conectando a MySQL Docker:", error)
    return false
  }
}

// Función para ejecutar queries
export async function executeQuery(query: string, params: any[] = []) {
  try {
    const [results] = await pool.execute(query, params)
    return results
  } catch (error) {
    console.error("Error ejecutando query:", error)
    throw error
  }
}

// Función para verificar si la base de datos existe
export async function checkDatabase() {
  try {
    const connection = await mysql.createConnection({
      host: dbConfig.host,
      port: dbConfig.port,
      user: dbConfig.user,
      password: dbConfig.password,
    })

    const [databases] = await connection.execute("SHOW DATABASES LIKE 'gym_management'")
    await connection.end()

    return Array.isArray(databases) && databases.length > 0
  } catch (error) {
    console.error("Error verificando base de datos:", error)
    return false
  }
}

// Función para obtener información del contenedor
export async function getDockerInfo() {
  try {
    const connection = await pool.getConnection()
    const [result] = await connection.execute("SELECT VERSION() as mysql_version, @@hostname as container_id")
    connection.release()
    return Array.isArray(result) && result.length > 0 ? result[0] : null
  } catch (error) {
    console.error("Error obteniendo info de Docker:", error)
    return null
  }
}
