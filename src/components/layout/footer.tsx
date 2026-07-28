import Link from "next/link"

export function Footer() {
  return (
    <footer className="border-t">
      <div className="mx-auto flex max-w-6xl flex-col gap-2 px-4 py-8 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
        <p>&copy; {new Date().getFullYear()} GearUp. Rent sports &amp; outdoor gear instantly.</p>
        <div className="flex gap-4">
          <Link href="/gear" className="hover:text-foreground">
            Browse Gear
          </Link>
          <Link href="/auth/register" className="hover:text-foreground">
            Become a Provider
          </Link>
        </div>
      </div>
    </footer>
  )
}
