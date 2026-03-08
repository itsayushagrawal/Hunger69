import { RestaurantCard } from "@/components/restaurant-card"

const restaurants = [
  {
    name: "Test Cafe",
    description: "Coffee and snacks",
    city: "Gurgaon",
    image: "https://images.unsplash.com/photo-1555992336-03a23c6b0d4c?w=800&q=80",
    rating: 4.3,
  },
  {
    name: "Spice Kitchen",
    description: "North Indian food",
    city: "Delhi",
    image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&q=80",
    rating: 4.7,
  },
  {
    name: "The Green Bowl",
    description: "Fresh salads and healthy bowls for the health conscious",
    city: "Mumbai",
    image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&q=80",
    rating: 4.5,
  },
  {
    name: "Pizza Paradise",
    description: "Authentic Italian pizzas and pastas",
    city: "Bangalore",
    image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=800&q=80",
    rating: 4.6,
  },
  {
    name: "Sushi Express",
    description: "Japanese cuisine and fresh sushi rolls",
    city: "Pune",
    image: "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=800&q=80",
    rating: 4.8,
  },
  {
    name: "Burger Barn",
    description: "Gourmet burgers and crispy fries",
    city: "Hyderabad",
    image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800&q=80",
    rating: 4.4,
  },
]

export default function Home() {
  return (
    <main className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 sm:py-12">
        <header className="mb-8 sm:mb-10">
          <h1 className="text-3xl sm:text-4xl font-bold text-foreground text-balance">
            Nearby Restaurants
          </h1>
          <p className="mt-2 text-muted-foreground">
            Discover the best food spots around you
          </p>
        </header>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {restaurants.map((restaurant) => (
            <RestaurantCard key={restaurant.name} restaurant={restaurant} />
          ))}
        </div>
      </div>
    </main>
  )
}
