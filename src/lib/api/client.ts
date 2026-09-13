export async function getJson(
  path: string,
  signal?: AbortSignal
): Promise<unknown> {
  const response = await fetch(path, {
    signal,
    headers: { Accept: "application/json" }
  });
  if (!response.ok) throw new Error("마을 소식을 가져오지 못했어요.");
  return response.json();
}
