const { exec } = require("child_process")
const fs = require("fs")
const path = require("path")

class DockerManager {
  constructor() {
    this.composeFile = path.join(__dirname, "..", "docker-compose.yml")
  }

  async executeCommand(command) {
    return new Promise((resolve, reject) => {
      exec(command, (error, stdout, stderr) => {
        if (error) {
          reject({ error, stderr })
        } else {
          resolve(stdout)
        }
      })
    })
  }

  async checkDockerInstalled() {
    try {
      await this.executeCommand("docker --version")
      await this.executeCommand("docker-compose --version")
      return true
    } catch (error) {
      return false
    }
  }

  async startServices() {
    console.log("🚀 Iniciando servicios Docker...")

    try {
      const output = await this.executeCommand("docker-compose up -d")
      console.log("✅ Servicios iniciados exitosamente")
      console.log(output)

      // Esperar a que MySQL esté listo
      console.log("⏳ Esperando que MySQL esté listo...")
      await this.waitForMySQL()

      console.log("🎉 ¡Todo listo!")
      console.log("📊 MySQL: http://localhost:3307")
      console.log("🌐 phpMyAdmin: http://localhost:8080")
    } catch (error) {
      console.error("❌ Error iniciando servicios:", error.stderr || error.error)
    }
  }

  async stopServices() {
    console.log("🛑 Deteniendo servicios Docker...")

    try {
      const output = await this.executeCommand("docker-compose down")
      console.log("✅ Servicios detenidos exitosamente")
      console.log(output)
    } catch (error) {
      console.error("❌ Error deteniendo servicios:", error.stderr || error.error)
    }
  }

  async showStatus() {
    console.log("📊 Estado de los servicios Docker...")

    try {
      const output = await this.executeCommand("docker-compose ps")
      console.log(output)
    } catch (error) {
      console.error("❌ Error obteniendo estado:", error.stderr || error.error)
    }
  }

  async showLogs() {
    console.log("📝 Logs de los servicios Docker...")

    try {
      const output = await this.executeCommand("docker-compose logs --tail=50")
      console.log(output)
    } catch (error) {
      console.error("❌ Error obteniendo logs:", error.stderr || error.error)
    }
  }

  async waitForMySQL(maxAttempts = 30) {
    for (let i = 0; i < maxAttempts; i++) {
      try {
        await this.executeCommand(
          "docker-compose exec -T mysql mysqladmin ping -h localhost -u gym_user -pgym_password",
        )
        console.log("✅ MySQL está listo")
        return true
      } catch (error) {
        console.log(`⏳ Intento ${i + 1}/${maxAttempts} - MySQL aún no está listo...`)
        await new Promise((resolve) => setTimeout(resolve, 2000))
      }
    }
    throw new Error("MySQL no se pudo inicializar en el tiempo esperado")
  }

  async resetDatabase() {
    console.log("🔄 Reiniciando base de datos...")

    try {
      // Detener servicios
      await this.executeCommand("docker-compose down -v")
      console.log("✅ Servicios detenidos y volúmenes eliminados")

      // Iniciar servicios nuevamente
      await this.startServices()
    } catch (error) {
      console.error("❌ Error reiniciando base de datos:", error.stderr || error.error)
    }
  }

  async backup() {
    const timestamp = new Date().toISOString().replace(/[:.]/g, "-")
    const backupFile = `backup-gym-${timestamp}.sql`

    console.log(`💾 Creando backup: ${backupFile}`)

    try {
      const output = await this.executeCommand(
        `docker-compose exec -T mysql mysqldump -u gym_user -pgym_password gym_management > ${backupFile}`,
      )
      console.log("✅ Backup creado exitosamente")
      console.log(`📁 Archivo: ${backupFile}`)
    } catch (error) {
      console.error("❌ Error creando backup:", error.stderr || error.error)
    }
  }
}

// Función principal
async function main() {
  const manager = new DockerManager()
  const command = process.argv[2]

  // Verificar que Docker esté instalado
  const dockerInstalled = await manager.checkDockerInstalled()
  if (!dockerInstalled) {
    console.error("❌ Docker o Docker Compose no están instalados")
    console.log("📋 Instala Docker Desktop desde: https://www.docker.com/products/docker-desktop")
    process.exit(1)
  }

  switch (command) {
    case "start":
      await manager.startServices()
      break
    case "stop":
      await manager.stopServices()
      break
    case "status":
      await manager.showStatus()
      break
    case "logs":
      await manager.showLogs()
      break
    case "reset":
      await manager.resetDatabase()
      break
    case "backup":
      await manager.backup()
      break
    default:
      console.log("🐳 Docker Manager para Gym Management")
      console.log("")
      console.log("Comandos disponibles:")
      console.log("  start  - Iniciar servicios Docker")
      console.log("  stop   - Detener servicios Docker")
      console.log("  status - Ver estado de servicios")
      console.log("  logs   - Ver logs de servicios")
      console.log("  reset  - Reiniciar base de datos")
      console.log("  backup - Crear backup de la base de datos")
      console.log("")
      console.log("Ejemplo: node scripts/docker-manager.js start")
  }
}

main().catch(console.error)
