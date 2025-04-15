"use client"

import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, XCircle, Loader2 } from "lucide-react"
import type { ArtistRequest } from "@/lib/types"
import { useState } from "react"
import { artistRequestClient } from "@/lib/api-client"
import { toast } from "@/hooks/use-toast"

interface ArtistRequestsClientProps {
  initialRequests: ArtistRequest[]
}

export function ArtistRequestsClient({ initialRequests }: ArtistRequestsClientProps) {
  const [requests, setRequests] = useState<ArtistRequest[]>(initialRequests)
  const [isLoading, setIsLoading] = useState<Record<string, boolean>>({})

  const handleApprove = async (id: string) => {
    setIsLoading((prev) => ({ ...prev, [id]: true }))

    try {
      const updatedRequest = await artistRequestClient.approveArtistRequest(id)

      setRequests((prev) => prev.map((request) => (request.id === id ? updatedRequest : request)))

      toast({
        title: "Artist approved",
        description: "The artist request has been approved successfully.",
      })
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
      const updatedRequest = await artistRequestClient.rejectArtistRequest(id)

      setRequests((prev) => prev.map((request) => (request.id === id ? updatedRequest : request)))

      toast({
        title: "Artist rejected",
        description: "The artist request has been rejected.",
      })
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

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>Genre</TableHead>
          <TableHead>Submission Date</TableHead>
          <TableHead>Status</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {requests.length === 0 ? (
          <TableRow>
            <TableCell colSpan={6} className="h-24 text-center">
              No pending requests
            </TableCell>
          </TableRow>
        ) : (
          requests.map((request) => (
            <TableRow key={request.id}>
              <TableCell className="font-medium">{request.name}</TableCell>
              <TableCell>{request.email}</TableCell>
              <TableCell>{request.genre}</TableCell>
              <TableCell>{request.createdAt}</TableCell>
              <TableCell>
                <Badge variant="outline">{request.status}</Badge>
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    className="h-8 gap-1 text-green-600"
                    onClick={() => handleApprove(request.id)}
                    disabled={isLoading[request.id] || request.status !== "pending"}
                  >
                    {isLoading[request.id] ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <CheckCircle className="h-4 w-4" />
                    )}
                    Approve
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="h-8 gap-1 text-red-600"
                    onClick={() => handleReject(request.id)}
                    disabled={isLoading[request.id] || request.status !== "pending"}
                  >
                    {isLoading[request.id] ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <XCircle className="h-4 w-4" />
                    )}
                    Reject
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  )
}
