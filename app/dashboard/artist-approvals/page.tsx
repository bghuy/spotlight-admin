"use client"

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useEffect, useState } from "react"
import { artistRequestClient } from "@/lib/api-client"
import type { ArtistRequest } from "@/lib/types"
import { ArtistRequestsClient } from "@/components/artist-requests-client"
import { ArtistRequestsSkeleton } from "@/components/artist-requests-skeleton"

export default function ArtistApprovalsPage() {
  const [requests, setRequests] = useState<ArtistRequest[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true)
        const data = await artistRequestClient.getArtistRequests("pending")
        setRequests(data)
      } catch (err) {
        setError("Failed to load artist requests")
        console.error(err)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [])

  if (isLoading) {
    return (
      <div className="flex flex-col gap-4">
        <h1 className="text-2xl font-bold tracking-tight">Artist Approval Requests</h1>
        <ArtistRequestsSkeleton />
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex flex-col gap-4">
        <h1 className="text-2xl font-bold tracking-tight">Artist Approval Requests</h1>
        <div className="rounded-md border border-destructive p-4">
          <p className="text-destructive">{error}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-2xl font-bold tracking-tight">Artist Approval Requests</h1>
      <Card>
        <CardHeader>
          <CardTitle>Pending Requests</CardTitle>
          <CardDescription>Review and approve artist account requests</CardDescription>
        </CardHeader>
        <CardContent>
          <ArtistRequestsClient initialRequests={requests} />
        </CardContent>
        <CardFooter className="flex justify-between">
          <div className="text-sm text-muted-foreground">Showing {requests.length} requests</div>
        </CardFooter>
      </Card>
    </div>
  )
}
