import React, { useState, useEffect } from 'react';
import { Line, Bar } from 'react-chartjs-2';
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
  Filler
} from 'chart.js';

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
  const [analyticsData, setAnalyticsData] = useState({
    totalRevenue: 0,
    monthlyRevenue: [],
    paymentMetrics: {
      totalPaid: 0,
      totalPending: 0,
      totalOverdue: 0,
      averagePaymentTime: 0
    },
    yearlyComparison: [],
    recentPayments: []
  });

  useEffect(() => {
    fetchAnalyticsData();
  }, []);

  const fetchAnalyticsData = async () => {
    try {
      const response = await invoiceApi.getAllInvoices();
      const invoices = response.data;
      
      // Process analytics data
      const processedData = processInvoiceData(invoices);
      setAnalyticsData(processedData);
    } catch (error) {
      console.error('Error fetching analytics data:', error);
    }
  };

  const processInvoiceData = (invoices) => {
    const now = new Date();
    const currentYear = now.getFullYear();

    // Initialize data structure
    const data = {
      totalRevenue: 0,
      monthlyRevenue: [],
      paymentMetrics: {
        totalPaid: 0,
        totalPending: 0,
        totalOverdue: 0,
        averagePaymentTime: 0
      },
      yearlyComparison: [],
      recentPayments: []
    };

    // Calculate monthly revenue for current year
    const monthlyData = new Array(12).fill(0);
    const previousYearData = new Array(12).fill(0);

    invoices.forEach(invoice => {
      const amount = invoice.total || invoice.totalAmount || 0;
      const date = new Date(invoice.createdAt || invoice.date);
      const invoiceYear = date.getFullYear();
      const month = date.getMonth();

      // Total revenue
      data.totalRevenue += amount;

      // Monthly revenue
      if (invoiceYear === currentYear) {
        monthlyData[month] += amount;
      } else if (invoiceYear === currentYear - 1) {
        previousYearData[month] += amount;
      }

      // Payment metrics
      if (invoice.status === 'paid') {
        data.paymentMetrics.totalPaid += amount;
        if (invoice.paidAt) {
          const paymentDate = new Date(invoice.paidAt);
          const paymentTime = Math.floor((paymentDate - date) / (1000 * 60 * 60 * 24));
          data.paymentMetrics.averagePaymentTime += paymentTime;
        }
      } else if (invoice.status === 'pending') {
        data.paymentMetrics.totalPending += amount;
        const daysOverdue = Math.floor((now - date) / (1000 * 60 * 60 * 24));
        if (daysOverdue > 30) {
          data.paymentMetrics.totalOverdue += amount;
        }
      }

      // Recent payments
      if (invoice.status === 'paid' && invoice.paidAt) {
        data.recentPayments.push({
          id: invoice._id,
          amount,
          date: new Date(invoice.paidAt),
          clientName: invoice.clientName
        });
      }
    });

    // Format monthly revenue data
    data.monthlyRevenue = monthlyData.map((amount, index) => ({
      month: new Date(currentYear, index).toLocaleString('default', { month: 'short' }),
      amount,
      previousYear: previousYearData[index]
    }));

    // Calculate average payment time
    const paidInvoices = invoices.filter(inv => inv.status === 'paid' && inv.paidAt);
    if (paidInvoices.length > 0) {
      data.paymentMetrics.averagePaymentTime = Math.round(
        data.paymentMetrics.averagePaymentTime / paidInvoices.length
      );
    }

    // Sort recent payments by date
    data.recentPayments.sort((a, b) => b.date - a.date).slice(0, 5);

    return data;
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  const revenueChartData = {
    labels: analyticsData.monthlyRevenue.map(item => item.month),
    datasets: [
      {
        label: 'Current Year',
        data: analyticsData.monthlyRevenue.map(item => item.amount),
        borderColor: 'rgb(99, 102, 241)',
        backgroundColor: 'rgba(99, 102, 241, 0.1)',
        fill: true,
        tension: 0.4
      },
      {
        label: 'Previous Year',
        data: analyticsData.monthlyRevenue.map(item => item.previousYear),
        borderColor: 'rgb(148, 163, 184)',
        backgroundColor: 'rgba(148, 163, 184, 0.1)',
        fill: true,
        tension: 0.4
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            return formatCurrency(context.raw);
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: function(value) {
            return formatCurrency(value);
          }
        }
      }
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Revenue Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">Total Revenue</h3>
          <p className="text-3xl font-bold text-indigo-600 dark:text-indigo-400">
            {formatCurrency(analyticsData.totalRevenue)}
          </p>
          <p className="text-sm text-gray-500 mt-2">All time revenue</p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">Payment Status</h3>
          <div className="space-y-3">
            <div>
              <p className="text-sm text-gray-500">Paid</p>
              <p className="text-xl font-semibold text-green-600">
                {formatCurrency(analyticsData.paymentMetrics.totalPaid)}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Pending</p>
              <p className="text-xl font-semibold text-yellow-600">
                {formatCurrency(analyticsData.paymentMetrics.totalPending)}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Overdue</p>
              <p className="text-xl font-semibold text-red-600">
                {formatCurrency(analyticsData.paymentMetrics.totalOverdue)}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">Payment Metrics</h3>
          <div className="space-y-3">
            <div>
              <p className="text-sm text-gray-500">Average Payment Time</p>
              <p className="text-xl font-semibold text-gray-900 dark:text-white">
                {analyticsData.paymentMetrics.averagePaymentTime} days
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Collection Rate</p>
              <p className="text-xl font-semibold text-indigo-600">
                {analyticsData.totalRevenue > 0
                  ? `${Math.round((analyticsData.paymentMetrics.totalPaid / analyticsData.totalRevenue) * 100)}%`
                  : '0%'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Revenue Chart */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mb-8">
        <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Revenue Comparison</h3>
        <div className="h-96">
          <Line data={revenueChartData} options={chartOptions} />
        </div>
      </div>

      {/* Recent Payments */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Recent Payments</h3>
        <div className="space-y-4">
          {analyticsData.recentPayments.map(payment => (
            <div key={payment.id} className="flex justify-between items-center border-b dark:border-gray-700 pb-4">
              <div>
                <p className="font-medium text-gray-900 dark:text-white">{payment.clientName}</p>
                <p className="text-sm text-gray-500">{payment.date.toLocaleDateString()}</p>
              </div>
              <p className="font-medium text-green-600">{formatCurrency(payment.amount)}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Analytics;
