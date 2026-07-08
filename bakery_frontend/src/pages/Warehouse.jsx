import React, { useState, useEffect } from 'react';
import API from '../services/api';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { useLanguage } from '../contexts/LanguageContext';
import { WarehouseIcon } from '../components/Icons';
import '../styles/Warehouse.css';

ChartJS.register(ArcElement, Tooltip, Legend);

export default function Warehouse() {
  const { t } = useLanguage();
  const [materials, setMaterials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState('');
  const [unit, setUnit] = useState('kg');
  const [quantity, setQuantity] = useState(0);

  useEffect(() => {
    API.get('/materials/')
      .then(res => {
        setMaterials(res.data);
        setLoading(false);
      })
      .catch(err => console.error(err));
  }, []);

  const handleAddPurchase = async (e) => {
    e.preventDefault();
    let materialId;
    const existing = materials.find(m => m.name === name);
    if (existing) {
      materialId = existing.id;
    } else {
      const newMat = await API.post('/materials/', { name, unit, current_quantity: 0 });
      materialId = newMat.data.id;
      setMaterials([...materials, newMat.data]);
    }
    await API.post('/material-movements/', {
      material: materialId,
      quantity_change: parseFloat(quantity),
      movement_type: 'IN',
      notes: 'Purchased via dashboard'
    });
    alert(t('purchase') + ' ' + t('addToWarehouse') + '!');
    window.location.reload();
  };

  const pieData = {
    labels: materials.map(m => m.name),
    datasets: [{ data: materials.map(m => parseFloat(m.current_quantity)), backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0'] }]
  };

  if (loading) return <div className="text-center p-4">Loading...</div>;

  return (
    <div className="warehouse-page">
      <h2 className="page-title"><WarehouseIcon /> {t('warehouse')}</h2>
      <div className="grid-2">
        <div className="card">
          <div className="card-header">
            <h4>{t('stock')}</h4>
            <span className="badge">{materials.length} {t('materials')}</span>
          </div>
          <div className="chart-container">
            <Pie data={pieData} />
          </div>
        </div>
        <div className="card">
          <div className="card-header"><h4>{t('addToWarehouse')}</h4></div>
          <form onSubmit={handleAddPurchase}>
            <div className="form-group">
              <label>{t('materialName')}</label>
              <input className="form-control" value={name} onChange={e => setName(e.target.value)} required />
            </div>
            <div className="form-group">
              <label>{t('unit')}</label>
              <select className="form-control" value={unit} onChange={e => setUnit(e.target.value)}>
                <option>kg</option><option>liters</option><option>pcs</option>
              </select>
            </div>
            <div className="form-group">
              <label>{t('quantity')}</label>
              <input type="number" className="form-control" value={quantity} onChange={e => setQuantity(e.target.value)} required />
            </div>
            <button type="submit" className="btn btn-primary">{t('add')}</button>
          </form>
        </div>
      </div>
      <div className="card">
        <div className="card-header"><h4>{t('stock')}</h4></div>
        <div className="table-wrapper">
          <table>
            <thead>
              <tr><th>{t('materialName')}</th><th>{t('unit')}</th><th>{t('quantity')}</th></tr>
            </thead>
            <tbody>
              {materials.map(m => (
                <tr key={m.id}><td><strong>{m.name}</strong></td><td>{m.unit}</td><td>{m.current_quantity}</td></tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}