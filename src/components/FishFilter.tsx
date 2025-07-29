'use client'

import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent } from '@/components/ui/card'
import { FishSighting } from '@/lib/types'

interface FishFilterProps {
  sightings: FishSighting[]
  onFilter: (filteredSightings: FishSighting[]) => void
}

export function FishFilter({ sightings, onFilter }: FishFilterProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedSpecies, setSelectedSpecies] = useState<string>('all')
  const [dateFilter, setDateFilter] = useState<string>('all')

  // Get unique species from sightings
  const uniqueSpecies = Array.from(new Set(sightings.map(s => s.species))).sort()

  const applyFilters = () => {
    let filtered = [...sightings]

    // Filter by search term (species or description)
    if (searchTerm) {
      filtered = filtered.filter(sighting =>
        sighting.species.toLowerCase().includes(searchTerm.toLowerCase()) ||
        sighting.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        sighting.reportedBy?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Filter by selected species
    if (selectedSpecies && selectedSpecies !== 'all') {
      filtered = filtered.filter(sighting => sighting.species === selectedSpecies)
    }

    // Filter by date
    if (dateFilter && dateFilter !== 'all') {
      const now = new Date()
      const filterDate = new Date()

      switch (dateFilter) {
        case 'today':
          filterDate.setHours(0, 0, 0, 0)
          filtered = filtered.filter(sighting => new Date(sighting.timestamp) >= filterDate)
          break
        case 'week':
          filterDate.setDate(now.getDate() - 7)
          filtered = filtered.filter(sighting => new Date(sighting.timestamp) >= filterDate)
          break
        case 'month':
          filterDate.setMonth(now.getMonth() - 1)
          filtered = filtered.filter(sighting => new Date(sighting.timestamp) >= filterDate)
          break
      }
    }

    onFilter(filtered)
  }

  const clearFilters = () => {
    setSearchTerm('')
    setSelectedSpecies('all')
    setDateFilter('all')
    onFilter(sightings)
  }

  return (
    <Card className="mb-6">
      <CardContent className="pt-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
          <div className="space-y-2">
            <label className="text-sm font-medium">Search</label>
            <Input
              placeholder="Search species, description..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Species</label>
            <Select value={selectedSpecies} onValueChange={setSelectedSpecies}>
              <SelectTrigger>
                <SelectValue placeholder="All species" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All species</SelectItem>
                {uniqueSpecies.map(species => (
                  <SelectItem key={species} value={species}>
                    {species}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Time Period</label>
            <Select value={dateFilter} onValueChange={setDateFilter}>
              <SelectTrigger>
                <SelectValue placeholder="All time" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All time</SelectItem>
                <SelectItem value="today">Today</SelectItem>
                <SelectItem value="week">Past week</SelectItem>
                <SelectItem value="month">Past month</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex gap-2">
            <Button onClick={applyFilters} className="flex-1">
              Filter
            </Button>
            <Button onClick={clearFilters} variant="outline">
              Clear
            </Button>
          </div>
        </div>

        {/* Active filters display */}
        {(searchTerm || (selectedSpecies && selectedSpecies !== 'all') || (dateFilter && dateFilter !== 'all')) && (
          <div className="mt-4 flex flex-wrap gap-2">
            <span className="text-sm text-gray-600">Active filters:</span>
            {searchTerm && (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800">
                Search: "{searchTerm}"
              </span>
            )}
            {selectedSpecies && selectedSpecies !== 'all' && (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-green-100 text-green-800">
                Species: {selectedSpecies}
              </span>
            )}
            {dateFilter && dateFilter !== 'all' && (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-purple-100 text-purple-800">
                Time: {dateFilter === 'today' ? 'Today' : dateFilter === 'week' ? 'Past week' : 'Past month'}
              </span>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
