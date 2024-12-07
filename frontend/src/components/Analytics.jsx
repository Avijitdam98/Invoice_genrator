import { useState, useEffect } from 'react';
import { invoiceApi } from '../services/api';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import { Line, Bar } from 'react-chartjs-2';
import { useDarkMode } from '../context/DarkModeContext';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const Analytics = () => {
  const { darkMode } = useDarkMode();
  const [analyticsData, setAnalyticsData] = useState({
    totalRevenue: 0,
    monthlyRevenue: [],
    paymentMetrics: {
      totalPaid: 0,
      totalPending: 0,
      totalOverdue: 0,
      averagePaymentTime: 0,
    },
    invoiceStatus: {
      paid: 0,
      pending: 0,
      overdue: 0,
    },
    yearlyComparison: [],
    recentPayments: [],
    totalInvoices: 0,
    topClients: [],
  });

  useEffect(() => {
    fetchAnalyticsData();
  }, []);

  const fetchAnalyticsData = async () => {
    try {
      const response = await invoiceApi.getAllInvoices();
      const invoices = response.data;
      const processedData = processInvoiceData(invoices);
      setAnalyticsData(processedData);
    } catch (error) {
      console.error('Error fetching analytics:', error);
    }
  };

  const processInvoiceData = (invoices) => {
    const now = new Date();
    const currentYear = now.getFullYear();
    const topClientsMap = {};

    const data = {
      totalRevenue: 0,
      monthlyRevenue: new Array(12).fill(0),
      paymentMetrics: {
        totalPaid: 0,
        totalPending: 0,
        totalOverdue: 0,
        averagePaymentTime: 0,
      },
      invoiceStatus: {
        paid: 0,
        pending: 0,
        overdue: 0,
      },
      totalInvoices: invoices.length,
      recentPayments: [],
      topClients: [],
    };

    invoices.forEach((invoice) => {
      const amount = invoice.total || invoice.totalAmount || 0;
      const date = new Date(invoice.createdAt || invoice.date);
      const month = date.getMonth();

      data.totalRevenue += amount;
      data.monthlyRevenue[month] += amount;

      // Payment Metrics
      if (invoice.status === 'paid') {
        data.paymentMetrics.totalPaid += amount;
        data.invoiceStatus.paid += 1;

        if (invoice.paidAt) {
          const paymentDate = new Date(invoice.paidAt);
          const paymentTime = Math.floor((paymentDate - date) / (1000 * 60 * 60 * 24));
          data.paymentMetrics.averagePaymentTime += paymentTime;
        }

        // Recent Payments
        data.recentPayments.push({
          id: invoice._id,
          amount,
          date: new Date(invoice.paidAt),
          clientName: invoice.clientName,
        });
      } else if (invoice.status === 'pending') {
        data.paymentMetrics.totalPending += amount;
        data.invoiceStatus.pending += 1;
      } else {
        data.invoiceStatus.overdue += 1;
        data.paymentMetrics.totalOverdue += amount;
      }

      // Top Clients
      if (invoice.clientName) {
        topClientsMap[invoice.clientName] =
          (topClientsMap[invoice.clientName] || 0) + amount;
      }
    });

    // Calculate Average Payment Time
    const paidInvoices = invoices.filter((inv) => inv.status === 'paid' && inv.paidAt);
    if (paidInvoices.length > 0) {
      data.paymentMetrics.averagePaymentTime = Math.round(
        data.paymentMetrics.averagePaymentTime / paidInvoices.length
      );
    }

    // Sort Top Clients
    data.topClients = Object.entries(topClientsMap)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([client, revenue]) => ({ client, revenue }));

    return data;
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        labels: {
          color: darkMode ? '#fff' : '#1f2937',
        },
      },
      tooltip: {
        backgroundColor: darkMode ? '#374151' : '#fff',
        titleColor: darkMode ? '#fff' : '#1f2937',
        bodyColor: darkMode ? '#fff' : '#1f2937',
        borderColor: darkMode ? '#4b5563' : '#e5e7eb',
        borderWidth: 1,
      },
    },
    scales: {
      x: {
        grid: {
          color: darkMode ? '#374151' : '#e5e7eb',
        },
        ticks: {
          color: darkMode ? '#9ca3af' : '#4b5563',
        },
      },
      y: {
        grid: {
          color: darkMode ? '#374151' : '#e5e7eb',
        },
        ticks: {
          color: darkMode ? '#9ca3af' : '#4b5563',
          callback: (value) => formatCurrency(value),
        },
      },
    },
  };

  const revenueChartData = {
    labels: analyticsData.monthlyRevenue.map((_, index) =>
      new Date(2023, index).toLocaleString('default', { month: 'short' })
    ),
    datasets: [
      {
        label: 'Monthly Revenue',
        data: analyticsData.monthlyRevenue,
        borderColor: darkMode ? '#818cf8' : 'rgb(99, 102, 241)',
        backgroundColor: darkMode ? 'rgba(129, 140, 248, 0.2)' : 'rgba(99, 102, 241, 0.2)',
        fill: true,
        tension: 0.4,
      },
    ],
  };

  const invoiceStatusData = {
    labels: ['Paid', 'Pending', 'Overdue'],
    datasets: [
      {
        label: 'Invoice Status',
        data: Object.values(analyticsData.invoiceStatus),
        backgroundColor: darkMode 
          ? ['rgba(34, 197, 94, 0.8)', 'rgba(250, 204, 21, 0.8)', 'rgba(239, 68, 68, 0.8)']
          : ['#22c55e', '#facc15', '#ef4444'],
      },
    ],
  };

  return (
    <div className={`p-6 ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
      <div className="flex justify-between items-center mb-6">
        <h1 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
          Analytics Dashboard
        </h1>
        <button
          onClick={fetchAnalyticsData}
          className="px-4 py-2 bg-indigo-600 text-white rounded-lg shadow hover:bg-indigo-700 transition-transform transform hover:scale-105"
        >
          Refresh Data
        </button>
      </div>

      {/* Summary Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className={`p-6 rounded-lg shadow-lg ${darkMode ? 'bg-green-600' : 'bg-gradient-to-r from-green-400 to-green-600'}`}>
          <h3 className="text-lg text-white">Total Revenue</h3>
          <p className="text-2xl font-bold text-white">{formatCurrency(analyticsData.totalRevenue)}</p>
        </div>
        <div className={`p-6 rounded-lg shadow-lg ${darkMode ? 'bg-blue-600' : 'bg-gradient-to-r from-blue-400 to-blue-600'}`}>
          <h3 className="text-lg text-white">Total Invoices</h3>
          <p className="text-2xl font-bold text-white">{analyticsData.totalInvoices}</p>
        </div>
        <div className={`p-6 rounded-lg shadow-lg ${darkMode ? 'bg-yellow-600' : 'bg-gradient-to-r from-yellow-400 to-yellow-600'}`}>
          <h3 className="text-lg text-white">Pending Payments</h3>
          <p className="text-2xl font-bold text-white">
            {formatCurrency(analyticsData.paymentMetrics.totalPending)}
          </p>
        </div>
        <div className={`p-6 rounded-lg shadow-lg ${darkMode ? 'bg-red-600' : 'bg-gradient-to-r from-red-400 to-red-600'}`}>
          <h3 className="text-lg text-white">Overdue Payments</h3>
          <p className="text-2xl font-bold text-white">
            {formatCurrency(analyticsData.paymentMetrics.totalOverdue)}
          </p>
        </div>
      </div>

      {/* Revenue and Invoice Status Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        <div className={`rounded-lg shadow p-6 ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
          <h3 className={`text-lg font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            Monthly Revenue
          </h3>
          <div className="h-80">
            <Line data={revenueChartData} options={chartOptions} />
          </div>
        </div>
        <div className={`rounded-lg shadow p-6 ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
          <h3 className={`text-lg font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            Invoice Status
          </h3>
          <div className="h-80">
            <Bar data={invoiceStatusData} options={chartOptions} />
          </div>
        </div>
      </div>

      {/* Top Clients */}
      <div className={`rounded-lg shadow p-6 ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
        <h3 className={`text-lg font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
          Top Performing Clients
        </h3>
        <ul className="space-y-2">
          {analyticsData.topClients.map((client, index) => (
            <li key={index} className="flex justify-between">
              <span className={`font-medium ${darkMode ? 'text-white' : 'text-gray-700'}`}>
                {client.client}
              </span>
              <span className={darkMode ? 'text-gray-400' : 'text-gray-500'}>
                {formatCurrency(client.revenue)}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Analytics;
