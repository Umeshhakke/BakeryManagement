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
import '../styles/ProductOverview.css';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export default function ProductOverview() {
  const { t } = useLanguage();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get('/analytics/product-summary/')
      .then(res => {
        setProducts(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="text-center p-4">Loading...</div>;

  // Chart: For each product, show produced, delivered, sold
  const chartData = {
    labels: products.map(p => p.product_name),
    datasets: [
      {
        label: t('totalProduced'),
        data: products.map(p => p.total_produced),
        backgroundColor: '#2a9d8f',
      },
      {
        label: t('totalDelivered'),
        data: products.map(p => p.total_delivered),
        backgroundColor: '#f4a261',
      },
      {
        label: t('totalSold'),
        data: products.map(p => p.total_sold),
        backgroundColor: '#e76f51',
      },
    ],
  };

  return (
    <div className="product-overview-page">
      <h2 className="page-title"><DistributeIcon /> {t('productOverview')}</h2>
      
      <div className="card">
        <div className="card-header">
          <h4>{t('productStatus')}</h4>
          <span className="badge">{products.length} {t('products')}</span>
        </div>
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>{t('productName')}</th>
                <th>{t('totalProduced')}</th>
                <th>{t('totalDelivered')}</th>
                <th>{t('totalSold')}</th>
                <th>{t('warehouseStock')}</th>
              </tr>
            </thead>
            <tbody>
              {products.map(product => (
                <tr key={product.product_id}>
                  <td><strong>{product.product_name}</strong></td>
                  <td>{product.total_produced}</td>
                  <td>{product.total_delivered}</td>
                  <td>{product.total_sold}</td>
                  <td>{product.current_warehouse_stock}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="card">
        <div className="card-header">
          <h4>{t('productionVsDistribution')}</h4>
        </div>
        <div className="chart-container">
          <Bar data={chartData} />
        </div>
      </div>
    </div>
  );
}