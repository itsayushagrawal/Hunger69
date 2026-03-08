import Image from "next/image"
import { Star, MapPin } from "lucide-react"
import { Button } from "@/components/ui/button"

interface Restaurant {
  name: string
  description: string
  city: string
  image: string
  rating?: number
}

interface RestaurantCardProps {
  restaurant: Restaurant
}

export function RestaurantCard({ restaurant }: RestaurantCardProps) {
  const { name, description, city, image, rating = 4.5 } = restaurant

  return (
    <div className="group bg-card rounded-xl shadow-md overflow-hidden transition-all duration-300 hover:shadow-xl hover:scale-[1.02]">
      <div className="relative h-48 w-full overflow-hidden">
        <Image
          src={image}
          alt={name}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />
      </div>
      
      <div className="p-4 space-y-3">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-semibold text-lg text-card-foreground line-clamp-1">
            {name}
          </h3>
          <div className="flex items-center gap-1 bg-primary/10 px-2 py-0.5 rounded-full shrink-0">
            <Star className="h-3.5 w-3.5 fill-primary text-primary" />
            <span className="text-sm font-medium text-primary">{rating}</span>
          </div>
        </div>
        
        <p className="text-muted-foreground text-sm line-clamp-2">
          {description}
        </p>
        
        <div className="flex items-center gap-1.5 text-muted-foreground">
          <MapPin className="h-4 w-4" />
          <span className="text-sm">{city}</span>
        </div>
        
        <Button className="w-full mt-2">
          View Menu
        </Button>
      </div>
    </div>
  )
}
