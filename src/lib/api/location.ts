import { z } from "zod";
import type { Region } from "./regions";

const addressSchema = z.object({
  success: z.literal(true),
  data: z.object({ region1depth: z.string().min(1), region2depth: z.string() })
});

export async function getLocationRegion(
  latitude: number,
  longitude: number,
  regions: Region[],
  signal?: AbortSignal
) {
  const params = new URLSearchParams({
    latitude: String(latitude),
    longitude: String(longitude)
  });
  const response = await fetch(`/api/location?${params}`, {
    signal,
    cache: "no-store"
  });
  if (!response.ok)
    throw new Error(
      "현재 위치의 주소를 불러오지 못했어요. 다시 시도해 주세요."
    );
  const parsed = addressSchema.safeParse(await response.json());
  if (!parsed.success) throw new Error("현재 위치의 주소를 확인하지 못했어요.");
  const address = parsed.data.data;
  const region = regions.find((item) => item.name === address.region1depth);
  const city = region?.sigungus.find(
    (item) => item.name === address.region2depth
  );
  if (!region || (address.region2depth && !city))
    throw new Error(
      "현재 위치와 일치하는 지역이 없어요. 지역을 직접 선택해 주세요."
    );
  return {
    regionCode: region.code,
    cityCode: city?.code ?? "",
    label: `${region.name} ${city?.name ?? ""}`.trim()
  };
}

export function getCurrentCoordinates(
  geolocation: Geolocation | undefined
): Promise<GeolocationCoordinates> {
  return new Promise((resolve, reject) => {
    if (!geolocation)
      return reject(new Error("이 브라우저에서는 위치를 확인할 수 없어요."));
    geolocation.getCurrentPosition(
      ({ coords }) => resolve(coords),
      (error) => {
        reject(
          new Error(
            error.code === 1
              ? "위치 권한을 허용하거나 지역을 직접 선택해 주세요."
              : error.code === 3
                ? "위치 확인 시간이 초과됐어요. 다시 시도해 주세요."
                : "현재 위치를 확인하지 못했어요. 지역을 직접 선택해 주세요."
          )
        );
      },
      { enableHighAccuracy: false, timeout: 10000, maximumAge: 60000 }
    );
  });
}
