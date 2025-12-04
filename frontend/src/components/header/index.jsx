import { AppBar, Toolbar, Stack, IconButton, Button, Box, InputBase, alpha, Divider, Avatar, Typography } from '@mui/material'
import HomeRoundedIcon from '@mui/icons-material/HomeRounded'
import SearchIcon from '@mui/icons-material/Search'
import NotificationsIcon from '@mui/icons-material/Notifications'
import AccountCircleIcon from '@mui/icons-material/AccountCircle'
import { useNavigate, Link } from 'react-router-dom'
import { useState } from 'react';
import { getCookie, deleteCookie } from '../../helpers/cookies.helper';

const Header = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const token = getCookie('token');
  const fullName = getCookie('fullName');

  const handleProfileClick = () => {
    navigate('/profile');
  };


  // Hàm xử lý khi form tìm kiếm được submit (nhấn Enter hoặc bấm nút)
  const handleSearch = (e) => {
    e.preventDefault(); // Ngăn chặn trình duyệt reload trang

    if (searchTerm.trim()) {
      // Chuyển hướng đến /search và truyền từ khóa qua query parameter (?q=...)
      navigate(`/search?keyword=${searchTerm.trim()}`);
      console.log("Searching for:", `/search?keyword=${searchTerm.trim()}`);

    } else {
      // Nếu không nhập gì, chuyển hướng về trang /search
      navigate('/search');
    }
    // Tùy chọn: clear input sau khi tìm kiếm
    // setSearchTerm(''); 
  };
  return (
    <AppBar position="static" elevation={0} sx={{ bgcolor: 'primary.main' }}>
      <Toolbar sx={{ minHeight: 68, gap: 3 }}>
        {/* Left logo */}
        <Box
          component={Link}
          to="/"
          sx={{
            fontWeight: 800,
            fontSize: 22,
            letterSpacing: 1,
            px: 1,
            textDecoration: 'none',
            color: 'inherit'
          }}
        >
          LOGO
        </Box>

        {/* Divider space between logo and nav */}
        <Divider orientation="vertical" flexItem sx={{ borderColor: alpha('#fff', 0.3) }} />

        {/* Navigation group */}
        <Stack direction="row" spacing={3} alignItems="center" sx={{ mr: 2 }}>
          <IconButton
            component={Link}
            to="/"
            color="inherit"
            size="small"
            aria-label="Trang chủ"
            sx={{ bgcolor: alpha('#fff', 0.12), '&:hover': { bgcolor: alpha('#fff', 0.25) } }}
          >
            <HomeRoundedIcon fontSize="small" />
          </IconButton>
          <Button component={Link} to="/ranking" color="inherit" size="small" sx={{ fontWeight: 600 }}>Ranking</Button>
          <Button component={Link} to="/schedule" color="inherit" size="small" sx={{ fontWeight: 600 }}>Lịch trình</Button>
        </Stack>

        {/* Center search box grows */}
        <Box sx={{ flexGrow: 1, display: 'flex', justifyContent: 'center' }}>
          <Box
            component="form"
            onSubmit={handleSearch}
            sx={(theme) => ({
              display: 'flex',
              alignItems: 'center',
              gap: 1,
              width: '100%',
              maxWidth: 520,
              px: 1.5,
              py: 0.75,
              borderRadius: 50,
              backgroundColor: alpha('#fff', 0.2),
              border: '1px solid ' + alpha('#fff', 0.35),
              transition: 'background-color .2s, box-shadow .2s',
              '&:hover': { backgroundColor: alpha('#fff', 0.3) },
              boxShadow: 'inset 0 0 0 1px ' + alpha('#000', 0.05)
            })}
          >
            <SearchIcon fontSize="small" />
            <InputBase
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Tìm kiếm..."
              inputProps={{ 'aria-label': 'search' }}
              sx={{ flex: 1, fontSize: 14 }}
            />
          </Box>
        </Box>

        {/* Auth buttons or User Menu */}
        {token ? (
          <Stack direction="row" spacing={0.5} alignItems="center">

            {/* User Profile Box - Avatar + Name */}
            <Box
              onClick={handleProfileClick}
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1,
                px: 1.5,
                py: 0.75,
                cursor: 'pointer',
              }}
            >
              <Typography
                variant="body2"
                sx={{
                  fontWeight: 600,
                  color: 'white',
                  fontSize: 14
                }}
              >
                {fullName || 'User'}
              </Typography>
              <IconButton
                size="small"
                sx={{
                  bgcolor: alpha('#fff', 0.12),
                  '&:hover': { bgcolor: alpha('#fff', 0.25) },
                  p: 0.5
                }}
              >
                <AccountCircleIcon sx={{ color: 'white', fontSize: 28 }} />
              </IconButton>
            </Box>
            {/* Notification Icon */}
            <IconButton
              color="inherit"
              size="small"
              sx={{
                bgcolor: alpha('#fff', 0.12),
                '&:hover': { bgcolor: alpha('#fff', 0.25) }
              }}
            >
              <NotificationsIcon fontSize="small" />
            </IconButton>
          </Stack>
        ) : (
          <Stack direction="row" spacing={1.5} alignItems="center">
            <Button
              component={Link}
              to="/login"
              size="small"
              variant="outlined"
              color="inherit"
              sx={{
                px: 2,
                borderRadius: 8,
                textTransform: 'none',
                fontWeight: 600,
                borderColor: alpha('#fff', 0.6),
                '&:hover': { borderColor: '#fff', backgroundColor: alpha('#fff', 0.15) }
              }}
            >
              Đăng nhập
            </Button>
            <Button
              size="small"
              variant="contained"
              component={Link}
              to="/register"
              sx={{
                px: 2,
                borderRadius: 8,
                textTransform: 'none',
                fontWeight: 600,
                background: 'linear-gradient(135deg,#ab47bc,#7e57c2)',
                boxShadow: 'none',
                '&:hover': { boxShadow: 'none', background: 'linear-gradient(135deg,#9c27b0,#673ab7)' }
              }}
            >
              Đăng ký
            </Button>
          </Stack>
        )}
      </Toolbar>
    </AppBar>
  )
}

export default Header
