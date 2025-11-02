import { Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Container, Box } from '@mui/material';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import CollectionList from './pages/CollectionList';
import AddComic from './pages/AddComic';
import ComicDetail from './pages/ComicDetail';

function App() {
  const { user } = useSelector((state) => state.auth);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Navbar />
      <Container maxWidth="xl" sx={{ mt: 4, mb: 4, flexGrow: 1 }}>
        <Routes>
          <Route
            path="/login"
            element={!user ? <Login /> : <Navigate to="/dashboard" />}
          />
          <Route
            path="/register"
            element={!user ? <Register /> : <Navigate to="/dashboard" />}
          />
          <Route
            path="/dashboard"
            element={user ? <Dashboard /> : <Navigate to="/login" />}
          />
          <Route
            path="/collection"
            element={user ? <CollectionList /> : <Navigate to="/login" />}
          />
          <Route
            path="/add"
            element={user ? <AddComic /> : <Navigate to="/login" />}
          />
          <Route
            path="/comic/:id"
            element={user ? <ComicDetail /> : <Navigate to="/login" />}
          />
          <Route path="/" element={<Navigate to="/dashboard" />} />
        </Routes>
      </Container>
    </Box>
  );
}

export default App;
