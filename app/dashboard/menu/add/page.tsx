"use client"

import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabase"
import { useRouter } from "next/navigation"

export default function AddMenuItem() {
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [price, setPrice] = useState("")
  const [image, setImage] = useState<File | null>(null)
  const router = useRouter()

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
  }

  async function handleAdd() {
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      alert("Please login")
      return
    }

    let imageUrl = ""

    if (image) {
      const fileName = `${Date.now()}-${image.name}`

      const { error: uploadError } = await supabase.storage
        .from("menu-images")
        .upload(fileName, image)

      if (uploadError) {
        console.error(uploadError)
        alert("Image upload failed")
        return
      }

      const { data } = supabase.storage
        .from("menu-images")
        .getPublicUrl(fileName)

      imageUrl = data.publicUrl
    }

    const { data: restaurant } = await supabase
      .from("restaurants")
      .select("id")
      .eq("owner_id", user.id)
      .single()

    const { error } = await supabase
      .from("menu_items")
      .insert([
        {
          name,
          description,
          price: Number(price),
          restaurant_id: restaurant?.id,
          image_url: imageUrl
        }
      ])

    if (error) {
      console.error(error)
      alert("Error adding menu item")
    } else {
      alert("Menu item added!")
      router.push("/dashboard/menu")
    }
  }

  return (
    <div className="p-10 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-6">Add Menu Item</h1>

      <input
        placeholder="Item Name"
        className="border p-2 w-full mb-3"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

      <textarea
        placeholder="Description"
        className="border p-2 w-full mb-3"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />

      <input
        placeholder="Price"
        className="border p-2 w-full mb-3"
        value={price}
        onChange={(e) => setPrice(e.target.value)}
      />

      <input
        type="file"
        className="border p-2 w-full mb-3"
        onChange={(e) => setImage(e.target.files?.[0] || null)}
      />

      <button
        onClick={handleAdd}
        className="bg-green-600 text-white px-4 py-2 w-full rounded"
      >
        Add Item
      </button>
    </div>
  )
}