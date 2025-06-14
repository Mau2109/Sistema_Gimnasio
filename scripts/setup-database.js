const mysql = require("mysql2/promise")
const fs = require("fs")
const path = require("path")

async function setupDatabase() {
  console.log("🚀 Configurando base de datos MySQL...")

  try {
    // Conectar a MySQL (sin especificar base de datos)
    const connection = await mysql.createConnection({
      host: "localhost",
      port: 3307,
      user: "gym_user",
      password: "gym_password",
    })

    console.log("✅ Conectado a MySQL")

    // Leer el archivo SQL
    const sqlPath = path.join(__dirname, "database-schema.sql")
    const sqlContent = fs.readFileSync(sqlPath, "utf8")

    // Dividir en statements individuales
    const statements = sqlContent
      .split(";")
      .map((stmt) => stmt.trim())
      .filter((stmt) => stmt.length > 0)

    console.log(`📝 Ejecutando ${statements.length} statements SQL...`)

    // Ejecutar cada statement
    for (const statement of statements) {
      try {
        await connection.execute(statement)
      } catch (error) {
        if (!error.message.includes("already exists")) {
          console.error("Error ejecutando statement:", error.message)
        }
      }
    }

    console.log("✅ Base de datos configurada exitosamente")
    console.log("📊 Datos de ejemplo insertados")

    await connection.end()

    console.log("\n🎉 ¡Configuración completada!")
    console.log("\nCredenciales de acceso:")
    console.log("👤 Miembro: miembro@gym.com / miembro123")
    console.log("👥 Recepcionista: recep@gym.com / recep123")
    console.log("🛡️ Administrador: admin@gym.com / admin123")
  } catch (error) {
    console.error("❌ Error configurando base de datos:", error.message)
    console.log("\n📋 Instrucciones:")
    console.log("1. Instala MySQL y configúralo en el puerto 3307")
    console.log('2. Crea un usuario "gym_user" con contraseña "gym_password"')
    console.log("3. Otorga permisos completos al usuario")
    console.log("4. Ejecuta: npm run db:setup")
  }
}

setupDatabase()
