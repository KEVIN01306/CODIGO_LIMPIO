import { Outlet } from 'react-router-dom';
import { Box } from '@mui/material';

const BlankLayout = () => {
  return (
    <Box sx={{ minHeight: "100vh", display: "flex", flexDirection: "column", bgcolor: "background.default" }}>
      <Outlet />
    </Box>
  );
};

export default BlankLayout;
