"use server";

import { auth } from "@/auth";
import { prisma } from "../prisma";
import { redirect } from "next/navigation";

async function getCodeAddress(address: string) {
  const apiKey = process.env.GOOGLE_MAPS_API_KEY;
  if (!apiKey) {
    throw new Error("Google Maps API key is not configured.");
  }
  const response = await fetch(
    `https://maps.gomaps.pro/maps/api/geocode/json?address=${encodeURIComponent(
      address
    )}&key=${apiKey}`
  );

  //   console.log(`Fetching location data for address`);

  if (!response.ok) {
    throw new Error("Failed to fetch location data from Google Maps API.");
  }

  //   console.log(`Response received from Google Maps API`);
  const data = await response.json();

  //   console.log(data);
  const { lat, lng } = data.results[0]?.geometry?.location;
  if (!lat || !lng) {
    throw new Error("Invalid location data received from Google Maps API.");
  }

  return { lat, lng };
}

export async function addLocation(formData: FormData, tripId: string) {
  const session = await auth();
  if (!session) {
    throw new Error("Unauthorized! Please log in to add a location.");
  }

  const address = formData.get("address")?.toString();
  if (!address) {
    throw new Error("Address is required to add a location.");
  }
  const { lat, lng } = await getCodeAddress(address);

  const count = await prisma.location.count({
    where: { tripId },
  });

  // Add the location to the database
  await prisma.location.create({
    data: {
      locationTitle: address,
      lat,
      lng,
      tripId,
      order: count,
    },
  });

  redirect(`/trips/${tripId}`); // Redirect  page after adding the location
}
