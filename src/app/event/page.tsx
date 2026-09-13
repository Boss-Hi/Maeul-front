import { EventDetail } from "./event-detail";

export default async function EventPage({
  searchParams
}: {
  searchParams: Promise<{ contentId?: string | string[] }>;
}) {
  const { contentId } = await searchParams;
  return (
    <EventDetail contentId={typeof contentId === "string" ? contentId : ""} />
  );
}
