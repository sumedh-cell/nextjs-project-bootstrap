'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'

const fishSightingSchema = z.object({
  species: z.string().min(1, 'Species is required'),
  latitude: z.number().min(-90, 'Invalid latitude').max(90, 'Invalid latitude'),
  longitude: z.number().min(-180, 'Invalid longitude').max(180, 'Invalid longitude'),
  description: z.string().min(1, 'Description is required'),
  reportedBy: z.string().optional()
})

type FishSightingForm = z.infer<typeof fishSightingSchema>

interface FishFormProps {
  onSubmit: (data: FishSightingForm) => Promise<boolean>
}

export function FishForm({ onSubmit }: FishFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitMessage, setSubmitMessage] = useState<{ type: 'success' | 'error', message: string } | null>(null)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm<FishSightingForm>({
    resolver: zodResolver(fishSightingSchema)
  })

  const handleFormSubmit = async (data: FishSightingForm) => {
    setIsSubmitting(true)
    setSubmitMessage(null)

    try {
      const success = await onSubmit(data)
      
      if (success) {
        setSubmitMessage({ type: 'success', message: 'Fish sighting added successfully!' })
        reset()
      } else {
        setSubmitMessage({ type: 'error', message: 'Failed to add fish sighting. Please try again.' })
      }
    } catch (error) {
      setSubmitMessage({ type: 'error', message: 'An unexpected error occurred.' })
    } finally {
      setIsSubmitting(false)
    }
  }

  // Get user's current location
  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude
          const lng = position.coords.longitude
          
          // Update form fields
          const latInput = document.getElementById('latitude') as HTMLInputElement
          const lngInput = document.getElementById('longitude') as HTMLInputElement
          
          if (latInput) latInput.value = lat.toString()
          if (lngInput) lngInput.value = lng.toString()
        },
        (error) => {
          setSubmitMessage({ type: 'error', message: 'Unable to get your location. Please enter coordinates manually.' })
        }
      )
    } else {
      setSubmitMessage({ type: 'error', message: 'Geolocation is not supported by this browser.' })
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Report Fish Sighting</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
          {submitMessage && (
            <Alert className={submitMessage.type === 'error' ? 'border-red-200 bg-red-50' : 'border-green-200 bg-green-50'}>
              <AlertDescription className={submitMessage.type === 'error' ? 'text-red-800' : 'text-green-800'}>
                {submitMessage.message}
              </AlertDescription>
            </Alert>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="species">Fish Species *</Label>
              <Input
                id="species"
                placeholder="e.g., Atlantic Salmon"
                {...register('species')}
                className={errors.species ? 'border-red-500' : ''}
              />
              {errors.species && (
                <p className="text-sm text-red-500">{errors.species.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="reportedBy">Your Name</Label>
              <Input
                id="reportedBy"
                placeholder="Optional"
                {...register('reportedBy')}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="latitude">Latitude *</Label>
              <Input
                id="latitude"
                type="number"
                step="any"
                placeholder="e.g., 44.2619"
                {...register('latitude', { valueAsNumber: true })}
                className={errors.latitude ? 'border-red-500' : ''}
              />
              {errors.latitude && (
                <p className="text-sm text-red-500">{errors.latitude.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="longitude">Longitude *</Label>
              <Input
                id="longitude"
                type="number"
                step="any"
                placeholder="e.g., -72.5806"
                {...register('longitude', { valueAsNumber: true })}
                className={errors.longitude ? 'border-red-500' : ''}
              />
              {errors.longitude && (
                <p className="text-sm text-red-500">{errors.longitude.message}</p>
              )}
            </div>
          </div>

          <div className="flex justify-center">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={getCurrentLocation}
              className="text-xs"
            >
              📍 Use My Location
            </Button>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description *</Label>
            <Textarea
              id="description"
              placeholder="Describe the fish, location details, behavior, etc."
              rows={3}
              {...register('description')}
              className={errors.description ? 'border-red-500' : ''}
            />
            {errors.description && (
              <p className="text-sm text-red-500">{errors.description.message}</p>
            )}
          </div>

          <Button
            type="submit"
            className="w-full"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Adding Sighting...' : 'Add Fish Sighting'}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
