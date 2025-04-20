"use client"

import { useState, useRef, type ChangeEvent, type FormEvent } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "@/hooks/use-toast"
import { ImageIcon, Upload } from "lucide-react"
import { albumClient } from "@/lib/api-client"

export function UploadAlbumForm() {
  // Form data
  const [title, setTitle] = useState("")

  // File uploads
  const [coverFile, setCoverFile] = useState<File | null>(null)
  const [coverUrl, setCoverUrl] = useState<string | null>(null)

  // Loading state
  const [isLoading, setIsLoading] = useState(false)

  // Refs
  const coverInputRef = useRef<HTMLInputElement>(null)

  // Handle cover image upload
  const handleCoverUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validate file type
    if (!file.type.startsWith("image/")) {
      toast({
        title: "Invalid file type",
        description: "Please upload an image file.",
        variant: "destructive",
      })
      return
    }

    // Create object URL for the image file
    const url = URL.createObjectURL(file)

    // Clean up previous URL if exists
    if (coverUrl) {
      URL.revokeObjectURL(coverUrl)
    }

    setCoverFile(file)
    setCoverUrl(url)

    toast({
      title: "Cover image uploaded",
      description: `${file.name} has been uploaded.`,
    })
  }

  // Handle form submission
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()

    if (!title) {
      toast({
        title: "Missing information",
        description: "Please enter an album title.",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    try {
      // Create the album
      const newAlbum = await albumClient.createAlbum({
        title,
        coverArt: coverUrl || "/placeholder.svg?height=200&width=200",
        releaseDate: new Date().toISOString(),
      })
      const albums = await albumClient.getAlbums()
      console.log(albums,"albums")

      toast({
        title: "Album created",
        description: `${title} has been created successfully.`,
      })

      // Reset form
      setTitle("")

      // Clean up URLs
      if (coverUrl) {
        // URL.revokeObjectURL(coverUrl)
        setCoverUrl(null)
        setCoverFile(null)
      }

      // Reset file inputs
      if (coverInputRef.current) coverInputRef.current.value = ""
    } catch (error) {
      console.error("Error creating album:", error)
      toast({
        title: "Error",
        description: "Failed to create album. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  // Clean up URLs when component unmounts
  const cleanUpUrls = () => {
    if (coverUrl) URL.revokeObjectURL(coverUrl)
  }

  return (
    <Card>
      <form onSubmit={handleSubmit}>
        <CardHeader>
          <CardTitle>Create New Album</CardTitle>
          <CardDescription>Enter album details and upload a cover image.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Album Title */}
          <div className="space-y-2">
            <Label htmlFor="title">Album Title *</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter album title"
              required
            />
          </div>

          {/* Cover Image Upload */}
          <div className="space-y-2">
            <Label htmlFor="cover">Cover Image</Label>
            <div className="flex items-center gap-4">
              <div className="flex-1">
                <div
                  className="border-2 border-dashed rounded-md p-6 flex flex-col items-center justify-center cursor-pointer hover:border-primary/50 transition-colors"
                  onClick={() => coverInputRef.current?.click()}
                >
                  <input
                    ref={coverInputRef}
                    type="file"
                    id="cover"
                    accept="image/*"
                    onChange={handleCoverUpload}
                    className="hidden"
                  />
                  <ImageIcon className="h-10 w-10 text-muted-foreground mb-2" />
                  <div className="text-center">
                    {coverFile ? (
                      <div>
                        <p className="font-medium text-sm">{coverFile.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {(coverFile.size / (1024 * 1024)).toFixed(2)} MB
                        </p>
                      </div>
                    ) : (
                      <div>
                        <p className="font-medium">Click to upload cover image</p>
                        <p className="text-xs text-muted-foreground">JPG, PNG, GIF (max 5MB)</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {coverUrl && (
                <div className="h-40 w-40 rounded-md overflow-hidden border">
                  <img
                    src={coverUrl || "/placeholder.svg"}
                    alt="Cover preview"
                    className="h-full w-full object-cover"
                  />
                </div>
              )}
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button type="button" variant="outline" onClick={cleanUpUrls}>
            Cancel
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? (
              <span className="flex items-center">
                <svg
                  className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Creating...
              </span>
            ) : (
              <>
                <Upload className="h-4 w-4 mr-2" />
                Create Album
              </>
            )}
          </Button>
        </CardFooter>
      </form>
    </Card>
  )
}
