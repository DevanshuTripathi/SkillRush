"use client"
import { useState } from 'react'
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Linkedin } from "lucide-react"

const LinkedInInput = () => {
  const [url, setUrl] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    console.log('LinkedIn URL:', url)
    // Handle the LinkedIn URL submission here
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <label className="text-sm font-medium">
          Enter your LinkedIn Profile URL
        </label>
        <div className="relative">
          <Input
            type="url"
            placeholder="https://www.linkedin.com/in/your-profile"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className="pl-10"
            pattern="^https?:\/\/(www\.)?linkedin\.com\/in\/[\w-]+\/?$"
            required
          />
          <Linkedin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        </div>
      </div>
      <Button type="submit" className="w-full" disabled={!url}>
        Import Profile
      </Button>
    </form>
  )
}

export default LinkedInInput
