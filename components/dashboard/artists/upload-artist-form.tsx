"use client"

import { useState, useRef, type ChangeEvent, type FormEvent } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "@/hooks/use-toast"
import { ImageIcon, Upload } from "lucide-react"
import { artistClient } from "@/lib/api-client"

export function UploadArtistForm() {
  // Form data
  const [name, setName] = useState("")

  // File uploads
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imageUrl, setImageUrl] = useState<string | null>(null)

  // Loading state
  const [isLoading, setIsLoading] = useState(false)

  // Refs
  const imageInputRef = useRef<HTMLInputElement>(null)

  // Handle image upload
  const handleImageUpload = (e: ChangeEvent<HTMLInputElement>) => {
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
    if (imageUrl) {
      URL.revokeObjectURL(imageUrl)
    }

    setImageFile(file)
    setImageUrl(url)

    toast({
      title: "Artist image uploaded",
      description: `${file.name} has been uploaded.`,
    })
  }

  // Handle form submission
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()

    if (!name) {
      toast({
        title: "Missing information",
        description: "Please enter an artist name.",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    try {
      // Create the artist
      const newArtist = await artistClient.createArtist({
        name,
        image: imageUrl || "/placeholder.svg?height=200&width=200",
      })
      const artists = await artistClient.getArtists()
      console.log(artists,"artists")

      toast({
        title: "Artist created",
        description: `${name} has been created successfully.`,
      })

      // Reset form
      setName("")

      // Clean up URLs
      if (imageUrl) {
        // URL.revokeObjectURL(imageUrl)
        setImageUrl(null)
        setImageFile(null)
      }

      // Reset file inputs
      if (imageInputRef.current) imageInputRef.current.value = ""
    } catch (error) {
      console.error("Error creating artist:", error)
      toast({
        title: "Error",
        description: "Failed to create artist. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  // Clean up URLs when component unmounts
  const cleanUpUrls = () => {
    if (imageUrl) URL.revokeObjectURL(imageUrl)
  }

  return (
    <Card>
      <form onSubmit={handleSubmit}>
        <CardHeader>
          <CardTitle>Create New Artist</CardTitle>
          <CardDescription>Enter artist details and upload a profile image.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Artist Name */}
          <div className="space-y-2">
            <Label htmlFor="name">Artist Name *</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter artist name"
              required
            />
          </div>

          {/* Artist Image Upload */}
          <div className="space-y-2">
            <Label htmlFor="image">Artist Image</Label>
            <div className="flex items-center gap-4">
              <div className="flex-1">
                <div
                  className="border-2 border-dashed rounded-md p-6 flex flex-col items-center justify-center cursor-pointer hover:border-primary/50 transition-colors"
                  onClick={() => imageInputRef.current?.click()}
                >
                  <input
                    ref={imageInputRef}
                    type="file"
                    id="image"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                  <ImageIcon className="h-10 w-10 text-muted-foreground mb-2" />
                  <div className="text-center">
                    {imageFile ? (
                      <div>
                        <p className="font-medium text-sm">{imageFile.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {(imageFile.size / (1024 * 1024)).toFixed(2)} MB
                        </p>
                      </div>
                    ) : (
                      <div>
                        <p className="font-medium">Click to upload artist image</p>
                        <p className="text-xs text-muted-foreground">JPG, PNG, GIF (max 5MB)</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {imageUrl && (
                <div className="h-40 w-40 rounded-full overflow-hidden border">
                  <img
                    src={imageUrl || "/placeholder.svg"}
                    alt="Artist preview"
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
                Create Artist
              </>
            )}
          </Button>
        </CardFooter>
      </form>
    </Card>
  )
}
