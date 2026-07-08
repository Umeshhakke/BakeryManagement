import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { LanguageProvider } from './contexts/LanguageContext';
import Layout from './components/Layout';
import './styles/global.css';

// Pages
import Home from './pages/Home';
import Shops from './pages/Shops';
import ShopDetail from './pages/ShopDetail';
import Warehouse from './pages/Warehouse';
import Production from './pages/Production';
import AdminRequests from './pages/AdminRequests';
import Analytics from './pages/Analytics';
import ProductDistribution from './pages/ProductDistribution';
import ManageShops from './pages/ManageShops';
import ProductOverview from './pages/ProductOverview';
import ProductCatalog from './pages/ProductCatalog';

function AppContent() {
  const [role, setRole] = useState(null);

  // If no role, show the selection screen (without sidebar)
  if (!role) {
    return <Home setRole={setRole} />;
  }

  // Once role is selected, wrap everything in the Layout (includes sidebar)
  return (
    <Layout role={role} setRole={setRole}>
      <Routes>
        {role === 'admin' && (
          <>
            <Route path="/" element={<Home setRole={setRole} />} />
            <Route path="/manage-shops" element={<ManageShops />} />
            <Route path="/warehouse" element={<Warehouse />} />
            <Route path="/production" element={<Production />} />
            <Route path="/admin-requests" element={<AdminRequests />} />
            <Route path="/analytics" element={<Analytics />} />
            <Route path="/distribution" element={<ProductDistribution />} />
            <Route path="*" element={<Navigate to="/" />} />
            <Route path="/product-overview" element={<ProductOverview />} />
          </>
        )}

        {role === 'shop' && (
          <>
            <Route path="/" element={<Home setRole={setRole} />} />
            <Route path="/shops" element={<Shops />} />
            <Route path="/shop/:id" element={<ShopDetail />} />
            <Route path="*" element={<Navigate to="/" />} />
            <Route path="/catalog" element={<ProductCatalog />} />
          </>
        )}
      </Routes>
    </Layout>
  );
}

export default function Root() {
  return (
    <Router>
      <LanguageProvider>
        <AppContent />
      </LanguageProvider>
    </Router>
  );
}