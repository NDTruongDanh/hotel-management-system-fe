/**
 * Booking Service
 * Handles all booking-related API calls for employee dashboard
 */

import { api } from "./api";
import type {
  ApiResponse,
  PaginatedResponse,
  CreateBookingRequest,
  CreateBookingResponse,
  CheckInRequest,
  CheckOutRequest,
  CreateTransactionRequest,
  Booking,
  BookingRoom,
  GetBookingsParams,
  CreateBookingEmployeeRequest,
  CancelBookingRequest,
  CancelBookingResponse,
  ConfirmBookingResponse,
  AvailableRoomSearchParams,
  AvailableRoom,
} from "@/lib/types/api";

export interface BookingResponse {
  bookingRooms?: BookingRoom[];
  booking?: Booking;
}

/**
 * Build query string from params object
 */
function buildQueryString(params: { [key: string]: unknown }): string {
  const searchParams = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      searchParams.append(key, String(value));
    }
  });
  const query = searchParams.toString();
  return query ? `?${query}` : "";
}

export const bookingService = {
  // ============================================================================
  // LIST & SEARCH BOOKINGS
  // ============================================================================

  /**
   * Get all bookings with pagination and filters (employee)
   * GET /employee/bookings
   *
   * Note: If API doesn't exist, returns empty array (mock fallback in hook)
   */
  async getAllBookings(
    params?: GetBookingsParams
  ): Promise<PaginatedResponse<Booking>> {
    try {
      const queryString = params
        ? buildQueryString(params as unknown as { [key: string]: unknown })
        : "";
      const response = await api.get<ApiResponse<PaginatedResponse<Booking>>>(
        `/employee/bookings${queryString}`,
        { requiresAuth: true }
      );
      const data =
        response && typeof response === "object" && "data" in response
          ? (response as ApiResponse<PaginatedResponse<Booking>>).data
          : (response as unknown as PaginatedResponse<Booking>);
      return data;
    } catch (error) {
      console.error("Get all bookings failed:", error);
      // Return empty paginated response for mock fallback
      return { data: [], total: 0, page: 1, limit: 10 };
    }
  },

  /**
   * Search bookings by query (code, customer name, phone)
   * GET /employee/bookings?search=...
   */
  async searchBookings(query: string): Promise<Booking[]> {
    try {
      const response = await this.getAllBookings({ search: query });
      return response.data || [];
    } catch (error) {
      console.error("Search bookings failed:", error);
      return [];
    }
  },

  /**
   * Get booking details by ID (employee)
   * GET /employee/bookings/{id}
   */
  async getBookingById(bookingId: string): Promise<BookingResponse> {
    const response = await api.get<ApiResponse<BookingResponse>>(
      `/employee/bookings/${bookingId}`,
      { requiresAuth: true }
    );
    const data =
      response && typeof response === "object" && "data" in response
        ? (response as ApiResponse<BookingResponse>).data
        : (response as unknown as BookingResponse);
    return data;
  },

  // ============================================================================
  // CREATE BOOKINGS
  // ============================================================================

  /**
   * Create a new booking (employee)
   * POST /employee/bookings
   *
   * Note: Uses mock response if API doesn't exist
   */
  async createBooking(
    data: CreateBookingRequest | CreateBookingEmployeeRequest
  ): Promise<CreateBookingResponse> {
    try {
      const response = await api.post<ApiResponse<CreateBookingResponse>>(
        "/employee/bookings",
        data,
        { requiresAuth: true }
      );
      const unwrappedData =
        response && typeof response === "object" && "data" in response
          ? (response as ApiResponse<CreateBookingResponse>).data
          : (response as unknown as CreateBookingResponse);
      return unwrappedData;
    } catch (error) {
      console.error("Create booking failed:", error);
      // Return mock response for frontend state update
      return {
        bookingId: `mock_${Date.now()}`,
        bookingCode: `BK${Date.now()}`,
        expiresAt: new Date(Date.now() + 15 * 60 * 1000).toISOString(),
        totalAmount: 0,
      };
    }
  },

  // ============================================================================
  // BOOKING STATUS MANAGEMENT
  // ============================================================================

  /**
   * Cancel a booking
   * PATCH /employee/bookings/{id}/cancel
   *
   * Note: Uses mock response if API doesn't exist
   */
  async cancelBooking(
    bookingId: string,
    reason?: string
  ): Promise<CancelBookingResponse> {
    try {
      const response = await api.patch<ApiResponse<CancelBookingResponse>>(
        `/employee/bookings/${bookingId}/cancel`,
        { reason } as CancelBookingRequest,
        { requiresAuth: true }
      );
      const data =
        response && typeof response === "object" && "data" in response
          ? (response as ApiResponse<CancelBookingResponse>).data
          : (response as unknown as CancelBookingResponse);
      return data;
    } catch (error) {
      console.error(
        "Cancel booking API failed, returning mock response:",
        error
      );
      // Return mock response for frontend state update
      return {
        id: bookingId,
        bookingCode: "",
        status: "CANCELLED",
        cancelledAt: new Date().toISOString(),
        cancelReason: reason,
      };
    }
  },

  /**
   * Confirm a pending booking
   * PATCH /employee/bookings/{id}/confirm
   *
   * Note: Uses mock response if API doesn't exist
   */
  async confirmBooking(bookingId: string): Promise<ConfirmBookingResponse> {
    try {
      const response = await api.patch<ApiResponse<ConfirmBookingResponse>>(
        `/employee/bookings/${bookingId}/confirm`,
        {},
        { requiresAuth: true }
      );
      const data =
        response && typeof response === "object" && "data" in response
          ? (response as ApiResponse<ConfirmBookingResponse>).data
          : (response as unknown as ConfirmBookingResponse);
      return data;
    } catch (error) {
      console.error(
        "Confirm booking API failed, returning mock response:",
        error
      );
      return {
        id: bookingId,
        bookingCode: "",
        status: "CONFIRMED",
        confirmedAt: new Date().toISOString(),
      };
    }
  },

  // ============================================================================
  // CHECK-IN / CHECK-OUT
  // ============================================================================

  /**
   * Check in guests for a booking (employee)
   * PATCH /employee/bookings/check-in
   */
  async checkIn(data: CheckInRequest): Promise<BookingResponse> {
    const response = await api.patch<ApiResponse<BookingResponse>>(
      "/employee/bookings/check-in",
      data,
      { requiresAuth: true }
    );
    const unwrappedData =
      response && typeof response === "object" && "data" in response
        ? (response as ApiResponse<BookingResponse>).data
        : (response as unknown as BookingResponse);
    return unwrappedData;
  },

  /**
   * Check out guests for a booking (employee)
   * PATCH /employee/bookings/check-out
   */
  async checkOut(data: CheckOutRequest): Promise<BookingResponse> {
    const response = await api.patch<ApiResponse<BookingResponse>>(
      "/employee/bookings/check-out",
      data,
      { requiresAuth: true }
    );
    const unwrappedData =
      response && typeof response === "object" && "data" in response
        ? (response as ApiResponse<BookingResponse>).data
        : (response as unknown as BookingResponse);
    return unwrappedData;
  },

  // ============================================================================
  // TRANSACTIONS
  // ============================================================================

  /**
   * Create a transaction for a booking (employee)
   * POST /employee/bookings/transaction
   */
  async createTransaction(
    data: CreateTransactionRequest
  ): Promise<BookingResponse> {
    const response = await api.post<ApiResponse<BookingResponse>>(
      "/employee/bookings/transaction",
      data,
      { requiresAuth: true }
    );
    const unwrappedData =
      response && typeof response === "object" && "data" in response
        ? (response as ApiResponse<BookingResponse>).data
        : (response as unknown as BookingResponse);
    return unwrappedData;
  },

  // ============================================================================
  // AVAILABLE ROOMS
  // ============================================================================

  /**
   * Get available rooms for a date range
   * GET /employee/rooms/available?checkInDate=...&checkOutDate=...&roomTypeId=...
   *
   * Note: Uses mock fallback if API doesn't exist
   */
  async getAvailableRooms(
    params: AvailableRoomSearchParams
  ): Promise<AvailableRoom[]> {
    try {
      const queryString = buildQueryString(
        params as unknown as { [key: string]: unknown }
      );
      const response = await api.get<ApiResponse<AvailableRoom[]>>(
        `/employee/rooms/available${queryString}`,
        { requiresAuth: true }
      );
      const data =
        response && typeof response === "object" && "data" in response
          ? (response as ApiResponse<AvailableRoom[]>).data
          : (response as unknown as AvailableRoom[]);
      return data;
    } catch (error) {
      console.error("Get available rooms failed:", error);
      // Return empty array - mock fallback handled in hook
      return [];
    }
  },
};
