"use client"

import { useQuery } from "@tanstack/react-query"

import { categoriesApi } from "@/lib/api/categories"
import { gearApi, type GearFilters } from "@/lib/api/gear"

export function useGearList(filters: GearFilters) {
  return useQuery({
    queryKey: ["gear", filters],
    queryFn: () => gearApi.list(filters),
  })
}

export function useGearDetails(id: string) {
  return useQuery({
    queryKey: ["gear", id],
    queryFn: () => gearApi.getById(id),
    enabled: !!id,
  })
}

export function useCategories() {
  return useQuery({
    queryKey: ["categories"],
    queryFn: () => categoriesApi.list(),
    staleTime: 5 * 60 * 1000,
  })
}
