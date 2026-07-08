# 🥖 Bakery ERP System

<div align="center">

![Django](https://img.shields.io/badge/Django-5.x-092E20?style=for-the-badge&logo=django)
![React](https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Database-336791?style=for-the-badge&logo=postgresql)
![DRF](https://img.shields.io/badge/Django_REST_Framework-API-red?style=for-the-badge)
![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)

A **full-stack Enterprise Resource Planning (ERP)** system built specifically for **Bakery Management**.

It streamlines the complete bakery workflow—from **Raw Material Procurement** and **Production Planning** to **Shop Distribution**, **Sales Tracking**, and **Business Analytics**—through an intuitive, role-based dashboard.

---

**Backend:** Django • Django REST Framework

**Frontend:** React

**Database:** PostgreSQL

</div>

---

# ✨ Features

## 👤 Role-Based Dashboards

### 🛠 Admin / Warehouse Manager

- Manage raw materials
- Record purchases
- Create production batches
- Fulfill shop requests
- Track warehouse inventory
- Monitor sales analytics
- View production lifecycle
- Manage finished goods

### 🏪 Shop Owner

- View shop inventory
- Browse available products
- Request stock
- Log daily sales
- Track remaining stock
- View order history

---

# 🏭 Warehouse Management

- Add raw material purchases
- Automatic warehouse stock updates
- Django Signals ensure inventory consistency
- Real-time stock availability
- Raw material usage tracking

---

# 🍞 Production Management

Create production batches with complete raw material consumption.

Example:

```
50 White Bread

↓

Consumes

5kg Flour
500g Yeast
200g Salt

↓

Produces

50 Finished White Bread
```

Features include:

- Batch-wise production
- Automatic raw material deduction
- Finished goods generation
- Stock validation
- Production history

---

# 📦 Smart Product Catalog

Shop Owners can browse every finished product available in the warehouse.

### Smart Validation

If:

Warehouse Stock = **30**

Requested Quantity = **50**

The system instantly rejects the request and displays:

```
Only 30 units are available.
```

This prevents over-ordering and maintains inventory accuracy.

---

# 🚚 Smart Shop Request Fulfillment

The Admin dashboard displays:

- Requested quantity
- Current warehouse stock
- Shop name
- Product

When fulfilling:

Example

```
Shop Requested : 50

Warehouse Has : 30

Admin Delivers : 30
```

Only the entered quantity is transferred.

This prevents negative stock and accidental overselling.

---

# 📈 Analytics Dashboard

The ERP provides complete business insights.

### 📊 Sales Analytics

- Total product sales
- Daily sales trend
- Shop performance
- Best-selling products

### 📦 Warehouse Analytics

- Raw material usage
- Warehouse stock
- Product distribution

### 🍞 Product Lifecycle

Track every product from production to sale.

Example:

| Stage | Quantity |
|--------|---------:|
| Produced | 100 |
| Delivered | 80 |
| Sold | 55 |
| Shop Stock | 25 |
| Warehouse Stock | 20 |

---

# 🌍 Multi-Language Support

The application supports:

- 🇬🇧 English
- 🇮🇳 Hindi
- 🇮🇳 Marathi

Language can be switched instantly from the sidebar.

Implemented using **React Context API**.

---

# 📱 Responsive Design

Designed for:

- Desktop
- Laptop
- Tablet
- Mobile

### Mobile Features

- Hamburger menu
- Slide-out sidebar
- Responsive tables
- Adaptive charts
- Optimized layouts

---

# 🛠 Tech Stack

| Layer | Technology |
|---------|------------|
| Backend | Django 5 |
| API | Django REST Framework |
| Frontend | React 18 |
| Routing | React Router DOM |
| Database | PostgreSQL |
| Charts | Chart.js |
| HTTP Client | Axios |
| Styling | CSS Modules |
| State Management | React Context API |
| Authentication | Django Authentication |
| Deployment | Docker, Gunicorn, Render, Vercel |

---

# 📂 Project Structure

```
BakeryManagerPython/

│

├── bakery_backend/

│   ├── core/

│   │   ├── models.py

│   │   ├── serializers.py

│   │   ├── signals.py

│   │   ├── views.py

│   │   ├── urls.py

│   │

│   ├── bakery_backend/

│   │   └── settings.py

│

│   └── manage.py

│

├── bakery_frontend/

│

│   ├── src/

│   │

│   ├── pages/

│   ├── components/

│   ├── contexts/

│   ├── services/

│   ├── styles/

│

│   └── public/

│

├── .gitignore

└── README.md
```

---

# 🚀 Local Setup

## Prerequisites

- Python 3.10+
- Node.js 16+
- PostgreSQL

---

## Clone Repository

```bash
https://github.com/Umeshhakke/BakeryManagement.git

cd BakeryManagement
```

---

# Backend Setup

```bash
cd bakery_backend

python -m venv venv

# Windows
venv\Scripts\activate

# Linux / macOS
source venv/bin/activate

pip install -r requirements.txt

cp .env.example .env

python manage.py makemigrations

python manage.py migrate

python manage.py createsuperuser

python manage.py runserver
```

---

# Frontend Setup

Open another terminal.

```bash
cd bakery_frontend

npm install

cp .env.example .env

npm start
```

---

# Access URLs

| Service | URL |
|----------|-----|
| React App | http://localhost:3000 |
| Backend API | http://127.0.0.1:8000/api/ |
| Django Admin | http://127.0.0.1:8000/admin/ |

---

# 🔐 Demo Credentials

| Role | Login |
|------|-------|
| Admin | Password: `admin123` |
| Shop Owner | No password required |

> **Note:** The frontend admin password acts only as a UI gate. Actual authentication and authorization are managed by Django.

---

# ⚙ Environment Variables

## Backend

```env
SECRET_KEY=your-secret-key

DATABASE_URL=postgres://username:password@host/database

DEBUG=1
```

## Frontend

```env
REACT_APP_API_URL=http://127.0.0.1:8000/api
```

---

# 📸 Screenshots

You can add screenshots here.

## Home Page
![Home Page](assets/HomePage.png)
## Shop Dashboard
![Shop Dashboard](assets/ShopDash.png)
## Shop Management 
![Shop Management](assets/ShopMgm.png)
## Warehouse Raw Material Stock
![Shop Management](assets/raw.png)
## Product Produced
![Product Produced](assets/production.png)
## Product Analysis
![Product Analysis](assets/Analysis.png)
## Product Distributed
![Product Distributed](assets/Distribution.png)
![Product Distributed](assets/PD2.png)
## Product Overview
![Product overview](assets/overview.png)
## Product Request
![Product Request](assets/PR.png)



---

# 🔄 System Workflow

```text
Purchase Raw Materials
          │
          ▼
Warehouse Stock Updated
          │
          ▼
Create Production Batch
          │
          ▼
Finished Goods Generated
          │
          ▼
Shop Requests Stock
          │
          ▼
Admin Approves Delivery
          │
          ▼
Shop Inventory Updated
          │
          ▼
Sales Logged
          │
          ▼
Analytics Updated
```

---

# 🚀 Future Enhancements

- QR Code Inventory
- Barcode Scanner
- GST Billing
- Invoice Generation
- Email Notifications
- SMS Notifications
- Multi-Warehouse Support
- Supplier Management
- Purchase Orders
- Financial Reports

---

# 🤝 Contributing

Contributions are welcome.

1. Fork the repository

2. Create a feature branch

```bash
git checkout -b feature/NewFeature
```

3. Commit your changes

```bash
git commit -m "Add New Feature"
```

4. Push

```bash
git push origin feature/NewFeature
```

5. Open a Pull Request

---

# 📄 License

This project is licensed under the MIT License.

---

# 📧 Contact

**Umesh Hakke**

📩 Email: umeshhakke050@gmail.com

🔗 GitHub: https://github.com/Umeshhakke

---

<div align="center">

Made with ❤️ using

**Django • React • PostgreSQL**

</div>
