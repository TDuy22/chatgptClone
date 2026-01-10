import { Flex } from '@chakra-ui/react';
import { AppProvider, useAppContext } from '@/contexts/AppContext';
import { ChatView } from '@/features/chat';
import { DataManagement } from '@/features/data-management/components/DataManagementPanel';
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
    <Flex h='100vh' overflow='hidden'>
      <Sidebar />
      <Flex flex='1' overflow='hidden'>
        {renderView()}
      </Flex>
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
