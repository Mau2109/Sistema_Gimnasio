"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"

export default function MiembroDashboard() {
  const [usuario, setUsuario] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("dashboard")
  const router = useRouter()

  useEffect(() => {
    const userData = localStorage.getItem("usuario")
    if (!userData) {
      router.push("/login")
      return
    }

    try {
      const user = JSON.parse(userData)
      if (user.tipo !== "miembro") {
        router.push("/login")
        return
      }
      setUsuario(user)
      setLoading(false)
    } catch (error) {
      router.push("/login")
    }
  }, [router])

  const handleLogout = () => {
    localStorage.removeItem("usuario")
    router.push("/login")
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando dashboard...</p>
        </div>
      </div>
    )
  }

  if (!usuario) return null

  const tabs = [
    { id: "dashboard", label: "Dashboard", icon: "📊" },
    { id: "clases", label: "Mis Clases", icon: "🏃" },
    { id: "progreso", label: "Mi Progreso", icon: "📈" },
    { id: "perfil", label: "Mi Perfil", icon: "👤" },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <div className="p-2 bg-green-600 rounded-lg">
                <span className="text-white text-xl">👤</span>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Mi Dashboard</h1>
                <p className="text-sm text-gray-600">Bienvenido, {usuario.nombre}</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">👤 Miembro</div>
              <Button variant="outline" onClick={handleLogout}>
                🚪 Cerrar Sesión
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab.id
                    ? "border-green-500 text-green-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                <span className="mr-2">{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Dashboard Tab */}
        {activeTab === "dashboard" && (
          <div className="space-y-8">
            {/* Estado de membresía */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-green-100">Membresía</p>
                      <p className="text-2xl font-bold">Premium</p>
                      <p className="text-sm text-green-100">30 días restantes</p>
                    </div>
                    <span className="text-4xl">💳</span>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-blue-100">Clases Este Mes</p>
                      <p className="text-2xl font-bold">12</p>
                      <p className="text-sm text-blue-100">+3 vs mes anterior</p>
                    </div>
                    <span className="text-4xl">🏃</span>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-purple-100">Próxima Clase</p>
                      <p className="text-2xl font-bold">Hoy</p>
                      <p className="text-sm text-purple-100">Yoga a las 08:00</p>
                    </div>
                    <span className="text-4xl">⏰</span>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Resumen rápido */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Actividad Reciente</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg">
                      <span className="text-green-600">✅</span>
                      <div>
                        <p className="text-sm font-medium">Clase de Yoga completada</p>
                        <p className="text-xs text-gray-500">Ayer a las 08:00</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg">
                      <span className="text-blue-600">📅</span>
                      <div>
                        <p className="text-sm font-medium">Inscrito en CrossFit</p>
                        <p className="text-xs text-gray-500">Mañana a las 18:00</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Objetivos del Mes</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Clases asistidas</span>
                        <span>12/15</span>
                      </div>
                      <Progress value={80} className="h-2" />
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Días activos</span>
                        <span>18/20</span>
                      </div>
                      <Progress value={90} className="h-2" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {/* Clases Tab */}
        {activeTab === "clases" && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Mis Clases Programadas</CardTitle>
                <CardDescription>Clases en las que estás inscrito</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <div className="flex items-center space-x-3">
                      <span className="text-2xl">🧘</span>
                      <div>
                        <h3 className="font-semibold">Yoga Matutino</h3>
                        <p className="text-sm text-gray-600">Hoy a las 08:00 - Ana García</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">Confirmada</span>
                      <Button variant="outline" size="sm">
                        Cancelar
                      </Button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-orange-50 rounded-lg border border-orange-200">
                    <div className="flex items-center space-x-3">
                      <span className="text-2xl">🏋️</span>
                      <div>
                        <h3 className="font-semibold">CrossFit</h3>
                        <p className="text-sm text-gray-600">Mañana a las 18:00 - Carlos López</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">Confirmada</span>
                      <Button variant="outline" size="sm">
                        Cancelar
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Clases Disponibles</CardTitle>
                <CardDescription>Inscríbete en nuevas clases</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg border border-green-200">
                    <div className="flex items-center space-x-3">
                      <span className="text-2xl">🚴</span>
                      <div>
                        <h3 className="font-semibold">Spinning</h3>
                        <p className="text-sm text-gray-600">Viernes a las 19:00</p>
                        <p className="text-xs text-green-600">5 cupos disponibles</p>
                      </div>
                    </div>
                    <Button size="sm" className="bg-green-600 hover:bg-green-700">
                      Inscribirse
                    </Button>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-pink-50 rounded-lg border border-pink-200">
                    <div className="flex items-center space-x-3">
                      <span className="text-2xl">💃</span>
                      <div>
                        <h3 className="font-semibold">Zumba</h3>
                        <p className="text-sm text-gray-600">Sábado a las 17:00</p>
                        <p className="text-xs text-green-600">8 cupos disponibles</p>
                      </div>
                    </div>
                    <Button size="sm" className="bg-pink-600 hover:bg-pink-700">
                      Inscribirse
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Progreso Tab */}
        {activeTab === "progreso" && (
          <div className="space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>📊 Estadísticas Físicas</CardTitle>
                  <CardDescription>Tu progreso físico registrado</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center p-4 bg-blue-50 rounded-lg">
                        <div className="text-2xl font-bold text-blue-600">75kg</div>
                        <div className="text-sm text-gray-600">Peso Actual</div>
                        <div className="text-xs text-green-600">-3kg este mes</div>
                      </div>
                      <div className="text-center p-4 bg-green-50 rounded-lg">
                        <div className="text-2xl font-bold text-green-600">22.5</div>
                        <div className="text-sm text-gray-600">IMC</div>
                        <div className="text-xs text-green-600">Normal</div>
                      </div>
                      <div className="text-center p-4 bg-purple-50 rounded-lg">
                        <div className="text-2xl font-bold text-purple-600">15%</div>
                        <div className="text-sm text-gray-600">Grasa Corporal</div>
                        <div className="text-xs text-green-600">-2% este mes</div>
                      </div>
                      <div className="text-center p-4 bg-orange-50 rounded-lg">
                        <div className="text-2xl font-bold text-orange-600">45%</div>
                        <div className="text-sm text-gray-600">Masa Muscular</div>
                        <div className="text-xs text-green-600">+1% este mes</div>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <h4 className="font-semibold">Evolución del Peso</h4>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Enero: 78kg</span>
                          <span>Febrero: 76kg</span>
                          <span>Marzo: 75kg</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div className="bg-green-600 h-2 rounded-full" style={{ width: "75%" }}></div>
                        </div>
                        <p className="text-xs text-gray-500">Objetivo: 72kg</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>🎯 Objetivos y Metas</CardTitle>
                  <CardDescription>Tus metas de fitness</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-semibold text-green-800">Perder 5kg</h4>
                        <span className="text-sm text-green-600">60% completado</span>
                      </div>
                      <Progress value={60} className="h-2 mb-2" />
                      <p className="text-sm text-gray-600">3kg perdidos de 5kg objetivo</p>
                    </div>

                    <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-semibold text-blue-800">20 clases al mes</h4>
                        <span className="text-sm text-blue-600">75% completado</span>
                      </div>
                      <Progress value={75} className="h-2 mb-2" />
                      <p className="text-sm text-gray-600">15 clases completadas de 20</p>
                    </div>

                    <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-semibold text-purple-800">Correr 5km</h4>
                        <span className="text-sm text-purple-600">40% completado</span>
                      </div>
                      <Progress value={40} className="h-2 mb-2" />
                      <p className="text-sm text-gray-600">Actualmente corres 2km</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>📈 Historial de Entrenamientos</CardTitle>
                <CardDescription>Tus últimas sesiones de entrenamiento</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <span className="text-2xl">🧘</span>
                      <div>
                        <h4 className="font-semibold">Yoga Matutino</h4>
                        <p className="text-sm text-gray-600">Ayer - 60 minutos</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-semibold text-green-600">350 cal</div>
                      <div className="flex items-center space-x-1">
                        <span className="text-yellow-400">⭐⭐⭐⭐⭐</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-orange-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <span className="text-2xl">🏋️</span>
                      <div>
                        <h4 className="font-semibold">CrossFit</h4>
                        <p className="text-sm text-gray-600">2 días atrás - 45 minutos</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-semibold text-orange-600">520 cal</div>
                      <div className="flex items-center space-x-1">
                        <span className="text-yellow-400">⭐⭐⭐⭐</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-pink-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <span className="text-2xl">💃</span>
                      <div>
                        <h4 className="font-semibold">Zumba</h4>
                        <p className="text-sm text-gray-600">3 días atrás - 50 minutos</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-semibold text-pink-600">420 cal</div>
                      <div className="flex items-center space-x-1">
                        <span className="text-yellow-400">⭐⭐⭐⭐⭐</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Perfil Tab */}
        {activeTab === "perfil" && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Información Personal</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium text-gray-700">Nombre</p>
                      <p className="text-sm text-gray-900">{usuario.nombre}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-700">Email</p>
                      <p className="text-sm text-gray-900">{usuario.email}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-700">Teléfono</p>
                      <p className="text-sm text-gray-900">+1234567890</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-700">Fecha de Nacimiento</p>
                      <p className="text-sm text-gray-900">15/03/1990</p>
                    </div>
                  </div>
                  <Button className="w-full">✏️ Editar Información</Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Estado de Membresía</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium text-gray-700">Tipo de Membresía</p>
                      <span className="px-2 py-1 bg-green-100 text-green-800 text-sm rounded-full">Premium</span>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-700">Estado</p>
                      <span className="px-2 py-1 bg-green-100 text-green-800 text-sm rounded-full">Activa</span>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-700">Fecha de Inicio</p>
                      <p className="text-sm text-gray-900">01/01/2024</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-700">Vencimiento</p>
                      <p className="text-sm text-gray-900">31/12/2024</p>
                    </div>
                  </div>
                  <div className="pt-4 border-t">
                    <Button className="w-full bg-green-600 hover:bg-green-700">🔄 Renovar Membresía</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}
