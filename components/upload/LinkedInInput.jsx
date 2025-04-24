"use client"
import { useState } from 'react'
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Linkedin, Loader2 } from "lucide-react"
import { toast } from "sonner"
import { fetchLinkedInSkills } from '@/lib/actions/linkedin'

const LinkedInInput = () => {
  const [url, setUrl] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const skills = await fetchLinkedInSkills(url)
      toast.success(`Found ${skills.length} skills from your profile`)
      // Here you can handle the skills data, for example:
      console.log('Skills:', skills)
    } catch (error) {
      toast.error('Failed to fetch skills from LinkedIn')
    } finally {
      setLoading(false)
    }
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
      <Button type="submit" className="w-full" disabled={!url || loading}>
        {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        {loading ? 'Importing...' : 'Import Profile'}
      </Button>
    </form>
  )
}

export default LinkedInInput
