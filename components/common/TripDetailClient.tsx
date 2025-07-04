"use client";

import { Location, Trip } from "@/app/generated/prisma";
import Image from "next/image";
import { clsx } from "clsx";
import { Calendar, MapPin, Plus } from "lucide-react";
import Link from "next/link";
import { Button } from "../ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { useState } from "react";
import Map from "./Map";
import SortableItinerary from "./SortableItinerary";

export type TripWithLocation = Trip & {
  locations: Location[];
};

interface TripDetailClientProps {
  trip: TripWithLocation;
}

const TripDetailClient = ({ trip }: TripDetailClientProps) => {
  const [active, setActive] = useState("overview");
  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      {trip.imageUrl && (
        <div className="w-full h-72 md:h-96 overflow-hidden rounded-xl shadow-lg relative">
          <Image
            src={trip.imageUrl}
            alt={trip.title || "Trip Image"}
            width={800}
            height={600}
            className="object-cover"
            priority
          />
        </div>
      )}

      <div className="bg-white p-6 shadow rounded-lg flex flex-col md:flex-row justify-between items-start md:items-center">
        <div>
          <h1 className="text-4xl font-extrabold">{trip.title}</h1>

          <div className="flex items-center text-gray-500 mt-2">
            <Calendar className="w-5 h-5 mr-2" />
            <span>
              {trip.startDate.toLocaleDateString()} -{" "}
              {trip.endDate.toLocaleDateString()}
            </span>
          </div>
        </div>
        <div className="mt-4 md:mt-0">
          <Link href={`/trips/${trip.id}/itinerary/new`}>
            <Button className="flex items-center">
              <Plus className="w-5 h-5" />
              <span>Add Location</span>
            </Button>
          </Link>
        </div>
      </div>
      <div className="bg-white p-6 shadow rounded-lg">
        <Tabs value={active} onValueChange={setActive}>
          <TabsList className="mb-6">
            <TabsTrigger value="overview" className="text-lg">
              Overview
            </TabsTrigger>
            <TabsTrigger value="itinerary" className="text-lg">
              Itinerary
            </TabsTrigger>
            <TabsTrigger value="map" className="text-lg">
              Map
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h2 className="text-2xl font-bold mb-4">Trip Summary</h2>
                <div className="space-y-4">
                  <div className="flex items-start">
                    <Calendar className="w-5 h-5 mr-2 inline-block text-gray-500" />
                    <div>
                      <p className="font-medium text-gray-700">Dates</p>
                      <p className="text-sm text-gray-500">
                        {trip.startDate.toLocaleDateString()} -{" "}
                        {trip.endDate.toLocaleDateString()}
                        <br />
                        {`${
                          (trip.endDate.getTime() - trip.startDate.getTime()) /
                          (1000 * 60 * 60 * 24)
                        } days(s)`}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <MapPin className="w-5 h-5 mr-2 inline-block text-gray-500" />
                    <div>
                      <p>Destinations</p>
                      <p>
                        {trip.locations.length}{" "}
                        {trip.locations.length === 1 ? "location" : "locations"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="h-72 rounded-lg overflow-hidden shadow">
                <Map itineraries={trip.locations} />
              </div>
              {trip.locations.length === 0 && (
                <div className=" text-center p-4">
                  <p>No locations added yet. Start planning your trip!</p>
                  <Link href={`/trips/${trip.id}/itinerary/new`}>
                    <Button className="flex items-center">
                      <Plus className="w-5 h-5" />
                      <span>Add Location</span>
                    </Button>
                  </Link>
                </div>
              )}

              <div>
                <p className="text-gray-600 leading-relaxed">
                  {trip.description}
                </p>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="itinerary" className="space-y-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-semibold">Full Itinerary</h2>
            </div>
            {trip.locations.length === 0 ? (
              <div className=" text-center p-4">
                <p>Add location to see them on the itinerary</p>
                <Link href={`/trips/${trip.id}/itinerary/new`}>
                  <Button className="flex items-center">
                    <Plus className="w-5 h-5" />
                    <span>Add Location</span>
                  </Button>
                </Link>
              </div>
            ) : (
              <SortableItinerary tripId={trip.id} locations={trip.locations} />
            )}
          </TabsContent>

          <TabsContent value="map" className="space-y-6">
            <div className="h-72 rounded-lg overflow-hidden shadow">
              <Map itineraries={trip.locations} />
            </div>
            {trip.locations.length === 0 && (
              <div className=" text-center p-4">
                <p>No locations added yet. Start planning your trip!</p>
                <Link href={`/trips/${trip.id}/itinerary/new`}>
                  <Button className="flex items-center">
                    <Plus className="w-5 h-5" />
                    <span>Add Location</span>
                  </Button>
                </Link>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>

      <div className="text-center">
        <Link href={`/trips`}>
          <Button className="flex items-center">
            <Plus className="w-5 h-5" />
            <span>Back To Trips</span>
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default TripDetailClient;
