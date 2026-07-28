import { Loader2 } from "lucide-react"

export default function AuthLoading() {
  return (
    <div className="flex min-h-[calc(100vh-8rem)] items-center justify-center">
      <Loader2 className="size-6 animate-spin text-muted-foreground" />
    </div>
  )
}
