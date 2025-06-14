"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export default function ConfiguracionDB() {
  const [dbStatus, setDbStatus] = useState<{
    connected: boolean
    database: string
    tables: number
    message: string
    dockerInfo?: any
  } | null>(null)
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const testConnection = async () => {
    setLoading(true)
    try {
      const response = await fetch("/api/database/test")
      const result = await response.json()
      setDbStatus(result)
    } catch (error) {
      setDbStatus({
        connected: false,
        database: "gym_management",
        tables: 0,
        message: "Error de conexión con Docker",
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    testConnection()
  }, [])

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="mb-6">
          <Button variant="outline" onClick={() => router.back()} className="mb-4">
            ← Volver
          </Button>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">🐳 Configuración Docker MySQL</CardTitle>
              <CardDescription>Estado y configuración de la base de datos MySQL con Docker</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {dbStatus && (
                  <div
                    className={`p-4 rounded-lg border ${
                      dbStatus.connected
                        ? "bg-green-50 border-green-200 text-green-800"
                        : "bg-red-50 border-red-200 text-red-800"
                    }`}
                  >
                    <div className="flex items-center space-x-2">
                      <span className="text-2xl">{dbStatus.connected ? "✅" : "❌"}</span>
                      <div>
                        <p className="font-semibold">
                          {dbStatus.connected ? "Docker MySQL Conectado" : "Error de Conexión"}
                        </p>
                        <p className="text-sm">{dbStatus.message}</p>
                        {dbStatus.dockerInfo && (
                          <p className="text-xs mt-1">
                            MySQL {dbStatus.dockerInfo.mysql_version} - Container: {dbStatus.dockerInfo.container_id}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <div className="text-center">
                      <div className="text-xl font-bold text-blue-600">localhost:3307</div>
                      <div className="text-sm text-blue-800">Puerto MySQL</div>
                    </div>
                  </div>
                  <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                    <div className="text-center">
                      <div className="text-xl font-bold text-green-600">gym_management</div>
                      <div className="text-sm text-green-800">Base de Datos</div>
                    </div>
                  </div>
                  <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
                    <div className="text-center">
                      <div className="text-xl font-bold text-purple-600">{dbStatus?.tables || 0}</div>
                      <div className="text-sm text-purple-800">Tablas</div>
                    </div>
                  </div>
                  <div className="p-4 bg-orange-50 rounded-lg border border-orange-200">
                    <div className="text-center">
                      <div className="text-xl font-bold text-orange-600">:8080</div>
                      <div className="text-sm text-orange-800">phpMyAdmin</div>
                    </div>
                  </div>
                </div>

                <div className="flex gap-4">
                  <Button onClick={testConnection} disabled={loading} className="flex-1">
                    {loading ? "🔄 Probando conexión..." : "🔍 Probar Conexión"}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => window.open("http://localhost:8080", "_blank")}
                    className="flex-1"
                  >
                    🌐 Abrir phpMyAdmin
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>🚀 Comandos Docker</CardTitle>
              <CardDescription>Comandos para gestionar los contenedores</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <h4 className="font-semibold mb-2">🟢 Iniciar servicios</h4>
                    <code className="text-sm bg-gray-800 text-green-400 p-2 rounded block">docker-compose up -d</code>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <h4 className="font-semibold mb-2">🔴 Detener servicios</h4>
                    <code className="text-sm bg-gray-800 text-red-400 p-2 rounded block">docker-compose down</code>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <h4 className="font-semibold mb-2">📊 Ver estado</h4>
                    <code className="text-sm bg-gray-800 text-blue-400 p-2 rounded block">docker-compose ps</code>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <h4 className="font-semibold mb-2">📝 Ver logs</h4>
                    <code className="text-sm bg-gray-800 text-yellow-400 p-2 rounded block">
                      docker-compose logs -f
                    </code>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>📋 Instrucciones de Configuración</CardTitle>
              <CardDescription>Pasos para configurar Docker MySQL</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <h4 className="font-semibold text-yellow-800 mb-2">⚠️ Requisitos Previos</h4>
                  <ul className="text-sm text-yellow-700 space-y-1">
                    <li>• Docker Desktop instalado y ejecutándose</li>
                    <li>• Docker Compose disponible</li>
                    <li>• Puertos 3307 y 8080 libres</li>
                  </ul>
                </div>

                <div className="space-y-3">
                  <h4 className="font-semibold">🚀 Pasos de Configuración:</h4>

                  <div className="space-y-3">
                    <div className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                      <span className="flex-shrink-0 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                        1
                      </span>
                      <div>
                        <p className="font-medium">Iniciar Docker</p>
                        <p className="text-sm text-gray-600">
                          Ejecuta: <code className="bg-gray-200 px-1 rounded">docker-compose up -d</code>
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                      <span className="flex-shrink-0 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                        2
                      </span>
                      <div>
                        <p className="font-medium">Esperar inicialización</p>
                        <p className="text-sm text-gray-600">
                          Los contenedores se crearán automáticamente con la base de datos y datos de ejemplo
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                      <span className="flex-shrink-0 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                        3
                      </span>
                      <div>
                        <p className="font-medium">Acceder a phpMyAdmin</p>
                        <p className="text-sm text-gray-600">
                          Ve a{" "}
                          <a
                            href="http://localhost:8080"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 underline"
                          >
                            http://localhost:8080
                          </a>
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start space-x-3 p-3 bg-green-50 rounded-lg border border-green-200">
                      <span className="flex-shrink-0 w-6 h-6 bg-green-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                        ✓
                      </span>
                      <div>
                        <p className="font-medium text-green-800">¡Listo!</p>
                        <p className="text-sm text-green-700">El sistema estará funcionando con datos de ejemplo</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>🔐 Credenciales Docker</CardTitle>
              <CardDescription>Información de acceso a los servicios</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <h4 className="font-semibold text-blue-800 mb-2">🗄️ MySQL Docker</h4>
                    <div className="text-sm text-blue-700 space-y-1">
                      <p>
                        <strong>Host:</strong> localhost
                      </p>
                      <p>
                        <strong>Puerto:</strong> 3307
                      </p>
                      <p>
                        <strong>Usuario:</strong> gym_user
                      </p>
                      <p>
                        <strong>Contraseña:</strong> gym_password
                      </p>
                      <p>
                        <strong>Base de datos:</strong> gym_management
                      </p>
                    </div>
                  </div>
                  <div className="p-4 bg-orange-50 rounded-lg border border-orange-200">
                    <h4 className="font-semibold text-orange-800 mb-2">🌐 phpMyAdmin</h4>
                    <div className="text-sm text-orange-700 space-y-1">
                      <p>
                        <strong>URL:</strong> http://localhost:8080
                      </p>
                      <p>
                        <strong>Usuario:</strong> gym_user
                      </p>
                      <p>
                        <strong>Contraseña:</strong> gym_password
                      </p>
                      <p>
                        <strong>Servidor:</strong> mysql
                      </p>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                  <h4 className="font-semibold text-green-800 mb-2">👥 Usuarios de la Aplicación</h4>
                  <div className="grid grid-cols-3 gap-4 text-sm text-green-700">
                    <div>
                      <p>
                        <strong>🛡️ Admin:</strong>
                      </p>
                      <p>admin@gym.com / admin123</p>
                    </div>
                    <div>
                      <p>
                        <strong>👥 Recep:</strong>
                      </p>
                      <p>recep@gym.com / recep123</p>
                    </div>
                    <div>
                      <p>
                        <strong>👤 Miembro:</strong>
                      </p>
                      <p>miembro@gym.com / miembro123</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
