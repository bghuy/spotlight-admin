"use client"

import { UploadSongForm } from "@/components/dashboard/songs/upload-song-form"

export default function UploadSongPage() {
  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-2xl font-bold tracking-tight">Upload Song</h1>
      <p className="text-muted-foreground">Upload a new song to the platform for review.</p>
      <UploadSongForm />
    </div>
  )
}
