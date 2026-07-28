import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import type { Pagination as PaginationData } from "@/types/api"

function buildHref(
  searchParams: Record<string, string | undefined>,
  page: number
) {
  const params = new URLSearchParams(
    Object.entries(searchParams).filter(
      (entry): entry is [string, string] => entry[1] !== undefined
    )
  )
  params.set("page", String(page))
  return `?${params.toString()}`
}

export function GearPagination({
  pagination,
  searchParams,
}: {
  pagination: PaginationData
  searchParams: Record<string, string | undefined>
}) {
  if (pagination.pages <= 1) return null

  const { page, pages } = pagination
  const pageNumbers = Array.from({ length: pages }, (_, i) => i + 1).filter(
    (p) => p === 1 || p === pages || Math.abs(p - page) <= 1
  )

  return (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            href={buildHref(searchParams, Math.max(1, page - 1))}
            aria-disabled={page === 1}
            className={page === 1 ? "pointer-events-none opacity-50" : ""}
          />
        </PaginationItem>
        {pageNumbers.map((p, idx) => (
          <PaginationItem key={p}>
            {idx > 0 && pageNumbers[idx - 1] !== p - 1 ? (
              <span className="px-2 text-muted-foreground">…</span>
            ) : null}
            <PaginationLink href={buildHref(searchParams, p)} isActive={p === page}>
              {p}
            </PaginationLink>
          </PaginationItem>
        ))}
        <PaginationItem>
          <PaginationNext
            href={buildHref(searchParams, Math.min(pages, page + 1))}
            aria-disabled={page === pages}
            className={page === pages ? "pointer-events-none opacity-50" : ""}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  )
}
