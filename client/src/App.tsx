import React, { useState, useEffect, useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { Home } from './pages/Home';
import { TODO } from './pages/Todo';
import { TodoProvider } from './context/TodoContext';
import { Tabs, Tab, Box, LinearProgress } from '@mui/material';
import { LoadingContext, LoadingProvider } from './context/Loading';
import { CmnLoadingBar } from './components/CmnLoadingBar';


function App() {
  return (
    <TodoProvider>
      <Router
        future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <AppContent />
      </Router>
    </TodoProvider>
  );
}

function AppContent() {
  const location = useLocation(); // 現在のURLを取得
  const [value, setValue] = useState(location.pathname); // 現在のタブを管理

  useEffect(() => {
    setValue(location.pathname); // URLが変更されたときにタブを更新
  }, [location]);

  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue);
  };
  return (
    <LoadingProvider>
      <Box sx={{ padding: '20px', margin: '10px' }}>
        {/* タイトル */}
        {/* Tabs コンポーネント */}
        <Tabs
          value={value}
          onChange={handleChange}
          indicatorColor="primary"
          textColor="primary"
        >
          <Tab label="Home" value="/" component={Link} to="/" />
          <Tab label="Todo" value="/todo" component={Link} to="/todo" />
        </Tabs>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/todo" element={<TODO />} />
        </Routes>
      </Box>
      <CmnLoadingBar />
    </LoadingProvider>
  );
}

export default App;
