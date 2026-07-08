import React, { useState, useEffect } from 'react';
import API from '../services/api';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { useLanguage } from '../contexts/LanguageContext';
import { ProductionIcon } from '../components/Icons';
import '../styles/Production.css';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export default function Production() {
  const { t } = useLanguage();
  const [batches, setBatches] = useState([]);
  const [materials, setMaterials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [productName, setProductName] = useState('');
  const [producedQty, setProducedQty] = useState(0);
  const [consumptions, setConsumptions] = useState([{ raw_material: '', quantity_used: 0 }]);

  useEffect(() => {
    Promise.all([
      API.get('/production-batches/'),
      API.get('/materials/')
    ]).then(([batRes, matRes]) => {
      setBatches(batRes.data);
      setMaterials(matRes.data);
      setLoading(false);
    }).catch(err => console.error(err));
  }, []);

  const addConsumption = () => setConsumptions([...consumptions, { raw_material: '', quantity_used: 0 }]);
  const updateConsumption = (idx, field, value) => {
    const newCons = [...consumptions];
    newCons[idx][field] = value;
    setConsumptions(newCons);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      product_name: productName,
      quantity_produced: parseInt(producedQty),
      consumptions: consumptions.filter(c => c.raw_material && c.quantity_used > 0)
    };
    await API.post('/production-batches/', payload);
    alert('Production logged!');
    window.location.reload();
  };

  const barData = {
    labels: batches.map(b => b.product_name + ' (' + b.batch_date.slice(0,10) + ')'),
    datasets: [{ label: 'Units Produced', data: batches.map(b => b.quantity_produced), backgroundColor: '#36A2EB' }]
  };

  if (loading) return <div className="text-center p-4">Loading...</div>;

  return (
    <div className="production-page">
      <h2 className="page-title"><ProductionIcon /> {t('production')}</h2>
      <div className="grid-2">
        <div className="card">
          <div className="card-header"><h4>{t('addProduction')}</h4></div>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>{t('productName')}</label>
              <input className="form-control" value={productName} onChange={e => setProductName(e.target.value)} required />
            </div>
            <div className="form-group">
              <label>{t('quantityProduced')}</label>
              <input type="number" className="form-control" value={producedQty} onChange={e => setProducedQty(e.target.value)} required />
            </div>
            <h5>{t('consumptions')}</h5>
            {consumptions.map((c, idx) => (
              <div key={idx} className="consumption-row">
                <select className="form-control" value={c.raw_material} onChange={e => updateConsumption(idx, 'raw_material', e.target.value)}>
                  <option value="">{t('selectMaterial')}</option>
                  {materials.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
                </select>
                <input type="number" className="form-control" placeholder={t('quantity')} value={c.quantity_used} onChange={e => updateConsumption(idx, 'quantity_used', e.target.value)} />
              </div>
            ))}
            <button type="button" className="btn btn-outline btn-sm" onClick={addConsumption}>+ {t('addMaterial')}</button>
            <button type="submit" className="btn btn-primary mt-10">{t('submitBatch')}</button>
          </form>
        </div>
        <div className="card">
          <div className="card-header"><h4>{t('productionOutput')}</h4></div>
          <div className="chart-container">
            <Bar data={barData} />
          </div>
        </div>
      </div>
    </div>
  );
}