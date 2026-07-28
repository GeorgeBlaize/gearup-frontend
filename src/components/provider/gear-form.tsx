"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { Loader2, Plus, X } from "lucide-react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"

import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
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
import { Textarea } from "@/components/ui/textarea"
import { useCategories } from "@/hooks/use-gear"
import { useCreateGear, useUpdateGear } from "@/hooks/use-provider"
import { gearSchema, type GearFormValues } from "@/lib/validators/gear"

const CONDITIONS = ["Excellent", "Good", "Fair", "Poor"] as const
const conditionItems = Object.fromEntries(CONDITIONS.map((c) => [c, c]))

export function GearForm({
  gearId,
  defaultValues,
}: {
  gearId?: string
  defaultValues?: Partial<GearFormValues>
}) {
  const router = useRouter()
  const { data: categoriesData } = useCategories()
  const categories = categoriesData?.categories ?? []
  const categoryItems = Object.fromEntries(categories.map((c) => [c.id, c.name]))

  const createGear = useCreateGear()
  const updateGear = useUpdateGear()
  const isEditing = !!gearId
  const isPending = createGear.isPending || updateGear.isPending

  const form = useForm<GearFormValues>({
    resolver: zodResolver(gearSchema),
    defaultValues: {
      name: "",
      description: "",
      pricePerDay: 0,
      categoryId: "",
      brand: "",
      condition: "Good",
      quantity: 1,
      images: [],
      availability: true,
      ...defaultValues,
    },
  })

  const images = form.watch("images")

  function onSubmit(values: GearFormValues) {
    const payload = {
      ...values,
      brand: values.brand || undefined,
      images: values.images.filter((url) => url.trim() !== ""),
    }

    if (isEditing) {
      updateGear.mutate(
        { id: gearId, payload },
        { onSuccess: () => router.push("/dashboard/provider/gear") }
      )
    } else {
      createGear.mutate(payload, {
        onSuccess: () => router.push("/dashboard/provider/gear"),
      })
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-5">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="Mountain Bike Pro" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Describe the gear's condition, features, and best use case..."
                  rows={4}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="pricePerDay"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Price per day (USD)</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    step="0.01"
                    min="0"
                    value={field.value}
                    onChange={(e) => field.onChange(e.target.valueAsNumber || 0)}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="quantity"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Quantity</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    min="1"
                    max="100"
                    value={field.value}
                    onChange={(e) => field.onChange(e.target.valueAsNumber || 1)}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="categoryId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Category</FormLabel>
                <Select
                  value={field.value}
                  items={categoryItems}
                  onValueChange={(value) => field.onChange(value ?? "")}
                >
                  <FormControl>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="condition"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Condition</FormLabel>
                <Select
                  value={field.value}
                  items={conditionItems}
                  onValueChange={(value) =>
                    field.onChange((value ?? "Good") as GearFormValues["condition"])
                  }
                >
                  <FormControl>
                    <SelectTrigger className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {CONDITIONS.map((c) => (
                      <SelectItem key={c} value={c}>
                        {c}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="brand"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Brand (optional)</FormLabel>
              <FormControl>
                <Input placeholder="Trek" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex flex-col gap-2">
          <Label>Image URLs (optional)</Label>
          {images.map((_, index) => (
            <div key={index} className="flex gap-2">
              <Input
                placeholder="https://example.com/photo.jpg"
                {...form.register(`images.${index}` as const)}
              />
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={() =>
                  form.setValue(
                    "images",
                    images.filter((_, i) => i !== index),
                    { shouldValidate: true }
                  )
                }
              >
                <X className="size-4" />
              </Button>
            </div>
          ))}
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="w-fit"
            disabled={images.length >= 10}
            onClick={() => form.setValue("images", [...images, ""])}
          >
            <Plus className="size-4" /> Add image URL
          </Button>
          {form.formState.errors.images && (
            <p className="text-sm font-medium text-destructive">
              {form.formState.errors.images.message as string}
            </p>
          )}
        </div>

        {isEditing && (
          <FormField
            control={form.control}
            name="availability"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-md border p-3">
                <FormLabel>Available for rent</FormLabel>
                <FormControl>
                  <Switch checked={field.value} onCheckedChange={field.onChange} />
                </FormControl>
              </FormItem>
            )}
          />
        )}

        <Button type="submit" size="lg" disabled={isPending} className="w-fit">
          {isPending && <Loader2 className="size-4 animate-spin" />}
          {isEditing ? "Save changes" : "List gear"}
        </Button>
      </form>
    </Form>
  )
}
