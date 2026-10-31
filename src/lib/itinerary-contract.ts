import { z } from "zod";

const positiveId = z.number().int().positive();
export const tourSchema = z.object({
  contentId: z.union([z.string(), z.number()]).transform(String).optional(),
  title: z.string(),
  addr1: z.string().nullish(),
  firstImage: z.string().nullish(),
  mapX: z.number().nullish(),
  mapY: z.number().nullish()
});
export const scheduleSchema = z.object({
  id: positiveId,
  sequence: z.number().int(),
  type: z.enum(["NORMAL", "TOUR"]),
  title: z.string().nullish(),
  description: z.string().nullish(),
  startTime: z.string().nullish(),
  endTime: z.string().nullish(),
  tour: tourSchema.nullish()
});
export const daySchema = z.object({
  id: positiveId,
  date: z.string(),
  dayNumber: z.number().int().positive(),
  schedules: z.array(scheduleSchema)
});
export const itinerarySchema = z.object({
  id: positiveId,
  startDate: z.string(),
  endDate: z.string(),
  tour: tourSchema,
  days: z.array(daySchema)
});
export const scheduleInputSchema = z.discriminatedUnion("type", [
  z.object({
    type: z.literal("NORMAL"),
    title: z.string().trim().min(1).max(200),
    description: z.string().trim().max(2000)
  }),
  z.object({
    type: z.literal("TOUR"),
    contentId: z.string().regex(/^[1-9]\d*$/)
  })
]);
export const reorderSchema = z
  .object({
    schedules: z
      .array(z.object({ id: positiveId, sequence: positiveId }))
      .min(1)
  })
  .refine(
    ({ schedules }) =>
      new Set(schedules.map((item) => item.id)).size === schedules.length &&
      schedules.every((item, index) => item.sequence === index + 1),
    "순서와 일정 번호를 확인해 주세요."
  );
export type Itinerary = z.infer<typeof itinerarySchema>;
export type ItineraryDay = z.infer<typeof daySchema>;
export type Schedule = z.infer<typeof scheduleSchema>;
export type ScheduleInput = z.infer<typeof scheduleInputSchema>;

export function itineraryRouteAllowed(method: string, path: string[]) {
  const route = path.join("/");
  const id = "[1-9]\\d*";
  if (method === "GET")
    return (
      route === "current" ||
      new RegExp(`^${id}(?:/days/${id}(?:/schedules/${id})?)?$`).test(route)
    );
  if (method === "POST")
    return (
      route === "generate" ||
      new RegExp(`^${id}/days/${id}/schedules$`).test(route)
    );
  if (method === "PUT")
    return new RegExp(`^${id}/days/${id}/schedules/(?:${id}|reorder)$`).test(
      route
    );
  return false;
}
