"use client"

import type React from "react"
import { useState, useEffect, useRef } from "react" // Import useRef
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Camera, MapPin, Upload, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { createClient } from "@/lib/supabase/client" // Import the Supabase client
import type { User } from "@supabase/supabase-js"

// Define a type for our categories fetched from Supabase
type Category = {
  id: string
  name: string
}

export default function ReportPage() {
  const router = useRouter()
  const supabase = createClient();

  const [user, setUser] = useState<User | null>(null)
  const [categories, setCategories] = useState<Category[]>([])
  const [formData, setFormData] = useState({
    photo: null as File | null,
    description: "",
    categoryId: "", // Changed from category to categoryId
    tags: [] as string[],
    isAnonymous: false,
    location: "Kochi, Kerala", // Default location
  })
  const [newTag, setNewTag] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null); // Create a ref for the file input

  // Fetch user session and categories on component mount
  useEffect(() => {
    const fetchInitialData = async () => {
      // Fetch user session
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        router.push("/auth") // Redirect to login if not authenticated
        return
      }
      setUser(session.user)

      // Fetch categories from Supabase
      const { data: categoriesData, error: categoriesError } = await supabase
        .from("categories")
        .select("id, name")
      
      if (categoriesError) {
        console.error("Error fetching categories:", categoriesError)
        setError("Could not load categories.")
      } else {
        setCategories(categoriesData || [])
      }
    }

    fetchInitialData()
  }, [router])

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setFormData((prev) => ({ ...prev, photo: file }))
      const url = URL.createObjectURL(file)
      setPreviewUrl(url)
    }
  }

  const addTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData((prev) => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()],
      }))
      setNewTag("")
    }
  }

  const removeTag = (tagToRemove: string) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((tag) => tag !== tagToRemove),
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !formData.photo) {
      setError("Photo and user session are required.");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      // 1. Upload the photo to Supabase Storage
      const file = formData.photo;
      const filePath = `public/${user.id}/${Date.now()}_${file.name}`;
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from("report-images")
        .upload(filePath, file);

      if (uploadError) {
        throw uploadError;
      }

      // 2. Get the public URL of the uploaded photo
      const { data: urlData } = supabase.storage
        .from("report-images")
        .getPublicUrl(uploadData.path);
      
      const photoUrl = urlData.publicUrl;

      // 3. Prepare the data for insertion
      const reportData = {
        user_id: user.id, // <-- This is the crucial line
        photo_url: photoUrl,
        description: formData.description,
        category_id: formData.categoryId,
        tags: formData.tags,
        is_anonymous: formData.isAnonymous,
        location: formData.location,
      };

      // DEBUG: Log the data to the console to verify it's correct
      console.log("Submitting report with data:", reportData);

      // 4. Insert the report into the 'reports' table
      const { error: insertError } = await supabase.from("reports").insert(reportData);

      if (insertError) {
        // This will now give a more specific error if something is wrong
        console.error("Supabase insert error:", insertError);
        throw insertError;
      }

      // 5. Success!
      alert("Report submitted successfully! You earned 10 points.");
      router.push("/");

    } catch (err: any) {
      console.error("Submission error:", err);
      setError(err.message || "An unexpected error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const isFormValid = formData.photo && formData.description && formData.categoryId
  // Auto geo-tagging with higher accuracy + reverse geocoding
useEffect(() => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const lat = pos.coords.latitude;
        const lon = pos.coords.longitude;

        // Update coordinates in form data
        setFormData((prev) => ({
          ...prev,
          latitude: lat,
          longitude: lon,
        }));

        try {
          // Reverse geocode using OpenStreetMap Nominatim API
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json`
          );
          const data = await res.json();

          if (data?.display_name) {
            setFormData((prev) => ({
              ...prev,
              location: data.display_name,
            }));
          }
        } catch (error) {
          console.error("Reverse geocoding failed:", error);
        }
      },
      (err) => {
        console.warn("Geolocation error:", err);
      },
      {
        enableHighAccuracy: true, // request GPS-level accuracy
        timeout: 10000, // 10s timeout
        maximumAge: 0, // no cached positions
      }
    );
  }
}, []);



  return (
    <div className="max-w-md mx-auto md:max-w-4xl p-4 md:p-6">
      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">Report Garbage</h1>
        <p className="text-gray-600">Help clean up your community and earn points!</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 md:grid md:grid-cols-2 md:gap-8 md:space-y-0">
        <div className="space-y-6">
          {/* Photo Upload */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center">
                <Camera className="h-5 w-5 mr-2" />
                Photo
              </CardTitle>
            </CardHeader>
            <CardContent>
              {previewUrl ? (
                <div className="relative">
                  <Image
                    src={previewUrl}
                    alt="Preview"
                    width={400}
                    height={300}
                    className="w-full h-48 md:h-64 object-cover rounded-lg"
                  />
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    className="absolute top-2 right-2"
                    onClick={() => {
                      setPreviewUrl(null)
                      setFormData((prev) => ({ ...prev, photo: null }))
                    }}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                  <Camera className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 mb-4">Take a photo of the garbage</p>
                  <Button 
                    type="button" 
                    variant="outline" 
                    className="cursor-pointer bg-transparent"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    Choose Photo
                  </Button>
                  <Input
                    ref={fileInputRef}
                    id="photo-upload"
                    type="file"
                    accept="image/jpeg, image/png, image/webp"
                    capture="environment"
                    onChange={handlePhotoChange}
                    className="hidden"
                  />
                </div>
              )}
            </CardContent>
          </Card>

          {/* Description */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Description</CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                placeholder="Describe what you see, how long it's been there, any health hazards..."
                value={formData.description}
                onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                rows={4}
                className="resize-none"
              />
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          {/* Category */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Category</CardTitle>
            </CardHeader>
            <CardContent>
              <Select
                value={formData.categoryId}
                onValueChange={(value) => setFormData((prev) => ({ ...prev, categoryId: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select waste category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </CardContent>
          </Card>

          {/* Tags */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Tags</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex space-x-2 mb-3">
                <Input
                  placeholder="Add tag (e.g., #Kochi, #Urgent)"
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addTag())}
                />
                <Button type="button" onClick={addTag} variant="outline">
                  Add
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {formData.tags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="cursor-pointer" onClick={() => removeTag(tag)}>
                    {tag} <X className="h-3 w-3 ml-1" />
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Location */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center">
                <MapPin className="h-5 w-5 mr-2" />
                Location
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Input
                placeholder="e.g., Near Palarivattom Bridge"
                value={formData.location}
                onChange={(e) => setFormData((prev) => ({ ...prev, location: e.target.value }))}
              />
              <p className="text-xs text-gray-500 mt-1">
                Geo-tagging will be added automatically in a future version.
              </p>
            </CardContent>
          </Card>

          {/* Anonymous Toggle */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="anonymous" className="text-base font-medium">
                    Post Anonymously
                  </Label>
                  <p className="text-sm text-gray-500">Your name won't be shown on this report</p>
                </div>
                <Switch
                  id="anonymous"
                  checked={formData.isAnonymous}
                  onCheckedChange={(checked) => setFormData((prev) => ({ ...prev, isAnonymous: checked }))}
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Submit Button and Error Message */}
        <div className="md:col-span-2">
          {error && <p className="text-red-500 text-sm mb-4 text-center">{error}</p>}
          <Button type="submit" className="w-full h-12 text-lg" disabled={!isFormValid || isSubmitting}>
            {isSubmitting ? (
              <div className="flex items-center">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                Submitting...
              </div>
            ) : (
              "Submit Report (+10 points)"
            )}
          </Button>
        </div>
      </form>
    </div>
  )
}
