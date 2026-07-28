import type { MetadataRoute } from "next"

import { gearApi } from "@/lib/api/gear"

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: SITE_URL, changeFrequency: "daily", priority: 1 },
    { url: `${SITE_URL}/gear`, changeFrequency: "hourly", priority: 0.9 },
    { url: `${SITE_URL}/auth/login`, changeFrequency: "yearly", priority: 0.3 },
    { url: `${SITE_URL}/auth/register`, changeFrequency: "yearly", priority: 0.3 },
  ]

  const gearRoutes: MetadataRoute.Sitemap = await gearApi
    .list({ limit: 100 })
    .then(({ gear }) =>
      gear.map((item) => ({
        url: `${SITE_URL}/gear/${item.id}`,
        lastModified: item.updatedAt,
        changeFrequency: "daily" as const,
        priority: 0.7,
      }))
    )
    .catch(() => [])

  return [...staticRoutes, ...gearRoutes]
}
