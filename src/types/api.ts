// Mirrors gearup-backend/prisma/schema.prisma and the JSON shapes the
// controllers actually select/include. Keep in sync with the backend.

export type UserRole = "CUSTOMER" | "PROVIDER" | "ADMIN"

export type RentalStatus =
  | "PLACED"
  | "CONFIRMED"
  | "PAID"
  | "PICKED_UP"
  | "RETURNED"
  | "CANCELLED"

export type PaymentStatus = "PENDING" | "COMPLETED" | "FAILED" | "REFUNDED"

export type PaymentProviderType = "STRIPE" | "SSLCOMMERZ"

export interface ApiResponse<T> {
  success: boolean
  message?: string
  data?: T
  errorDetails?: string
}

export interface Pagination {
  page: number
  limit: number
  total: number
  pages: number
}

export interface User {
  id: string
  email: string
  name: string
  phone?: string | null
  address?: string | null
  role: UserRole
  isActive: boolean
  createdAt: string
  updatedAt?: string
  _count?: {
    gearItems?: number
    rentals?: number
    reviews?: number
  }
}

export interface Category {
  id: string
  name: string
  description?: string | null
  _count?: { gearItems: number }
}

export interface GearReview {
  id?: string
  rating: number
  comment?: string | null
  customer: { id?: string; name: string }
  createdAt: string
}

export interface GearItem {
  id: string
  name: string
  description: string
  pricePerDay: number
  brand?: string | null
  condition: "Excellent" | "Good" | "Fair" | "Poor"
  availability: boolean
  images: string[]
  quantity: number
  categoryId: string
  category: { id: string; name: string; description?: string | null }
  providerId: string
  provider: {
    id: string
    name: string
    email: string
    phone?: string | null
    address?: string | null
  }
  reviews?: GearReview[]
  averageRating?: number
  reviewCount?: number
  available?: boolean
  activeRentals?: number
  createdAt: string
  updatedAt: string
  _count?: { reviews: number; rentalItems: number }
}

export interface GearListResponse {
  gear: GearItem[]
  filters: { minPrice: number; maxPrice: number }
  pagination: Pagination
}

export interface RentalItem {
  id?: string
  gearItemId: string
  quantity: number
  pricePerDayAtRental: number
  gearItem: {
    id: string
    name: string
    brand?: string | null
    images: string[]
    pricePerDay?: number
    category?: { id: string; name: string }
    reviews?: { id: string }[]
  }
}

export interface PaymentSummary {
  id: string
  transactionId: string
  amount: number
  status: PaymentStatus
  provider: PaymentProviderType
  paidAt?: string | null
}

export interface Payment extends PaymentSummary {
  rentalOrderId: string
  currency: string
  paymentIntentId?: string | null
  sessionId?: string | null
  failureReason?: string | null
  createdAt: string
  updatedAt: string
  rentalOrder?: RentalOrder
}

export interface RentalOrder {
  id: string
  orderNumber: string
  customerId: string
  customer?: {
    id: string
    name: string
    email: string
    phone?: string | null
    address?: string | null
  }
  providerId: string
  provider?: {
    id: string
    name: string
    email: string
    phone?: string | null
    address?: string | null
  }
  startDate: string
  endDate: string
  totalAmount: number
  status: RentalStatus
  payment?: PaymentSummary | null
  rentalItems: RentalItem[]
  daysRemaining?: number
  canReview?: boolean
  createdAt: string
  updatedAt: string
  _count?: { rentalItems: number }
}

export interface RentalListResponse {
  rentals: RentalOrder[]
  pagination: Pagination
}

export interface Review {
  id: string
  rating: number
  comment?: string | null
  customerId: string
  customer?: { id: string; name: string }
  gearItemId: string
  gearItem?: { id: string; name: string }
  createdAt: string
  updatedAt: string
}

export interface ProviderStatsOverview {
  totalGear: number
  totalOrders: number
  completedOrders: number
  pendingOrders: number
  totalRevenue: number
}

export interface MonthlyTrend {
  month: string
  orders?: number
  revenue: number
  transactions?: number
}

export interface ProviderStats {
  overview: ProviderStatsOverview
  recentOrders: RentalOrder[]
  monthlyTrends: MonthlyTrend[]
}

export interface AdminDashboardStats {
  overview: {
    totalUsers: number
    totalProviders: number
    totalGearItems: number
    totalRentals: number
    monthlyRevenue: number
    monthlyTransactions: number
  }
  statusBreakdown: { status: RentalStatus; _count: { status: number } }[]
  recentRentals: RentalOrder[]
  monthlyRevenue: MonthlyTrend[]
}

export interface CreatePaymentResult {
  clientSecret: string
  paymentId: string
  transactionId: string
}
