/**
 * QR Code Settings Card Component
 * Manages payment QR code image configuration
 * Beautiful, animated, and vibrant design with image picker
 */

"use client";

import { useState, useEffect, useRef } from "react";
import { QrCode, Edit2, Save, X, Upload, Image as ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import type {
  PaymentQrCodeConfig,
  UpdatePaymentQrCodeRequest,
} from "@/lib/types/app-settings";
import { PermissionGuard } from "@/components/permission-guard";
import Image from "next/image";

interface QrCodeSettingsCardProps {
  qrCodeConfig: PaymentQrCodeConfig | null;
  onUpdate: (config: UpdatePaymentQrCodeRequest) => Promise<void>;
  loading: boolean;
}

export function QrCodeSettingsCard({
  qrCodeConfig,
  onUpdate,
  loading,
}: QrCodeSettingsCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [base64Image, setBase64Image] = useState<string>("");
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Sync state when qrCodeConfig prop changes
  useEffect(() => {
    if (qrCodeConfig?.base64) {
      setBase64Image(qrCodeConfig.base64);
      // If base64 doesn't have data URI prefix, add it
      const imageUrl = qrCodeConfig.base64.startsWith("data:")
        ? qrCodeConfig.base64
        : `data:image/png;base64,${qrCodeConfig.base64}`;
      setPreviewUrl(imageUrl);
    }
  }, [qrCodeConfig]);

  const handleEdit = () => {
    setError(null);
    setIsEditing(true);
  };

  const handleCancel = () => {
    // Revert to original state
    if (qrCodeConfig?.base64) {
      setBase64Image(qrCodeConfig.base64);
      const imageUrl = qrCodeConfig.base64.startsWith("data:")
        ? qrCodeConfig.base64
        : `data:image/png;base64,${qrCodeConfig.base64}`;
      setPreviewUrl(imageUrl);
    }
    setError(null);
    setIsEditing(false);
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      setError("Vui lòng chọn file hình ảnh");
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError("Kích thước file không được vượt quá 5MB");
      return;
    }

    // Convert to base64
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      setPreviewUrl(result);
      // Remove data URI prefix for storage
      const base64Data = result.split(",")[1] || result;
      setBase64Image(base64Data);
      setError(null);
    };
    reader.onerror = () => {
      setError("Lỗi khi đọc file");
    };
    reader.readAsDataURL(file);
  };

  const handleSave = async () => {
    if (!base64Image) {
      setError("Vui lòng chọn hình ảnh QR code");
      return;
    }

    try {
      setSaving(true);
      setError(null);
      await onUpdate({ base64: base64Image });
      setIsEditing(false);
    } catch (err) {
      const errorMsg =
        err instanceof Error ? err.message : "Lỗi khi cập nhật QR code";
      setError(errorMsg);
      console.error("Failed to save QR code:", err);
    } finally {
      setSaving(false);
    }
  };

  if (qrCodeConfig === null && !loading) {
    return (
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <QrCode className="h-5 w-5" />
            QR Code Thanh Toán
          </CardTitle>
          <CardDescription>
            Cấu hình hình ảnh QR code cho thanh toán
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-muted-foreground">Chưa có dữ liệu...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden col-span-full">
      {/* Gradient background */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-bl from-green-500/20 via-emerald-500/20 to-transparent rounded-full blur-3xl opacity-40 -z-0" />

      <CardHeader className="relative">
        <CardTitle className="flex items-center justify-between">
          <span className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-gradient-to-br from-green-500 to-emerald-500 text-white shadow-lg">
              <QrCode className="h-5 w-5" />
            </div>
            <div>
              <div className="text-lg font-bold">QR Code Thanh Toán</div>
              <CardDescription className="text-xs mt-0.5">
                Cấu hình hình ảnh QR code cho khách hàng thanh toán
              </CardDescription>
            </div>
          </span>
          {!isEditing && (
            <PermissionGuard permission="settings:update">
              <Button
                variant="ghost"
                size="icon"
                onClick={handleEdit}
                disabled={loading}
                className="hover:bg-accent transition-colors z-10"
              >
                <Edit2 className="h-4 w-4" />
              </Button>
            </PermissionGuard>
          )}
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-6 relative">
        {error && (
          <div className="p-4 bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 rounded-lg">
            <p className="text-sm font-medium text-red-800 dark:text-red-200">
              ⚠️ {error}
            </p>
          </div>
        )}

        {!isEditing ? (
          <div className="space-y-6">
            {/* QR Code Display */}
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 dark:from-green-950 dark:via-emerald-950 dark:to-teal-950 border border-green-200 dark:border-green-800 p-8 transition-transform duration-300">
              <div className="relative flex flex-col items-center justify-center gap-4">
                {previewUrl ? (
                  <div className="relative w-64 h-64 bg-white rounded-xl shadow-lg p-4 border-2 border-green-200">
                    <Image
                      src={previewUrl}
                      alt="Payment QR Code"
                      fill
                      className="object-contain"
                    />
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-3 text-muted-foreground">
                    <ImageIcon className="h-16 w-16 opacity-30" />
                    <p className="text-sm">Chưa có QR code</p>
                  </div>
                )}
              </div>
            </div>

            <div className="text-center text-sm text-muted-foreground">
              Khách hàng có thể quét mã QR này để thanh toán tiền đặt cọc và
              các khoản phí khác
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Upload Section */}
            <div className="space-y-4">
              <Label className="text-base font-semibold">
                Tải lên hình ảnh QR Code
              </Label>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                className="hidden"
              />

              <div className="flex flex-col items-center gap-4">
                {/* Preview */}
                {previewUrl ? (
                  <div className="relative w-64 h-64 bg-white rounded-xl shadow-lg p-4 border-2 border-green-200">
                    <Image
                      src={previewUrl}
                      alt="QR Code Preview"
                      fill
                      className="object-contain"
                    />
                  </div>
                ) : (
                  <div className="w-64 h-64 bg-gray-100 dark:bg-gray-800 rounded-xl flex items-center justify-center border-2 border-dashed border-gray-300 dark:border-gray-600">
                    <div className="text-center">
                      <ImageIcon className="h-16 w-16 mx-auto mb-2 text-gray-400" />
                      <p className="text-sm text-gray-500">Chưa có hình ảnh</p>
                    </div>
                  </div>
                )}

                {/* Upload Button */}
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full max-w-xs"
                >
                  <Upload className="h-4 w-4 mr-2" />
                  Chọn hình ảnh
                </Button>

                <p className="text-xs text-muted-foreground text-center">
                  Chấp nhận file ảnh định dạng JPG, PNG, GIF (tối đa 5MB)
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 justify-end pt-4 border-t">
              <Button
                variant="outline"
                onClick={handleCancel}
                disabled={saving}
              >
                <X className="h-4 w-4 mr-2" />
                Hủy
              </Button>
              <PermissionGuard permission="settings:update">
                <Button
                  onClick={handleSave}
                  disabled={saving || !base64Image}
                  className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600"
                >
                  {saving ? (
                    <>
                      <div className="h-4 w-4 mr-2 animate-spin rounded-full border-2 border-white border-t-transparent" />
                      Đang lưu...
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4 mr-2" />
                      Lưu thay đổi
                    </>
                  )}
                </Button>
              </PermissionGuard>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
