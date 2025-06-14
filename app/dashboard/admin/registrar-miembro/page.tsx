"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export default function RegistrarMiembro() {
  const [formData, setFormData] = useState({
    nombre: "",
    email: "",
    password: "",
    telefono: "",
    fecha_nacimiento: "",
    tipo_membresia: "basica",
  })
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState("")
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage("")

    try {
      const response = await fetch("/api/usuarios", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          tipo: "miembro",
        }),
      })

      const result = await response.json()

      if (result.success) {
        setMessage("✅ Miembro registrado exitosamente")
        setFormData({
          nombre: "",
          email: "",
          password: "",
          telefono: "",
          fecha_nacimiento: "",
          tipo_membresia: "basica",
        })
      } else {
        setMessage(`❌ Error: ${result.error}`)
      }
    } catch (error) {
      setMessage("❌ Error de conexión")
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4">
        <div className="mb-6">
          <Button variant="outline" onClick={() => router.back()} className="mb-4">
            ← Volver
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">👤 Registrar Nuevo Miembro</CardTitle>
            <CardDescription>Completa la información para registrar un nuevo miembro en el gimnasio</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Nombre Completo *"
                  name="nombre"
                  value={formData.nombre}
                  onChange={handleChange}
                  required
                  placeholder="Ej: Juan Pérez"
                />

                <Input
                  label="Email *"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  placeholder="juan@email.com"
                />

                <Input
                  label="Contraseña *"
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  placeholder="Mínimo 6 caracteres"
                />

                <Input
                  label="Teléfono"
                  name="telefono"
                  value={formData.telefono}
                  onChange={handleChange}
                  placeholder="+1234567890"
                />

                <Input
                  label="Fecha de Nacimiento"
                  name="fecha_nacimiento"
                  type="date"
                  value={formData.fecha_nacimiento}
                  onChange={handleChange}
                />

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Tipo de Membresía *</label>
                  <select
                    name="tipo_membresia"
                    value={formData.tipo_membresia}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                    required
                  >
                    <option value="basica">💳 Básica - $50/mes</option>
                    <option value="premium">⭐ Premium - $80/mes</option>
                    <option value="vip">👑 VIP - $120/mes</option>
                  </select>
                </div>
              </div>

              {message && (
                <div
                  className={`p-4 rounded-lg ${
                    message.includes("✅")
                      ? "bg-green-50 text-green-800 border border-green-200"
                      : "bg-red-50 text-red-800 border border-red-200"
                  }`}
                >
                  {message}
                </div>
              )}

              <div className="flex gap-4">
                <Button type="submit" disabled={loading} className="flex-1">
                  {loading ? "⏳ Registrando..." : "✅ Registrar Miembro"}
                </Button>

                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.push("/dashboard/admin")}
                  className="flex-1"
                >
                  Cancelar
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
