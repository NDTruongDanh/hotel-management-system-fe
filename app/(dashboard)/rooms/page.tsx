"use client";

import { useState, useMemo } from "react";
import { useRooms } from "@/hooks/use-rooms";
import { useRoomTypes } from "@/hooks/use-room-types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Plus,
  Search,
  Grid3x3,
  List,
  AlertCircle,
  Loader2,
  Hotel,
  CheckCircle2,
  Users,
  TrendingUp,
  Filter,
  X,
  Layers,
} from "lucide-react";
import { RoomCard } from "@/components/rooms/room-card";
import { RoomTable } from "@/components/rooms/room-table";
import { RoomFormModal } from "@/components/rooms/room-form-modal";
import type { RoomStatus } from "@/lib/types/api";

// Status configuration for filters
const statusOptions: { value: RoomStatus | "ALL"; label: string; color: string }[] = [
  { value: "ALL", label: "Tất cả trạng thái", color: "bg-gray-500" },
  { value: "AVAILABLE", label: "Sẵn sàng", color: "bg-emerald-500" },
  { value: "OCCUPIED", label: "Đang sử dụng", color: "bg-red-500" },
  { value: "RESERVED", label: "Đã đặt", color: "bg-blue-500" },
  { value: "CLEANING", label: "Đang dọn", color: "bg-yellow-500" },
  { value: "MAINTENANCE", label: "Bảo trì", color: "bg-gray-500" },
  { value: "OUT_OF_SERVICE", label: "Ngừng hoạt động", color: "bg-purple-500" },
];

