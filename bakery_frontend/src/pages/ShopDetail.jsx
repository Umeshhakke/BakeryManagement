import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import API from '../services/api';
import { useLanguage } from '../contexts/LanguageContext';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { ShopIcon } from '../components/Icons';
import '../styles/ShopDetail.css';

ChartJS.register(ArcElement, Tooltip, Legend);

export default function ShopDetail() {
  const { id } = useParams();
  const { t } = useLanguage();
  const [shop, setShop] = useState(null);
  const [inventory, setInventory] = useState([]);
  const [sales, setSales] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sellProductId, setSellProductId] = useState('');
  const [sellQty, setSellQty] = useState(1);
  const [requestProductId, setRequestProductId] = useState('');
  const [requestQty, setRequestQty] = useState(1);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const shopRes = await API.get(`/shops/${id}/`);
        const invRes = await API.get(`/shop-inventory/?shop=${id}`);
        const salesRes = await API.get(`/sales/?shop=${id}`);
        setShop(shopRes.data);
        setInventory(invRes.data);
        setSales(salesRes.data);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  const handleSell = async (e) => {
    e.preventDefault();
    if (!sellProductId || sellQty < 1) return alert('Invalid input');
    try {
      await API.post('/sales/', {
        shop: parseInt(id),
        product: parseInt(sellProductId),
        quantity_sold: parseInt(sellQty),
      });
      alert('Sale logged!');
      window.location.reload();
    } catch (err) {
      alert('Sale failed. Check stock.');
    }
  };

  const handleRequest = async (e) => {
    e.preventDefault();
    if (!requestProductId || requestQty < 1) return alert('Invalid input');
    try {
      await API.post('/replenishment-requests/', {
        shop: parseInt(id),
        product: parseInt(requestProductId),
        requested_quantity: parseInt(requestQty),
      });
      alert('Request sent!');
    } catch (err) {
      alert('Request failed.');
    }
  };

  const chartData = () => {
    const productSales = {};
    sales.forEach(s => {
      const name = s.product_name || `Product ${s.product}`;
      productSales[name] = (productSales[name] || 0) + s.quantity_sold;
    });
    return {
      labels: Object.keys(productSales),
      datasets: [{ data: Object.values(productSales), backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56'] }],
    };
  };

  if (loading) return <div className="text-center p-4">Loading...</div>;
  if (!shop) return <div>Shop not found.</div>;

  return (
    <div className="shop-detail-page">
      <h2 className="page-title"><ShopIcon /> {shop.name}</h2>
      <div className="grid-2">
        <div className="card">
          <div className="card-header">
            <h4>{t('inventory')}</h4>
            <span className="badge">{inventory.length} {t('items')}</span>
          </div>
          <div className="table-wrapper">
            <table>
              <thead>
                <tr><th>{t('product')}</th><th>{t('stock')}</th></tr>
              </thead>
              <tbody>
                {inventory.length === 0 ? (
                  <tr><td colSpan="2">{t('noStock')}</td></tr>
                ) : (
                  inventory.map(item => (
                    <tr key={item.id}>
                      <td>{item.product_name}</td>
                      <td>{item.current_stock}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
        <div className="card">
          <div className="card-header">
            <h4>{t('salesChart')}</h4>
          </div>
          <div className="chart-container">
            {sales.length === 0 ? <p>{t('noSales')}</p> : <Pie data={chartData()} />}
          </div>
        </div>
      </div>
      <div className="grid-2">
        <div className="card">
          <h4>{t('sell')}</h4>
          <form onSubmit={handleSell}>
            <div className="form-group">
              <label>{t('selectProduct')}</label>
              <select className="form-control" value={sellProductId} onChange={e => setSellProductId(e.target.value)} required>
                <option value="">{t('selectProduct')}</option>
                {inventory.map(item => (
                  <option key={item.id} value={item.product}>{item.product_name}</option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label>{t('quantity')}</label>
              <input type="number" className="form-control" min="1" value={sellQty} onChange={e => setSellQty(e.target.value)} required />
            </div>
            <button type="submit" className="btn btn-primary">{t('sell')}</button>
          </form>
        </div>
        <div className="card">
          <h4>{t('requestStock')}</h4>
          <form onSubmit={handleRequest}>
            <div className="form-group">
              <label>{t('selectProduct')}</label>
              <select className="form-control" value={requestProductId} onChange={e => setRequestProductId(e.target.value)} required>
                <option value="">{t('selectProduct')}</option>
                {inventory.map(item => (
                  <option key={item.id} value={item.product}>{item.product_name}</option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label>{t('quantity')}</label>
              <input type="number" className="form-control" min="1" value={requestQty} onChange={e => setRequestQty(e.target.value)} required />
            </div>
            <button type="submit" className="btn btn-outline">{t('requestStock')}</button>
          </form>
        </div>
      </div>
    </div>
  );
}