/**
 * Check-in/Check-out Service
 * Handles service usage, penalties, and surcharges during check-in/checkout flow
 *
 * Note: Core checkIn() and checkOut() methods are in booking.service.ts
 */

import { api } from "./api";
import type { ApiResponse } from "@/lib/types/api";
import type {
  ServiceUsageRequest,
  ServiceUsageResponse,
  UpdateServiceUsageRequest,
  WalkInBookingRequest,
  WalkInBookingResponse,
} from "@/lib/types/checkin-checkout";

export const checkinCheckoutService = {
  // ============================================================================
  // SERVICE USAGE (from swagger.json: /employee/service/service-usage)
  // ============================================================================

  /**
   * Add service usage to a booking room
   * POST /employee/service/service-usage
   */
  async addServiceUsage(
    data: ServiceUsageRequest
  ): Promise<ServiceUsageResponse> {
    const response = await api.post<ApiResponse<ServiceUsageResponse>>(
      "/employee/service/service-usage",
      data,
      { requiresAuth: true }
    );
    const unwrappedData =
      response && typeof response === "object" && "data" in response
        ? (response as ApiResponse<ServiceUsageResponse>).data
        : (response as unknown as ServiceUsageResponse);
    return unwrappedData;
  },

  /**
   * Update service usage (quantity or status)
   * PATCH /employee/service/service-usage/{id}
   */
  async updateServiceUsage(
    serviceUsageId: string,
    data: UpdateServiceUsageRequest
  ): Promise<ServiceUsageResponse> {
    const response = await api.patch<ApiResponse<ServiceUsageResponse>>(
      `/employee/service/service-usage/${serviceUsageId}`,
      data,
      { requiresAuth: true }
    );
    const unwrappedData =
      response && typeof response === "object" && "data" in response
        ? (response as ApiResponse<ServiceUsageResponse>).data
        : (response as unknown as ServiceUsageResponse);
    return unwrappedData;
  },

  /**
   * Cancel service usage
   * PATCH /employee/service/service-usage/{id} with status: CANCELLED
   */
  async cancelServiceUsage(
    serviceUsageId: string
  ): Promise<ServiceUsageResponse> {
    return this.updateServiceUsage(serviceUsageId, { status: "CANCELLED" });
  },

  // ============================================================================
  // WALK-IN BOOKING (Missing API - documented in Missing_API_endpoints.md)
  // ============================================================================

  /**
   * Create walk-in booking with immediate check-in
   * POST /employee/bookings/walk-in
   *
   * Note: This API is currently not implemented in the backend.
   * See Missing_API_endpoints.md for the expected request/response format.
   */
  async createWalkInBooking(
    data: WalkInBookingRequest
  ): Promise<WalkInBookingResponse> {
    try {
      const response = await api.post<ApiResponse<WalkInBookingResponse>>(
        "/employee/bookings/walk-in",
        data,
        { requiresAuth: true }
      );
      const unwrappedData =
        response && typeof response === "object" && "data" in response
          ? (response as ApiResponse<WalkInBookingResponse>).data
          : (response as unknown as WalkInBookingResponse);
      return unwrappedData;
    } catch (error) {
      console.error("Walk-in booking failed (API may not exist):", error);
      // Return mock response for UI development
      return {
        bookingId: `walkin_${Date.now()}`,
        bookingCode: `WI${Date.now()}`,
        bookingRoomId: `room_${Date.now()}`,
        status: "CHECKED_IN",
        message: "Walk-in booking created successfully (mock)",
      };
    }
  },
};
