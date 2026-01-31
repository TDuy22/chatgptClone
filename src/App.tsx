import { Flex } from '@chakra-ui/react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider, useAppContext } from '@/contexts/AppContext';
import { ChatView } from '@/features/chat';
import { DataManagement } from '@/features/data-management/components/DataManagementPanel';
import { Sidebar, SidebarProvider } from '@/features/sidebar';
import { LandingPage } from '@/pages';

function AppContent() {
  const { currentView } = useAppContext();

  const renderView = () => {
    switch (currentView) {
      case 'data-management':
        return <DataManagement />;
      case 'chat':
      default:
        return <ChatView />;
    }
  };

  return (
    <Flex h='100vh' overflow='hidden'>
      <Sidebar />
      <Flex flex='1' overflow='hidden'>
        {renderView()}
      </Flex>
    </Flex>
  );
}

function MainApp() {
  return (
    <AppProvider>
      <SidebarProvider>
        <AppContent />
      </SidebarProvider>
    </AppProvider>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Landing Page */}
        <Route path='/' element={<LandingPage />} />
        <Route path='/landing' element={<LandingPage />} />
        
        {/* Main App */}
        <Route path='/app' element={<MainApp />} />
        <Route path='/app/*' element={<MainApp />} />
        
        {/* Redirect unknown routes to landing */}
        <Route path='*' element={<Navigate to='/' replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
