"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export default function AdminDashboard() {
  const [usuario, setUsuario] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    totalMiembros: 0,
    totalEntrenadores: 0,
    clasesHoy: 0,
    ingresosMes: 0,
  })
  const router = useRouter()

  useEffect(() => {
    const userData = localStorage.getItem("usuario")
    if (!userData) {
      router.push("/login")
      return
    }

    try {
      const user = JSON.parse(userData)
      if (user.tipo !== "administrador") {
        router.push("/login")
        return
      }
      setUsuario(user)
      loadStats()
      setLoading(false)
    } catch (error) {
      router.push("/login")
    }
  }, [router])

  const loadStats = async () => {
    try {
      // Cargar estadísticas desde las APIs
      const [miembrosRes, entrenadoresRes, horariosRes] = await Promise.all([
        fetch("/api/usuarios?tipo=miembro"),
        fetch("/api/entrenadores"),
        fetch("/api/horarios?fecha=" + new Date().toISOString().split("T")[0]),
      ])

      const miembros = await miembrosRes.json()
      const entrenadores = await entrenadoresRes.json()
      const horarios = await horariosRes.json()

      setStats({
        totalMiembros: miembros.success ? miembros.data.length : 0,
        totalEntrenadores: entrenadores.success ? entrenadores.data.length : 0,
        clasesHoy: horarios.success ? horarios.data.length : 0,
        ingresosMes: 15750, // Esto vendría de la API de pagos
      })
    } catch (error) {
      console.error("Error cargando estadísticas:", error)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem("usuario")
    router.push("/login")
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando dashboard...</p>
        </div>
      </div>
    )
  }

  if (!usuario) return null

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <div className="p-2 bg-blue-600 rounded-lg">
                <span className="text-white text-xl">🛡️</span>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Panel de Administración</h1>
                <p className="text-sm text-gray-600">Bienvenido, {usuario.nombre}</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                🛡️ Administrador
              </div>
              <Button variant="outline" onClick={handleLogout}>
                🚪 Cerrar Sesión
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Estadísticas */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100">Total Miembros</p>
                  <p className="text-3xl font-bold">{stats.totalMiembros}</p>
                </div>
                <span className="text-4xl">👥</span>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-100">Entrenadores</p>
                  <p className="text-3xl font-bold">{stats.totalEntrenadores}</p>
                </div>
                <span className="text-4xl">🏃‍♂️</span>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-100">Clases Hoy</p>
                  <p className="text-3xl font-bold">{stats.clasesHoy}</p>
                </div>
                <span className="text-4xl">📅</span>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-orange-500 to-orange-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-orange-100">Ingresos del Mes</p>
                  <p className="text-3xl font-bold">${stats.ingresosMes}</p>
                </div>
                <span className="text-4xl">💰</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Acciones rápidas */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Gestión de Usuarios</CardTitle>
              <CardDescription>Administra miembros, entrenadores y personal</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <Button
                  className="h-20 flex flex-col items-center justify-center bg-blue-600 hover:bg-blue-700"
                  onClick={() => router.push("/dashboard/admin/registrar-miembro")}
                >
                  <span className="text-2xl mb-2">👤</span>
                  Nuevo Miembro
                </Button>
                <Button
                  variant="outline"
                  className="h-20 flex flex-col items-center justify-center"
                  onClick={() => router.push("/dashboard/admin/registrar-entrenador")}
                >
                  <span className="text-2xl mb-2">🏃‍♂️</span>
                  Nuevo Entrenador
                </Button>
                <Button
                  variant="outline"
                  className="h-20 flex flex-col items-center justify-center"
                  onClick={() => router.push("/dashboard/admin/gestionar-usuarios")}
                >
                  <span className="text-2xl mb-2">👥</span>
                  Ver Usuarios
                </Button>
                <Button
                  variant="outline"
                  className="h-20 flex flex-col items-center justify-center"
                  onClick={() => router.push("/dashboard/admin/asignaciones")}
                >
                  <span className="text-2xl mb-2">🔗</span>
                  Asignaciones
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Gestión de Clases</CardTitle>
              <CardDescription>Administra clases, horarios y programación</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <Button
                  variant="outline"
                  className="h-20 flex flex-col items-center justify-center"
                  onClick={() => router.push("/dashboard/admin/nueva-clase")}
                >
                  <span className="text-2xl mb-2">📅</span>
                  Nueva Clase
                </Button>
                <Button
                  variant="outline"
                  className="h-20 flex flex-col items-center justify-center"
                  onClick={() => router.push("/dashboard/admin/horarios")}
                >
                  <span className="text-2xl mb-2">⏰</span>
                  Horarios
                </Button>
                <Button
                  variant="outline"
                  className="h-20 flex flex-col items-center justify-center"
                  onClick={() => router.push("/dashboard/admin/reportes")}
                >
                  <span className="text-2xl mb-2">📊</span>
                  Reportes
                </Button>
                <Button
                  variant="outline"
                  className="h-20 flex flex-col items-center justify-center"
                  onClick={() => router.push("/dashboard/admin/configuracion")}
                >
                  <span className="text-2xl mb-2">⚙️</span>
                  Configuración
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
