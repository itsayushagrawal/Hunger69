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
    const [orderType, setOrderType] = useState("pickup")

    const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0)

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
            .eq("is_available", true)

        if (error) {
            console.error(error)
        } else {
            setMenuItems(data || [])
        }
    }

    function addToCart(item: any) {
        setCart((prev) => {
            const existing = prev.find((i) => i.id === item.id)

            if (existing) {
                return prev.map((i) =>
                    i.id === item.id
                        ? { ...i, quantity: (i.quantity || 1) + 1 }
                        : i
                )
            }

            return [...prev, { ...item, quantity: 1 }]
        })
    }

    async function handleCheckout() {
        if (cart.length === 0) return

        const { data: { user } } = await supabase.auth.getUser()

        if (!user) {
            alert("Please login first")
            return
        }

        const { data, error } = await supabase
            .from("orders")
            .insert([
                {
                    restaurant_id: id,
                    customer_id: user.id,
                    total_amount: total,
                    status: "pending",
                    order_type: orderType,
                },
            ])
            .select()
            .single()

        if (error) {
            console.error("Order error:", JSON.stringify(error))
            return
        }

        const orderId = data.id

        const items = cart.map((item) => ({
            order_id: orderId,
            menu_item_id: item.id,
            quantity: item.quantity,
            price: item.price,
        }))

        await supabase.from("order_items").insert(items)

        alert("Order placed!")
        setCart([])
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
                        className="border rounded-lg overflow-hidden flex justify-between items-center"
                    >
                        {item.image_url && (
                            <img
                                src={item.image_url}
                                alt={item.name}
                                className="w-24 h-24 object-cover flex-shrink-0"
                            />
                        )}

                        <div className="flex-1 p-4">
                            <h3 className="font-medium">{item.name}</h3>
                            <p className="text-sm text-gray-500">{item.description}</p>
                        </div>

                        <div className="flex items-center gap-3 p-4">
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

            <h2 className="text-2xl font-semibold mt-10 mb-4">Order Type</h2>
            <div className="flex gap-3">
                <button
                    onClick={() => setOrderType("dine_in")}
                    className={`px-4 py-2 rounded border ${orderType === "dine_in" ? "bg-black text-white" : ""}`}
                >
                    Dine In
                </button>
                <button
                    onClick={() => setOrderType("pickup")}
                    className={`px-4 py-2 rounded border ${orderType === "pickup" ? "bg-black text-white" : ""}`}
                >
                    Pickup
                </button>
                <button
                    onClick={() => setOrderType("delivery")}
                    className={`px-4 py-2 rounded border ${orderType === "delivery" ? "bg-black text-white" : ""}`}
                >
                    Delivery
                </button>
            </div>
            <h2 className="text-2xl font-semibold mt-10 mb-4">Cart</h2>

            <div className="space-y-3">
                {cart.map((item, index) => (
                    <div
                        key={index}
                        className="border p-3 rounded-md flex justify-between items-center"
                    >
                        <span>
                            {item.name} x{item.quantity}
                        </span>

                        <span>
                            ₹{item.price * item.quantity}
                        </span>
                    </div>
                ))}
            </div>
            <div className="border-t pt-4 mt-4 flex justify-between font-semibold text-lg">
                <span>Total</span>
                <span>₹{total}</span>
            </div>

            <button
                onClick={handleCheckout}
                className="w-full bg-green-600 text-white py-3 rounded-lg mt-4 font-medium"
            >
                Checkout
            </button>

        </div>
    )
}