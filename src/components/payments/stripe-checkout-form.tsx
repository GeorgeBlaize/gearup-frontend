"use client"

import { CardElement, useElements, useStripe } from "@stripe/react-stripe-js"
import { Loader2, Lock } from "lucide-react"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { toast } from "sonner"

import { Alert, AlertDescription } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { useConfirmPayment } from "@/hooks/use-payments"
import { useAuth } from "@/hooks/use-auth"

const CARD_ELEMENT_OPTIONS = {
  style: {
    base: {
      fontSize: "14px",
      color: "var(--foreground, #0a0a0a)",
      "::placeholder": { color: "#94a3b8" },
    },
    invalid: { color: "#ef4444" },
  },
}

export function StripeCheckoutForm({
  rentalId,
  clientSecret,
}: {
  rentalId: string
  clientSecret: string
}) {
  const stripe = useStripe()
  const elements = useElements()
  const router = useRouter()
  const { user } = useAuth()
  const confirmPayment = useConfirmPayment()

  const [submitting, setSubmitting] = useState(false)
  const [cardError, setCardError] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!stripe || !elements) return

    const cardElement = elements.getElement(CardElement)
    if (!cardElement) return

    setSubmitting(true)
    setCardError(null)

    const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
      payment_method: {
        card: cardElement,
        billing_details: {
          name: user?.name,
          email: user?.email,
        },
      },
    })

    if (error) {
      setCardError(error.message ?? "Payment failed. Please try again.")
      toast.error(error.message ?? "Payment failed")
      setSubmitting(false)
      return
    }

    if (paymentIntent?.status === "succeeded") {
      await confirmPayment.mutateAsync(paymentIntent.id).catch(() => {
        // Backend sync failed but Stripe already succeeded -- the webhook
        // (or a retry) will reconcile it; still route to success.
      })
      toast.success("Payment successful!")
      router.push(`/payment/success?rentalId=${rentalId}`)
      return
    }

    setSubmitting(false)
    router.push(`/payment/cancel?rentalId=${rentalId}`)
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div className="rounded-md border p-3">
        <CardElement options={CARD_ELEMENT_OPTIONS} onChange={() => setCardError(null)} />
      </div>

      {cardError && (
        <Alert variant="destructive">
          <AlertDescription>{cardError}</AlertDescription>
        </Alert>
      )}

      <Button type="submit" size="lg" disabled={!stripe || submitting}>
        {submitting ? (
          <>
            <Loader2 className="size-4 animate-spin" /> Processing…
          </>
        ) : (
          <>
            <Lock className="size-4" /> Pay now
          </>
        )}
      </Button>

      <p className="text-center text-xs text-muted-foreground">
        Test card: 4242 4242 4242 4242, any future date, any CVC.
      </p>
    </form>
  )
}
