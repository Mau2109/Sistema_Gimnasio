"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

type TipoUsuario = "administrador" | "miembro" | "recepcionista"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [tipoUsuario, setTipoUsuario] = useState<TipoUsuario | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!tipoUsuario) {
      setError("Por favor selecciona un tipo de usuario")
      return
    }

    setIsLoading(true)
    setError("")

    console.log("Intentando login con:", { email, password, tipoUsuario })

    // Simulación de autenticación
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Credenciales de prueba
    const validCredentials = {
      "admin@gym.com": { password: "admin123", tipo: "administrador", nombre: "Juan Carlos Admin" },
      "recep@gym.com": { password: "recep123", tipo: "recepcionista", nombre: "María González Recep" },
      "miembro@gym.com": { password: "miembro123", tipo: "miembro", nombre: "Carlos López Miembro" },
    }

    const user = validCredentials[email as keyof typeof validCredentials]

    if (user && user.password === password && user.tipo === tipoUsuario) {
      const userData = {
        email,
        tipo: tipoUsuario,
        nombre: user.nombre,
      }

      localStorage.setItem("usuario", JSON.stringify(userData))

      // Redirigir según el tipo
      switch (tipoUsuario) {
        case "administrador":
          router.push("/dashboard/admin")
          break
        case "recepcionista":
          router.push("/dashboard/recepcionista")
          break
        case "miembro":
          router.push("/dashboard/miembro")
          break
      }
    } else {
      setError("Credenciales inválidas. Verifica tu email, contraseña y tipo de usuario.")
    }

    setIsLoading(false)
  }

  const tiposUsuario = [
    {
      tipo: "administrador" as TipoUsuario,
      titulo: "Administrador",
      descripcion: "Gestión completa del gimnasio",
      icono: "🛡️",
      color: "blue",
      email: "admin@gym.com",
      password: "admin123",
    },
    {
      tipo: "recepcionista" as TipoUsuario,
      titulo: "Recepcionista",
      descripcion: "Atención al cliente y pagos",
      icono: "👥",
      color: "orange",
      email: "recep@gym.com",
      password: "recep123",
    },
    {
      tipo: "miembro" as TipoUsuario,
      titulo: "Miembro",
      descripcion: "Acceso a clases y progreso",
      icono: "👤",
      color: "green",
      email: "miembro@gym.com",
      password: "miembro123",
    },
  ]

  const handleTipoSelect = (tipo: TipoUsuario, email: string, password: string) => {
    setTipoUsuario(tipo)
    setEmail(email)
    setPassword(password)
    setError("")
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-blue-600 rounded-full">
              <span className="text-2xl">🏋️</span>
            </div>
          </div>
          <CardTitle className="text-3xl font-bold text-gray-900">GymManager Pro</CardTitle>
          <CardDescription className="text-lg">Sistema de gestión integral para gimnasios</CardDescription>
        </CardHeader>
        <CardContent>
          {!tipoUsuario ? (
            <div className="space-y-6">
              <div className="text-center">
                <h3 className="text-xl font-semibold text-gray-800 mb-2">Selecciona tu tipo de usuario</h3>
                <p className="text-gray-600">Elige cómo quieres acceder al sistema</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {tiposUsuario.map((usuario) => (
                  <button
                    key={usuario.tipo}
                    onClick={() => handleTipoSelect(usuario.tipo, usuario.email, usuario.password)}
                    className={`p-6 rounded-xl border-2 transition-all duration-200 hover:scale-105 hover:shadow-lg ${
                      usuario.color === "blue"
                        ? "border-blue-200 bg-blue-50 hover:border-blue-300 hover:bg-blue-100"
                        : usuario.color === "orange"
                          ? "border-orange-200 bg-orange-50 hover:border-orange-300 hover:bg-orange-100"
                          : "border-green-200 bg-green-50 hover:border-green-300 hover:bg-green-100"
                    }`}
                  >
                    <div className="text-center">
                      <div className="text-4xl mb-3">{usuario.icono}</div>
                      <h4 className="text-lg font-semibold text-gray-800 mb-2">{usuario.titulo}</h4>
                      <p className="text-sm text-gray-600 mb-4">{usuario.descripcion}</p>
                      <div className="text-xs text-gray-500 space-y-1">
                        <div>
                          <strong>Email:</strong> {usuario.email}
                        </div>
                        <div>
                          <strong>Contraseña:</strong> {usuario.password}
                        </div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>

              <div className="text-center">
                <p className="text-sm text-gray-500">
                  💡 Haz clic en cualquier tarjeta para seleccionar el tipo de usuario y autocompletar las credenciales
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="text-center">
                <div className="inline-flex items-center space-x-2 px-4 py-2 bg-gray-100 rounded-full">
                  <span className="text-2xl">{tiposUsuario.find((u) => u.tipo === tipoUsuario)?.icono}</span>
                  <span className="font-medium">{tiposUsuario.find((u) => u.tipo === tipoUsuario)?.titulo}</span>
                </div>
                <button
                  onClick={() => {
                    setTipoUsuario(null)
                    setEmail("")
                    setPassword("")
                    setError("")
                  }}
                  className="ml-2 text-sm text-blue-600 hover:text-blue-800 underline"
                >
                  Cambiar tipo
                </button>
              </div>

              <form onSubmit={handleLogin} className="space-y-4">
                <Input
                  label="Email"
                  type="email"
                  placeholder="tu@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />

                <Input
                  label="Contraseña"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />

                {error && (
                  <div className="text-sm text-red-600 bg-red-50 p-3 rounded-lg border border-red-200">❌ {error}</div>
                )}

                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? "🔄 Iniciando sesión..." : "🚀 Iniciar Sesión"}
                </Button>
              </form>

              <div className="p-4 bg-gray-50 rounded-lg border">
                <h4 className="font-semibold text-sm mb-2 text-gray-800">
                  📋 Credenciales precargadas para {tiposUsuario.find((u) => u.tipo === tipoUsuario)?.titulo}:
                </h4>
                <div className="text-sm text-gray-600 space-y-1">
                  <div>
                    <strong>Email:</strong> {email}
                  </div>
                  <div>
                    <strong>Contraseña:</strong> {password}
                  </div>
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  ✅ Las credenciales ya están cargadas, solo haz clic en "Iniciar Sesión"
                </p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
