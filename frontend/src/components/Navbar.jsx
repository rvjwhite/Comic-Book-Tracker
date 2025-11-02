import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Menu,
  MenuItem,
  Box,
  Chip,
} from '@mui/material';
import {
  Menu as MenuIcon,
  AccountBalanceWallet,
  Person,
} from '@mui/icons-material';
import { logout } from '../store/slices/authSlice';
import { connectWallet, disconnectWallet } from '../store/slices/web3Slice';

function Navbar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const { account, isConnected } = useSelector((state) => state.web3);
  const [anchorEl, setAnchorEl] = useState(null);

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    dispatch(logout());
    dispatch(disconnectWallet());
    navigate('/login');
    handleClose();
  };

  const handleConnectWallet = () => {
    if (isConnected) {
      dispatch(disconnectWallet());
    } else {
      dispatch(connectWallet());
    }
  };

  const shortenAddress = (address) => {
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
  };

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" component={Link} to="/" sx={{ flexGrow: 1, textDecoration: 'none', color: 'inherit' }}>
          Comic Book Tracker
        </Typography>

        {user && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Button color="inherit" component={Link} to="/dashboard">
              Dashboard
            </Button>
            <Button color="inherit" component={Link} to="/collection">
              Collection
            </Button>
            <Button color="inherit" component={Link} to="/add">
              Add Comic
            </Button>

            <Button
              color="inherit"
              startIcon={<AccountBalanceWallet />}
              onClick={handleConnectWallet}
            >
              {isConnected ? shortenAddress(account) : 'Connect Wallet'}
            </Button>

            <IconButton
              size="large"
              onClick={handleMenu}
              color="inherit"
            >
              <Person />
            </IconButton>
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleClose}
            >
              <MenuItem disabled>
                <Typography variant="body2">{user.username}</Typography>
              </MenuItem>
              <MenuItem onClick={handleLogout}>Logout</MenuItem>
            </Menu>
          </Box>
        )}
      </Toolbar>
    </AppBar>
  );
}

export default Navbar;
