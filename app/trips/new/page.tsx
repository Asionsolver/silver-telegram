"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { createTrip } from "@/lib/actions/create-trip";
import { UploadButton } from "@/lib/uploadthing";
import { cn } from "@/lib/utils";
import Image from "next/image";

import { useState, useTransition } from "react";

const NewTrip = () => {
  const [isPending, startTransition] = useTransition();
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  return (
    <div className="max-w-lg mx-auto mt-10">
      <Card>
        <CardHeader className="text-2xl">New Trip</CardHeader>
        <CardContent>
          <form
            className="space-y-6"
            action={(formData: FormData) => {
              // handle image upload
              if (imageUrl) {
                formData.append("imageUrl", imageUrl);
              }
              startTransition(() => {
                createTrip(formData);
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
                placeholder="Kasmir trip..."
                className={cn(
                  "w-full border border-gray-300 px-3 py-2",
                  "rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 mb-3"
                )}
                required
              />

              <div>
                <label
                  htmlFor="title"
                  className="block font-medium text-gray-700 mb-1"
                >
                  Description
                </label>
                <textarea
                  rows={4}
                  cols={50}
                  name="description"
                  id="description"
                  placeholder="Trip description..."
                  className={cn(
                    "w-full border border-gray-300 px-3 py-2",
                    "rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  )}
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-3">
                <div>
                  <label
                    htmlFor="title"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Start Date
                  </label>
                  <input
                    type="date"
                    name="startDate"
                    id="startDate"
                    className={cn(
                      "w-full border border-gray-300 px-3 py-2",
                      "rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    )}
                  />
                </div>{" "}
                <div>
                  <label
                    htmlFor="title"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    End Date
                  </label>
                  <input
                    type="date"
                    name="endDate"
                    id="endDate"
                    className={cn(
                      "w-full border border-gray-300 px-3 py-2",
                      "rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    )}
                  />
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
