"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"

export default function OrdersPage() {
    const [orders, setOrders] = useState<any[]>([])

    useEffect(() => {
        fetchOrders()

        const channel = supabase
            .channel("orders")
            .on(
                "postgres_changes",
                { event: "*", schema: "public", table: "orders" },
                () => {
                    fetchOrders()
                }
            )
            .subscribe()

        return () => {
            supabase.removeChannel(channel)
        }
    }, [])

    async function fetchOrders() {
        const { data, error } = await supabase
            .from("orders")
            .select(`
        *,
        order_items (
          quantity,
          menu_items (
            name
          )
        )
      `)
            .order("created_at", { ascending: false })

        if (error) {
            console.error(error)
        } else {
            setOrders(data || [])
        }
    }

    return (
        <div className="p-10">
            <h1 className="text-3xl font-bold mb-6">Your Orders</h1>

            <div className="space-y-6">
                {orders.map((order) => (
                    <div key={order.id} className="border p-4 rounded-lg">
                        <p className="font-medium mb-2">Order ID: {order.id}</p>

                        <div className="text-sm text-gray-600 mb-2">
                            {order.order_items?.map((item: any, index: number) => (
                                <div key={index}>
                                    {item.menu_items.name} x{item.quantity}
                                </div>
                            ))}
                        </div>

                        <p className="text-sm">Status: {order.status}</p>

                        <p className="font-semibold mt-2">₹{order.total_amount}</p>
                    </div>
                ))}
            </div>
        </div>
    )
}