import { createContext, useContext, useState } from 'react';

export type AppView = 'chat' | 'data-management';

interface AppContextType {
  currentView: AppView;
  setCurrentView: (view: AppView) => void;
}

const AppContext = createContext({} as AppContextType);

export const AppProvider = (props: { children: React.ReactNode }) => {
  const [currentView, setCurrentView] = useState<AppView>('chat');

  return (
    <AppContext.Provider value={{ currentView, setCurrentView }}>
      {props.children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  return useContext(AppContext);
};
