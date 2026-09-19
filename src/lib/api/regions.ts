import { z } from "zod";
import { getJson } from "./client";

const regionSchema = z.object({
  code: z.string().min(1),
  name: z.string().min(1),
  sigungus: z.array(
    z.object({
      code: z.string().min(1),
      name: z.string().min(1)
    })
  )
});

export type Region = z.infer<typeof regionSchema>;

export async function getRegions(signal?: AbortSignal) {
  return z.array(regionSchema).parse(await getJson("/api/regions", signal));
}
