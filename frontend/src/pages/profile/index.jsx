import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Avatar,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Card,
  CardContent,
  CardMedia,
  IconButton,
  Button,
  Rating,
  Grid,
  Divider
} from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import EventIcon from '@mui/icons-material/Event';
import LogoutIcon from '@mui/icons-material/Logout';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { getCookie, deleteCookie } from '../../helpers/cookies.helper';

function Profile() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('favorites'); // 'favorites' or 'plans'
  const fullName = getCookie('fullName');
  const token = getCookie('token');

  // Mock data - thay thế bằng API call thực tế
  const [favoriteSpots, setFavoriteSpots] = useState([
    {
      id: 1,
      name: 'スポットの名前',
      address: '東京',
      rating: 4,
      image: '/placeholder.jpg',
      reviews: '30件の口コミ'
    },
    {
      id: 2,
      name: 'スポットの名前',
      address: '東京',
      rating: 5,
      image: '/placeholder.jpg',
      reviews: '30件の口コミ'
    },
    {
      id: 3,
      name: 'スポットの名前',
      address: '東京',
      rating: 3,
      image: '/placeholder.jpg',
      reviews: '30件の口コミ'
    },
    {
      id: 4,
      name: 'スポットの名前',
      address: '東京',
      rating: 4,
      image: '/placeholder.jpg',
      reviews: '30件の口コミ'
    },
    {
      id: 5,
      name: 'スポットの名前',
      address: '東京',
      rating: 5,
      image: '/placeholder.jpg',
      reviews: '30件の口コミ'
    },
    {
      id: 6,
      name: 'スポットの名前',
      address: '東京',
      rating: 4,
      image: '/placeholder.jpg',
      reviews: '30件の口コミ'
    }
  ]);

  const [favoritePlans, setFavoritePlans] = useState([
    {
      id: 1,
      name: 'スポットの名前',
      address: '東京',
      rating: 4,
      image: '/placeholder.jpg',
      reviews: '30件の口コミ'
    },
    {
      id: 2,
      name: 'スポットの名前',
      address: '東京',
      rating: 5,
      image: '/placeholder.jpg',
      reviews: '30件の口コミ'
    }
  ]);

  useEffect(() => {
    // Kiểm tra đăng nhập
    if (!token) {
      navigate('/login');
    }
  }, [token, navigate]);

  const handleLogout = () => {
    deleteCookie('token');
    deleteCookie('fullName');
    deleteCookie('user');
    navigate('/login');
  };

  const handleUnfavorite = (id, type) => {
    if (type === 'spot') {
      setFavoriteSpots(favoriteSpots.filter(spot => spot.id !== id));
    } else {
      setFavoritePlans(favoritePlans.filter(plan => plan.id !== id));
    }
  };

  const handleViewDetail = (id, type) => {
    if (type === 'spot') {
      navigate(`/places/${id}`);
    } else {
      navigate(`/schedule/${id}`);
    }
  };

  return (
    <>
      <Box sx={{ bgcolor: '#f5f5f5', minHeight: '100vh', py: 2 }}>
        <Container maxWidth="xl">
          <Grid container spacing={3}>
            {/* Left Sidebar - 3 parts */}
            <Grid item xs={12} md={3}>
              <Card sx={{ p: 3, position: 'sticky', top: 20 }}>
                {/* Profile Section */}
                <Box sx={{ textAlign: 'center', mb: 3 }}>
                  <Avatar
                    sx={{
                      width: 80,
                      height: 80,
                      mx: 'auto',
                      mb: 2,
                      bgcolor: 'primary.main'
                    }}
                  >
                    <AccountCircleIcon sx={{ fontSize: 60 }} />
                  </Avatar>
                  <Typography variant="h6" fontWeight={600}>
                    {fullName || 'User'}
                  </Typography>
                </Box>

                <Divider sx={{ my: 2 }} />

                {/* Menu List */}
                <List sx={{ flex:1}}>
                  <ListItem
                    button
                    selected={activeTab === 'favorites'}
                    onClick={() => setActiveTab('favorites')}
                    sx={{
                      borderRadius: 1,
                      mb: 1,
                      '&.Mui-selected': {
                        bgcolor: 'primary.light',
                        '&:hover': { bgcolor: 'primary.light' }
                      }
                    }}
                  >
                    <ListItemIcon>
                      <FavoriteIcon color={activeTab === 'favorites' ? 'primary' : 'action'} />
                    </ListItemIcon>
                    <ListItemText primary="お気に入りスト" />
                  </ListItem>

                  <ListItem
                    button
                    selected={activeTab === 'plans'}
                    onClick={() => setActiveTab('plans')}
                    sx={{
                      borderRadius: 1,
                      mb: 1,
                      '&.Mui-selected': {
                        bgcolor: 'primary.light',
                        '&:hover': { bgcolor: 'primary.light' }
                      }
                    }}
                  >
                    <ListItemIcon>
                      <EventIcon color={activeTab === 'plans' ? 'primary' : 'action'} />
                    </ListItemIcon>
                    <ListItemText primary="お気に入りプラン" />
                  </ListItem>
                </List>

                <Divider sx={{ my: 2 }} />

                {/* Logout Button */}
                <Button
                  fullWidth
                  variant="outlined"
                  color="error"
                  startIcon={<LogoutIcon />}
                  onClick={handleLogout}
                  sx={{ mt: 2 }}
                >
                  ログアウト
                </Button>
              </Card>
            </Grid>

            {/* Right Content Area - 9 parts */}
            <Grid item xs={12} md={9} sx={{flex:1}}>
              <Grid container spacing={3}>
                {(activeTab === 'favorites' ? favoriteSpots : favoritePlans).map((item) => (
                  <Grid item xs={12} sm={6} md={4} key={item.id}>
                    <Card
                      sx={{
                        height: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        position: 'relative',
                        transition: 'transform 0.2s, box-shadow 0.2s',
                        '&:hover': {
                          transform: 'translateY(-4px)',
                          boxShadow: 4
                        }
                      }}
                    >
                      {/* Unfavorite Button */}
                      <IconButton
                        onClick={() => handleUnfavorite(item.id, activeTab === 'favorites' ? 'spot' : 'plan')}
                        sx={{
                          position: 'absolute',
                          top: 8,
                          right: 8,
                          bgcolor: 'white',
                          zIndex: 1,
                          '&:hover': { bgcolor: 'white' }
                        }}
                      >
                        <FavoriteIcon color="error" />
                      </IconButton>

                      {/* Image */}
                      <CardMedia
                        component="div"
                        sx={{
                          height: 180,
                          bgcolor: '#e0e0e0',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}
                      >
                        <Typography color="text.secondary">画像</Typography>
                      </CardMedia>

                      <CardContent sx={{ flexGrow: 1 }}>
                        <Typography variant="h6" fontWeight={600} gutterBottom>
                          {item.name}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" gutterBottom>
                          {item.address}
                        </Typography>
                        
                        {/* Rating */}
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                          <Rating value={item.rating} readOnly size="small" />
                        </Box>
                        
                        <Typography variant="caption" color="text.secondary">
                          {item.reviews}
                        </Typography>

                        {/* Detail Button */}
                        <Button
                          fullWidth
                          variant="outlined"
                          onClick={() => handleViewDetail(item.id, activeTab === 'favorites' ? 'spot' : 'plan')}
                          sx={{ mt: 2 }}
                        >
                          詳細を見る
                        </Button>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>

              {/* Empty State */}
              {((activeTab === 'favorites' && favoriteSpots.length === 0) ||
                (activeTab === 'plans' && favoritePlans.length === 0)) && (
                <Box
                  sx={{
                    textAlign: 'center',
                    py: 8,
                    bgcolor: 'white',
                    borderRadius: 2
                  }}
                >
                  <FavoriteBorderIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
                  <Typography variant="h6" color="text.secondary">
                    お気に入りがまだありません
                  </Typography>
                </Box>
              )}
            </Grid>
          </Grid>
        </Container>
      </Box>
    </>
  );
}

export default Profile;
