"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export default function RecepcionistaDashboard() {
  const [usuario, setUsuario] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const router = useRouter()

  useEffect(() => {
    console.log("Verificando autenticación en recepcionista dashboard...")

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

      if (user.tipo !== "recepcionista") {
        console.log("Usuario no es recepcionista, redirigiendo a login")
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
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto"></div>
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
              <div className="p-2 bg-orange-600 rounded-lg">
                <span className="text-white text-xl">👥</span>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Panel de Recepción</h1>
                <p className="text-sm text-gray-600">Bienvenido, {usuario.nombre}</p>
                <p className="text-xs text-gray-500">Tipo: {usuario.tipo}</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="px-3 py-1 bg-orange-100 text-orange-800 rounded-full text-sm font-medium">
                👥 Recepcionista
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
        <div className="mb-8 p-4 bg-orange-50 border border-orange-200 rounded-lg">
          <div className="flex items-center space-x-2">
            <span className="text-orange-600">✅</span>
            <p className="text-orange-800 font-medium">
              ¡Bienvenido al panel de recepción! Aquí puedes gestionar miembros y procesar pagos.
            </p>
          </div>
        </div>

        {/* Estadísticas del turno */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100">Miembros Atendidos</p>
                  <p className="text-3xl font-bold">25</p>
                  <p className="text-sm text-blue-100">En tu turno</p>
                </div>
                <span className="text-4xl">👥</span>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-100">Pagos Procesados</p>
                  <p className="text-3xl font-bold">8</p>
                  <p className="text-sm text-green-100">$1,240 total</p>
                </div>
                <span className="text-4xl">💳</span>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-100">Consultas Resueltas</p>
                  <p className="text-3xl font-bold">12</p>
                  <p className="text-sm text-purple-100">3 pendientes</p>
                </div>
                <span className="text-4xl">📞</span>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-orange-500 to-orange-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-orange-100">Nuevos Registros</p>
                  <p className="text-3xl font-bold">3</p>
                  <p className="text-sm text-orange-100">Miembros nuevos</p>
                </div>
                <span className="text-4xl">➕</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Gestión de miembros y actividades */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle>Gestión de Miembros</CardTitle>
              <CardDescription>Busca y gestiona información de miembros</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Input
                  placeholder="🔍 Buscar miembro por nombre, email o teléfono..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />

                <div className="space-y-3">
                  <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg border border-green-200">
                    <div className="flex items-center space-x-3">
                      <span className="text-2xl">👤</span>
                      <div>
                        <h3 className="font-semibold">Ana García</h3>
                        <p className="text-sm text-gray-600">ana@email.com</p>
                        <p className="text-xs text-gray-500">+1234567890</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">Activo</span>
                      <Button variant="outline" size="sm">
                        Ver Detalles
                      </Button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-red-50 rounded-lg border border-red-200">
                    <div className="flex items-center space-x-3">
                      <span className="text-2xl">👤</span>
                      <div>
                        <h3 className="font-semibold">Carlos López</h3>
                        <p className="text-sm text-gray-600">carlos@email.com</p>
                        <p className="text-xs text-gray-500">+1234567891</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="px-2 py-1 bg-red-100 text-red-800 text-xs rounded-full">Vencido</span>
                      <Button variant="outline" size="sm">
                        Ver Detalles
                      </Button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <div className="flex items-center space-x-3">
                      <span className="text-2xl">👤</span>
                      <div>
                        <h3 className="font-semibold">María Rodríguez</h3>
                        <p className="text-sm text-gray-600">maria@email.com</p>
                        <p className="text-xs text-gray-500">+1234567892</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">Premium</span>
                      <Button variant="outline" size="sm">
                        Ver Detalles
                      </Button>
                    </div>
                  </div>
                </div>

                <Button className="w-full bg-orange-600 hover:bg-orange-700">➕ Registrar Nuevo Miembro</Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Actividad del Día</CardTitle>
              <CardDescription>Resumen de actividades de hoy</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg">
                  <span className="text-green-600">💳</span>
                  <div>
                    <p className="text-sm font-medium">Pago procesado - Juan Pérez</p>
                    <p className="text-xs text-gray-500">$150 - Tarjeta - 09:30</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg">
                  <span className="text-blue-600">📞</span>
                  <div>
                    <p className="text-sm font-medium">Consulta resuelta - Ana García</p>
                    <p className="text-xs text-gray-500">Horarios de yoga - 10:30</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3 p-3 bg-purple-50 rounded-lg">
                  <span className="text-purple-600">➕</span>
                  <div>
                    <p className="text-sm font-medium">Nuevo registro - María Rodríguez</p>
                    <p className="text-xs text-gray-500">Membresía Premium - 12:45</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3 p-3 bg-orange-50 rounded-lg">
                  <span className="text-orange-600">💰</span>
                  <div>
                    <p className="text-sm font-medium">Pago procesado - Laura Martínez</p>
                    <p className="text-xs text-gray-500">$200 - Efectivo - 14:20</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3 p-3 bg-yellow-50 rounded-lg">
                  <span className="text-yellow-600">❓</span>
                  <div>
                    <p className="text-sm font-medium">Consulta pendiente - Roberto Silva</p>
                    <p className="text-xs text-gray-500">Cancelación de clase - 15:20</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Acciones rápidas */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Procesamiento de Pagos</CardTitle>
              <CardDescription>Pagos procesados hoy</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg border border-green-200">
                  <div className="flex items-center space-x-3">
                    <span className="text-green-600">✅</span>
                    <div>
                      <h3 className="font-semibold">Juan Pérez - $150</h3>
                      <p className="text-sm text-gray-600">Tarjeta de crédito - 09:30</p>
                    </div>
                  </div>
                  <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">Procesado</span>
                </div>

                <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg border border-green-200">
                  <div className="flex items-center space-x-3">
                    <span className="text-green-600">✅</span>
                    <div>
                      <h3 className="font-semibold">Laura Martínez - $200</h3>
                      <p className="text-sm text-gray-600">Efectivo - 11:15</p>
                    </div>
                  </div>
                  <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">Procesado</span>
                </div>

                <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg border border-green-200">
                  <div className="flex items-center space-x-3">
                    <span className="text-green-600">✅</span>
                    <div>
                      <h3 className="font-semibold">Roberto Silva - $180</h3>
                      <p className="text-sm text-gray-600">Transferencia - 14:20</p>
                    </div>
                  </div>
                  <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">Procesado</span>
                </div>

                <Button className="w-full bg-green-600 hover:bg-green-700">💳 Procesar Nuevo Pago</Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Centro de Consultas</CardTitle>
              <CardDescription>Consultas y solicitudes de miembros</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                  <div className="flex items-center space-x-3">
                    <span className="text-yellow-600">❓</span>
                    <div>
                      <h3 className="font-semibold">Ana García</h3>
                      <p className="text-sm text-gray-600">Horarios de yoga</p>
                      <p className="text-xs text-gray-500">10:30</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full">Pendiente</span>
                    <Button variant="outline" size="sm">
                      Resolver
                    </Button>
                  </div>
                </div>

                <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg border border-green-200">
                  <div className="flex items-center space-x-3">
                    <span className="text-green-600">✅</span>
                    <div>
                      <h3 className="font-semibold">Carlos López</h3>
                      <p className="text-sm text-gray-600">Renovación de membresía</p>
                      <p className="text-xs text-gray-500">12:45</p>
                    </div>
                  </div>
                  <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">Resuelta</span>
                </div>

                <div className="flex items-center justify-between p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                  <div className="flex items-center space-x-3">
                    <span className="text-yellow-600">❓</span>
                    <div>
                      <h3 className="font-semibold">María Rodríguez</h3>
                      <p className="text-sm text-gray-600">Cancelación de clase</p>
                      <p className="text-xs text-gray-500">15:20</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full">Pendiente</span>
                    <Button variant="outline" size="sm">
                      Resolver
                    </Button>
                  </div>
                </div>

                <Button className="w-full bg-blue-600 hover:bg-blue-700">📞 Nueva Consulta</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
