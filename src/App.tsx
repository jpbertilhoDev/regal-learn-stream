import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { lazy, Suspense } from "react";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { AdminRoute } from "./components/AdminRoute";
import Landing from "./pages/Landing";
import Auth from "./pages/Auth";
import AppHome from "./pages/App";
import Trail from "./pages/Trail";
import Lesson from "./pages/Lesson";
import NotFound from "./pages/NotFound";

const AdminDashboard = lazy(() => import("./pages/admin/Dashboard"));
const TrailsList = lazy(() => import("./pages/admin/trails/TrailsList"));
const TrailForm = lazy(() => import("./pages/admin/trails/TrailForm"));
const ModulesList = lazy(() => import("./pages/admin/modules/ModulesList"));
const ModuleForm = lazy(() => import("./pages/admin/modules/ModuleForm"));
const LessonsList = lazy(() => import("./pages/admin/lessons/LessonsList"));
const LessonForm = lazy(() => import("./pages/admin/lessons/LessonForm"));
const UsersList = lazy(() => import("./pages/admin/users/UsersList"));
const UserDetails = lazy(() => import("./pages/admin/users/UserDetails"));

const queryClient = new QueryClient();

const LoadingFallback = () => (
  <div className="min-h-screen flex items-center justify-center bg-background">
    <div className="text-center">
      <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
      <p className="text-muted-foreground">Carregando...</p>
    </div>
  </div>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/app" element={<ProtectedRoute><AppHome /></ProtectedRoute>} />
          <Route path="/app/trail/:slug" element={<ProtectedRoute><Trail /></ProtectedRoute>} />
          <Route path="/app/lesson/:slug/:lessonId" element={<ProtectedRoute><Lesson /></ProtectedRoute>} />
          
          {/* Admin Routes */}
          <Route 
            path="/admin" 
            element={
              <AdminRoute>
                <Suspense fallback={<LoadingFallback />}>
                  <AdminDashboard />
                </Suspense>
              </AdminRoute>
            } 
          />
          
          {/* Trails */}
          <Route 
            path="/admin/trails" 
            element={
              <AdminRoute>
                <Suspense fallback={<LoadingFallback />}>
                  <TrailsList />
                </Suspense>
              </AdminRoute>
            } 
          />
          <Route 
            path="/admin/trails/new" 
            element={
              <AdminRoute>
                <Suspense fallback={<LoadingFallback />}>
                  <TrailForm />
                </Suspense>
              </AdminRoute>
            } 
          />
          <Route 
            path="/admin/trails/:id/edit" 
            element={
              <AdminRoute>
                <Suspense fallback={<LoadingFallback />}>
                  <TrailForm />
                </Suspense>
              </AdminRoute>
            } 
          />
          
          {/* Modules */}
          <Route 
            path="/admin/modules" 
            element={
              <AdminRoute>
                <Suspense fallback={<LoadingFallback />}>
                  <ModulesList />
                </Suspense>
              </AdminRoute>
            } 
          />
          <Route 
            path="/admin/modules/new" 
            element={
              <AdminRoute>
                <Suspense fallback={<LoadingFallback />}>
                  <ModuleForm />
                </Suspense>
              </AdminRoute>
            } 
          />
          <Route 
            path="/admin/modules/:id/edit" 
            element={
              <AdminRoute>
                <Suspense fallback={<LoadingFallback />}>
                  <ModuleForm />
                </Suspense>
              </AdminRoute>
            } 
          />

          {/* Lessons */}
          <Route 
            path="/admin/lessons" 
            element={
              <AdminRoute>
                <Suspense fallback={<LoadingFallback />}>
                  <LessonsList />
                </Suspense>
              </AdminRoute>
            } 
          />
          <Route 
            path="/admin/lessons/new" 
            element={
              <AdminRoute>
                <Suspense fallback={<LoadingFallback />}>
                  <LessonForm />
                </Suspense>
              </AdminRoute>
            } 
          />
          <Route 
            path="/admin/lessons/:id/edit" 
            element={
              <AdminRoute>
                <Suspense fallback={<LoadingFallback />}>
                  <LessonForm />
                </Suspense>
              </AdminRoute>
            } 
          />

          {/* Users */}
          <Route 
            path="/admin/users" 
            element={
              <AdminRoute>
                <Suspense fallback={<LoadingFallback />}>
                  <UsersList />
                </Suspense>
              </AdminRoute>
            } 
          />
          <Route 
            path="/admin/users/:id" 
            element={
              <AdminRoute>
                <Suspense fallback={<LoadingFallback />}>
                  <UserDetails />
                </Suspense>
              </AdminRoute>
            } 
          />
          
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
