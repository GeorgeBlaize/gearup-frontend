"use client"

import Image from "next/image"
import { useState } from "react"

import { cn, resolveGearImage } from "@/lib/utils"

export function GearGallery({ images, name }: { images: string[]; name: string }) {
  const gallery = images.length > 0 ? images : [""]
  const [active, setActive] = useState(0)

  return (
    <div className="flex flex-col gap-2">
      <div className="relative aspect-4/3 w-full overflow-hidden rounded-lg bg-muted">
        <Image
          src={resolveGearImage(gallery[active])}
          alt={name}
          fill
          sizes="(max-width: 768px) 100vw, 50vw"
          className="object-cover"
          priority
        />
      </div>
      {gallery.length > 1 && (
        <div className="flex gap-2 overflow-x-auto">
          {gallery.map((src, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setActive(i)}
              className={cn(
                "relative aspect-square size-16 shrink-0 overflow-hidden rounded-md border-2",
                active === i ? "border-primary" : "border-transparent"
              )}
            >
              <Image
                src={resolveGearImage(src)}
                alt={`${name} thumbnail ${i + 1}`}
                fill
                sizes="64px"
                className="object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
