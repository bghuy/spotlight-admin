import type { Metadata } from "next"
import { UploadAlbumForm } from "@/components/dashboard/albums/upload-album-form"

export const metadata: Metadata = {
  title: "Upload Album",
  description: "Upload a new album to the platform.",
}

export default function UploadAlbumPage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Upload Album</h1>
        <p className="text-muted-foreground">Create a new album by providing a title and cover image.</p>
      </div>
      <UploadAlbumForm />
    </div>
  )
}
