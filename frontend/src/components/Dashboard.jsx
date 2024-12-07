import React, { useState, useEffect } from 'react';
import { invoiceApi } from '../services/api';
import {
  HiCurrencyDollar,
  HiChartBar,
  HiTrendingUp,
  HiUsers,
} from 'react-icons/hi';
import { Line, Pie, Doughnut, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  BarElement
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  BarElement
);

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalRevenue: 0,
    averageInvoice: 0,
    monthlyGrowth: 0,
    totalClients: 0,
    revenueByMonth: [],
    statusDistribution: {},
    paymentMethodDistribution: {},
    clientDistribution: {},
    weeklyTrends: [],
    averagePaymentTime: 0
  });

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const response = await invoiceApi.getAllInvoices();
      const invoices = response.data;
      
      // Calculate total revenue
      const totalRevenue = invoices.reduce((sum, invoice) => 
        sum + (invoice.total || invoice.totalAmount || 0), 0
      );

      // Calculate average invoice amount
      const averageInvoice = totalRevenue / (invoices.length || 1);

      // Get unique clients
      const uniqueClients = new Set(invoices.map(invoice => invoice.clientName));
      const totalClients = uniqueClients.size;

      // Group invoices by month
      const monthlyData = groupInvoicesByMonth(invoices);
      
      // Calculate monthly growth
      const monthlyGrowth = calculateMonthlyGrowth(monthlyData);

      // Calculate status distribution
      const statusDistribution = invoices.reduce((acc, invoice) => {
        const status = invoice.status || 'pending';
        acc[status] = (acc[status] || 0) + 1;
        return acc;
      }, {});

      // Calculate payment method distribution
      const paymentMethodDistribution = invoices.reduce((acc, invoice) => {
        const method = invoice.paymentMethod || 'Not Specified';
        acc[method] = (acc[method] || 0) + 1;
        return acc;
      }, {});

      // Calculate client distribution (top 5 clients by revenue)
      const clientDistribution = invoices.reduce((acc, invoice) => {
        const client = invoice.clientName || 'Unknown';
        acc[client] = (acc[client] || 0) + (invoice.total || invoice.totalAmount || 0);
        return acc;
      }, {});

      // Sort clients by revenue and get top 5
      const topClients = Object.entries(clientDistribution)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 5)
        .reduce((acc, [client, amount]) => {
          acc[client] = amount;
          return acc;
        }, {});

      // Calculate weekly trends
      const weeklyTrends = calculateWeeklyTrends(invoices);

      // Calculate average payment time (in days)
      const averagePaymentTime = calculateAveragePaymentTime(invoices);

      setStats({
        totalRevenue,
        averageInvoice,
        monthlyGrowth,
        totalClients,
        revenueByMonth: monthlyData,
        statusDistribution,
        paymentMethodDistribution,
        clientDistribution: topClients,
        weeklyTrends,
        averagePaymentTime
      });
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    }
  };

  const groupInvoicesByMonth = (invoices) => {
    const monthlyData = {};
    const last6Months = Array.from({ length: 6 }, (_, i) => {
      const date = new Date();
      date.setMonth(date.getMonth() - i);
      return date;
    }).reverse();

    // Initialize all months with 0
    last6Months.forEach(date => {
      const monthKey = date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
      monthlyData[monthKey] = 0;
    });

    // Sum up invoice amounts for each month
    invoices.forEach(invoice => {
      const date = new Date(invoice.createdAt || invoice.date);
      const monthKey = date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
      if (monthlyData.hasOwnProperty(monthKey)) {
        monthlyData[monthKey] += (invoice.total || invoice.totalAmount || 0);
      }
    });

    return Object.entries(monthlyData);
  };

  const calculateMonthlyGrowth = (monthlyData) => {
    if (monthlyData.length < 2) return 0;
    
    const lastMonth = monthlyData[monthlyData.length - 1][1];
    const previousMonth = monthlyData[monthlyData.length - 2][1];
    
    if (previousMonth === 0) return 100;
    
    return ((lastMonth - previousMonth) / previousMonth) * 100;
  };

  const calculateWeeklyTrends = (invoices) => {
    const now = new Date();
    const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    
    const weeklyInvoices = invoices.filter(invoice => {
      const invoiceDate = new Date(invoice.createdAt || invoice.date);
      return invoiceDate >= oneWeekAgo && invoiceDate <= now;
    });

    const dailyData = {};
    for (let i = 0; i < 7; i++) {
      const date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
      const dayKey = date.toLocaleDateString('en-US', { weekday: 'short' });
      dailyData[dayKey] = 0;
    }

    weeklyInvoices.forEach(invoice => {
      const date = new Date(invoice.createdAt || invoice.date);
      const dayKey = date.toLocaleDateString('en-US', { weekday: 'short' });
      dailyData[dayKey] += (invoice.total || invoice.totalAmount || 0);
    });

    return Object.entries(dailyData).reverse();
  };

  const calculateAveragePaymentTime = (invoices) => {
    const paidInvoices = invoices.filter(invoice => invoice.status === 'paid' && invoice.paidAt);
    if (paidInvoices.length === 0) return 0;

    const totalDays = paidInvoices.reduce((sum, invoice) => {
      const created = new Date(invoice.createdAt || invoice.date);
      const paid = new Date(invoice.paidAt);
      const days = Math.floor((paid - created) / (1000 * 60 * 60 * 24));
      return sum + days;
    }, 0);

    return Math.round(totalDays / paidInvoices.length);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const chartData = {
    labels: stats.revenueByMonth.map(([month]) => month),
    datasets: [
      {
        label: 'Monthly Revenue',
        data: stats.revenueByMonth.map(([, amount]) => amount),
        fill: true,
        borderColor: 'rgb(99, 102, 241)',
        backgroundColor: 'rgba(99, 102, 241, 0.1)',
        tension: 0.4,
        pointBackgroundColor: 'rgb(99, 102, 241)',
        pointBorderColor: '#fff',
        pointBorderWidth: 2,
        pointRadius: 4,
        pointHoverRadius: 6
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        padding: 12,
        titleColor: '#fff',
        titleFont: {
          size: 14,
          weight: 'bold'
        },
        bodyFont: {
          size: 13
        },
        callbacks: {
          label: function(context) {
            return 'Revenue: ' + formatCurrency(context.parsed.y);
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(0, 0, 0, 0.1)',
          drawBorder: false
        },
        ticks: {
          callback: function(value) {
            return formatCurrency(value);
          },
          font: {
            size: 12
          }
        }
      },
      x: {
        grid: {
          display: false
        },
        ticks: {
          font: {
            size: 12
          }
        }
      }
    },
    interaction: {
      intersect: false,
      mode: 'index'
    }
  };

  const statusChartData = {
    labels: Object.keys(stats.statusDistribution),
    datasets: [
      {
        data: Object.values(stats.statusDistribution),
        backgroundColor: [
          'rgb(34, 197, 94)', // green for paid
          'rgb(234, 179, 8)', // yellow for pending
          'rgb(239, 68, 68)', // red for overdue
          'rgb(148, 163, 184)' // gray for others
        ],
        borderWidth: 1
      }
    ]
  };

  const paymentMethodChartData = {
    labels: Object.keys(stats.paymentMethodDistribution),
    datasets: [
      {
        data: Object.values(stats.paymentMethodDistribution),
        backgroundColor: [
          'rgb(99, 102, 241)', // indigo
          'rgb(168, 85, 247)', // purple
          'rgb(236, 72, 153)', // pink
          'rgb(14, 165, 233)', // sky
          'rgb(249, 115, 22)' // orange
        ],
        borderWidth: 1
      }
    ]
  };

  const clientChartData = {
    labels: Object.keys(stats.clientDistribution),
    datasets: [
      {
        data: Object.values(stats.clientDistribution),
        backgroundColor: [
          'rgb(99, 102, 241)',   // indigo
          'rgb(168, 85, 247)',   // purple
          'rgb(236, 72, 153)',   // pink
          'rgb(14, 165, 233)',   // sky
          'rgb(249, 115, 22)'    // orange
        ],
        borderWidth: 1
      }
    ]
  };

  const weeklyTrendsData = {
    labels: stats.weeklyTrends.map(([day]) => day),
    datasets: [
      {
        label: 'Daily Revenue',
        data: stats.weeklyTrends.map(([, amount]) => amount),
        backgroundColor: 'rgba(99, 102, 241, 0.5)',
        borderColor: 'rgb(99, 102, 241)',
        borderWidth: 1
      }
    ]
  };

  const pieChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          usePointStyle: true,
          padding: 20,
          color: document.documentElement.classList.contains('dark') ? 'white' : 'black'
        }
      }
    }
  };

  const barChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        display: false
      },
      title: {
        display: false
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(0, 0, 0, 0.1)'
        }
      },
      x: {
        grid: {
          display: false
        }
      }
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">Dashboard</h1>
      
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* Total Revenue */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-indigo-100 dark:bg-indigo-900">
              <HiCurrencyDollar className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Revenue</p>
              <p className="text-lg font-semibold text-gray-900 dark:text-white">
                {formatCurrency(stats.totalRevenue)}
              </p>
            </div>
          </div>
        </div>

        {/* Average Invoice */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-green-100 dark:bg-green-900">
              <HiChartBar className="h-6 w-6 text-green-600 dark:text-green-400" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Average Invoice</p>
              <p className="text-lg font-semibold text-gray-900 dark:text-white">
                {formatCurrency(stats.averageInvoice)}
              </p>
            </div>
          </div>
        </div>

        {/* Monthly Growth */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-blue-100 dark:bg-blue-900">
              <HiTrendingUp className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Monthly Growth</p>
              <p className="text-lg font-semibold text-gray-900 dark:text-white">
                {stats.monthlyGrowth.toFixed(1)}%
              </p>
            </div>
          </div>
        </div>

        {/* Total Clients */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-purple-100 dark:bg-purple-900">
              <HiUsers className="h-6 w-6 text-purple-600 dark:text-purple-400" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Clients</p>
              <p className="text-lg font-semibold text-gray-900 dark:text-white">
                {stats.totalClients}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Revenue Chart */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 col-span-2">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Revenue Overview</h2>
            <div className="text-sm text-gray-500 dark:text-gray-400">
              Last 6 Months
            </div>
          </div>
          <div className="h-80">
            <Line data={chartData} options={chartOptions} />
          </div>
        </div>

        {/* Weekly Trends */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Weekly Trends</h2>
          <div className="h-64">
            <Bar data={weeklyTrendsData} options={barChartOptions} />
          </div>
        </div>

        {/* Status Distribution Chart */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Invoice Status Distribution</h2>
          <div className="h-64">
            <Pie data={statusChartData} options={pieChartOptions} />
          </div>
        </div>

        {/* Top Clients Chart */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Top 5 Clients by Revenue</h2>
          <div className="h-64">
            <Doughnut data={clientChartData} options={pieChartOptions} />
          </div>
        </div>

        {/* Payment Methods Chart */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Payment Methods</h2>
          <div className="h-64">
            <Pie data={paymentMethodChartData} options={pieChartOptions} />
          </div>
        </div>

        {/* Payment Time Stats */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Payment Statistics</h2>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-600 dark:text-gray-400">Average Payment Time</span>
              <span className="text-lg font-semibold text-gray-900 dark:text-white">
                {stats.averagePaymentTime} days
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600 dark:text-gray-400">Paid Invoices</span>
              <span className="text-lg font-semibold text-gray-900 dark:text-white">
                {stats.statusDistribution['paid'] || 0}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600 dark:text-gray-400">Pending Invoices</span>
              <span className="text-lg font-semibold text-gray-900 dark:text-white">
                {stats.statusDistribution['pending'] || 0}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
