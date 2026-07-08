import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import API from '../services/api';
import { useLanguage } from '../contexts/LanguageContext';
import { ShopIcon } from '../components/Icons';
import '../styles/Shops.css';

export default function Shops() {
  const { t } = useLanguage();
  const [shops, setShops] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get('/shops/')
      .then(res => {
        setShops(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="text-center p-4">Loading...</div>;

  return (
    <div className="shops-page">
      <h2 className="page-title"><ShopIcon /> {t('myShops')}</h2>
      <div className="card">
        <div className="card-header">
          <h4>{t('currentShops')}</h4>
          <span className="badge">{shops.length}</span>
        </div>
        {shops.length === 0 ? (
          <p className="text-center">No shops found.</p>
        ) : (
          <div className="shops-list">
            {shops.map(shop => (
              <Link to={`/shop/${shop.id}`} key={shop.id} className="shop-item">
                <div className="shop-info">
                  <span className="shop-name">{shop.name}</span>
                  <span className="shop-location">{shop.location}</span>
                </div>
                <span className="shop-arrow">→</span>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}