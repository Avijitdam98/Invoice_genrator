const Invoice = require('../models/Invoice');

// Get analytics data
exports.getAnalytics = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    const dateFilter = {};
    
    if (startDate && endDate) {
      dateFilter.createdAt = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    }

    // Get revenue statistics
    const revenueStats = await Invoice.aggregate([
      { 
        $match: { 
          ...dateFilter,
          status: 'Paid'
        }
      },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: '$total' },
          averageRevenue: { $avg: '$total' },
          maxInvoice: { $max: '$total' },
          minInvoice: { $min: '$total' }
        }
      }
    ]);

    // Get invoice status distribution
    const statusDistribution = await Invoice.aggregate([
      { $match: dateFilter },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
          totalAmount: { $sum: '$total' }
        }
      }
    ]);

    // Get monthly revenue trend
    const monthlyRevenue = await Invoice.aggregate([
      {
        $match: {
          status: 'Paid',
          createdAt: { $gte: new Date(new Date().setMonth(new Date().getMonth() - 12)) }
        }
      },
      {
        $group: {
          _id: { 
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' }
          },
          revenue: { $sum: '$total' },
          count: { $sum: 1 }
        }
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } }
    ]);

    // Get top clients
    const topClients = await Invoice.aggregate([
      { $match: dateFilter },
      {
        $group: {
          _id: '$clientName',
          totalRevenue: { $sum: '$total' },
          invoiceCount: { $sum: 1 },
          averageInvoice: { $avg: '$total' }
        }
      },
      { $sort: { totalRevenue: -1 } },
      { $limit: 5 }
    ]);

    // Get recent activity with more details
    const recentActivity = await Invoice.find(dateFilter)
      .sort({ createdAt: -1 })
      .limit(10)
      .select('clientName total status createdAt dueDate items');

    // Calculate payment trends
    const paymentTrends = await Invoice.aggregate([
      { $match: { status: 'Paid', ...dateFilter } },
      {
        $project: {
          daysToPay: {
            $divide: [
              { $subtract: ['$paidAt', '$createdAt'] },
              1000 * 60 * 60 * 24 // Convert to days
            ]
          },
          total: 1
        }
      },
      {
        $group: {
          _id: null,
          averagePaymentTime: { $avg: '$daysToPay' },
          totalPaidAmount: { $sum: '$total' }
        }
      }
    ]);

    // Format the response
    res.json({
      overview: {
        totalRevenue: revenueStats[0]?.totalRevenue || 0,
        averageRevenue: revenueStats[0]?.averageRevenue || 0,
        maxInvoice: revenueStats[0]?.maxInvoice || 0,
        minInvoice: revenueStats[0]?.minInvoice || 0
      },
      statusDistribution,
      monthlyRevenue: monthlyRevenue.map(month => ({
        year: month._id.year,
        month: month._id.month,
        revenue: month.revenue,
        count: month.count
      })),
      topClients,
      recentActivity,
      paymentMetrics: {
        averagePaymentTime: paymentTrends[0]?.averagePaymentTime || 0,
        totalPaidAmount: paymentTrends[0]?.totalPaidAmount || 0
      }
    });
  } catch (error) {
    console.error('Analytics Error:', error);
    res.status(500).json({ 
      message: 'Error fetching analytics data',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};
