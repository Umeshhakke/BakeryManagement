import React, { useState, useEffect } from 'react';
import API from '../services/api';
import { Pie, Bar, Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
} from 'chart.js';
import { useLanguage } from '../contexts/LanguageContext';
import { AnalyticsIcon } from '../components/Icons';
import '../styles/Analytics.css';

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title
);

export default function Analytics() {
  const { t } = useLanguage();
  const [productSales, setProductSales] = useState([]);
  const [shopPerformance, setShopPerformance] = useState([]);
  const [salesOverTime, setSalesOverTime] = useState([]);
  const [rawMaterialUsage, setRawMaterialUsage] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      API.get('/analytics/total-sales/'),
      API.get('/analytics/shop-performance/'),
      API.get('/analytics/sales-over-time/'),
      API.get('/analytics/raw-material-usage/'),
    ])
      .then(([pSales, sPerf, sTime, rMat]) => {
        setProductSales(pSales.data);
        setShopPerformance(sPerf.data);
        setSalesOverTime(sTime.data);
        setRawMaterialUsage(rMat.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="text-center p-4">Loading...</div>;

  const pieData = {
    labels: productSales.map((item) => item.product__product_name),
    datasets: [
      {
        data: productSales.map((item) => item.total),
        backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF'],
      },
    ],
  };

  const barData = {
    labels: shopPerformance.map((item) => item.shop__name),
    datasets: [
      {
        label: t('totalSales'),
        data: shopPerformance.map((item) => item.total),
        backgroundColor: '#36A2EB',
      },
    ],
  };

  const lineData = {
    labels: salesOverTime.map((item) => item.sale_date__date),
    datasets: [
      {
        label: t('dailySales'),
        data: salesOverTime.map((item) => item.total),
        borderColor: '#FF6384',
        fill: false,
      },
    ],
  };

  const materialData = {
    labels: rawMaterialUsage.map((item) => item.raw_material__name),
    datasets: [
      {
        label: t('rawMaterialUsage'),
        data: rawMaterialUsage.map((item) => item.total),
        backgroundColor: '#4BC0C0',
      },
    ],
  };

  return (
    <div className="analytics-page">
      <h2 className="page-title"><AnalyticsIcon /> {t('analytics')}</h2>
      <div className="grid-2">
        <div className="card">
          <div className="card-header">
            <h4>{t('salesByProduct')}</h4>
          </div>
          <div className="chart-container">
            <Pie data={pieData} />
          </div>
        </div>
        <div className="card">
          <div className="card-header">
            <h4>{t('shopPerformance')}</h4>
          </div>
          <div className="chart-container">
            <Bar data={barData} />
          </div>
        </div>
        <div className="card full-width">
          <div className="card-header">
            <h4>{t('salesTrend')}</h4>
          </div>
          <div className="chart-container">
            <Line data={lineData} />
          </div>
        </div>
        <div className="card full-width">
          <div className="card-header">
            <h4>{t('rawMaterialUsage')}</h4>
          </div>
          <div className="chart-container">
            <Bar data={materialData} />
          </div>
        </div>
      </div>
    </div>
  );
}