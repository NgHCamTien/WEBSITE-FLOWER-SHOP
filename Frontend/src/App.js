import MainLayout from './layouts/MainLayout';
import HomePage from './pages/HomePage';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <MainLayout>
          <HomePage />
        </MainLayout>
      </CartProvider>
    </AuthProvider>
  );
}
export default App;