"use client"

import { useState } from "react"
import { supabase } from "@/lib/supabase"
import { useRouter } from "next/navigation"

export default function RestaurantLogin() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const router = useRouter()

  async function handleLogin() {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      alert(error.message)
    } else {
      window.location.href = "/dashboard"
    }
  }

async function handleSignup() {
    const { data, error } = await supabase.auth.signUp({
        email,
        password,
    })

    if (error) {
        alert(error.message)
        return
    }

await supabase.from("profiles").upsert([{
    id: data.user?.id,
    role: "restaurant"
}])

    window.location.href = "/create-restaurant"
}

  return (
    <div className="p-10 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-6">Restaurant Owner Login</h1>

      <input
        type="email"
        placeholder="Email"
        className="border p-2 w-full mb-3"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <input
        type="password"
        placeholder="Password"
        className="border p-2 w-full mb-3"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <button
        onClick={handleLogin}
        className="bg-black text-white px-4 py-2 w-full rounded"
      >
        Login
      </button>

      <button
        onClick={handleSignup}
        className="bg-gray-700 text-white px-4 py-2 w-full rounded mt-3"
      >
        Sign Up as Restaurant
      </button>
    </div>
  )
}