/**
 * Página principal de la aplicación de gestión de gimnasio
 * Redirige automáticamente a la página de login
 */
import { redirect } from "next/navigation"

export default function HomePage() {
  // Redirigir automáticamente al login
  redirect("/login")
}
