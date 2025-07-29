'use client'

import { FishSighting } from '@/lib/types'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

interface FishListProps {
  sightings: FishSighting[]
  loading: boolean
}

export function FishList({ sightings, loading }: FishListProps) {
  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader>
              <div className="h-4 bg-gray-200 rounded w-1/3"></div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="h-3 bg-gray-200 rounded w-full"></div>
                <div className="h-3 bg-gray-200 rounded w-2/3"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  if (sightings.length === 0) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-8">
          <div className="text-center text-gray-500">
            <div className="text-4xl mb-2">🐟</div>
            <p>No fish sightings yet</p>
            <p className="text-sm">Add your first sighting below!</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Recent Sightings</h2>
        <Badge variant="secondary">{sightings.length} total</Badge>
      </div>
      
      <div className="space-y-3 max-h-96 overflow-y-auto">
        {sightings.map((sighting) => (
          <Card key={sighting.id} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base">{sighting.species}</CardTitle>
                <Badge variant="outline" className="text-xs">
                  {new Date(sighting.timestamp).toLocaleDateString()}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <p className="text-sm text-gray-600 mb-2">{sighting.description}</p>
              
              <div className="flex items-center justify-between text-xs text-gray-500">
                <div className="flex items-center gap-4">
                  <span>📍 {sighting.latitude.toFixed(4)}, {sighting.longitude.toFixed(4)}</span>
                  {sighting.reportedBy && (
                    <span>👤 {sighting.reportedBy}</span>
                  )}
                </div>
                <span>{new Date(sighting.timestamp).toLocaleTimeString()}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
