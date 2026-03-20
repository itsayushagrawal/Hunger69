"use client"

import { useState } from "react"
import { supabase } from "@/lib/supabase"
import { useRouter } from "next/navigation"

export default function CreateRestaurant() {
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [city, setCity] = useState("")
  const router = useRouter()

  async function handleCreate() {
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      alert("Please login")
      return
    }

    const { error } = await supabase
      .from("restaurants")
      .insert([
        {
          name,
          description,
          city,
          owner_id: user.id
        }
      ])

    if (error) {
      console.error(error)
      alert("Error creating restaurant")
    } else {
      alert("Restaurant created!")
      router.push("/dashboard/menu/add")
    }
  }

  return (
    <div className="p-10 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-6">Create Your Restaurant</h1>

      <input
        placeholder="Restaurant Name"
        className="border p-2 w-full mb-3"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

      <input
        placeholder="City"
        className="border p-2 w-full mb-3"
        value={city}
        onChange={(e) => setCity(e.target.value)}
      />

      <textarea
        placeholder="Description"
        className="border p-2 w-full mb-3"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />

      <button
        onClick={handleCreate}
        className="bg-green-600 text-white px-4 py-2 w-full rounded"
      >
        Create Restaurant
      </button>
    </div>
  )
}