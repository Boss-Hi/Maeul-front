import { z } from "zod";
import { getJson } from "./client";

const categoryCodes: Record<string, string> = {
  "축제/공연/행사": "EV",
  체험관광: "EX",
  역사관광: "HS",
  문화관광: "VE"
};
const id = z.union([z.string(), z.number()]).transform(String);
const festivalSchema = z
  .object({
    contentId: id.optional(),
    contentid: id.optional(),
    id: id.optional(),
    title: z.string(),
    tel: z.string().nullish(),
    lclsSystm1: z.string().nullish(),
    addr1: z.string().nullish(),
    address: z.string().nullish(),
    firstimage: z.string().nullish(),
    firstImage: z.string().nullish(),
    eventstartdate: z.string().nullish(),
    eventStartDate: z.string().nullish(),
    eventenddate: z.string().nullish(),
    eventEndDate: z.string().nullish(),
    overview: z.string().nullish(),
    tourCategoryCode: z.string().nullish(),
    tourCategoryName: z.string().nullish()
  })
  .transform((value) => ({
    id: value.contentId ?? value.contentid ?? value.id,
    title: value.title,
    tel: value.tel ?? "",
    address: value.address ?? value.addr1 ?? "",
    image: safeImage(value.firstImage ?? value.firstimage),
    start: formatDate(value.eventStartDate ?? value.eventstartdate),
    end: formatDate(value.eventEndDate ?? value.eventenddate),
    description: value.overview ?? "",
    categoryCode: value.lclsSystm1 ?? value.tourCategoryCode ?? "",
    categoryName:
      value.tourCategoryName ??
      Object.entries(categoryCodes).find(
        ([, code]) => code === value.lclsSystm1
      )?.[0] ??
      ""
  }))
  .refine((value) => Boolean(value.id), "Missing festival identifier");
const categorySchema = z
  .object({
    id,
    name: z.string().min(1)
  })
  .transform((value) => ({
    id: value.id,
    code: categoryCodes[value.name],
    name: value.name
  }));
export type Festival = z.infer<typeof festivalSchema>;

function safeImage(value: string | null | undefined) {
  if (!value) return "";
  try {
    const url = new URL(value);
    return ["https:", "http:"].includes(url.protocol) ? url.href : "";
  } catch {
    return "";
  }
}
function formatDate(value: string | null | undefined) {
  if (!value) return "";
  return /^\d{8}$/.test(value)
    ? `${value.slice(0, 4)}.${value.slice(4, 6)}.${value.slice(6)}`
    : value;
}
function extractList(value: unknown): unknown[] {
  if (Array.isArray(value)) return value;
  if (value && typeof value === "object") {
    const object = value as Record<string, unknown>;
    if (Array.isArray(object.content)) return object.content;
    if (object.data !== undefined) return extractList(object.data);
  }
  throw new Error("행사 응답 형식을 확인하지 못했어요.");
}
export async function getFestivals(
  options: { page: number; category: string; size?: number },
  signal?: AbortSignal
) {
  const params = new URLSearchParams({
    page: String(options.page),
    size: String(options.size ?? 5)
  });
  params.set("tourCategoryCode", options.category || "EV");
  const response = z
    .object({
      success: z.literal(true),
      data: z.object({
        content: z.array(festivalSchema),
        number: z.number().int().nonnegative(),
        totalElements: z.number().int().nonnegative(),
        totalPages: z.number().int().nonnegative(),
        last: z.boolean()
      })
    })
    .parse(await getJson(`/api/festivals?${params}`, signal));
  return response.data;
}
export async function getFestival(contentId: string, signal?: AbortSignal) {
  return z
    .object({ success: z.literal(true), data: festivalSchema })
    .parse(
      await getJson(`/api/festivals/${encodeURIComponent(contentId)}`, signal)
    ).data;
}
export async function getFestivalCategories(signal?: AbortSignal) {
  return z
    .array(categorySchema)
    .parse(extractList(await getJson("/api/festivals/categories", signal)));
}
