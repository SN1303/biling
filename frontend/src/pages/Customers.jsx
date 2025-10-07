import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
  IconButton,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  MenuItem,
  CircularProgress,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { customers, packages } from '../api';

const statusColors = {
  active: 'success',
  inactive: 'error',
  suspended: 'warning',
};

export default function Customers() {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    phone_number: '',
    package_id: '',
    pppoe_username: '',
    pppoe_password: '',
    subscription_status: 'active',
  });

  const { data: customerList, isLoading: isLoadingCustomers } = useQuery(
    ['customers'],
    () => customers.getAll()
  );

  const { data: packageList } = useQuery(['packages'], () => packages.getAll());

  const handleOpen = () => {
    setFormData({
      name: '',
      address: '',
      phone_number: '',
      package_id: '',
      pppoe_username: '',
      pppoe_password: '',
      subscription_status: 'active',
    });
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await customers.create(formData);
      handleClose();
      // Refresh data
      window.location.reload();
    } catch (error) {
      console.error('Error creating customer:', error);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const filteredCustomers = (customerList?.data || []).filter((customer) =>
    customer.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h4">Customers</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleOpen}
        >
          Add Customer
        </Button>
      </Box>

      <TextField
        fullWidth
        label="Search Customers"
        variant="outlined"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        sx={{ mb: 3 }}
      />

      {isLoadingCustomers ? (
        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
          <CircularProgress />
        </Box>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Phone</TableCell>
                <TableCell>Package</TableCell>
                <TableCell>PPPoE Username</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredCustomers.map((customer) => (
                <TableRow key={customer.id}>
                  <TableCell>{customer.name}</TableCell>
                  <TableCell>{customer.phone_number}</TableCell>
                  <TableCell>{customer.package?.name}</TableCell>
                  <TableCell>{customer.pppoe_username}</TableCell>
                  <TableCell>
                    <Chip
                      label={customer.subscription_status}
                      color={statusColors[customer.subscription_status]}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <IconButton
                      size="small"
                      onClick={() => navigate(`/customers/${customer.id}`)}
                    >
                      <EditIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Add Customer Dialog */}
      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>Add New Customer</DialogTitle>
        <form onSubmit={handleSubmit}>
          <DialogContent>
            <TextField
              fullWidth
              label="Name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label="Address"
              name="address"
              value={formData.address}
              onChange={handleChange}
              required
              multiline
              rows={3}
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label="Phone Number"
              name="phone_number"
              value={formData.phone_number}
              onChange={handleChange}
              required
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              select
              label="Package"
              name="package_id"
              value={formData.package_id}
              onChange={handleChange}
              required
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
              label="PPPoE Username"
              name="pppoe_username"
              value={formData.pppoe_username}
              onChange={handleChange}
              required
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label="PPPoE Password"
              name="pppoe_password"
              value={formData.pppoe_password}
              onChange={handleChange}
              required
              sx={{ mb: 2 }}
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