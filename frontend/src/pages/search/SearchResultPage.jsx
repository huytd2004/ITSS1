// src/pages/SearchResultPage.jsx
import * as React from 'react';
import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import axios from 'axios';
import { Grid, Box, Container, Typography, Pagination, TextField, Button, Paper, Stack } from '@mui/material';
import SpotCard from '../../components/spot-card';
import FilterSidebar from '../../components/filter-sidebar';
import SearchIcon from '@mui/icons-material/Search';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import SearchInputSidebar from '../../components/filter-sidebar/SearchInputSidebar';

const SearchResultPage = () => {
    const [searchParams] = useSearchParams();
    const urlKeyword = searchParams.get('keyword'); // Lấy keyword từ URL
    const [spots, setSpots] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filterState, setFilterState] = useState({}); 

    useEffect(() => {
        const fetchSpots = async () => {
            setLoading(true);
            try {
                const API_URL = 'http://localhost:3000/api/places/search';

                // BƯỚC 1: Tạo URLSearchParams mới
                const params = new URLSearchParams(); 
                
                // BƯỚC 2: Thêm Keyword từ URL
                if (urlKeyword && urlKeyword.trim()) {
                    params.append('keyword', urlKeyword.trim());
                }

                // BƯỚC 3: Thêm các bộ lọc khác từ filterState (age, price,...)
                for (const key in filterState) {
                    const value = filterState[key];
                    if (value && value.trim() && value !== 'all') {
                        params.append(key, value.trim());
                    }
                }

                // BƯỚC 4: Xây dựng URL cuối cùng
                const queryString = params.toString();
                const apiUrlWithQuery = `${API_URL}${queryString ? '?' + queryString : ''}`;

                console.log("URL truy vấn hợp nhất:", apiUrlWithQuery);
                
                const response = await axios.get(apiUrlWithQuery); 
                setSpots(response.data.data || response.data); 
                setLoading(false);
            } catch (error) {
                console.error("Lỗi khi tải dữ liệu:", error);
                setLoading(false);
            }
        };
        
        // useEffect chạy lại khi URL params (bao gồm keyword) thay đổi HOẶC filterState thay đổi
        fetchSpots(); 
    }, [urlKeyword, filterState]);

  if (loading) {
      return (
          <Container maxWidth="xl" sx={{ mt: 4 }}>
              <Typography variant="h5" align="center">Đang tải dữ liệu...</Typography>
          </Container>
      );
  }

  return (
    <Box sx={{ bgcolor: "#f5f5f5", minHeight: "100vh", py: 3 }}>
        <Container maxWidth="xl" sx={{ mt: 0 }}>
            <Grid container spacing={3}>
                
                {/* Cột 1: Sidebar Filter (MD: 3) */}
                <Grid item xs={12} md={3}>
                    <Stack spacing={3}>
                        {/* 1. THANH TÌM KIẾM KEYWORD MỚI */}
                        <SearchInputSidebar />
                        
                        {/* 2. BỘ LỌC CHÍNH */}
                        <FilterSidebar filterState={filterState} setFilterState={setFilterState} />
                    </Stack>
                </Grid>
                
                {/* Cột 2: Kết quả tìm kiếm (MD: 9) */}
                <Grid item xs={12} md={9} sx={{ flex: 1 }}>
                    <Paper sx={{ p: 3, boxShadow: "0 4px 12px rgba(0,0,0,0.08)" }}>
                        {/* Tiêu đề và List/Map Toggle (Wireframe Mục 9) */}
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                            <Typography variant="body1" color="textSecondary" fontWeight={600}>
                                Tìm thấy {spots.length} địa điểm cho: "{urlKeyword || "Tất cả"}"
                            </Typography>
                            <Stack direction="row" spacing={2}>
                                {/* Giữ nguyên kiểu Button hiện tại để khớp với hình ảnh bạn đang có */}
                                <Button variant="contained">LIST</Button> 
                                <Button variant="contained">MAP</Button> 
                            </Stack>
                        </Box>


                        {/* Danh sách các Spot Cards (Wireframe Mục 5) */}
                        <Grid container spacing={3}>
                            {spots.map((spot) => (
                                <Grid 
                                    item 
                                    xs={12}      // Màn hình rất nhỏ: 1 thẻ / hàng
                                    sm={6}       // Màn hình nhỏ (tablet): 2 thẻ / hàng 
                                    lg={5}       // Màn hình lớn: 4 thẻ / hàng 
                                    key={spot.id} 
                                    sx={{ 
                                    display: "flex",
                                    justifyContent: "center",
                                    alignItems: "center"
                                     }}
                                > 
                                    <SpotCard spot={spot} />
                                </Grid>
                            ))}
                        </Grid>

                        {/* Pagination (Wireframe Mục 8) */}
                        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4, pb: 2 }}>
                            <Pagination count={10} color="primary" page={1} />
                        </Box>
                    </Paper>
                </Grid>
            </Grid>
        </Container>
    </Box>
  );
};

export default SearchResultPage;
