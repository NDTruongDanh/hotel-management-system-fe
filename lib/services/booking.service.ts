/**
 * Booking Service
 * Handles all booking-related API calls
 */

import { api } from "./api";
import type {
  ApiResponse,
  CreateBookingRequest,
  CreateBookingResponse,
  CheckInRequest,
  CreateTransactionRequest,
} from "@/lib/types/api";

export const bookingService = {
  /**
   * Create a new booking (customer)
   * POST /customer/bookings
   */
  async createBooking(
    data: CreateBookingRequest
  ): Promise<CreateBookingResponse> {
    const response = await api.post<ApiResponse<CreateBookingResponse>>(
      "/customer/bookings",
      data,
      { requiresAuth: true }
    );
    return response.data;
  },

  /**
   * Get booking details by ID
   * GET /customer/bookings/{id} or /employee/bookings/{id}
   */
  async getBookingById(bookingId: string, isEmployee = false): Promise<any> {
    const endpoint = isEmployee
      ? `/employee/bookings/${bookingId}`
      : `/customer/bookings/${bookingId}`;

    const response = await api.get<ApiResponse<any>>(endpoint, {
      requiresAuth: true,
    });
    return response.data;
  },

  /**
   * Check in guests for a booking (employee)
   * PATCH /employee/bookings/check-in
   */
  async checkIn(data: CheckInRequest): Promise<any> {
    const response = await api.patch<ApiResponse<any>>(
      "/employee/bookings/check-in",
      data,
      { requiresAuth: true }
    );
    return response.data;
  },

  /**
   * Create a transaction for a booking (employee)
   * POST /employee/bookings/transaction
   */
  async createTransaction(data: CreateTransactionRequest): Promise<any> {
    const response = await api.post<ApiResponse<any>>(
      "/employee/bookings/transaction",
      data,
      { requiresAuth: true }
    );
    return response.data;
  },
};
