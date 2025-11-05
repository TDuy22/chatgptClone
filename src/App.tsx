import { Flex } from '@chakra-ui/react';
import { AppProvider, useAppContext } from '@/contexts/AppContext';
import { ChatView } from '@/features/chat';
import { DataManagement } from '@/features/data-management';
import { Sidebar, SidebarProvider } from '@/features/sidebar';

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
    <Flex minH='100dvh'>
      <Sidebar />
      {renderView()}
    </Flex>
  );
}

function App() {
  return (
    <AppProvider>
      <SidebarProvider>
        <AppContent />
      </SidebarProvider>
    </AppProvider>
  );
}

export default App;
