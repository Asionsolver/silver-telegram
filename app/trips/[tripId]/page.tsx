import { auth } from "@/auth";
import TripDetailClient from "@/components/common/TripDetailClient";
import { prisma } from "@/lib/prisma";

const TripDetail = async ({
  params,
}: {
  params: Promise<{ tripId: string }>;
}) => {
  const { tripId } = await params;
  const session = await auth();
  if (!session) {
    return (
      <div className="text-red-500 font-bold">
        Please log in to view trip details.
      </div>
    );
  }

  const trip = await prisma.trip.findUnique({
    where: { id: tripId, userId: session.user?.id },
    include: {
      locations: true,
    },
  });

  //   console.log(trip);
  if (!trip) {
    return <div className="text-red-500 font-bold">Trip not found.</div>;
  }

  return <TripDetailClient trip={trip} />;
};

export default TripDetail;
