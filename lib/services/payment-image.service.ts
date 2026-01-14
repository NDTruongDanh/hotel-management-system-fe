/**
 * Payment Image Service
 * Handles fetching payment proof images for bookings
 */

import { api } from "./api";
import { PaymentImage } from "@/lib/types/api";

class PaymentImageService {
  /**
   * Get all payment images for a booking
   * GET /customer-api/v1/bookings/:bookingId/payment-images
   */
  async getPaymentImages(bookingId: string): Promise<PaymentImage[]> {
    return api.get<PaymentImage[]>(
      `/customer-api/v1/bookings/${bookingId}/payment-images`
    );
  }

  /**
   * Upload a single payment image
   * POST /customer-api/v1/bookings/:bookingId/payment-images
   */
  async uploadPaymentImage(
    bookingId: string,
    file: File,
    options?: {
      isDefault?: boolean;
      sortOrder?: number;
      paymentMethod?: string;
      description?: string;
    }
  ): Promise<PaymentImage> {
    const formData = new FormData();
    formData.append("image", file);
    if (options?.isDefault !== undefined)
      formData.append("isDefault", String(options.isDefault));
    if (options?.sortOrder !== undefined)
      formData.append("sortOrder", String(options.sortOrder));
    if (options?.paymentMethod)
      formData.append("paymentMethod", options.paymentMethod);
    if (options?.description) formData.append("description", options.description);

    return api.post<PaymentImage>(
      `/customer-api/v1/bookings/${bookingId}/payment-images`,
      formData
    );
  }

  /**
   * Upload multiple payment images
   * POST /customer-api/v1/bookings/:bookingId/payment-images/batch
   */
  async uploadPaymentImagesBatch(
    bookingId: string,
    files: File[]
  ): Promise<{
    successful: PaymentImage[];
    failed: Array<{ file: string; error: string }>;
    successCount: number;
    failureCount: number;
    total: number;
  }> {
    const formData = new FormData();
    files.forEach((file) => {
      formData.append("images", file);
    });

    return api.post(
      `/customer-api/v1/bookings/${bookingId}/payment-images/batch`,
      formData
    );
  }

  /**
   * Delete a payment image
   * DELETE /customer-api/v1/bookings/payment-images/:imageId
   */
  async deletePaymentImage(imageId: string): Promise<void> {
    return api.delete(`/customer-api/v1/bookings/payment-images/${imageId}`);
  }
}

export const paymentImageService = new PaymentImageService();
