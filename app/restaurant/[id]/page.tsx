"use client"

import { useParams } from "next/navigation"
import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"

export default function RestaurantPage() {
    const params = useParams()
    const id = params.id

    const [restaurant, setRestaurant] = useState<any>(null)
    const [menuItems, setMenuItems] = useState<any[]>([])
    const [cart, setCart] = useState<any[]>([])

    useEffect(() => {
        fetchRestaurant()
        fetchMenuItems()
    }, [])

    async function fetchRestaurant() {
        const { data, error } = await supabase
            .from("restaurants")
            .select("*")
            .eq("id", id)
            .single()

        if (error) {
            console.error(error)
        } else {
            setRestaurant(data)
        }
    }

    async function fetchMenuItems() {
        const { data, error } = await supabase
            .from("menu_items")
            .select("*")
            .eq("restaurant_id", id)

        if (error) {
            console.error(error)
        } else {
            setMenuItems(data || [])
        }
    }

    function addToCart(item: any) {
        setCart((prev) => [...prev, item])
    }

    if (!restaurant) {
        return <div className="p-10">Loading...</div>
    }

    return (
        <div className="p-10">
            <h1 className="text-3xl font-bold">{restaurant.name}</h1>
            <p className="mt-2">{restaurant.description}</p>
            <p className="text-gray-500">{restaurant.city}</p>

            <p className="text-sm text-gray-500 mt-2">
                Cart items: {cart.length}
            </p>

            <h2 className="text-2xl font-semibold mt-8 mb-4">Menu</h2>

            <div className="space-y-4">
                {menuItems.map((item) => (
                    <div
                        key={item.id}
                        className="border p-4 rounded-lg flex justify-between items-center"
                    >
                        <div>
                            <h3 className="font-medium">{item.name}</h3>
                            <p className="text-sm text-gray-500">{item.description}</p>
                        </div>

                        <div className="flex items-center gap-3">
                            <span className="font-semibold">₹{item.price}</span>

                            <button
                                onClick={() => addToCart(item)}
                                className="bg-black text-white px-3 py-1 rounded-md text-sm"
                            >
                                Add
                            </button>
                        </div>
                    </div>
                ))}
            </div>

        </div>
    )
}