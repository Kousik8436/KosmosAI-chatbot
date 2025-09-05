import React, { useContext, useEffect } from 'react';
import Sidebar from './components/Sidebar/Sidebar';
import Main from './components/Main/Main';
import ContextProvider, { Context } from './context/Context';

const AppContent = () => {
  const { darkMode } = useContext(Context);
  
  useEffect(() => {
    document.body.className = darkMode ? 'dark' : '';
  }, [darkMode]);
  
  return (
    <>
      <Sidebar />
      <Main />
    </>
  )
}

const App = () => {
  return (
    <ContextProvider>
      <AppContent />
    </ContextProvider>
  );
}
export default App;