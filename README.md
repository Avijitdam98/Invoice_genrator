# Invoice Generator

A modern, full-stack invoice generation application built with React and Node.js.

## Features

- 🧾 Create, edit, and manage invoices
- 💰 Track payments and generate reports
- 📊 Analytics dashboard with visual insights
- ✍️ Digital signature support
- 🌙 Dark mode support
- 📱 Responsive design
- 🔒 Secure authentication

## Tech Stack

### Frontend
- React.js
- Tailwind CSS
- React Router DOM
- React PDF
- React Signature Canvas
- Chart.js for analytics

### Backend
- Node.js
- Express.js
- MongoDB
- JWT Authentication
- Mongoose ODM

## Getting Started

### Prerequisites
- Node.js (v18 or higher)
- MongoDB
- npm or yarn

### Installation

1. Clone the repository
```bash
git clone https://github.com/Avijitdam98/Invoice_genrator.git
cd Invoice_genrator
```

2. Install frontend dependencies
```bash
cd frontend
npm install
```

3. Install backend dependencies
```bash
cd ../backend
npm install
```

4. Set up environment variables
Create a `.env` file in the backend directory with:
```env
MONGODB_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
PORT=5001
```

5. Start the development servers

Backend:
```bash
cd backend
npm run dev
```

Frontend:
```bash
cd frontend
npm run dev
```

## Deployment

### Backend Deployment (Render)

1. Create a new Web Service on Render
2. Connect your GitHub repository
3. Configure the following:
   - Build Command: `npm install`
   - Start Command: `node server.js`
   - Environment Variables:
     ```
     PORT=5000
     MONGODB_URI=your_mongodb_uri
     JWT_SECRET=your_jwt_secret
     NODE_ENV=production
     CORS_ORIGIN=https://your-frontend-url.vercel.app
     ```

### Frontend Deployment (Vercel)

1. Create a new project on Vercel
2. Connect your GitHub repository
3. Configure the following environment variables:
   ```
   REACT_APP_API_URL=https://your-backend-url.onrender.com/api
   REACT_APP_ENV=production
   ```
4. Deploy!

## Features in Detail

### Invoice Management
- Create and edit invoices
- Add multiple line items
- Calculate totals automatically
- Digital signature support
- PDF generation and download

### Analytics Dashboard
- Revenue tracking
- Invoice status distribution
- Monthly trends
- Top clients analysis

### User Experience
- Responsive design for all devices
- Dark mode support
- Intuitive interface
- Real-time updates

## Live Demo

Frontend: [https://invoice-generator-react.vercel.app](https://invoice-generator-react.vercel.app)
Backend API: [https://invoice-generator-api.onrender.com](https://invoice-generator-api.onrender.com)

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Author

Avijit Dam - [GitHub Profile](https://github.com/Avijitdam98)
