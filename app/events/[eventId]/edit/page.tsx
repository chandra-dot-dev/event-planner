import { auth } from "@/auth";
import EditEventForm from "@/components/EditEventForm";
import { Event } from "@/lib/models";
import { notFound, redirect } from "next/navigation";

export default async function EditEventPage({
  params,
}: {
  params: Promise<{ eventId: string }>;
}) {
  const { eventId } = await params;
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login");
  }

  const eventResponse = await fetch(
    `${process.env.NEXT_PUBLIC_APP_URL}/api/events/${eventId}`,
    { next: { tags: [`event-${eventId}`] } }
  );

  if (!eventResponse.ok) {
    notFound();
  }

  const event = (await eventResponse.json()) as Event;

  if (event.userId !== session.user.id) {
    redirect(`/events/${eventId}`);
  }

  return <EditEventForm event={event} />;
}
