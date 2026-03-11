"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"

export default function MenuDashboard() {
    const [menuItems, setMenuItems] = useState<any[]>([])

    useEffect(() => {
        fetchMenu()
    }, [])

    async function fetchMenu() {

        const { data: { user } } = await supabase.auth.getUser()

        if (!user) return

        const { data, error } = await supabase
        .from("menu_items")
        .select(`
        *,
        restaurants!inner (
        owner_id
        )
        `)
        .eq("restaurants.owner_id", user.id)

        if (error) {
            console.error(error)
        } else {
            setMenuItems(data || [])
        }
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

                        <p className="font-semibold">₹{item.price}</p>
                    </div>
                ))}
            </div>
        </div>
    )
}