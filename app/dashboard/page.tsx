"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"

export default function Dashboard() {
    const [orders, setOrders] = useState<any[]>([])

    useEffect(() => {
        fetchOrders()
    }, [])

    async function fetchOrders() {
        const { data, error } = await supabase
            .from("orders")
            .select(`
  *,
  order_items (
    quantity,
    price,
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

    async function updateStatus(orderId: string, status: string) {
        const { error } = await supabase
            .from("orders")
            .update({ status })
            .eq("id", orderId)

        if (error) {
            console.error(error)
            return
        }

        fetchOrders()
    }

    return (
        <div className="p-10">
            <h1 className="text-3xl font-bold mb-6">Restaurant Dashboard</h1>

            <div className="space-y-4">
                {orders.map((order) => (
                    <div key={order.id} className="border p-4 rounded-lg flex justify-between">
                        <div className="mt-2 text-sm text-gray-600">
                            {order.order_items?.map((item: any, index: number) => (
                                <div key={index}>
                                    {item.menu_items?.name} x{item.quantity}
                                </div>
                            ))}
                        </div>
                        <div>
                            <p className="font-medium">Order ID: {order.id}</p>
                            <p className="text-sm text-gray-500">
                                Status: {order.status}
                            </p>
                        </div>
                        <div className="flex gap-2 mt-2">
                            <button
                                onClick={() => updateStatus(order.id, "preparing")}
                                className="bg-yellow-500 text-white px-2 py-1 rounded text-xs"
                            >
                                Preparing
                            </button>

                            <button
                                onClick={() => updateStatus(order.id, "ready")}
                                className="bg-blue-500 text-white px-2 py-1 rounded text-xs"
                            >
                                Ready
                            </button>

                            <button
                                onClick={() => updateStatus(order.id, "completed")}
                                className="bg-green-600 text-white px-2 py-1 rounded text-xs"
                            >
                                Complete
                            </button>
                        </div>

                        <p className="font-semibold">₹{order.total_amount}</p>
                    </div>
                ))}
            </div>
        </div>
    )
}