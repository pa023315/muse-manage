import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Skeleton } from "@/components/ui/skeleton";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { HashRouter, Routes, Route, Navigate } from "react-router-dom";
import { Suspense, lazy } from "react";
import AppLayout from "./components/layout/AppLayout";
import AdminLayout from "./components/layout/AdminLayout";

// Lazy load pages for better performance
const LandingPage = lazy(() => import("./pages/LandingPage"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const Inquiries = lazy(() => import("./pages/Inquiries"));
const Quotes = lazy(() => import("./pages/Quotes"));
const Projects = lazy(() => import("./pages/Projects"));
const Invoices = lazy(() => import("./pages/Invoices"));
const Expenses = lazy(() => import("./pages/Expenses"));
const Events = lazy(() => import("./pages/Events"));
const Vendors = lazy(() => import("./pages/Vendors"));
const FavoriteVendors = lazy(() => import("./pages/FavoriteVendors"));
const Customers = lazy(() => import("./pages/Customers"));
const PublicInquiryForm = lazy(() => import("./pages/PublicInquiryForm"));
const NotFound = lazy(() => import("./pages/NotFound"));
const AdminDashboard = lazy(() => import("./pages/admin/AdminDashboard"));
const AdminEvents = lazy(() => import("./pages/admin/AdminEvents"));
const AdminVendors = lazy(() => import("./pages/admin/AdminVendors"));
const Schedule = lazy(() => import("./pages/Schedule"));

// Loading skeleton component
const PageLoadingSkeleton = () => (
  <div className="p-6 space-y-6">
    <div className="space-y-2">
      <Skeleton className="h-8 w-48" />
      <Skeleton className="h-4 w-96" />
    </div>
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <Skeleton key={i} className="h-32" />
      ))}
    </div>
    <div className="grid gap-6 lg:grid-cols-3">
      <Skeleton className="lg:col-span-2 h-80" />
      <Skeleton className="h-80" />
    </div>
  </div>
);

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <HashRouter>
        <Suspense fallback={
          <div className="flex h-screen bg-background">
            <div className="flex h-full w-64 flex-col bg-sidebar" />
            <main className="flex-1 overflow-auto">
              <PageLoadingSkeleton />
            </main>
          </div>
        }>
          <Routes>
            {/* Public routes */}
            <Route path="/landing" element={<LandingPage />} />
            <Route path="/inquiry-form/:formId?" element={<PublicInquiryForm />} />
          
          {/* Main routes */}
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={
            <AppLayout>
              <Dashboard />
            </AppLayout>
          } />
            <Route path="/inquiries" element={
              <AppLayout>
                <Inquiries />
              </AppLayout>
            } />
            <Route path="/quotes" element={
              <AppLayout>
                <Quotes />
              </AppLayout>
            } />
            <Route path="/projects" element={
              <AppLayout>
                <Projects />
              </AppLayout>
            } />
            <Route path="/invoices" element={
              <AppLayout>
                <Invoices />
              </AppLayout>
            } />
            <Route path="/expenses" element={
              <AppLayout>
                <Expenses />
              </AppLayout>
            } />
          {/* 客戶管理 */}
          <Route path="/customers" element={
            <AppLayout>
              <Customers />
            </AppLayout>
          } />
          <Route path="/customers/new" element={
            <AppLayout>
              <div className="p-6">
                <h1 className="text-2xl font-bold">新增客戶</h1>
                <p className="text-muted-foreground">新增客戶功能開發中...</p>
              </div>
            </AppLayout>
          } />
          
          {/* 廠商資源 */}
          <Route path="/vendors" element={
            <AppLayout>
              <Vendors />
            </AppLayout>
          } />
          <Route path="/vendors/favorites" element={
            <AppLayout>
              <FavoriteVendors />
            </AppLayout>
          } />
          
          {/* 庫存管理 */}
          <Route path="/inventory" element={
            <AppLayout>
              <div className="p-6">
                <h1 className="text-2xl font-bold">庫存管理</h1>
                <p className="text-muted-foreground">庫存功能開發中...</p>
              </div>
            </AppLayout>
          } />
          
          {/* 專案管理 - 時程表 */}
          <Route path="/schedule" element={
            <AppLayout>
              <Schedule />
            </AppLayout>
          } />
          
          {/* 活動 */}
          <Route path="/events" element={
            <AppLayout>
              <Events />
            </AppLayout>
          } />
          <Route path="/events/registered" element={
            <AppLayout>
              <div className="p-6">
                <h1 className="text-2xl font-bold">已報名活動</h1>
                <p className="text-muted-foreground">已報名活動功能開發中...</p>
              </div>
            </AppLayout>
          } />
          
          {/* 資料管理 */}
          <Route path="/settings/account" element={
            <AppLayout>
              <div className="p-6">
                <h1 className="text-2xl font-bold">帳號管理</h1>
                <p className="text-muted-foreground">帳號管理功能開發中...</p>
              </div>
            </AppLayout>
          } />
          <Route path="/settings/permissions" element={
            <AppLayout>
              <div className="p-6">
                <h1 className="text-2xl font-bold">權限管理</h1>
                <p className="text-muted-foreground">權限管理功能開發中...</p>
              </div>
            </AppLayout>
          } />
          <Route path="/settings/billing" element={
            <AppLayout>
              <div className="p-6">
                <h1 className="text-2xl font-bold">服務訂閱管理</h1>
                <p className="text-muted-foreground">服務訂閱管理功能開發中...</p>
              </div>
            </AppLayout>
          } />
          <Route path="/settings/*" element={
            <AppLayout>
              <div className="p-6">
                <h1 className="text-2xl font-bold">系統設定</h1>
                <p className="text-muted-foreground">設定功能開發中...</p>
              </div>
            </AppLayout>
          } />
          
          {/* 後台管理 - Separate Admin Interface */}
          <Route path="/admin" element={
            <AdminLayout>
              <AdminDashboard />
            </AdminLayout>
          } />
          <Route path="/admin/events" element={
            <AdminLayout>
              <AdminEvents />
            </AdminLayout>
          } />
          <Route path="/admin/vendors" element={
            <AdminLayout>
              <AdminVendors />
            </AdminLayout>
          } />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
        </Suspense>
      </HashRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
