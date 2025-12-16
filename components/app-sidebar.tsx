"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ICONS } from "@/src/constants/icons.enum";
import { cn } from "@/lib/utils";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  useSidebar,
} from "@/components/ui/sidebar";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

// Navigation items based on page-description.md
const navItems = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: ICONS.DASHBOARD,
  },
];

const roomManagement = [
  {
    title: "Quản lý Phòng",
    url: "/rooms",
    icon: ICONS.BED_DOUBLE,
  },
  {
    title: "Loại Phòng",
    url: "/room-types",
    icon: ICONS.DOOR_OPEN,
  },
];

const bookingManagement = [
  {
    title: "Đặt Phòng",
    url: "/reservations",
    icon: ICONS.CALENDAR,
  },
  {
    title: "Check-in / Check-out",
    url: "/checkin-checkout",
    icon: ICONS.CLIPBOARD_LIST,
  },
];

const serviceManagement = [
  {
    title: "Dịch Vụ",
    url: "/services",
    icon: ICONS.UTENSILS,
  },
  {
    title: "Phụ Thu",
    url: "/surcharges",
    icon: ICONS.SURCHARGE,
  },
  {
    title: "Phí Phạt",
    url: "/penalties",
    icon: ICONS.PENALTY,
  },
  {
    title: "Thanh Toán",
    url: "/payments",
    icon: ICONS.RECEIPT,
  },
];

const adminManagement = [
  {
    title: "Khách hàng",
    url: "/customers",
    icon: ICONS.USER,
  },
  {
    title: "Nhân Viên",
    url: "/staff",
    icon: ICONS.USER_COG,
  },
  {
    title: "Báo Cáo",
    url: "/reports",
    icon: ICONS.BAR_CHART,
  },
];

