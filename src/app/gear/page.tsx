import { GearPagination } from "@/components/common/gear-pagination"
import { GearFilters } from "@/components/gear/gear-filters"
import { GearGrid } from "@/components/gear/gear-grid"
import { categoriesApi } from "@/lib/api/categories"
import { gearApi } from "@/lib/api/gear"

type SearchParams = Record<string, string | string[] | undefined>

function first(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value
}

export default async function GearBrowsePage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>
}) {
  const resolvedParams = await searchParams

  const filters = {
    search: first(resolvedParams.search),
    brand: first(resolvedParams.brand),
    categoryId: first(resolvedParams.categoryId),
    minPrice: first(resolvedParams.minPrice)
      ? Number(first(resolvedParams.minPrice))
      : undefined,
    maxPrice: first(resolvedParams.maxPrice)
      ? Number(first(resolvedParams.maxPrice))
      : undefined,
    availability: first(resolvedParams.availability) === "true" || undefined,
    sortBy: first(resolvedParams.sortBy) ?? "createdAt",
    sortOrder: (first(resolvedParams.sortOrder) as "asc" | "desc") ?? "desc",
    page: first(resolvedParams.page) ? Number(first(resolvedParams.page)) : 1,
    limit: 12,
  }

  const [{ gear, pagination }, { categories }] = await Promise.all([
    gearApi.list(filters),
    categoriesApi.list(),
  ])

  const plainSearchParams: Record<string, string | undefined> = {}
  for (const [key, value] of Object.entries(resolvedParams)) {
    plainSearchParams[key] = first(value)
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <h1 className="mb-6 text-2xl font-semibold">Browse Gear</h1>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-[240px_1fr]">
        <aside>
          <GearFilters categories={categories} />
        </aside>
        <div className="flex flex-col gap-6">
          <p className="text-sm text-muted-foreground">
            {pagination.total} {pagination.total === 1 ? "item" : "items"} found
          </p>
          <GearGrid gear={gear} />
          <GearPagination pagination={pagination} searchParams={plainSearchParams} />
        </div>
      </div>
    </div>
  )
}
