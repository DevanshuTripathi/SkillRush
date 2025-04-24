"use client"
import React, { useState } from 'react'
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { FileText, Linkedin, ListChecks } from "lucide-react"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import ResumeUpload from '@/components/upload/ResumeUpload'
import LinkedInInput from '@/components/upload/LinkedInInput'
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

const InputPage = () => {
  const [selectedOption, setSelectedOption] = useState("");
  const [skills, setSkills] = useState("");

  const options = [
    {
      id: "resume",
      title: "Upload Resume",
      description: "Upload your existing resume",
      icon: <FileText className="h-6 w-6" />,
    },
    {
      id: "linkedin",
      title: "LinkedIn Profile",
      description: "Import from your LinkedIn profile",
      icon: <Linkedin className="h-6 w-6" />,
    },
    {
      id: "manual",
      title: "Manual Input",
      description: "Enter your skills manually",
      icon: <ListChecks className="h-6 w-6" />,
    },
  ]

  const handleSkillSubmit = async () => {
    try {
      // Here you'll add the API call to save skills
      toast.success("Skills updated successfully!");
    } catch (error) {
      toast.error("Failed to update skills");
    }
  };

  const renderInputMethod = () => {
    switch(selectedOption) {
      case 'resume':
        return <ResumeUpload />
      case 'linkedin':
        return <LinkedInInput />
      case 'manual':
        return (
          <div className="space-y-4">
            <label className="text-sm font-medium">
              Enter your skills (one per line)
            </label>
            <Textarea
              placeholder="React.js&#10;Next.js&#10;TypeScript&#10;Node.js"
              value={skills}
              onChange={(e) => setSkills(e.target.value)}
              className="h-40"
            />
            <Button 
              onClick={handleSkillSubmit}
              className="w-full"
              disabled={!skills.trim()}
            >
              Save Skills
            </Button>
          </div>
        );
      default:
        return null
    }
  }

  return (
    <div className="container mx-auto px-4 py-24">
      <div className="max-w-2xl mx-auto space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-4">Choose Input Method</h1>
          <p className="text-muted-foreground">
            Select how you would like to provide your professional information
          </p>
        </div>

        <RadioGroup
          value={selectedOption}
          onValueChange={setSelectedOption}
          className="grid gap-4"
        >
          {options.map((option) => (
            <Label
              key={option.id}
              className={`cursor-pointer ${
                selectedOption === option.id ? "ring-2 ring-primary" : ""
              }`}
            >
              <RadioGroupItem
                value={option.id}
                className="sr-only"
              />
              <Card className="p-4">
                <div className="flex items-center gap-4">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    {option.icon}
                  </div>
                  <div>
                    <h3 className="font-semibold">{option.title}</h3>
                    <p className="text-sm text-muted-foreground">
                      {option.description}
                    </p>
                  </div>
                </div>
              </Card>
            </Label>
          ))}
        </RadioGroup>

        <Button 
          className="w-full"
          disabled={!selectedOption}
          onClick={() => console.log(selectedOption)}
        >
          Continue
        </Button>

        {selectedOption && (
          <div className="mt-8 p-6 border rounded-lg bg-card">
            {renderInputMethod()}
          </div>
        )}
      </div>
    </div>
  )
}

export default InputPage
