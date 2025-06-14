"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export default function AdminDashboard() {
  const [usuario, setUsuario] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    console.log("Verificando autenticación en admin dashboard...")

    const userData = localStorage.getItem("usuario")
    console.log("Datos del usuario en localStorage:", userData)

    if (!userData) {
      console.log("No hay datos de usuario, redirigiendo a login")
      router.push("/login")
      return
    }

    try {
      const user = JSON.parse(userData)
      console.log("Usuario parseado:", user)

      if (user.tipo !== "administrador") {
        console.log("Usuario no es administrador, redirigiendo a login")
        router.push("/login")
        return
      }

      setUsuario(user)
      setLoading(false)
    } catch (error) {
      console.error("Error parseando datos de usuario:", error)
      router.push("/login")
    }
  }, [router])

  const handleLogout = () => {
    console.log("Cerrando sesión...")
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

  if (!usuario) {
    return null
  }

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
                <p className="text-xs text-gray-500">Tipo: {usuario.tipo}</p>
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
        {/* Mensaje de bienvenida */}
        <div className="mb-8 p-4 bg-green-50 border border-green-200 rounded-lg">
          <div className="flex items-center space-x-2">
            <span className="text-green-600">✅</span>
            <p className="text-green-800 font-medium">
              ¡Bienvenido al panel de administración! Has iniciado sesión correctamente.
            </p>
          </div>
        </div>

        {/* Estadísticas */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100">Total Miembros</p>
                  <p className="text-3xl font-bold">245</p>
                </div>
                <span className="text-4xl">👥</span>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-100">Clases Hoy</p>
                  <p className="text-3xl font-bold">12</p>
                </div>
                <span className="text-4xl">📅</span>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-100">Ingresos del Mes</p>
                  <p className="text-3xl font-bold">$15,750</p>
                </div>
                <span className="text-4xl">💰</span>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-orange-500 to-orange-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-orange-100">Crecimiento</p>
                  <p className="text-3xl font-bold">+8.5%</p>
                </div>
                <span className="text-4xl">📈</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Acciones rápidas */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Acciones Rápidas</CardTitle>
              <CardDescription>Acceso directo a funciones principales</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <Button className="h-20 flex flex-col items-center justify-center bg-blue-600 hover:bg-blue-700">
                  <span className="text-2xl mb-2">👤</span>
                  Nuevo Miembro
                </Button>
                <Button variant="outline" className="h-20 flex flex-col items-center justify-center">
                  <span className="text-2xl mb-2">📅</span>
                  Nueva Clase
                </Button>
                <Button variant="outline" className="h-20 flex flex-col items-center justify-center">
                  <span className="text-2xl mb-2">📊</span>
                  Ver Reportes
                </Button>
                <Button variant="outline" className="h-20 flex flex-col items-center justify-center">
                  <span className="text-2xl mb-2">⚙️</span>
                  Configuración
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Actividad Reciente</CardTitle>
              <CardDescription>Últimas actividades en el sistema</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg">
                  <span className="text-green-600">✅</span>
                  <div>
                    <p className="text-sm font-medium">Ana García se registró</p>
                    <p className="text-xs text-gray-500">hace 2 horas</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg">
                  <span className="text-blue-600">💳</span>
                  <div>
                    <p className="text-sm font-medium">Pago de membresía - Carlos López</p>
                    <p className="text-xs text-gray-500">hace 4 horas</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3 p-3 bg-purple-50 rounded-lg">
                  <span className="text-purple-600">🏋️</span>
                  <div>
                    <p className="text-sm font-medium">Clase de Yoga completada</p>
                    <p className="text-xs text-gray-500">hace 6 horas</p>
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
