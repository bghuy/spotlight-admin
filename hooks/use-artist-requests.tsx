"use client"

import { useState } from "react"
import type { ArtistRequest } from "@/lib/types"
import { approveArtistRequest, rejectArtistRequest } from "@/lib/actions"
import { toast } from "@/hooks/use-toast"

export function useArtistRequests(initialRequests: ArtistRequest[]) {
  const [requests, setRequests] = useState<ArtistRequest[]>(initialRequests)
  const [isLoading, setIsLoading] = useState<Record<string, boolean>>({})

  const handleApprove = async (id: string) => {
    setIsLoading((prev) => ({ ...prev, [id]: true }))

    try {
      const result = await approveArtistRequest(id)

      if (result.success) {
        setRequests((prev) => prev.map((request) => (request.id === id ? { ...request, status: "approved" } : request)))
        toast({
          title: "Artist approved",
          description: "The artist request has been approved successfully.",
        })
      } else {
        throw new Error(result.error || "Failed to approve artist")
      }
    } catch (error) {
      toast({
        title: "Error",
        description: (error as Error).message || "An error occurred while approving the artist.",
        variant: "destructive",
      })
    } finally {
      setIsLoading((prev) => ({ ...prev, [id]: false }))
    }
  }

  const handleReject = async (id: string) => {
    setIsLoading((prev) => ({ ...prev, [id]: true }))

    try {
      const result = await rejectArtistRequest(id)

      if (result.success) {
        setRequests((prev) => prev.map((request) => (request.id === id ? { ...request, status: "rejected" } : request)))
        toast({
          title: "Artist rejected",
          description: "The artist request has been rejected.",
        })
      } else {
        throw new Error(result.error || "Failed to reject artist")
      }
    } catch (error) {
      toast({
        title: "Error",
        description: (error as Error).message || "An error occurred while rejecting the artist.",
        variant: "destructive",
      })
    } finally {
      setIsLoading((prev) => ({ ...prev, [id]: false }))
    }
  }

  return {
    requests,
    isLoading,
    handleApprove,
    handleReject,
  }
}
