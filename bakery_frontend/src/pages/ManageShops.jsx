import React, { useState, useEffect } from 'react';
import API from '../services/api';
import { useLanguage } from '../contexts/LanguageContext';
import { ShopIcon } from '../components/Icons';
import '../styles/ManageShops.css';

export default function ManageShops() {
  const { t } = useLanguage();
  const [shops, setShops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState('');
  const [location, setLocation] = useState('');
  const [contact, setContact] = useState('');

  useEffect(() => {
    fetchShops();
  }, []);

  const fetchShops = () => {
    setLoading(true);
    API.get('/shops/')
      .then(res => {
        setShops(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !location || !contact) {
      alert('Please fill all fields');
      return;
    }
    try {
      await API.post('/shops/', { name, location, contact });
      alert(t('addShop') + ' ' + t('success'));
      setName('');
      setLocation('');
      setContact('');
      fetchShops();
    } catch (err) {
      console.error(err);
      alert('Error adding shop');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this shop?')) return;
    try {
      await API.delete(`/shops/${id}/`);
      fetchShops();
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <div className="text-center p-4">Loading...</div>;

  return (
    <div className="manage-shops-page">
      <h2 className="page-title"><ShopIcon /> {t('manageShops')}</h2>
      <div className="grid-2">
        <div className="card">
          <div className="card-header">
            <h4>➕ {t('addShop')}</h4>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>{t('name')}</label>
              <input
                className="form-control"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label>{t('location')}</label>
              <input
                className="form-control"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label>{t('contact')}</label>
              <input
                className="form-control"
                value={contact}
                onChange={(e) => setContact(e.target.value)}
                required
              />
            </div>
            <button type="submit" className="btn btn-primary">
              {t('add')}
            </button>
          </form>
        </div>
        <div className="card">
          <div className="card-header">
            <h4>📋 {t('currentShops')}</h4>
            <span className="badge">{shops.length}</span>
          </div>
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>{t('name')}</th>
                  <th>{t('location')}</th>
                  <th>{t('contact')}</th>
                  <th>{t('action')}</th>
                </tr>
              </thead>
              <tbody>
                {shops.map((shop) => (
                  <tr key={shop.id}>
                    <td><strong>{shop.name}</strong></td>
                    <td>{shop.location}</td>
                    <td>{shop.contact}</td>
                    <td>
                      <button
                        className="btn btn-danger btn-sm"
                        onClick={() => handleDelete(shop.id)}
                      >
                        {t('delete')}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}