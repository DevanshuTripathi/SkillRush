"use client"
import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Upload, X } from "lucide-react"
import { Input } from "@/components/ui/input"

const ResumeUpload = () => {
  const [file, setFile] = useState(null)

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0]
    if (selectedFile && (selectedFile.type === 'application/pdf' || selectedFile.type.includes('document'))) {
      setFile(selectedFile)
    } else {
      alert('Please upload a PDF or Word document')
    }
  }

  return (
    <div className="space-y-4 w-full max-w-md mx-auto">
      <div className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-lg hover:bg-muted/50 transition-colors">
        {!file ? (
          <label className="flex flex-col items-center justify-center w-full h-full cursor-pointer">
            <Upload className="w-10 h-10 mb-2 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">
              Upload your resume (PDF or Word)
            </p>
            <Input
              type="file"
              className="hidden"
              accept=".pdf,.doc,.docx"
              onChange={handleFileChange}
            />
          </label>
        ) : (
          <div className="flex flex-col items-center space-y-2">
            <div className="flex items-center space-x-2">
              <span className="text-sm font-medium">{file.name}</span>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setFile(null)}
                className="h-8 w-8"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">
              {(file.size / 1024 / 1024).toFixed(2)} MB
            </p>
          </div>
        )}
      </div>
      {file && (
        <Button className="w-full" onClick={() => console.log('Uploading:', file)}>
          Upload Resume
        </Button>
      )}
    </div>
  )
}

export default ResumeUpload
