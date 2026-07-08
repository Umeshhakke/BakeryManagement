import React, { useState, useEffect } from 'react';
import API from '../services/api';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { useLanguage } from '../contexts/LanguageContext';
import { DistributeIcon } from '../components/Icons';
import '../styles/ProductDistribution.css';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export default function ProductDistribution() {
  const { t } = useLanguage();
  const [products, setProducts] = useState([]);
  const [selectedProductId, setSelectedProductId] = useState('');
  const [data, setData] = useState(null);
  const [deliveries, setDeliveries] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    API.get('/finished-goods/')
      .then(res => setProducts(res.data))
      .catch(err => console.error(err));
  }, []);

  const fetchDistribution = async (productId) => {
    if (!productId) return;
    setLoading(true);
    try {
      const res = await API.get(`/analytics/product-distribution/?product_id=${productId}`);
      setData(res.data);
      const delRes = await API.get(`/finished-goods-movements/?product=${productId}&movement_type=DEL`);
      setDeliveries(delRes.data);
    } catch (err) {
      console.error(err);
      alert('Error fetching distribution data');
    }
    setLoading(false);
  };

  const handleProductChange = (e) => {
    const id = e.target.value;
    setSelectedProductId(id);
    fetchDistribution(id);
  };

  const chartData = () => {
    if (!data || !data.shops.length) return null;
    return {
      labels: data.shops.map(s => s.shop_name),
      datasets: [
        {
          label: t('delivered'),
          data: data.shops.map(s => s.total_delivered),
          backgroundColor: '#2a9d8f',
        },
        {
          label: t('sold'),
          data: data.shops.map(s => s.total_sold),
          backgroundColor: '#f4a261',
        },
      ],
    };
  };

  return (
    <div className="distribution-page">
      <h2 className="page-title"><DistributeIcon /> {t('distribution')}</h2>
      <div className="card">
        <div className="form-group">
          <label>{t('selectProduct')}</label>
          <select
            className="form-control"
            value={selectedProductId}
            onChange={handleProductChange}
          >
            <option value="">-- {t('selectProduct')} --</option>
            {products.map(p => (
              <option key={p.id} value={p.id}>{p.product_name}</option>
            ))}
          </select>
        </div>
      </div>

      {loading && <div className="text-center p-4">Loading...</div>}

      {data && (
        <>
          <div className="grid-3">
            <div className="stat-card">
              <div className="stat-label">{t('totalProduced')}</div>
              <div className="stat-number">{data.total_produced}</div>
            </div>
            <div className="stat-card">
              <div className="stat-label">{t('warehouseStock')}</div>
              <div className="stat-number">{data.current_warehouse_stock}</div>
            </div>
            <div className="stat-card">
              <div className="stat-label">{t('sentToShops')}</div>
              <div className="stat-number">
                {data.shops.reduce((acc, s) => acc + s.total_delivered, 0)}
              </div>
            </div>
          </div>

          <div className="card">
            <div className="card-header">
              <h4>{t('shopPerformance')}</h4>
            </div>
            <div className="table-wrapper">
              <table>
                <thead>
                  <tr>
                    <th>{t('shop')}</th>
                    <th>{t('delivered')}</th>
                    <th>{t('sold')}</th>
                    <th>{t('shopStock')}</th>
                  </tr>
                </thead>
                <tbody>
                  {data.shops.map((shop, idx) => (
                    <tr key={idx}>
                      <td><strong>{shop.shop_name}</strong></td>
                      <td>{shop.total_delivered}</td>
                      <td>{shop.total_sold}</td>
                      <td>{shop.current_shop_stock}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="card">
            <div className="card-header">
              <h4>{t('comparisonChart')}</h4>
            </div>
            <div className="chart-container">
              {chartData() ? <Bar data={chartData()} /> : <p>No data for chart.</p>}
            </div>
          </div>

          <div className="card">
            <div className="card-header">
              <h4>{t('fullDeliveryHistory')}</h4>
            </div>
            <div className="table-wrapper" style={{ maxHeight: '300px', overflowY: 'auto' }}>
              {deliveries.length === 0 ? (
                <p className="text-center">{t('noDeliveries')}</p>
              ) : (
                <table>
                  <thead>
                    <tr>
                      <th>{t('date')}</th>
                      <th>{t('shop')}</th>
                      <th>{t('qtyDelivered')}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {deliveries.map(d => (
                      <tr key={d.id}>
                        <td>{new Date(d.timestamp).toLocaleDateString()}</td>
                        <td>{d.shop_name || `Shop ${d.shop}`}</td>
                        <td>{Math.abs(d.quantity_change)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}