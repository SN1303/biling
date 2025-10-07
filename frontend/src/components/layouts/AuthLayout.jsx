import { Outlet } from 'react-router-dom';
import { Box, Container } from '@mui/material';

export default function AuthLayout() {
  return (
    <Box
      sx={{
        display: 'flex',
        minHeight: '100vh',
        bgcolor: 'background.default',
      }}
    >
      <Container>
        <Outlet />
      </Container>
    </Box>
  );
}