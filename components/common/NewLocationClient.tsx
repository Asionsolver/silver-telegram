"use client";

import { useTransition } from "react";
import { Button } from "../ui/button";
import { addLocation } from "@/lib/actions/add-location";

//
const NewLocationClient = ({ tripId }: { tripId: string }) => {
  const [isPending, startTransition] = useTransition();
  return (
    <div className="min-h-[calc(100vh-8rem)] flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-md mx-auto">
        <div className="bg-white p-6 shadow rounded-lg">
          <h1 className="text-3xl font-bold mb-6 text-center">
            Add new Location
          </h1>

          <form
            className="space-y-4"
            action={(formData: FormData) => {
              startTransition(() => {
                addLocation(formData, tripId);
              });
            }}
          >
            <div>
              <label
                className="block text-sm font-medium text-gray-700 mb-2"
                htmlFor="address"
              >
                Address
              </label>
              <input
                type="text"
                name="address"
                id="address"
                className="w-full border border-gray-300 px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <Button type="submit" className="w-full">
              {isPending ? "Adding..." : "Add Location"}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default NewLocationClient;
