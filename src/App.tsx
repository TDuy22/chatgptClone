import { Flex } from '@chakra-ui/react';
import { AppProvider, useAppContext } from './app-context';
import { ChatView } from './chat-view';
import { DataManagement } from './data-management';
import { Sidebar } from './sidebar';
import { SidebarProvider } from './sidebar-context';

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
