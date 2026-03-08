"use client"

import { supabase } from "@/lib/supabase"
import { useState, useEffect } from "react"
import { RestaurantCard } from "@/components/restaurant-card"

export default function Home() {
  const [restaurants, setRestaurants] = useState<any[]>([])

  useEffect(() => {
    fetchRestaurants()
  }, [])

  async function fetchRestaurants() {
    const { data, error } = await supabase
      .from("restaurants")
      .select("*")

    if (error) {
      console.error(error)
    } else {
      setRestaurants(data || [])
    }
  }

  return (
    <main className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 sm:py-12">
        <header className="mb-8 sm:mb-10">
          <h1 className="text-3xl sm:text-4xl font-bold text-foreground">
            Nearby Restaurants
          </h1>
          <p className="mt-2 text-muted-foreground">
            Discover the best food spots around you
          </p>
        </header>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {restaurants.map((restaurant) => (
            <RestaurantCard key={restaurant.id} restaurant={restaurant} />
          ))}
        </div>
      </div>
    </main>
  )
}