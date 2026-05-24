"use client";

import { updateEvent } from "@/lib/event-actions";
import { Event } from "@/lib/models";
import { format } from "date-fns";
import { useRouter } from "next/navigation";
import { useActionState } from "react";

interface EditEventFormProps {
  event: Event;
}

export default function EditEventForm({ event }: EditEventFormProps) {
  const router = useRouter();

  // Bind the eventId to the updateEvent action
  const updateEventWithId = updateEvent.bind(null, event.id);

  const [state, formAction, isPending] = useActionState(updateEventWithId, {
    success: false,
    eventId: null,
    error: "",
  });

  if (state.success && state.eventId) {
    router.push(`/events/${state.eventId}`);
  }

  // Format date for datetime-local input: YYYY-MM-DDTHH:MM
  const defaultDateValue = format(new Date(event.date), "yyyy-MM-dd'T'HH:mm");

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground">Edit Event</h1>
        <p className="text-muted mt-2">
          Update the fields below to modify your event details
        </p>
      </div>

      <form className="space-y-6" action={formAction}>
        <div>
          <label
            htmlFor="title"
            className="block text-sm text-foreground font-medium mb-2"
          >
            Event Title *
          </label>
          <input
            type="text"
            id="title"
            name="title"
            required
            defaultValue={event.title}
            className="input-field"
            placeholder="Enter event title"
          />
        </div>

        <div>
          <label
            htmlFor="description"
            className="block text-sm text-foreground font-medium mb-2"
          >
            Description *
          </label>
          <textarea
            id="description"
            name="description"
            required
            defaultValue={event.description}
            rows={4}
            className="input-field"
            placeholder="Enter event description"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label
              htmlFor="date"
              className="block text-sm text-foreground font-medium mb-2"
            >
              Date & Time *
            </label>
            <input
              type="datetime-local"
              id="date"
              name="date"
              required
              defaultValue={defaultDateValue}
              className="input-field"
            />
          </div>

          <div>
            <label
              htmlFor="location"
              className="block text-sm text-foreground font-medium mb-2"
            >
              Location *
            </label>
            <input
              type="text"
              id="location"
              name="location"
              required
              defaultValue={event.location}
              className="input-field"
              placeholder="Enter event location"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label
              htmlFor="maxAttendees"
              className="block text-sm text-foreground font-medium mb-2"
            >
              Maximum Attendees
            </label>
            <input
              type="number"
              id="maxAttendees"
              name="maxAttendees"
              min="1"
              defaultValue={event.maxAttendees || ""}
              className="input-field"
              placeholder="Leave empty for unlimited"
            />
          </div>

          <div>
            <label
              htmlFor="isPublic"
              className="block text-sm text-foreground font-medium mb-2"
            >
              Event Visibility
            </label>
            <div className="flex items-center">
              <input
                type="checkbox"
                id="isPublic"
                name="isPublic"
                defaultChecked={event.isPublic}
                className="h-4 w-4 text-primary focus:ring-primary border-slate-600 rounded bg-slate-800"
              />
              <label className="text-foreground ml-2 block text-sm">
                Make this event public
              </label>
            </div>
          </div>
        </div>

        {state.error && (
          <div className="bg-red-600/10 border border-red-600/20 rounded-md p-4">
            <p className="text-sm text-red-400">{state.error}</p>
          </div>
        )}

        <div className="flex gap-4">
          <button className="btn-primary" type="submit" disabled={isPending}>
            {isPending ? "Saving..." : "Save Changes"}
          </button>
          <button
            className="btn-secondary"
            type="button"
            onClick={() => router.back()}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
