import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Box,
  Container,
  TextField,
  Button,
  Typography,
  Checkbox,
  FormControlLabel,
  Paper
} from '@mui/material';
import { toast } from 'react-toastify';
import Header from '../../components/header';
import { register } from '../../services/user.services';

function Register() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Validation
      if (!formData.fullName || !formData.email || !formData.password || !formData.confirmPassword) {
        toast.error('Vui lòng nhập đầy đủ thông tin');
        setLoading(false);
        return;
      }

      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        toast.error('Email không hợp lệ');
        setLoading(false);
        return;
      }

      // Validate password length
      if (formData.password.length < 6) {
        toast.error('Mật khẩu phải có ít nhất 6 ký tự');
        setLoading(false);
        return;
      }

      // Check password match
      if (formData.password !== formData.confirmPassword) {
        toast.error('Mật khẩu xác nhận không khớp');
        setLoading(false);
        return;
      }

      // Check terms agreement
      if (!agreedToTerms) {
        toast.error('Vui lòng đồng ý với Điều khoản Sử dụng và Chính sách Quyền riêng tư');
        setLoading(false);
        return;
      }

      // Call API
      const option = {
        fullName: formData.fullName.trim(),
        email: formData.email.trim(),
        password: formData.password,
        confirmPassword: formData.confirmPassword
      };

      const response = await register(option);
      console.log('Register response:', response);

      // Kiểm tra thành công dựa vào response có data hoặc message thành công
      if (response && (response.data || response.message === 'Đăng ký thành công')) {
        toast.success('Đăng ký thành công!');
        
        // Chuyển hướng đến trang login sau 1 giây
        setTimeout(() => {
          navigate('/login');
        }, 1000);
      } else {
        toast.error(response.message || 'Đăng ký thất bại. Vui lòng thử lại.');
      }
    } catch (error) {
      console.error('Register error:', error);
      toast.error('Có lỗi xảy ra. Vui lòng thử lại sau.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Header />
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#f5f5f5',
          py: 4
        }}
      >
        <Container maxWidth="sm">
          <Paper
            elevation={10}
            sx={{
              p: 4,
              borderRadius: 3,
              backgroundColor: 'white'
            }}
          >
            {/* Title */}
            <Typography
              variant="h4"
              component="h1"
              gutterBottom
              align="center"
              sx={{
                fontWeight: 700,
                color: 'primary.main',
                mb: 4
              }}
            >
              Đăng ký
            </Typography>

            {/* Form */}
            <Box component="form" onSubmit={handleSubmit} noValidate>
              {/* Full Name Input */}
              <TextField
                fullWidth
                label="Tên"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                margin="normal"
                required
                autoFocus
                sx={{ mb: 2 }}
              />

              {/* Email Input */}
              <TextField
                fullWidth
                label="Email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                margin="normal"
                required
                sx={{ mb: 2 }}
              />

              {/* Password Input */}
              <TextField
                fullWidth
                label="Mật khẩu"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                margin="normal"
                required
                sx={{ mb: 2 }}
              />

              {/* Confirm Password Input */}
              <TextField
                fullWidth
                label="Xác nhận mật khẩu"
                name="confirmPassword"
                type="password"
                value={formData.confirmPassword}
                onChange={handleChange}
                margin="normal"
                required
                sx={{ mb: 2 }}
              />

              {/* Terms Agreement Checkbox */}
              <FormControlLabel
                control={
                  <Checkbox
                    checked={agreedToTerms}
                    onChange={(e) => setAgreedToTerms(e.target.checked)}
                    color="primary"
                  />
                }
                label={
                  <Typography variant="body2">
                    Tôi đồng ý với{' '}
                    <span style={{ color: '#667eea', fontWeight: 600 }}>
                      Điều khoản Sử dụng
                    </span>
                    {' '}và{' '}
                    <span style={{ color: '#667eea', fontWeight: 600 }}>
                      Chính sách Quyền riêng tư
                    </span>
                  </Typography>
                }
                sx={{ mb: 3 }}
              />

              {/* Register Button */}
              <Button
                type="submit"
                fullWidth
                variant="contained"
                size="large"
                disabled={loading}
                sx={{
                  py: 1.5,
                  fontWeight: 600,
                  fontSize: 16,
                  textTransform: 'none',
                  borderRadius: 2,
                  mb: 3,
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  '&:hover': {
                    background: 'linear-gradient(135deg, #5568d3 0%, #64387d 100%)'
                  },
                  '&:disabled': {
                    background: '#ccc',
                    color: '#666'
                  }
                }}
              >
                {loading ? 'Đang đăng ký...' : 'Đăng ký'}
              </Button>

              {/* Login Link */}
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="body2" color="text.secondary">
                  Đã có tài khoản?{' '}
                  <Link
                    to="/login"
                    style={{
                      color: '#667eea',
                      fontWeight: 600,
                      textDecoration: 'none'
                    }}
                  >
                    Đăng nhập
                  </Link>
                </Typography>
              </Box>
            </Box>
          </Paper>
        </Container>
      </Box>
    </>
  );
}

export default Register;
