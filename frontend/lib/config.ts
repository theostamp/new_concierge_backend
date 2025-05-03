// ✅ Ασφαλής ανάκτηση του base URL και στον client και στον server
export function getBaseUrl(): string {
  return process.env.NEXT_PUBLIC_API_URL ?? '';
}
