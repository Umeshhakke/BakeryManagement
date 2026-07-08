import React, { useState, useEffect } from 'react';
import API from '../services/api';
import { useLanguage } from '../contexts/LanguageContext';
import { RequestIcon } from '../components/Icons';
import '../styles/AdminRequests.css';

export default function AdminRequests() {
  const { t } = useLanguage();
  const [requests, setRequests] = useState([]);
  const [productsMap, setProductsMap] = useState({}); // {id: {name, stock}}
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      API.get('/replenishment-requests/?status=PENDING'),
      API.get('/finished-goods/')
    ]).then(([reqRes, prodRes]) => {
      setRequests(reqRes.data);
      
      // Create a map of product ID -> { name, stock }
      const map = {};
      prodRes.data.forEach(p => {
        map[p.id] = { name: p.product_name, stock: p.current_warehouse_stock };
      });
      setProductsMap(map);
      setLoading(false);
    }).catch(err => {
      console.error(err);
      setLoading(false);
    });
  }, []);

  const handleFulfill = async (id) => {
    const req = requests.find(r => r.id === id);
    if (!req) return;
    
    const productData = productsMap[req.product];
    const currentStock = productData ? productData.stock : 0;

    // 1. Check if stock is 0
    if (currentStock < 1) {
      alert(`🚫 Stock not available for this product. Current warehouse stock: ${currentStock}`);
      return;
    }

    // 2. Calculate max deliverable (cannot exceed requested OR available stock)
    const maxDeliver = Math.min(req.requested_quantity, currentStock);

    // 3. Ask Admin how much to deliver (pre-filled with max possible)
    const deliverQty = window.prompt(
      `📦 Warehouse has ${currentStock} units available.\nRequested: ${req.requested_quantity} units.\nHow many units would you like to deliver? (Max: ${maxDeliver})`, 
      maxDeliver
    );

    // 4. Validate Admin input
    if (!deliverQty || parseInt(deliverQty) < 1) {
      alert("Fulfillment cancelled.");
      return;
    }

    const finalQty = parseInt(deliverQty);
    if (finalQty > currentStock) {
      alert(`❌ Cannot deliver more than available stock (${currentStock})!`);
      return;
    }

    // 5. Execute the delivery and update request
    try {
      await API.post('/deliveries/', {
        shop: req.shop,
        product: req.product,
        quantity: finalQty,
      });
      await API.patch(`/replenishment-requests/${id}/`, { status: 'FULFILLED' });
      
      // Remove from the UI table
      setRequests(requests.filter(r => r.id !== id));
      alert(`✅ Successfully delivered ${finalQty} units!`);
    } catch (err) {
      console.error(err);
      alert('Failed to fulfill request.');
    }
  };

  if (loading) return <div className="text-center p-4">Loading...</div>;

  return (
    <div className="admin-requests-page">
      <h2 className="page-title"><RequestIcon /> {t('shopRequests')}</h2>
      <div className="card">
        <div className="card-header">
          <h4>{t('pendingRequests')}</h4>
          <span className="badge">{requests.length}</span>
        </div>
        {requests.length === 0 ? (
          <p className="text-center">{t('noPending')}</p>
        ) : (
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>{t('shop')}</th>
                  <th>{t('product')}</th>
                  <th>{t('requested')}</th>
                  <th>{t('warehouseStock')}</th>
                  <th>{t('action')}</th>
                </tr>
              </thead>
              <tbody>
                {requests.map((req) => (
                  <tr key={req.id}>
                    <td>{req.shop}</td>
                    {/* Show product name instead of just ID */}
                    <td>{productsMap[req.product]?.name || req.product}</td>
                    <td><strong>{req.requested_quantity}</strong></td>
                    {/* Show current warehouse stock */}
                    <td>
                      {productsMap[req.product]?.stock !== undefined 
                        ? productsMap[req.product].stock 
                        : '...'}
                    </td>
                    <td>
                      <button
                        className="btn btn-primary btn-sm"
                        onClick={() => handleFulfill(req.id)}
                      >
                        {t('fulfill')}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}