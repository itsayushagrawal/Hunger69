"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"
import Link from "next/link"

export default function Navbar() {
    const [role, setRole] = useState<string | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetchRole()
    }, [])

    async function fetchRole() {
        const { data: { user } } = await supabase.auth.getUser()

        if (!user) {
            setLoading(false)
            return
        }

        const { data: profile } = await supabase
            .from("profiles")
            .select("role")
            .eq("id", user.id)
            .single()

        setRole(profile?.role || null)
        setLoading(false)
    }

    async function handleLogout() {
        await supabase.auth.signOut()
        window.location.href = "/"
    }

    if (loading) return null

    return (
        <nav className="border-b px-6 py-3 flex justify-between items-center">
            <Link href="/" className="font-bold text-lg">Hunger69</Link>

            <div className="flex gap-4 items-center text-sm">
                {role === "restaurant" && (
                    <>
                        <Link href="/dashboard">Dashboard</Link>
                        <Link href="/dashboard/menu">Menu</Link>
                    </>
                )}

                {role === "customer" && (
                    <Link href="/orders">My Orders</Link>
                )}

                {!role && (
                    <>
                        <Link href="/login">Login</Link>
                        <Link href="/restaurant-login">Restaurant Login</Link>
                    </>
                )}

                {role && (
                    <button onClick={handleLogout} className="text-red-500">
                        Logout
                    </button>
                )}
            </div>
        </nav>
    )
}