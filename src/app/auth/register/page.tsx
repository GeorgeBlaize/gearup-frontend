"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { Loader2, PackageSearch, ShoppingBag } from "lucide-react"
import Link from "next/link"
import { useForm } from "react-hook-form"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { useRegister } from "@/hooks/use-auth"
import { cn } from "@/lib/utils"
import { registerSchema, type RegisterFormValues } from "@/lib/validators/auth"

const ROLES = [
  {
    value: "CUSTOMER" as const,
    label: "Customer",
    description: "Rent sports & outdoor gear",
    icon: ShoppingBag,
  },
  {
    value: "PROVIDER" as const,
    label: "Provider",
    description: "List gear for others to rent",
    icon: PackageSearch,
  },
]

export default function RegisterPage() {
  const register = useRegister()

  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      role: "CUSTOMER",
      phone: "",
      address: "",
    },
  })

  function onSubmit(values: RegisterFormValues) {
    register.mutate({
      ...values,
      phone: values.phone || undefined,
      address: values.address || undefined,
    })
  }

  return (
    <div className="flex min-h-[calc(100vh-8rem)] items-center justify-center px-4 py-12">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl">Create an account</CardTitle>
          <CardDescription>
            Join GearUp as a customer or a gear provider.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4">
              <FormField
                control={form.control}
                name="role"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>I am a...</FormLabel>
                    <div className="grid grid-cols-2 gap-3">
                      {ROLES.map((role) => (
                        <button
                          key={role.value}
                          type="button"
                          onClick={() => field.onChange(role.value)}
                          className={cn(
                            "flex flex-col items-center gap-1 rounded-lg border p-3 text-center transition-colors",
                            field.value === role.value
                              ? "border-primary bg-primary/5"
                              : "hover:bg-muted"
                          )}
                        >
                          <role.icon className="size-5" />
                          <span className="text-sm font-medium">{role.label}</span>
                          <span className="text-xs text-muted-foreground">
                            {role.description}
                          </span>
                        </button>
                      ))}
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full name</FormLabel>
                    <FormControl>
                      <Input placeholder="Jamie Rivera" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="you@example.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="At least 6 characters" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-2 gap-3">
                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone (optional)</FormLabel>
                      <FormControl>
                        <Input placeholder="+1 555 0100" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="address"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Address (optional)</FormLabel>
                      <FormControl>
                        <Input placeholder="City, Country" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <Button type="submit" className="mt-2 w-full" disabled={register.isPending}>
                {register.isPending && <Loader2 className="size-4 animate-spin" />}
                Create account
              </Button>
            </form>
          </Form>
          <p className="mt-4 text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link href="/auth/login" className="font-medium text-primary hover:underline">
              Log in
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
