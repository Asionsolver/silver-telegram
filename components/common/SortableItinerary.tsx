import { Location } from "@/app/generated/prisma";
import { DndContext, closestCenter, DragEndEvent } from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { use, useId, useState } from "react";
import { CSS } from "@dnd-kit/utilities";
import { reorderItinerary } from "@/lib/actions/reorderItinerary";

interface SortableItineraryProps {
  tripId: string;
  locations: Location[];
}

const SortableItinerary = ({ tripId, locations }: SortableItineraryProps) => {
  const id = useId();
  const [localLocations, setLocalLocations] = useState(locations);

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;

    if (active.id !== over?.id) {
      const oldIndex = localLocations.findIndex((loc) => loc.id === active.id);
      const newIndex = localLocations.findIndex((loc) => loc.id === over?.id);

      const updatedLocations = arrayMove(
        localLocations,
        oldIndex,
        newIndex
      ).map((loc, index) => ({ ...loc, order: index }));

      console.log("Updated Locations:", updatedLocations);

      setLocalLocations(updatedLocations);

      // Here you would typically make an API call to update the order in the database
      await reorderItinerary(
        tripId,
        updatedLocations.map((loc) => loc.id)
      );
    }
  };
  return (
    <DndContext
      id={id}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SortableContext
        items={localLocations.map((loc) => loc.id)}
        strategy={verticalListSortingStrategy}
      >
        <div className="space-y-4">
          {localLocations.map((item, key) => (
            <SortableItem item={item} key={key} />
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
};

export default SortableItinerary;

const SortableItem = ({ item }: { item: Location }) => {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({
      id: item.id,
    });
  return (
    <div
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      style={{
        transform: CSS.Transform.toString(transform),
        transition,
      }}
      className="p-4 flex border bg-white rounded-md justify-between items-center hover:shadow hover:bg-gray-50 cursor-pointer transition-shadow"
    >
      <div>
        <h4 className="font-medium text-gray-800">{item.locationTitle}</h4>
        <p className="text-sm text-gray-500 truncate max-w-xs">{`Latitude: ${item.lat}, Longitude: ${item.lng}`}</p>
      </div>
      <div className="text-sm text-gray-500">Day {item.order}</div>
    </div>
  );
};
