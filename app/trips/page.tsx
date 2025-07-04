import { auth } from "@/auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { prisma } from "@/lib/prisma";

import { Calendar, MapPin } from "lucide-react";
import Link from "next/link";

const TripsPage = async () => {
  const session = await auth();
  const trips = await prisma.trip.findMany({
    where: { userId: session?.user?.id },
  });

  const sortedTrips = [...trips].sort((a, b) => {
    return new Date(b.startDate).getTime() - new Date(a.startDate).getTime();
  });

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const upcomingTrips = sortedTrips.filter((trip) => {
    return new Date(trip.startDate) >= today;
  });
  if (!session) {
    return (
      <div className="flex justify-center items-center h-screen text-gray-800 text-xl">
        Please log in to view your trips.
      </div>
    );
  }
  return (
    <div className=" container space-y-6 mx-auto px-4 py-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <Link href="/trips/new">
          <Button>New Trip</Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Welcome back, {session.user?.name}!</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="flex flex-col">
            {trips.length === 0
              ? "Start planning your next adventure!"
              : `You have ${trips.length} ${
                  trips.length === 1 ? "trip" : "trips"
                } planned. Here are your upcoming ${upcomingTrips.length} ${
                  upcomingTrips.length === 1 ? "trip" : "trips"
                }.`}
          </p>
        </CardContent>
      </Card>
      <div className="space-y-4">
        <h2 className="text-xl font-semibold mb4">Your Recent Trips</h2>
        {trips.length === 0 ? (
          <Card>
            <CardContent className="flex items-center justify-center flex-col py-8">
              <h3 className="text-center mb-4 max-w-md">No trips yet.</h3>
              <p>Start planning your adventure by creating your first trip.</p>
              <Link href="/trips/new">
                <Button>Create Trip</Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {sortedTrips.slice(0, 6).map((trip, key) => (
                <Link href={`/trips/${trip.id}`} key={key}>
                  <Card className="h-full hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <CardTitle className="line-clamp-1">
                        {trip.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="flex items-center">
                        <MapPin className="inline mr-1" size={16} />
                        <span>{trip.description}</span>
                      </p>
                      <p className=" flex items-center mt-2 text-gray-500">
                        <Calendar className="inline mr-1" size={16} />
                        <span>
                          {new Date(trip.startDate).toLocaleDateString("en-GB")}{" "}
                          - {new Date(trip.endDate).toLocaleDateString("en-GB")}
                        </span>
                      </p>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default TripsPage;
