"use server";

import { auth } from "@/auth";
import { prisma } from "../prisma";
import { redirect } from "next/navigation";

export async function createTrip(formData: FormData) {
  try {
    const session = await auth();
    if (!session || !session.user?.id) {
      throw new Error("Unauthorized! Please log in to create a trip.");
    }
    const title = formData.get("title")?.toString();
    const description = formData.get("description")?.toString();
    const imageUrl = formData.get("imageUrl")?.toString() || null;
    const startDateStr = formData.get("startDate")?.toString();
    const endDateStr = formData.get("endDate")?.toString();

    if (!title || !description || !startDateStr || !endDateStr) {
      throw new Error("All fields are required");
    }

    const startDate = new Date(startDateStr);
    const endDate = new Date(endDateStr);

    await prisma.trip.create({
      data: {
        title,
        description,
        imageUrl,
        startDate,
        endDate,
        userId: session.user.id,
      },
    });
  } catch (error) {
    // Re-throw the error so it can be caught in the client
    throw error;
  }

  // redirect is called outside try-catch so it won't be caught as an error
  redirect("/trips");
}
