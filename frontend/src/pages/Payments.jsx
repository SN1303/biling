import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Typography,
  CircularProgress,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
} from '@mui/material';
import { payments, customers } from '../api';

const statusColors = {
  paid: 'success',
  unpaid: 'error',
  partial: 'warning',
};

export default function Payments() {
  const [open, setOpen] = useState(false);
  const [paymentData, setPaymentData] = useState({
    customer_id: '',
    amount: '',
    payment_date: new Date().toISOString().split('T')[0],
    period_start: '',
    period_end: '',
    status: 'paid',
    notes: '',
  });

  const { data: paymentList, isLoading: isLoadingPayments } = useQuery(
    ['payments'],
    () => payments.getAll()
  );

  const { data: customerList } = useQuery(['customers'], () =>
    customers.getAll()
  );

  const handleOpen = () => {
    setPaymentData({
      customer_id: '',
      amount: '',
      payment_date: new Date().toISOString().split('T')[0],
      period_start: '',
      period_end: '',
      status: 'paid',
      notes: '',
    });
    setOpen(true);
  };

  const handleClose = () => setOpen(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await payments.create(paymentData);
      handleClose();
      window.location.reload();
    } catch (error) {
      console.error('Error creating payment:', error);
    }
  };

  const handleChange = (e) => {
    setPaymentData({ ...paymentData, [e.target.name]: e.target.value });
  };

  if (isLoadingPayments) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h4">Payments</Typography>
        <Button variant="contained" onClick={handleOpen}>
          Add Payment
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Customer</TableCell>
              <TableCell>Amount</TableCell>
              <TableCell>Payment Date</TableCell>
              <TableCell>Period</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Notes</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {(paymentList?.data || []).map((payment) => (
              <TableRow key={payment.id}>
                <TableCell>{payment.customer?.name}</TableCell>
                <TableCell>Rp {Number(payment.amount).toLocaleString()}</TableCell>
                <TableCell>
                  {new Date(payment.payment_date).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  {new Date(payment.period_start).toLocaleDateString()} -{' '}
                  {new Date(payment.period_end).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  <Chip
                    label={payment.status}
                    color={statusColors[payment.status]}
                    size="small"
                  />
                </TableCell>
                <TableCell>{payment.notes}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>Add Payment</DialogTitle>
        <form onSubmit={handleSubmit}>
          <DialogContent>
            <TextField
              fullWidth
              select
              label="Customer"
              name="customer_id"
              value={paymentData.customer_id}
              onChange={handleChange}
              required
              sx={{ mb: 2 }}
            >
              {(customerList?.data || []).map((customer) => (
                <MenuItem key={customer.id} value={customer.id}>
                  {customer.name}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              fullWidth
              label="Amount"
              name="amount"
              type="number"
              value={paymentData.amount}
              onChange={handleChange}
              required
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label="Payment Date"
              name="payment_date"
              type="date"
              value={paymentData.payment_date}
              onChange={handleChange}
              required
              sx={{ mb: 2 }}
              InputLabelProps={{ shrink: true }}
            />
            <TextField
              fullWidth
              label="Period Start"
              name="period_start"
              type="date"
              value={paymentData.period_start}
              onChange={handleChange}
              required
              sx={{ mb: 2 }}
              InputLabelProps={{ shrink: true }}
            />
            <TextField
              fullWidth
              label="Period End"
              name="period_end"
              type="date"
              value={paymentData.period_end}
              onChange={handleChange}
              required
              sx={{ mb: 2 }}
              InputLabelProps={{ shrink: true }}
            />
            <TextField
              fullWidth
              select
              label="Status"
              name="status"
              value={paymentData.status}
              onChange={handleChange}
              required
              sx={{ mb: 2 }}
            >
              <MenuItem value="paid">Paid</MenuItem>
              <MenuItem value="unpaid">Unpaid</MenuItem>
              <MenuItem value="partial">Partial</MenuItem>
            </TextField>
            <TextField
              fullWidth
              label="Notes"
              name="notes"
              multiline
              rows={3}
              value={paymentData.notes}
              onChange={handleChange}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Cancel</Button>
            <Button type="submit" variant="contained">
              Save
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Box>
  );
}