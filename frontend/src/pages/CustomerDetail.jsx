import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import {
  Box,
  Paper,
  Tab,
  Tabs,
  TextField,
  Button,
  Typography,
  Grid,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  MenuItem,
} from '@mui/material';
import { customers, packages, payments, notes } from '../api';

function TabPanel({ children, value, index }) {
  return value === index && <Box sx={{ py: 3 }}>{children}</Box>;
}

export default function CustomerDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState(0);
  const [paymentDialog, setPaymentDialog] = useState(false);
  const [noteDialog, setNoteDialog] = useState(false);
  const [editMode, setEditMode] = useState(false);

  // Fetch customer data
  const { data: customerData, isLoading } = useQuery(['customer', id], () =>
    customers.get(id)
  );

  // Fetch packages for dropdown
  const { data: packageList } = useQuery(['packages'], () => packages.getAll());

  const [formData, setFormData] = useState({
    name: customerData?.data?.name || '',
    address: customerData?.data?.address || '',
    phone_number: customerData?.data?.phone_number || '',
    package_id: customerData?.data?.package_id || '',
    subscription_status: customerData?.data?.subscription_status || '',
    pppoe_username: customerData?.data?.pppoe_username || '',
    pppoe_password: customerData?.data?.pppoe_password || '',
  });

  const [paymentData, setPaymentData] = useState({
    amount: '',
    payment_date: new Date().toISOString().split('T')[0],
    period_start: '',
    period_end: '',
    status: 'paid',
    notes: '',
  });

  const [noteData, setNoteData] = useState({
    note: '',
    is_technical: false,
    is_sent_notification: false,
  });

  // Handle form changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle save
  const handleSave = async () => {
    try {
      await customers.update(id, formData);
      setEditMode(false);
      window.location.reload();
    } catch (error) {
      console.error('Error updating customer:', error);
    }
  };

  // Handle payment submission
  const handlePaymentSubmit = async () => {
    try {
      await payments.create({
        ...paymentData,
        customer_id: id,
      });
      setPaymentDialog(false);
      window.location.reload();
    } catch (error) {
      console.error('Error creating payment:', error);
    }
  };

  // Handle note submission
  const handleNoteSubmit = async () => {
    try {
      await notes.create({
        ...noteData,
        customer_id: id,
      });
      setNoteDialog(false);
      window.location.reload();
    } catch (error) {
      console.error('Error creating note:', error);
    }
  };

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  const customer = customerData?.data;

  return (
    <Box>
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between' }}>
        <Typography variant="h4">Customer Details</Typography>
        <Box>
          {editMode ? (
            <>
              <Button onClick={() => setEditMode(false)} sx={{ mr: 1 }}>
                Cancel
              </Button>
              <Button variant="contained" onClick={handleSave}>
                Save Changes
              </Button>
            </>
          ) : (
            <Button variant="contained" onClick={() => setEditMode(true)}>
              Edit Customer
            </Button>
          )}
        </Box>
      </Box>

      <Paper sx={{ mb: 3 }}>
        <Tabs value={activeTab} onChange={(e, v) => setActiveTab(v)}>
          <Tab label="Details" />
          <Tab label="Payments" />
          <Tab label="Notes" />
        </Tabs>

        <TabPanel value={activeTab} index={0}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Name"
                name="name"
                value={editMode ? formData.name : customer.name}
                onChange={handleChange}
                disabled={!editMode}
                sx={{ mb: 2 }}
              />
              <TextField
                fullWidth
                label="Address"
                name="address"
                value={editMode ? formData.address : customer.address}
                onChange={handleChange}
                disabled={!editMode}
                multiline
                rows={3}
                sx={{ mb: 2 }}
              />
              <TextField
                fullWidth
                label="Phone Number"
                name="phone_number"
                value={editMode ? formData.phone_number : customer.phone_number}
                onChange={handleChange}
                disabled={!editMode}
                sx={{ mb: 2 }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                select
                label="Package"
                name="package_id"
                value={editMode ? formData.package_id : customer.package_id}
                onChange={handleChange}
                disabled={!editMode}
                sx={{ mb: 2 }}
              >
                {(packageList?.data || []).map((pkg) => (
                  <MenuItem key={pkg.id} value={pkg.id}>
                    {pkg.name} - Rp {pkg.price}
                  </MenuItem>
                ))}
              </TextField>
              <TextField
                fullWidth
                select
                label="Status"
                name="subscription_status"
                value={
                  editMode
                    ? formData.subscription_status
                    : customer.subscription_status
                }
                onChange={handleChange}
                disabled={!editMode}
                sx={{ mb: 2 }}
              >
                <MenuItem value="active">Active</MenuItem>
                <MenuItem value="inactive">Inactive</MenuItem>
                <MenuItem value="suspended">Suspended</MenuItem>
              </TextField>
              <TextField
                fullWidth
                label="PPPoE Username"
                name="pppoe_username"
                value={editMode ? formData.pppoe_username : customer.pppoe_username}
                onChange={handleChange}
                disabled={!editMode}
                sx={{ mb: 2 }}
              />
              <TextField
                fullWidth
                label="PPPoE Password"
                name="pppoe_password"
                value={editMode ? formData.pppoe_password : customer.pppoe_password}
                onChange={handleChange}
                disabled={!editMode}
                sx={{ mb: 2 }}
              />
            </Grid>
          </Grid>
        </TabPanel>

        <TabPanel value={activeTab} index={1}>
          <Box sx={{ mb: 2 }}>
            <Button
              variant="contained"
              onClick={() => setPaymentDialog(true)}
            >
              Add Payment
            </Button>
          </Box>
          {/* Payment history table would go here */}
        </TabPanel>

        <TabPanel value={activeTab} index={2}>
          <Box sx={{ mb: 2 }}>
            <Button
              variant="contained"
              onClick={() => setNoteDialog(true)}
            >
              Add Note
            </Button>
          </Box>
          {/* Notes list would go here */}
        </TabPanel>
      </Paper>

      {/* Payment Dialog */}
      <Dialog
        open={paymentDialog}
        onClose={() => setPaymentDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Add Payment</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Amount"
            type="number"
            value={paymentData.amount}
            onChange={(e) =>
              setPaymentData({ ...paymentData, amount: e.target.value })
            }
            sx={{ mt: 2, mb: 2 }}
          />
          <TextField
            fullWidth
            label="Payment Date"
            type="date"
            value={paymentData.payment_date}
            onChange={(e) =>
              setPaymentData({ ...paymentData, payment_date: e.target.value })
            }
            sx={{ mb: 2 }}
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            fullWidth
            label="Period Start"
            type="date"
            value={paymentData.period_start}
            onChange={(e) =>
              setPaymentData({ ...paymentData, period_start: e.target.value })
            }
            sx={{ mb: 2 }}
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            fullWidth
            label="Period End"
            type="date"
            value={paymentData.period_end}
            onChange={(e) =>
              setPaymentData({ ...paymentData, period_end: e.target.value })
            }
            sx={{ mb: 2 }}
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            fullWidth
            select
            label="Status"
            value={paymentData.status}
            onChange={(e) =>
              setPaymentData({ ...paymentData, status: e.target.value })
            }
            sx={{ mb: 2 }}
          >
            <MenuItem value="paid">Paid</MenuItem>
            <MenuItem value="unpaid">Unpaid</MenuItem>
            <MenuItem value="partial">Partial</MenuItem>
          </TextField>
          <TextField
            fullWidth
            label="Notes"
            multiline
            rows={3}
            value={paymentData.notes}
            onChange={(e) =>
              setPaymentData({ ...paymentData, notes: e.target.value })
            }
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setPaymentDialog(false)}>Cancel</Button>
          <Button onClick={handlePaymentSubmit} variant="contained">
            Save
          </Button>
        </DialogActions>
      </Dialog>

      {/* Note Dialog */}
      <Dialog
        open={noteDialog}
        onClose={() => setNoteDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Add Note</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Note"
            multiline
            rows={4}
            value={noteData.note}
            onChange={(e) => setNoteData({ ...noteData, note: e.target.value })}
            sx={{ mt: 2 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setNoteDialog(false)}>Cancel</Button>
          <Button onClick={handleNoteSubmit} variant="contained">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}