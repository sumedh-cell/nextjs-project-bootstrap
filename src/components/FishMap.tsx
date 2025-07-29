'use client'

import { FishSighting } from '@/lib/types'

interface FishMapProps {
  sightings: FishSighting[]
}

export function FishMap({ sightings }: FishMapProps) {
  // Calculate bounds for the map based on sightings
  const bounds = sightings.reduce(
    (acc, sighting) => ({
      minLat: Math.min(acc.minLat, sighting.latitude),
      maxLat: Math.max(acc.maxLat, sighting.latitude),
      minLng: Math.min(acc.minLng, sighting.longitude),
      maxLng: Math.max(acc.maxLng, sighting.longitude),
    }),
    {
      minLat: sightings[0]?.latitude || 44.2619,
      maxLat: sightings[0]?.latitude || 44.2619,
      minLng: sightings[0]?.longitude || -72.5806,
      maxLng: sightings[0]?.longitude || -72.5806,
    }
  )

  // Convert lat/lng to pixel positions (simplified)
  const getMarkerPosition = (lat: number, lng: number) => {
    const mapWidth = 100
    const mapHeight = 100
    
    const x = ((lng - bounds.minLng) / (bounds.maxLng - bounds.minLng)) * mapWidth
    const y = ((bounds.maxLat - lat) / (bounds.maxLat - bounds.minLat)) * mapHeight
    
    return { x: Math.max(5, Math.min(95, x)), y: Math.max(5, Math.min(95, y)) }
  }

  return (
    <div className="relative w-full h-96 bg-gradient-to-b from-blue-100 to-blue-200 rounded-lg border overflow-hidden">
      {/* Map Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-green-50 to-blue-100">
        {/* Water patterns */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-1/4 left-1/4 w-32 h-16 bg-blue-300 rounded-full blur-sm"></div>
          <div className="absolute top-1/2 right-1/3 w-24 h-12 bg-blue-300 rounded-full blur-sm"></div>
          <div className="absolute bottom-1/3 left-1/2 w-28 h-14 bg-blue-300 rounded-full blur-sm"></div>
        </div>
        
        {/* Shore lines */}
        <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-green-200 to-transparent"></div>
        <div className="absolute top-0 right-0 w-8 h-full bg-gradient-to-l from-green-200 to-transparent"></div>
      </div>

      {/* Fish Sighting Markers */}
      {sightings.map((sighting) => {
        const position = getMarkerPosition(sighting.latitude, sighting.longitude)
        return (
          <div
            key={sighting.id}
            className="absolute transform -translate-x-1/2 -translate-y-1/2 group cursor-pointer"
            style={{
              left: `${position.x}%`,
              top: `${position.y}%`,
            }}
          >
            {/* Marker */}
            <div className="w-4 h-4 bg-red-500 border-2 border-white rounded-full shadow-lg hover:scale-125 transition-transform">
              <div className="absolute inset-0 bg-red-500 rounded-full animate-ping opacity-75"></div>
            </div>
            
            {/* Tooltip */}
            <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 bg-black text-white text-xs rounded px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
              <div className="font-semibold">{sighting.species}</div>
              <div className="text-gray-300">{new Date(sighting.timestamp).toLocaleDateString()}</div>
              <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-black"></div>
            </div>
          </div>
        )
      })}

      {/* Map Legend */}
      <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm rounded-lg p-3 shadow-lg">
        <h3 className="font-semibold text-sm mb-2">Fish Sightings</h3>
        <div className="flex items-center gap-2 text-xs">
          <div className="w-3 h-3 bg-red-500 rounded-full border border-white"></div>
          <span>Recent Sighting</span>
        </div>
        <div className="text-xs text-gray-600 mt-1">
          {sightings.length} total sightings
        </div>
      </div>

      {/* Coordinates Display */}
      <div className="absolute bottom-4 right-4 bg-white/90 backdrop-blur-sm rounded px-2 py-1 text-xs text-gray-600">
        {bounds.minLat.toFixed(4)}, {bounds.minLng.toFixed(4)}
      </div>
    </div>
  )
}
