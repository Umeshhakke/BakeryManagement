import React, { useState, useEffect } from 'react';
import API from '../services/api';
import { useLanguage } from '../contexts/LanguageContext';
import { DistributeIcon } from '../components/Icons';
import '../styles/ProductCatalog.css';

export default function ProductCatalog() {
  const { t } = useLanguage();
  const [products, setProducts] = useState([]);
  const [shops, setShops] = useState([]);
  const [selectedShopId, setSelectedShopId] = useState('');
  const [loading, setLoading] = useState(true);
  const [requesting, setRequesting] = useState({}); // Track requesting state per product

  useEffect(() => {
    // Fetch all finished goods AND all shops for the dropdown
    Promise.all([
      API.get('/finished-goods/'),
      API.get('/shops/')
    ]).then(([prodRes, shopRes]) => {
      setProducts(prodRes.data);
      setShops(shopRes.data);
      // Auto-select the first shop if available
      if (shopRes.data.length > 0) {
        setSelectedShopId(shopRes.data[0].id);
      }
      setLoading(false);
    }).catch(err => {
      console.error(err);
      setLoading(false);
    });
  }, []);

  const handleRequest = async (productId) => {
    if (!selectedShopId) {
      alert('Please select a shop first.');
      return;
    }

    // Ask for quantity
    const qty = window.prompt('How many units would you like to request?', '10');
    if (!qty || parseInt(qty) < 1) return;

    setRequesting({ ...requesting, [productId]: true });
    try {
      await API.post('/replenishment-requests/', {
        shop: parseInt(selectedShopId),
        product: productId,
        requested_quantity: parseInt(qty)
      });
      alert(`Request for ${qty} units sent to Admin!`);
    } catch (err) {
      // Catch the 400 validation error from the Django backend
      if (err.response && err.response.data && err.response.data.detail) {
        alert("❌ " + err.response.data.detail);
      } else {
        alert('Failed to send request.');
      }
    }
    setRequesting({ ...requesting, [productId]: false });
  };

  if (loading) return <div className="text-center p-4">Loading...</div>;

  return (
    <div className="product-catalog-page">
      <h2 className="page-title"><DistributeIcon /> {t('productCatalog')}</h2>
      
      <div className="card">
        <div className="catalog-controls">
          <div className="form-group" style={{ maxWidth: '300px' }}>
            <label>{t('requestingForShop')}</label>
            <select 
              className="form-control" 
              value={selectedShopId} 
              onChange={(e) => setSelectedShopId(e.target.value)}
            >
              {shops.map(shop => (
                <option key={shop.id} value={shop.id}>{shop.name}</option>
              ))}
            </select>
          </div>
          <p className="catalog-hint">{t('catalogHint')}</p>
        </div>
      </div>

      <div className="grid-3">
        {products.length === 0 ? (
          <div className="card full-width text-center">
            <p>No products have been created yet.</p>
          </div>
        ) : (
          products.map(product => (
            <div className="card product-card" key={product.id}>
              <div className="product-header">
                <h4>{product.product_name}</h4>
                <span className="badge">{t('available')}</span>
              </div>
              <div className="product-details">
                <p><strong>{t('warehouseStock')}:</strong> {product.current_warehouse_stock}</p>
              </div>
              <button 
                className="btn btn-primary" 
                onClick={() => handleRequest(product.id)}
                disabled={requesting[product.id]}
              >
                {requesting[product.id] ? t('sending') : t('requestStock')}
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}