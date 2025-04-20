import type { Metadata } from "next"
import { UploadArtistForm } from "@/components/dashboard/artists/upload-artist-form"

export const metadata: Metadata = {
  title: "Upload Artist",
  description: "Upload a new artist to the platform.",
}

export default function UploadArtistPage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Upload Artist</h1>
        <p className="text-muted-foreground">Create a new artist by providing a name and profile image.</p>
      </div>
      <UploadArtistForm />
    </div>
  )
}
