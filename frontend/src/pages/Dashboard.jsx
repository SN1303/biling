import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  Box,
  Card,
  CardContent,
  Grid,
  Typography,
  CircularProgress,
} from '@mui/material';
import { customers, payments } from '../api';

// Stat Card Component
const StatCard = ({ title, value, loading }) => (
  <Card>
    <CardContent>
      <Typography color="textSecondary" gutterBottom>
        {title}
      </Typography>
      {loading ? (
        <CircularProgress size={20} />
      ) : (
        <Typography variant="h5">{value}</Typography>
      )}
    </CardContent>
  </Card>
);

export default function Dashboard() {
  const { data: dashboardData, isLoading: isDashboardLoading } = useQuery(
    ['dashboard'],
    () => customers.dashboard()
  );

  const { data: monthlyReport, isLoading: isReportLoading } = useQuery(
    ['monthlyReport'],
    () => payments.monthlyReport()
  );

  const stats = dashboardData?.data || {};
  const report = monthlyReport?.data || {};

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Dashboard
      </Typography>

      <Grid container spacing={3}>
        {/* Pelanggan Aktif */}
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Pelanggan Aktif"
            value={stats.total_active || 0}
            loading={isDashboardLoading}
          />
        </Grid>

        {/* Pelanggan Non-Aktif */}
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Pelanggan Non-Aktif"
            value={stats.total_inactive || 0}
            loading={isDashboardLoading}
          />
        </Grid>

        {/* Pendapatan Bulan Ini */}
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Pendapatan Bulan Ini"
            value={`Rp ${Number(report.paid?.total || 0).toLocaleString()}`}
            loading={isReportLoading}
          />
        </Grid>

        {/* Belum Bayar */}
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Belum Bayar"
            value={stats.unpaid_customers || 0}
            loading={isDashboardLoading}
          />
        </Grid>
      </Grid>
    </Box>
  );
}