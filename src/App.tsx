import { useState, useEffect } from 'react';
import { Flex } from '@chakra-ui/react';
import { AppProvider, useAppContext } from '@/contexts/AppContext';
import { ChatView } from '@/features/chat';
import { DataManagement } from '@/features/data-management/components/DataManagementPanel';
import { Sidebar, SidebarProvider } from '@/features/sidebar';
import { LandingPage } from '@/pages';

// Key to store landing page state in localStorage
const LANDING_VIEWED_KEY = 'askify_landing_viewed';

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
  const [showLanding, setShowLanding] = useState<boolean | null>(null);

  useEffect(() => {
    // Check if user has already viewed landing page
    const hasViewedLanding = localStorage.getItem(LANDING_VIEWED_KEY);
    setShowLanding(!hasViewedLanding);
  }, []);

  const handleEnterApp = () => {
    // Mark landing as viewed and show main app
    localStorage.setItem(LANDING_VIEWED_KEY, 'true');
    setShowLanding(false);
  };

  // Show nothing while checking localStorage (prevents flash)
  if (showLanding === null) {
    return null;
  }

  // Show landing page for new users
  if (showLanding) {
    return <LandingPage onEnterApp={handleEnterApp} />;
  }

  // Show main app
  return <MainApp />;
}

export default App;
