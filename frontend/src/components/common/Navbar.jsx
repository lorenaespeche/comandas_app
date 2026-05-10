import {
  AppBar, Toolbar, Typography, Button, Box, IconButton,
  Tooltip, Avatar, Drawer, List, ListItem, ListItemIcon,
  ListItemText, Divider,
} from '@mui/material';
import {
  Dashboard, People, Group, RestaurantMenu, Receipt,
  PointOfSale, Logout, Menu as MenuIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useState } from 'react';

const menuItems = [
  { label: 'Dashboard',    icon: <Dashboard />,      path: '/home' },
  { label: 'Funcionários', icon: <People />,          path: '/funcionarios' },
  { label: 'Clientes',     icon: <Group />,           path: '/clientes' },
  { label: 'Produtos',     icon: <RestaurantMenu />,  path: '/produtos' },
  { label: 'Comandas',     icon: <Receipt />,         path: '/comandas' },
  { label: 'Caixa',        icon: <PointOfSale />,     path: '/caixa' },
];

// Avatar com sua foto — arquivo: frontend/public/foto.jpeg
const FotoAvatar = ({ size = 36 }) => (
  <Avatar
    src="foto.jpeg"
    alt="Minha foto"
    sx={{
      width: size,
      height: size,
      border: '2px solid #f59e0b',
      bgcolor: '#f59e0b',
      fontSize: size * 0.4,
    }}
  >
    EU
  </Avatar>
);

const Navbar = () => {
  const navigate = useNavigate();
  const { isAuthenticated, logout } = useAuth();
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);

  const handleDrawerToggle = () => setMobileDrawerOpen(!mobileDrawerOpen);
  const handleLogout = () => { logout(); setMobileDrawerOpen(false); };

  const drawer = (
    <Box sx={{ textAlign: 'left', width: 250 }}>
      <Box
        sx={{
          p: 2,
          borderBottom: '1px solid rgba(0,0,0,0.12)',
          display: 'flex',
          alignItems: 'center',
          gap: 2,
          background: 'linear-gradient(135deg, #1e293b 0%, #334155 100%)',
        }}
      >
        <FotoAvatar size={48} />
        <Box>
          <Typography variant="body1" sx={{ color: 'white', fontWeight: 600 }}>
            Meu Perfil
          </Typography>
          <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)' }}>
            Comandas do Zé
          </Typography>
        </Box>
      </Box>

      <List>
        {menuItems.map((item) => (
          <ListItem
            key={item.path}
            onClick={() => { navigate(item.path); setMobileDrawerOpen(false); }}
            sx={{ '&:hover': { backgroundColor: 'rgba(30,41,59,0.08)' }, cursor: 'pointer' }}
          >
            <ListItemIcon sx={{ color: 'primary.main' }}>{item.icon}</ListItemIcon>
            <ListItemText primary={item.label} />
          </ListItem>
        ))}
        <Divider />
        <ListItem
          onClick={handleLogout}
          sx={{ '&:hover': { backgroundColor: 'rgba(239,68,68,0.08)' }, cursor: 'pointer' }}
        >
          <ListItemIcon sx={{ color: 'error.main' }}><Logout /></ListItemIcon>
          <ListItemText primary="Sair" sx={{ color: 'error.main' }} />
        </ListItem>
      </List>
    </Box>
  );

  return (
    <>
      <AppBar position="sticky" elevation={2}>
        <Toolbar sx={{ minHeight: 64, px: { xs: 1, sm: 2 } }}>

          {/* Logo */}
          <Typography
            variant="h5"
            component="div"
            sx={{
              fontWeight: 700,
              background: 'linear-gradient(135deg, #f59e0b 0%, #fbbf24 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              display: 'flex',
              alignItems: 'center',
              gap: 1,
              fontSize: { xs: '1.2rem', sm: '1.5rem' },
              flexGrow: 1,
            }}
          >
            <RestaurantMenu sx={{ color: '#f59e0b', fontSize: { xs: '1.2rem', sm: '2rem' } }} />
            <Box component="span" sx={{ display: { xs: 'none', sm: 'inline' } }}>Comandas do Zé</Box>
            <Box component="span" sx={{ display: { xs: 'inline', sm: 'none' } }}>Zé</Box>
          </Typography>

          {isAuthenticated && (
            <>
              {/* Desktop (sm e acima) */}
              <Box sx={{ display: { xs: 'none', sm: 'flex' }, alignItems: 'center', gap: 0.5 }}>
                {menuItems.map((item) => (
                  <Tooltip key={item.path} title={item.label} arrow>
                    <Button
                      color="inherit"
                      onClick={() => navigate(item.path)}
                      sx={{
                        minWidth: 'auto', px: 1.5, py: 1, borderRadius: 2,
                        alignItems: 'center', gap: 0.5,
                        '&:hover': { backgroundColor: 'rgba(255,255,255,0.1)' },
                      }}
                    >
                      {item.icon}
                      <Typography variant="body2" sx={{ ml: 0.5 }}>{item.label}</Typography>
                    </Button>
                  </Tooltip>
                ))}

                {/* Foto — Desktop */}
                <Tooltip title="Perfil" arrow>
                  <IconButton color="inherit" sx={{ ml: 1 }}>
                    <FotoAvatar size={36} />
                  </IconButton>
                </Tooltip>

                <Tooltip title="Sair" arrow>
                  <IconButton
                    color="inherit"
                    onClick={handleLogout}
                    sx={{ '&:hover': { backgroundColor: 'rgba(239,68,68,0.1)' } }}
                  >
                    <Logout />
                  </IconButton>
                </Tooltip>
              </Box>

              {/* Mobile (xs) */}
              <Box sx={{ display: { xs: 'flex', sm: 'none' }, alignItems: 'center', gap: 1 }}>
                {/* Foto — Mobile */}
                <Tooltip title="Perfil" arrow>
                  <IconButton color="inherit">
                    <FotoAvatar size={34} />
                  </IconButton>
                </Tooltip>

                <IconButton
                  color="inherit"
                  onClick={handleDrawerToggle}
                  sx={{ '&:hover': { backgroundColor: 'rgba(255,255,255,0.1)' } }}
                >
                  <MenuIcon />
                </IconButton>
              </Box>
            </>
          )}
        </Toolbar>
      </AppBar>

      {/* Drawer Mobile */}
      <Drawer
        variant="temporary"
        open={mobileDrawerOpen}
        onClose={handleDrawerToggle}
        ModalProps={{ keepMounted: true }}
        sx={{
          display: { xs: 'block', sm: 'none' },
          '& .MuiDrawer-paper': { boxSizing: 'border-box', width: 250 },
        }}
      >
        {drawer}
      </Drawer>
    </>
  );
};

export default Navbar;