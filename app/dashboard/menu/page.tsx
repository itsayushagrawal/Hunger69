"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"

export default function MenuDashboard() {
    const [menuItems, setMenuItems] = useState<any[]>([])

    useEffect(() => {
        checkRole()
    }, [])

    async function checkRole() {
        const { data: { user } } = await supabase.auth.getUser()

        if (!user) {
            window.location.href = "/restaurant-login"
            return
        }

        const { data: profile } = await supabase
            .from("profiles")
            .select("role")
            .eq("id", user.id)
            .single()

        if (profile?.role !== "restaurant") {
            alert("Access denied. Restaurant owners only.")
            window.location.href = "/"
            return
        }

        fetchMenu()
    }

    async function fetchMenu() {
        const { data: { user } } = await supabase.auth.getUser()

        if (!user) return

        const { data: restaurant } = await supabase
            .from("restaurants")
            .select("id")
            .eq("owner_id", user.id)
            .single()

        if (!restaurant) return

        const { data, error } = await supabase
            .from("menu_items")
            .select("*")
            .eq("restaurant_id", restaurant.id)

        if (error) {
            console.error(error)
        } else {
            setMenuItems(data || [])
        }
    }

    async function deleteMenuItem(itemId: string) {
        const { error } = await supabase
            .from("menu_items")
            .delete()
            .eq("id", itemId)

        if (error) {
            console.error(error)
            alert("Error deleting item")
            return
        }

        fetchMenu()
    }

    return (
        <div className="p-10">
            <h1 className="text-3xl font-bold mb-6">Menu Management</h1>
            <button
                onClick={() => window.location.href = "/dashboard/menu/add"}
                className="bg-green-600 text-white px-4 py-2 rounded mb-6"
            >
                + Add Menu Item
            </button>

            <div className="space-y-4">
                {menuItems.map((item) => (
                    <div
                        key={item.id}
                        className="border p-4 rounded-lg flex justify-between"
                    >
                        <div>
                            <p className="font-medium">{item.name}</p>
                            <p className="text-sm text-gray-500">{item.description}</p>
                        </div>

                        <div className="flex items-center gap-3">
                            <p className="font-semibold">₹{item.price}</p>
                            <button
                                onClick={() => deleteMenuItem(item.id)}
                                className="bg-red-500 text-white px-3 py-1 rounded text-sm"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}