const operationalManagement = [
  {
    title: "Housekeeping",
    url: "/housekeeping",
    icon: ICONS.CLIPBOARD_LIST,
  },
  {
    title: "Quản lý Ca",
    url: "/shift-management",
    icon: ICONS.CLOCK,
  },
];

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname();
  const { state } = useSidebar();

  return (
    <TooltipProvider delayDuration={0}>
      <Sidebar
        collapsible="icon"
        variant="sidebar"
        data-sidebar-state={state}
        {...props}
      >
        <SidebarHeader className="border-b border-primary-100 bg-gradient-to-br from-primary-50 via-white to-primary-50/30">
          <div className="flex items-center gap-3 px-4 py-4 group-data-[collapsible=icon]:px-2 group-data-[collapsible=icon]:justify-center">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-primary-600 to-primary-500 text-white shadow-lg shadow-primary-600/20">
              <span className="text-lg">{ICONS.HOTEL}</span>
            </div>
            <div className="flex flex-col overflow-hidden group-data-[collapsible=icon]:hidden">
              <span className="text-base font-bold text-gray-900 truncate">
                UIT Hotel System
              </span>
              <span className="text-xs text-gray-600 truncate font-medium">
                Quản lý khách sạn
              </span>
            </div>
          </div>
        </SidebarHeader>

        <SidebarContent className="bg-gradient-to-b from-gray-50 to-white scrollbar-hide">
          {/* Dashboard */}
          <SidebarGroup>
            <SidebarGroupContent>
              <SidebarMenu>
                {navItems.map((item) => {
                  const isActive = pathname === item.url;
                  return (
                    <SidebarMenuItem key={item.title}>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <SidebarMenuButton
                            asChild
                            className={cn(
                              "transition-all duration-200 h-11 text-sm font-medium",
                              isActive
                                ? "bg-gradient-to-r from-primary-600 to-primary-500 text-white border-l-4 border-primary-700 hover:from-primary-700 hover:to-primary-600 shadow-md"
                                : "hover:bg-primary-50 hover:text-primary-700 text-gray-700 hover:border-l-4 hover:border-primary-300"
                            )}
                          >
                            <Link href={item.url} className="flex items-center gap-3">
                              <span className={cn("w-5 h-5", isActive && "drop-shadow-sm")}>{item.icon}</span>
                              <span>{item.title}</span>
                            </Link>
                          </SidebarMenuButton>
                        </TooltipTrigger>
                        <TooltipContent side="right" className="bg-gray-900 text-white border-gray-700">
                          {item.title}
                        </TooltipContent>
                      </Tooltip>
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>

          {/* Room Management */}
          <SidebarGroup>
            <SidebarGroupLabel className="text-[11px] font-bold text-gray-500 uppercase tracking-widest px-4 py-2">
              Quản lý Phòng
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {roomManagement.map((item) => {
                  const isActive = pathname === item.url;
                  return (
                    <SidebarMenuItem key={item.title}>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <SidebarMenuButton
                            asChild
                            className={cn(
                              "transition-all duration-200 h-11 text-sm font-medium",
                              isActive
                                ? "bg-gradient-to-r from-primary-600 to-primary-500 text-white border-l-4 border-primary-700 hover:from-primary-700 hover:to-primary-600 shadow-md"
                                : "hover:bg-primary-50 hover:text-primary-700 text-gray-700 hover:border-l-4 hover:border-primary-300"
                            )}
                          >
                            <Link href={item.url} className="flex items-center gap-3">
                              <span className={cn("w-5 h-5", isActive && "drop-shadow-sm")}>{item.icon}</span>
                              <span>{item.title}</span>
                            </Link>
                          </SidebarMenuButton>
                        </TooltipTrigger>
                        <TooltipContent side="right" className="bg-gray-900 text-white border-gray-700">
                          {item.title}
                        </TooltipContent>
                      </Tooltip>
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>

          {/* Booking Management */}
          <SidebarGroup>
            <SidebarGroupLabel className="text-[11px] font-bold text-gray-500 uppercase tracking-widest px-4 py-2">
              Đặt Phòng & Check-in/out
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {bookingManagement.map((item) => {
                  const isActive = pathname === item.url;
                  return (
                    <SidebarMenuItem key={item.title}>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <SidebarMenuButton
                            asChild
                            className={cn(
                              "transition-all duration-200 h-11 text-sm font-medium",
                              isActive
                                ? "bg-gradient-to-r from-primary-600 to-primary-500 text-white border-l-4 border-primary-700 hover:from-primary-700 hover:to-primary-600 shadow-md"
                                : "hover:bg-primary-50 hover:text-primary-700 text-gray-700 hover:border-l-4 hover:border-primary-300"
                            )}
                          >
                            <Link href={item.url} className="flex items-center gap-3">
                              <span className={cn("w-5 h-5", isActive && "drop-shadow-sm")}>{item.icon}</span>
                              <span>{item.title}</span>
                            </Link>
                          </SidebarMenuButton>
                        </TooltipTrigger>
                        <TooltipContent side="right" className="bg-gray-900 text-white border-gray-700">
                          {item.title}
                        </TooltipContent>
                      </Tooltip>
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>

          {/* Service & Payment */}
          <SidebarGroup>
            <SidebarGroupLabel className="text-[11px] font-bold text-gray-500 uppercase tracking-widest px-4 py-2">
              Dịch Vụ & Thanh Toán
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {serviceManagement.map((item) => {
                  const isActive = pathname === item.url;
                  return (
                    <SidebarMenuItem key={item.title}>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <SidebarMenuButton
                            asChild
                            className={cn(
                              "transition-all duration-200 h-11 text-sm font-medium",
                              isActive
                                ? "bg-gradient-to-r from-primary-600 to-primary-500 text-white border-l-4 border-primary-700 hover:from-primary-700 hover:to-primary-600 shadow-md"
                                : "hover:bg-primary-50 hover:text-primary-700 text-gray-700 hover:border-l-4 hover:border-primary-300"
                            )}
                          >
                            <Link href={item.url} className="flex items-center gap-3">
                              <span className={cn("w-5 h-5", isActive && "drop-shadow-sm")}>{item.icon}</span>
                              <span>{item.title}</span>
                            </Link>
                          </SidebarMenuButton>
                        </TooltipTrigger>
                        <TooltipContent side="right" className="bg-gray-900 text-white border-gray-700">
                          {item.title}
                        </TooltipContent>
                      </Tooltip>
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>

          {/* Admin */}
          <SidebarGroup>
            <SidebarGroupLabel className="text-[11px] font-bold text-gray-500 uppercase tracking-widest px-4 py-2">
              Quản Trị
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {adminManagement.map((item) => {
                  const isActive = pathname === item.url;
                  return (
                    <SidebarMenuItem key={item.title}>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <SidebarMenuButton
                            asChild
                            className={cn(
                              "transition-all duration-200 h-11 text-sm font-medium",
                              isActive
                                ? "bg-gradient-to-r from-primary-600 to-primary-500 text-white border-l-4 border-primary-700 hover:from-primary-700 hover:to-primary-600 shadow-md"
                                : "hover:bg-primary-50 hover:text-primary-700 text-gray-700 hover:border-l-4 hover:border-primary-300"
                            )}
                          >
                            <Link href={item.url} className="flex items-center gap-3">
                              <span className={cn("w-5 h-5", isActive && "drop-shadow-sm")}>{item.icon}</span>
                              <span>{item.title}</span>
                            </Link>
                          </SidebarMenuButton>
                        </TooltipTrigger>
                        <TooltipContent side="right" className="bg-gray-900 text-white border-gray-700">
                          {item.title}
                        </TooltipContent>
                      </Tooltip>
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>

          {/* Operational Management */}
          <SidebarGroup>
            <SidebarGroupLabel className="text-[11px] font-bold text-gray-500 uppercase tracking-widest px-4 py-2">
              Vận hành
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {operationalManagement.map((item) => {
                  const isActive = pathname === item.url;
                  return (
                    <SidebarMenuItem key={item.title}>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <SidebarMenuButton
                            asChild
                            className={cn(
                              "transition-all duration-200 h-11 text-sm font-medium",
                              isActive
                                ? "bg-gradient-to-r from-primary-600 to-primary-500 text-white border-l-4 border-primary-700 hover:from-primary-700 hover:to-primary-600 shadow-md"
                                : "hover:bg-primary-50 hover:text-primary-700 text-gray-700 hover:border-l-4 hover:border-primary-300"
                            )}
                          >
                            <Link href={item.url} className="flex items-center gap-3">
                              <span className={cn("w-5 h-5", isActive && "drop-shadow-sm")}>{item.icon}</span>
                              <span>{item.title}</span>
                            </Link>
                          </SidebarMenuButton>
                        </TooltipTrigger>
                        <TooltipContent side="right" className="bg-gray-900 text-white border-gray-700">
                          {item.title}
                        </TooltipContent>
                      </Tooltip>
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>

        <SidebarFooter className="border-t border-primary-100 bg-gradient-to-br from-error-50/50 via-white to-white">
          <SidebarMenu>
            <SidebarMenuItem>
              <Tooltip>
                <TooltipTrigger asChild>
                  <SidebarMenuButton
                    asChild
                    className="h-11 hover:bg-error-50 hover:text-error-600 transition-all duration-200 text-gray-700 font-medium hover:border-l-4 hover:border-error-400"
                  >
                    <Link href="/logout" className="flex items-center gap-3">
                      <span className="w-5 h-5">{ICONS.LOGOUT}</span>
                      <span>Đăng Xuất</span>
                    </Link>
                  </SidebarMenuButton>
                </TooltipTrigger>
                <TooltipContent side="right" className="bg-gray-900 text-white border-gray-700">
                  Đăng Xuất
                </TooltipContent>
              </Tooltip>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
        <SidebarRail />
      </Sidebar>
    </TooltipProvider>
  );
}