export default function RoomsPage() {
  const {
    rooms,
    loading,
    error,
    isDeleting,
    statistics,
    uniqueFloors,
    filters,
    handleSearch,
    handleFilterChange,
    clearFilters,
    modalOpen,
    setModalOpen,
    editingRoom,
    handleAddNew,
    handleEdit,
    handleSave,
    handleDelete,
    clearError,
  } = useRooms();

  const { roomTypes } = useRoomTypes();

  const [viewMode, setViewMode] = useState<"grid" | "table">("grid");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<RoomStatus | "ALL">("ALL");
  const [floorFilter, setFloorFilter] = useState<string>("ALL");
  const [roomTypeFilter, setRoomTypeFilter] = useState<string>("ALL");

  // Handle search change
  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    handleSearch(value);
  };

  // Handle status filter
  const handleStatusFilterChange = (value: string) => {
    setStatusFilter(value as RoomStatus | "ALL");
    handleFilterChange({ status: value === "ALL" ? undefined : (value as RoomStatus) });
  };

  // Handle floor filter
  const handleFloorFilterChange = (value: string) => {
    setFloorFilter(value);
    handleFilterChange({ floor: value === "ALL" ? undefined : parseInt(value) });
  };

  // Handle room type filter
  const handleRoomTypeFilterChange = (value: string) => {
    setRoomTypeFilter(value);
    handleFilterChange({ roomTypeId: value === "ALL" ? undefined : value });
  };

  // Clear all filters
  const handleClearAllFilters = () => {
    setSearchTerm("");
    setStatusFilter("ALL");
    setFloorFilter("ALL");
    setRoomTypeFilter("ALL");
    clearFilters();
  };

  // Check if any filter is active
  const hasActiveFilters = searchTerm || statusFilter !== "ALL" || floorFilter !== "ALL" || roomTypeFilter !== "ALL";

  // Group rooms by floor for grid view
  const roomsByFloor = useMemo(() => {
    const grouped: Record<number, typeof rooms> = {};
    rooms.forEach((room) => {
      if (!grouped[room.floor]) {
        grouped[room.floor] = [];
      }
      grouped[room.floor].push(room);
    });
    // Sort floors
    return Object.entries(grouped)
      .sort(([a], [b]) => parseInt(a) - parseInt(b))
      .map(([floor, floorRooms]) => ({
        floor: parseInt(floor),
        rooms: floorRooms.sort((a, b) => a.roomNumber.localeCompare(b.roomNumber)),
      }));
  }, [rooms]);

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Modern Header with Gradient */}
      <div className="relative overflow-hidden rounded-3xl bg-linear-to-br from-blue-600 via-cyan-600 to-teal-600 p-8 shadow-2xl">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48cGF0aCBkPSJNMzYgMzRjMC0yLjIxLTEuNzktNC00LTRzLTQgMS43OS00IDQgMS43OSA0IDQgNCA0LTEuNzkgNC00em0wLTEwYzAtMi4yMS0xLjc5LTQtNC00cy00IDEuNzktNCA0IDEuNzkgNCA0IDQgNC0xLjc5IDQtNHoiLz48L2c+PC9nPjwvc3ZnPg==')] opacity-20"></div>
        <div className="relative flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white/20 backdrop-blur-sm">
              <Hotel className="h-9 w-9 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-black text-white drop-shadow-lg">
                Quản lý Phòng
              </h1>
              <p className="text-lg text-white/90 mt-1 font-medium">
                Danh sách và quản lý tất cả các phòng trong khách sạn
              </p>
            </div>
          </div>
          <Button
            onClick={handleAddNew}
            size="lg"
            className="bg-white text-blue-600 hover:bg-white/90 shadow-2xl hover:shadow-white/20 transition-all duration-300 hover:scale-105 h-14 px-8 font-bold"
          >
            <Plus className="mr-2 h-6 w-6" />
            Thêm phòng mới
          </Button>
        </div>
      </div>

      {/* Error Alert */}
      {error && (
        <Alert variant="destructive" className="border-red-300 bg-red-50">
          <AlertCircle className="h-5 w-5" />
          <AlertDescription className="flex items-center justify-between flex-1">
            <span>{error}</span>
            <Button
              variant="ghost"
              size="sm"
              onClick={clearError}
              className="h-6 px-2 hover:bg-white/10"
            >
              Đóng
            </Button>
          </AlertDescription>
        </Alert>
      )}

      {/* Statistics Cards with Gradient */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        {/* Total Rooms */}
        <Card className="group relative overflow-hidden border-0 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 bg-linear-to-br from-blue-50 via-blue-100 to-cyan-100">
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-300/20 rounded-full blur-3xl"></div>
          <CardHeader className="pb-2 relative">
            <CardTitle className="text-sm font-bold text-blue-700 uppercase tracking-wide flex items-center gap-2">
              <Hotel className="h-4 w-4" />
              Tổng phòng
            </CardTitle>
          </CardHeader>
          <CardContent className="relative">
            <div className="text-5xl font-extrabold text-blue-900 mb-2">
              {statistics.total}
            </div>
            <div className="text-xs text-blue-600 font-semibold">
              Tất cả các phòng
            </div>
          </CardContent>
        </Card>

        {/* Available Rooms */}
        <Card className="group relative overflow-hidden border-0 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 bg-linear-to-br from-emerald-50 via-emerald-100 to-teal-100">
          <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-300/20 rounded-full blur-3xl"></div>
          <CardHeader className="pb-2 relative">
            <CardTitle className="text-sm font-bold text-emerald-700 uppercase tracking-wide flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4" />
              Phòng trống
            </CardTitle>
          </CardHeader>
          <CardContent className="relative">
            <div className="text-5xl font-extrabold text-emerald-900 mb-2">
              {statistics.available}
            </div>
            <div className="text-xs text-emerald-600 font-semibold">
              Sẵn sàng đặt phòng
            </div>
          </CardContent>
        </Card>

        {/* Occupied Rooms */}
        <Card className="group relative overflow-hidden border-0 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 bg-linear-to-br from-orange-50 via-orange-100 to-amber-100">
          <div className="absolute top-0 right-0 w-32 h-32 bg-orange-300/20 rounded-full blur-3xl"></div>
          <CardHeader className="pb-2 relative">
            <CardTitle className="text-sm font-bold text-orange-700 uppercase tracking-wide flex items-center gap-2">
              <Users className="h-4 w-4" />
              Đang sử dụng
            </CardTitle>
          </CardHeader>
          <CardContent className="relative">
            <div className="text-5xl font-extrabold text-orange-900 mb-2">
              {statistics.occupied}
            </div>
            <div className="text-xs text-orange-600 font-semibold">
              Khách đang ở
            </div>
          </CardContent>
        </Card>

        {/* Occupancy Rate */}
        <Card className="group relative overflow-hidden border-0 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 bg-linear-to-br from-purple-50 via-purple-100 to-pink-100">
          <div className="absolute top-0 right-0 w-32 h-32 bg-purple-300/20 rounded-full blur-3xl"></div>
          <CardHeader className="pb-2 relative">
            <CardTitle className="text-sm font-bold text-purple-700 uppercase tracking-wide flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Tỷ lệ lấp đầy
            </CardTitle>
          </CardHeader>
          <CardContent className="relative">
            <div className="text-5xl font-extrabold text-purple-900 mb-2">
              {statistics.occupancyRate}%
            </div>
            <div className="text-xs text-purple-600 font-semibold">
              Công suất sử dụng
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Enhanced Search & Filters - Redesigned */}
      <div className="space-y-4">
        {/* Filter Row with Search - All in one row */}
        <Card className="border-0 shadow-lg bg-linear-to-br from-white via-blue-50/30 to-cyan-50/20 overflow-hidden">
          <CardContent className="p-6">
            <div className="space-y-5">
              {/* Filter Label & Active Chips */}
              <div className="flex items-center gap-4 flex-wrap">
                <div className="flex items-center gap-2.5 px-4 py-2.5 bg-linear-to-r from-blue-100 via-cyan-100 to-teal-100 rounded-full shadow-sm">
                  <Filter className="h-5 w-5 text-blue-600" />
                  <span className="text-sm font-bold bg-linear-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">Bộ lọc</span>
                </div>

                {/* Active Filter Tags */}
                <div className="flex flex-wrap gap-2.5">
                  {statusFilter !== "ALL" && (
                    <div className="px-4 py-2 bg-linear-to-r from-blue-500 to-cyan-500 text-white text-sm rounded-full font-semibold flex items-center gap-2 shadow-md hover:shadow-lg hover:scale-105 transition-all">
                      <span>{statusOptions.find(s => s.value === statusFilter)?.label}</span>
                      <button onClick={() => handleStatusFilterChange("ALL")} className="hover:bg-white/25 rounded-full p-1 transition-colors">
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  )}
                  {floorFilter !== "ALL" && (
                    <div className="px-4 py-2 bg-linear-to-r from-cyan-500 to-teal-500 text-white text-sm rounded-full font-semibold flex items-center gap-2 shadow-md hover:shadow-lg hover:scale-105 transition-all">
                      <span>Tầng {floorFilter}</span>
                      <button onClick={() => handleFloorFilterChange("ALL")} className="hover:bg-white/25 rounded-full p-1 transition-colors">
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  )}
                  {roomTypeFilter !== "ALL" && (
                    <div className="px-4 py-2 bg-linear-to-r from-teal-500 to-emerald-500 text-white text-sm rounded-full font-semibold flex items-center gap-2 shadow-md hover:shadow-lg hover:scale-105 transition-all">
                      <span>{roomTypes.find(t => t.roomTypeID === roomTypeFilter)?.roomTypeName}</span>
                      <button onClick={() => handleRoomTypeFilterChange("ALL")} className="hover:bg-white/25 rounded-full p-1 transition-colors">
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Search & Filters in one row */}
              <div className="flex flex-col sm:flex-row gap-4 items-end w-full">
                {/* Search Bar - 55% width */}
                <div className="w-full sm:w-[55%] relative group">
                  <div className="absolute inset-0 bg-linear-to-r from-blue-500/20 via-cyan-500/20 to-teal-500/20 rounded-xl blur-md opacity-0 group-focus-within:opacity-100 transition-opacity duration-300"></div>
                  <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-600 transition-colors z-10" />
                  <Input
                    placeholder="Tìm kiếm theo số phòng..."
                    value={searchTerm}
                    onChange={(e) => handleSearchChange(e.target.value)}
                    className="pl-12 pr-4 h-14 bg-white/95 border-2 border-gray-200 hover:border-blue-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/15 transition-all duration-200 text-base font-medium placeholder:text-gray-400 rounded-xl shadow-md relative"
                  />
                </div>

                {/* Filters - 45% width */}
                <div className="flex-1 grid grid-cols-3 gap-3 items-end auto-rows-max">
                  {/* Status Filter */}
                  <div className="col-span-1 flex flex-col min-w-0">
                    <label className="text-xs font-bold text-transparent bg-linear-to-r from-blue-600 to-blue-700 bg-clip-text uppercase tracking-wider mb-2 block">
                      Trạng thái
                    </label>
                    <Select value={statusFilter} onValueChange={handleStatusFilterChange}>
                      <SelectTrigger className="h-14 flex items-center bg-white border-2 border-blue-200 hover:border-blue-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 rounded-xl font-semibold text-base transition-all hover:shadow-md">
                        <SelectValue placeholder="Chọn trạng thái" />
                      </SelectTrigger>
                      <SelectContent>
                        {statusOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            <div className="flex items-center gap-2">
                              <div className={`h-3 w-3 rounded-full ${option.color}`} />
                              <span className="font-medium">{option.label}</span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Floor Filter */}
                  <div className="col-span-1 flex flex-col min-w-0">
                    <label className="text-xs font-bold text-transparent bg-linear-to-r from-cyan-600 to-teal-700 bg-clip-text uppercase tracking-wider mb-2 block">
                      Tầng
                    </label>
                    <Select value={floorFilter} onValueChange={handleFloorFilterChange}>
                      <SelectTrigger className="h-14 flex items-center bg-white border-2 border-cyan-200 hover:border-cyan-400 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 rounded-xl font-semibold text-base transition-all hover:shadow-md">
                        <SelectValue placeholder="Chọn tầng" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="ALL">
                          <div className="flex items-center gap-2 font-medium">
                            <Layers className="h-4 w-4 text-gray-500" />
                            Tất cả tầng
                          </div>
                        </SelectItem>
                        {uniqueFloors.map((floor) => (
                          <SelectItem key={floor} value={floor.toString()}>
                            <span className="font-medium">Tầng {floor}</span>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Room Type Filter */}
                  <div className="col-span-1 flex flex-col min-w-0">
                    <label className="text-xs font-bold text-transparent bg-linear-to-r from-teal-600 to-emerald-700 bg-clip-text uppercase tracking-wider mb-2 block">
                      Loại phòng
                    </label>
                    <Select value={roomTypeFilter} onValueChange={handleRoomTypeFilterChange}>
                      <SelectTrigger className="h-14 flex items-center bg-white border-2 border-teal-200 hover:border-teal-400 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 rounded-xl font-semibold text-base transition-all hover:shadow-md">
                        <SelectValue placeholder="Chọn loại phòng" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="ALL">
                          <div className="flex items-center gap-2 font-medium">
                            <Hotel className="h-4 w-4 text-gray-500" />
                            Tất cả loại phòng
                          </div>
                        </SelectItem>
                        {roomTypes.map((type) => (
                          <SelectItem key={type.roomTypeID} value={type.roomTypeID}>
                            <span className="font-medium">{type.roomTypeName}</span>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Clear All Button - on same row as filters */}
                {hasActiveFilters && (
                  <Button
                    variant="outline"
                    onClick={handleClearAllFilters}
                    className="h-14 px-6 border-2 border-red-300 text-red-600 hover:bg-red-50 hover:border-red-500 hover:text-red-700 rounded-xl font-bold transition-all whitespace-nowrap shadow-sm"
                  >
                    <X className="h-5 w-5 mr-2" />
                    Xóa tất cả
                  </Button>
                )}
              </div>

              {/* Results Summary */}
              <div className="flex items-center justify-between pt-3 border-t border-gray-200">
                <div className="flex items-center gap-2">
                  <div className="h-2.5 w-2.5 rounded-full bg-linear-to-r from-blue-500 to-cyan-500 animate-pulse"></div>
                  <span className="text-sm font-semibold text-gray-700">
                    <span className="text-blue-600">{rooms.length}</span> phòng
                    {hasActiveFilters && (
                      <span className="text-gray-500"> • Đã áp dụng bộ lọc</span>
                    )}
                  </span>
                </div>
                <div className="text-xs text-gray-500 font-medium">
                  {searchTerm && `Tìm kiếm: "${searchTerm}"`}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* View Toggle */}
        <div className="flex justify-end">
          <Tabs value={viewMode} onValueChange={(v) => setViewMode(v as "grid" | "table")} className="w-auto">
            <TabsList className="bg-white border-2 border-gray-200 p-1.5 h-12 rounded-xl shadow-md">
              <TabsTrigger 
                value="grid" 
                className="gap-2 px-5 h-full data-[state=active]:bg-linear-to-r data-[state=active]:from-blue-500 data-[state=active]:to-cyan-500 data-[state=active]:text-white data-[state=active]:shadow-lg rounded-lg transition-all font-semibold"
              >
                <Grid3x3 className="h-5 w-5" />
                <span className="hidden sm:inline">Lưới</span>
              </TabsTrigger>
              <TabsTrigger 
                value="table" 
                className="gap-2 px-5 h-full data-[state=active]:bg-linear-to-r data-[state=active]:from-blue-500 data-[state=active]:to-cyan-500 data-[state=active]:text-white data-[state=active]:shadow-lg rounded-lg transition-all font-semibold"
              >
                <List className="h-5 w-5" />
                <span className="hidden sm:inline">Bảng</span>
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </div>

      {/* Content Area */}
      {loading ? (
        <Card className="border-0 shadow-lg">
          <CardContent className="p-6">
            <div className="flex flex-col items-center justify-center py-20">
              <Loader2 className="h-16 w-16 animate-spin text-blue-600 mb-4" />
              <p className="text-base text-gray-600 font-medium">Đang tải dữ liệu...</p>
            </div>
          </CardContent>
        </Card>
      ) : rooms.length === 0 ? (
        <Card className="border-0 shadow-lg">
          <CardContent className="p-6">
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="flex h-24 w-24 items-center justify-center rounded-full bg-linear-to-br from-gray-100 to-gray-200 mb-6 shadow-inner">
                <Hotel className="h-12 w-12 text-gray-400" />
              </div>
              <h3 className="text-2xl font-bold mb-3 text-gray-900">
                {hasActiveFilters ? "Không tìm thấy kết quả" : "Chưa có phòng nào"}
              </h3>
              <p className="text-base text-gray-500 mb-6 max-w-md leading-relaxed">
                {hasActiveFilters
                  ? "Thử thay đổi bộ lọc hoặc xóa bộ lọc để xem tất cả phòng"
                  : "Bắt đầu bằng cách thêm phòng đầu tiên cho khách sạn của bạn"}
              </p>
              {hasActiveFilters ? (
                <Button
                  onClick={handleClearAllFilters}
                  variant="outline"
                  size="lg"
                  className="gap-2"
                >
                  <X className="h-5 w-5" />
                  Xóa bộ lọc
                </Button>
              ) : (
                <Button
                  onClick={handleAddNew}
                  size="lg"
                  className="bg-linear-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 shadow-lg hover:shadow-xl transition-all"
                >
                  <Plus className="mr-2 h-5 w-5" />
                  Thêm phòng đầu tiên
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      ) : viewMode === "grid" ? (
        /* Grid View - Grouped by Floor */
        <div className="space-y-8">
          {roomsByFloor.map(({ floor, rooms: floorRooms }) => (
            <div key={floor} className="space-y-4">
              {/* Floor Header */}
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-3 px-5 py-3 rounded-xl bg-linear-to-r from-blue-600 to-cyan-600 shadow-lg">
                  <Layers className="h-5 w-5 text-white" />
                  <span className="text-lg font-bold text-white">Tầng {floor}</span>
                  <span className="px-2 py-0.5 bg-white/20 rounded-full text-sm font-semibold text-white">
                    {floorRooms.length} phòng
                  </span>
                </div>
                <div className="flex-1 h-px bg-linear-to-r from-blue-200 to-transparent" />
              </div>

              {/* Floor Rooms Grid */}
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {floorRooms.map((room) => (
                  <RoomCard
                    key={room.id}
                    room={room}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                    isDeleting={isDeleting === room.id}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* Table View */
        <RoomTable
          rooms={rooms}
          onEdit={handleEdit}
          onDelete={handleDelete}
          isDeleting={isDeleting}
        />
      )}

      {/* Form Modal */}
      <RoomFormModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={handleSave}
        editingRoom={editingRoom}
      />
    </div>
  );
}
