"use client"

import { useState } from "react"
import { supabase } from "@/lib/supabase"

export default function LoginPage() {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")

async function handleLogin() {
    const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
    })

    if (error) {
        alert(error.message)
        return
    }

    const { data: { user } } = await supabase.auth.getUser()

    const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user!.id)
        .single()

    if (profile?.role === "restaurant") {
        window.location.href = "/dashboard"
    } else {
        window.location.href = "/"
    }
}

    return (
        <div className="p-10 max-w-md mx-auto">
            <h1 className="text-2xl font-bold mb-4">Login</h1>

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
                onClick={async () => {
                    const { data, error } = await supabase.auth.signUp({
                        email,
                        password,
                    })

                    if (error) {
                        alert(error.message)
                        return
                    }

                    await supabase.from("profiles").insert([{
                        id: data.user?.id,
                        role: "customer"
                    }])

                    alert("Account created! You can now login.")
                }}
                className="bg-gray-700 text-white px-4 py-2 w-full rounded mt-3"
            >
                Sign Up
            </button>
        </div>
    )
}