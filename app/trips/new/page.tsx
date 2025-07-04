"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { createTrip } from "@/lib/actions/create-trip";
import { UploadButton } from "@/lib/uploadthing";
import { cn } from "@/lib/utils";
import Image from "next/image";

import { useState, useTransition } from "react";

interface FormErrors {
  title?: string;
  description?: string;
  startDate?: string;
  endDate?: string;
  general?: string;
}

const NewTrip = () => {
  const [isPending, startTransition] = useTransition();
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [errors, setErrors] = useState<FormErrors>({});
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    startDate: "",
    endDate: "",
  });

  // Validation function
  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    // Title validation
    if (!formData.title.trim()) {
      newErrors.title = "Trip title is required";
    } else if (formData.title.trim().length < 3) {
      newErrors.title = "Trip title must be at least 3 characters";
    }

    // Description validation
    if (!formData.description.trim()) {
      newErrors.description = "Description is required";
    } else if (formData.description.trim().length < 10) {
      newErrors.description = "Description must be at least 10 characters";
    }

    // Start date validation
    if (!formData.startDate) {
      newErrors.startDate = "Start date is required";
    } else {
      const startDate = new Date(formData.startDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      if (startDate < today) {
        newErrors.startDate = "Start date cannot be in the past";
      }
    }

    // End date validation
    if (!formData.endDate) {
      newErrors.endDate = "End date is required";
    } else if (formData.startDate && formData.endDate) {
      const startDate = new Date(formData.startDate);
      const endDate = new Date(formData.endDate);

      if (endDate <= startDate) {
        newErrors.endDate = "End date must be after start date";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle input changes
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Clear error for this field when user starts typing
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };
  return (
    <div className="max-w-lg mx-auto mt-10">
      <Card>
        <CardHeader className="text-2xl">New Trip</CardHeader>
        <CardContent>
          <form
            className="space-y-6"
            onSubmit={(e) => {
              e.preventDefault();

              if (!validateForm()) {
                return;
              }

              // Create FormData from the validated state
              const formDataToSubmit = new FormData();
              formDataToSubmit.append("title", formData.title);
              formDataToSubmit.append("description", formData.description);
              formDataToSubmit.append("startDate", formData.startDate);
              formDataToSubmit.append("endDate", formData.endDate);

              // Handle image upload
              if (imageUrl) {
                formDataToSubmit.append("imageUrl", imageUrl);
              }

              startTransition(() => {
                createTrip(formDataToSubmit).catch((error) => {
                  // Only show error if it's not a redirect
                  if (error.message !== "NEXT_REDIRECT") {
                    setErrors({
                      general: error.message || "Failed to create trip",
                    });
                  }
                });
              });
            }}
          >
            <div className="mb-3">
              <label
                htmlFor="title"
                className="block font-medium text-gray-700 mb-1"
              >
                Trip Title
              </label>
              <input
                type="text"
                name="title"
                id="title"
                value={formData.title}
                onChange={handleInputChange}
                placeholder="Kashmir trip..."
                className={cn(
                  "w-full border px-3 py-2",
                  "rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500",
                  errors.title ? "border-red-500" : "border-gray-300"
                )}
              />
              {errors.title && (
                <p className="text-red-500 text-sm mt-1">{errors.title}</p>
              )}

              <div className="mt-3">
                <label
                  htmlFor="description"
                  className="block font-medium text-gray-700 mb-1"
                >
                  Description
                </label>
                <textarea
                  rows={4}
                  cols={50}
                  name="description"
                  id="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Trip description..."
                  className={cn(
                    "w-full border px-3 py-2",
                    "rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500",
                    errors.description ? "border-red-500" : "border-gray-300"
                  )}
                />
                {errors.description && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.description}
                  </p>
                )}
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-3">
                <div>
                  <label
                    htmlFor="startDate"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Start Date
                  </label>
                  <input
                    type="date"
                    name="startDate"
                    id="startDate"
                    value={formData.startDate}
                    onChange={handleInputChange}
                    className={cn(
                      "w-full border px-3 py-2",
                      "rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500",
                      errors.startDate ? "border-red-500" : "border-gray-300"
                    )}
                  />
                  {errors.startDate && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.startDate}
                    </p>
                  )}
                </div>
                <div>
                  <label
                    htmlFor="endDate"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    End Date
                  </label>
                  <input
                    type="date"
                    name="endDate"
                    id="endDate"
                    value={formData.endDate}
                    onChange={handleInputChange}
                    className={cn(
                      "w-full border px-3 py-2",
                      "rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500",
                      errors.endDate ? "border-red-500" : "border-gray-300"
                    )}
                  />
                  {errors.endDate && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.endDate}
                    </p>
                  )}
                </div>
              </div>
            </div>
            <div>
              <label
                htmlFor="imageUpload"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Trip Image
              </label>
              {imageUrl && (
                <Image
                  src={imageUrl}
                  alt="Trip Image"
                  width={300}
                  height={100}
                  className="w-full mb-4 rounded-md max-h-48 object-cover"
                />
              )}
              <UploadButton
                endpoint={"imageUploader"}
                onClientUploadComplete={(res) => {
                  console.log("Files: ", res[0].ufsUrl);

                  // You can handle the uploaded files here
                  if (res && res[0].ufsUrl) {
                    setImageUrl(res[0].ufsUrl);
                  }
                }}
                onUploadError={(error: Error) => {
                  // Handle the error here
                  console.error("Upload failed:", error);
                }}
              />
            </div>
            {errors.general && (
              <div className="text-red-500 text-sm bg-red-50 p-3 rounded-md">
                {errors.general}
              </div>
            )}
            <Button type="submit" className="w-full" disabled={isPending}>
              {isPending ? "Creating..." : "Create Trip"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default NewTrip;
