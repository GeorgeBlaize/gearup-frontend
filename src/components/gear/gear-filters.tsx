"use client"

import { Search } from "lucide-react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { useState } from "react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import type { Category } from "@/types/api"

const SORT_OPTIONS = [
  { value: "createdAt:desc", label: "Newest" },
  { value: "pricePerDay:asc", label: "Price: Low to High" },
  { value: "pricePerDay:desc", label: "Price: High to Low" },
  { value: "name:asc", label: "Name: A to Z" },
]

export function GearFilters({ categories }: { categories: Category[] }) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const [search, setSearch] = useState(searchParams.get("search") ?? "")
  const [brand, setBrand] = useState(searchParams.get("brand") ?? "")
  const [minPrice, setMinPrice] = useState(searchParams.get("minPrice") ?? "")
  const [maxPrice, setMaxPrice] = useState(searchParams.get("maxPrice") ?? "")

  const categoryId = searchParams.get("categoryId") ?? "all"
  const availability = searchParams.get("availability") === "true"
  const sort = `${searchParams.get("sortBy") ?? "createdAt"}:${searchParams.get("sortOrder") ?? "desc"}`

  // Base UI's <Select.Value> shows the raw value unless the Root is given an
  // items map, which it uses to resolve the matching label to display.
  const categoryItems: Record<string, string> = {
    all: "All categories",
    ...Object.fromEntries(categories.map((c) => [c.id, c.name])),
  }
  const sortItems: Record<string, string> = Object.fromEntries(
    SORT_OPTIONS.map((o) => [o.value, o.label])
  )

  function navigate(overrides: Record<string, string | null>) {
    const params = new URLSearchParams(searchParams.toString())
    for (const [key, value] of Object.entries(overrides)) {
      if (value === null || value === "") {
        params.delete(key)
      } else {
        params.set(key, value)
      }
    }
    params.delete("page")
    router.push(`${pathname}?${params.toString()}`)
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    navigate({ search, brand, minPrice, maxPrice })
  }

  return (
    <div className="flex flex-col gap-4 rounded-lg border p-4">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="search">Search</Label>
          <div className="relative">
            <Search className="absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              id="search"
              placeholder="Search gear..."
              className="pl-8"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="brand">Brand</Label>
          <Input
            id="brand"
            placeholder="Any brand"
            value={brand}
            onChange={(e) => setBrand(e.target.value)}
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <Label>Price per day</Label>
          <div className="flex items-center gap-2">
            <Input
              type="number"
              min={0}
              placeholder="Min"
              value={minPrice}
              onChange={(e) => setMinPrice(e.target.value)}
            />
            <span className="text-muted-foreground">–</span>
            <Input
              type="number"
              min={0}
              placeholder="Max"
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
            />
          </div>
        </div>

        <Button type="submit" size="sm" className="w-full">
          Apply filters
        </Button>
      </form>

      <div className="flex flex-col gap-1.5">
        <Label>Category</Label>
        <Select
          value={categoryId}
          items={categoryItems}
          onValueChange={(value) =>
            navigate({ categoryId: value === "all" ? null : value })
          }
        >
          <SelectTrigger className="w-full">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All categories</SelectItem>
            {categories.map((category) => (
              <SelectItem key={category.id} value={category.id}>
                {category.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex flex-col gap-1.5">
        <Label>Sort by</Label>
        <Select
          value={sort}
          items={sortItems}
          onValueChange={(value) => {
            const [sortBy, sortOrder] = (value ?? "createdAt:desc").split(":")
            navigate({ sortBy, sortOrder })
          }}
        >
          <SelectTrigger className="w-full">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {SORT_OPTIONS.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex items-center justify-between">
        <Label htmlFor="availability-only">Available only</Label>
        <Switch
          id="availability-only"
          checked={availability}
          onCheckedChange={(checked) =>
            navigate({ availability: checked ? "true" : null })
          }
        />
      </div>

      {(searchParams.get("search") ||
        searchParams.get("brand") ||
        searchParams.get("minPrice") ||
        searchParams.get("maxPrice") ||
        categoryId !== "all" ||
        availability) && (
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => {
            setSearch("")
            setBrand("")
            setMinPrice("")
            setMaxPrice("")
            router.push(pathname)
          }}
        >
          Clear all filters
        </Button>
      )}
    </div>
  )
}
