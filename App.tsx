import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { LanguageProvider } from './context/LanguageContext';
import { ThemeProvider } from './context/ThemeContext';
import { ContentProvider, useContent } from './context/ContentContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { LiveEditProvider, useLiveEdit } from './context/LiveEditContext';

// Visual Editor
import LiveEditToolbar from './components/admin/visual-editor/LiveEditToolbar';
import QuickEditDrawer from './components/admin/visual-editor/QuickEditDrawer';

// Public Components & Pages
import Header from './components/Header';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
import CommunityPage from './pages/CommunityPage';
import EventsPage from './pages/EventsPage';
import GalleryPage from './pages/GalleryPage';
import BusinessesPage from './pages/BusinessesPage';
import ContactPage from './pages/ContactPage';

// Admin Components & Pages
import AdminLayout from './components/admin/AdminLayout';
import AdminLoginPage from './pages/admin/AdminLoginPage';
import AdminDashboard from './pages/admin/AdminDashboard';
import ManageCommunityNotices from './pages/admin/ManageCommunityNotices';
import ManageEmergency from './pages/admin/ManageEmergency';
import ManageProjects from './pages/admin/ManageProjects';
import ManageNews from './pages/admin/ManageNews';
import ManageEvents from './pages/admin/ManageEvents';
import ManageLiveEvent from './pages/admin/ManageLiveEvent';
import ManageGallery from './pages/admin/ManageGallery';
import ManageBusinesses from './pages/admin/ManageBusinesses';
import ManageFestivals from './pages/admin/ManageFestivals';
import ManageNavigation from './pages/admin/ManageNavigation';
import ManageLabels from './pages/admin/ManageLabels';
import ManageMessages from './pages/admin/ManageMessages';
import ManagePageBuilder from './pages/admin/ManagePageBuilder';
import SiteSettings from './pages/admin/SiteSettings';

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-orange-500 animate-spin text-2xl">⟳</div>
      </div>
    );
  }
  if (!isAuthenticated) {
    return <Navigate to="/admin" replace />;
  }
  return <AdminLayout>{children}</AdminLayout>;
};

const PublicLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { themeTriplets } = useContent();
  const { viewport } = useLiveEdit();

  const viewportClass =
    viewport === 'mobile'
      ? 'max-w-[390px] mx-auto border-x border-slate-300 dark:border-slate-800 shadow-2xl min-h-screen'
      : viewport === 'tablet'
      ? 'max-w-[768px] mx-auto border-x border-slate-300 dark:border-slate-800 shadow-2xl min-h-screen'
      : 'w-full';

  return (
    <div
      className="flex flex-col min-h-screen bg-gray-50 text-gray-800 dark:bg-black dark:text-gray-200 transition-colors duration-300"
      style={{
        ['--brand-orange' as string]: themeTriplets.primary,
        ['--brand-blue' as string]: themeTriplets.secondary,
      }}
    >
      <LiveEditToolbar />
      <div className={`flex flex-col flex-grow ${viewportClass}`}>
        <Header />
        <main className="flex-grow">{children}</main>
        <Footer />
      </div>
      <QuickEditDrawer />
    </div>
  );
};

const App: React.FC = () => {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <ContentProvider>
          <AuthProvider>
            <LiveEditProvider>
              <HashRouter>
                <Routes>
                  {/* Public Routes */}
                  <Route path="/" element={<PublicLayout><HomePage /></PublicLayout>} />
                  <Route path="/about" element={<PublicLayout><AboutPage /></PublicLayout>} />
                  <Route path="/community" element={<PublicLayout><CommunityPage /></PublicLayout>} />
                  <Route path="/events" element={<PublicLayout><EventsPage /></PublicLayout>} />
                  <Route path="/gallery" element={<PublicLayout><GalleryPage /></PublicLayout>} />
                  <Route path="/businesses" element={<PublicLayout><BusinessesPage /></PublicLayout>} />
                  <Route path="/contact" element={<PublicLayout><ContactPage /></PublicLayout>} />

                  {/* Admin Auth Route */}
                  <Route path="/admin" element={<AdminLoginPage />} />

                  {/* Protected Admin Dashboard Routes */}
                  <Route path="/admin/dashboard" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
                  <Route path="/admin/builder" element={<ProtectedRoute><ManagePageBuilder /></ProtectedRoute>} />
                  <Route path="/admin/notices" element={<ProtectedRoute><ManageCommunityNotices /></ProtectedRoute>} />

                  <Route path="/admin/emergency" element={<ProtectedRoute><ManageEmergency /></ProtectedRoute>} />
                  <Route path="/admin/projects" element={<ProtectedRoute><ManageProjects /></ProtectedRoute>} />
                  <Route path="/admin/news" element={<ProtectedRoute><ManageNews /></ProtectedRoute>} />
                  <Route path="/admin/events" element={<ProtectedRoute><ManageEvents /></ProtectedRoute>} />
                  <Route path="/admin/live" element={<ProtectedRoute><ManageLiveEvent /></ProtectedRoute>} />
                  <Route path="/admin/gallery" element={<ProtectedRoute><ManageGallery /></ProtectedRoute>} />
                  <Route path="/admin/businesses" element={<ProtectedRoute><ManageBusinesses /></ProtectedRoute>} />
                  <Route path="/admin/festivals" element={<ProtectedRoute><ManageFestivals /></ProtectedRoute>} />
                  <Route path="/admin/navigation" element={<ProtectedRoute><ManageNavigation /></ProtectedRoute>} />
                  <Route path="/admin/copy" element={<ProtectedRoute><ManageLabels /></ProtectedRoute>} />
                  <Route path="/admin/messages" element={<ProtectedRoute><ManageMessages /></ProtectedRoute>} />
                  <Route path="/admin/settings" element={<ProtectedRoute><SiteSettings /></ProtectedRoute>} />

                  {/* Catch-all fallback */}
                  <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
              </HashRouter>
            </LiveEditProvider>
          </AuthProvider>
        </ContentProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
};

export default App;