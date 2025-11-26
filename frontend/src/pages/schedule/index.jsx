import { useEffect,useState} from "react";
import {
  Avatar,
  Box,
  Button,
  Divider,
  FormControl,
  FormControlLabel,
  FormLabel,
  Grid,
  IconButton,
  InputAdornment,
  MenuItem,
  Pagination,
  Paper,
  Radio,
  RadioGroup,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import SearchIcon from "@mui/icons-material/Search";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import FilterAltIcon from "@mui/icons-material/FilterAlt";
import axios from "axios";

export default function Schedule() {
  // const plans = useMemo(() => mockPlans.slice(0, 6), []);
  const [plansData, setPlansData] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchDayPlans = async () => {
      console.log("Fetching day plans from API... Page:", page);
      try {
        setLoading(true);
        const response = await axios.get("http://localhost:3000/api/day-plans", {
          params: { page }
        });
        setPlansData(response.data?.data ?? []);
        setTotalPages(response.data?.pagination?.totalPages ?? 1);
        console.log("Fetched day plans:", response.data);
      } catch (error) {
        console.error("Failed to fetch day plans", error?.response ?? error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchDayPlans();
  }, [page]);

  const handlePageChange = (event, value) => {
    setPage(value);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  
  return (
    <Box sx={{ px: { xs: 2, md: 4 }, py: 3, bgcolor: "#f2f4f7" }}>
      <Box sx={{ mb: 3 }}>
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
        >
          <Typography variant="h5" fontWeight={700} sx={{ color: "#1e1e1e" }}>
            Lịch trình đề xuất
          </Typography>
          <Button
            variant="contained"
            color="primary"
            startIcon={<FavoriteBorderIcon />}
            sx={{
              textTransform: "none",
              borderRadius: 2,
              boxShadow: "0 4px 10px rgba(25,118,210,0.35)",
            }}
          >
            Tạo lịch trình mới
          </Button>
        </Stack>
      </Box>

      <Grid container spacing={3}  columns={12}>
        <Grid item xs={12} md={9} sx={{ flex: 1 }}>
          {loading ? (
            <Stack alignItems="center" justifyContent="center" sx={{ py: 8 }}>
              <Typography variant="body1" color="text.secondary">
                Đang tải dữ liệu...
              </Typography>
            </Stack>
          ) : plansData.length === 0 ? (
            <Stack alignItems="center" justifyContent="center" sx={{ py: 8 }}>
              <Typography variant="body1" color="text.secondary">
                Không có lịch trình nào
              </Typography>
            </Stack>
          ) : (
            <Grid container spacing={3} sx={{marginBottom: 2}}>
            {plansData.map((plan) => (
              <Grid
                item
                xs={12}
                sm={6}
                md={4}
                key={plan.id}
                sx={{ display: "flex" }}
              >
                <Paper
                  sx={{
                    flex: 1,
                    display: "flex",
                    flexDirection: "column",
                    minHeight: 420,
                    width: 310,
                    p: { xs: 2, md: 3 },
                    borderRadius: 3,
                    boxShadow: "0 8px 25px rgba(15,23,42,0.08)",
                  }}
                >
                  <Stack spacing={2} sx={{ flex: 1 }}>
                    <Stack
                      direction="row"
                      alignItems="center"
                      justifyContent="space-between"
                    >
                      <Stack direction="row" alignItems="center" spacing={1}>
                        <Avatar
                          src={plan.user.avatar}
                          alt={plan.user.fullName}
                          sx={{ width: 40, height: 40 }}
                        />
                        <Typography variant="subtitle1" fontWeight={600}>
                          {plan.user.fullName}
                        </Typography>
                      </Stack>
                      <Stack direction="row" alignItems="center" spacing={0.5}>
                        <FavoriteBorderIcon
                          fontSize="small"
                          sx={{ color: "#eb3941" }}
                        />
                        <Typography variant="body2" sx={{ color: "#6b7280" }}>
                          {plan.likes}
                        </Typography>
                      </Stack>
                    </Stack>

                    <Box
                      component="img"
                      src={plan.cover}
                      alt={plan.title}
                      sx={{
                        width: "100%",
                        borderRadius: 2,
                        height: 180,
                        objectFit: "cover",
                      }}
                    />

                    <Stack spacing={0.5}>
                      <Typography variant="subtitle1" fontWeight={600}>
                        {plan.title}
                      </Typography>
                      <Typography variant="body2" sx={{ color: "#374151" }}>
                        {plan.description}
                      </Typography>
                      <Stack direction="column" spacing={0.3} sx={{ pt: 1 }}>
                        <Typography variant="caption" sx={{ color: "#6b7280" }}>
                          <LocationOnIcon
                            fontSize="small"
                            sx={{
                              verticalAlign: "middle",
                              mr: 0.5,
                              color: "#1976d2",
                            }}
                          />
                          {plan.province[0]} · {plan.area[0]}
                        </Typography>
                        <Typography variant="caption" sx={{ color: "#6b7280" }}>
                          Giá: {plan.price_range}
                        </Typography>
                        <Typography variant="caption" sx={{ color: "#6b7280" }}>
                          Độ tuổi: {plan.age}
                        </Typography>
                      </Stack>
                    </Stack>
                  </Stack>

                  <Stack
                    direction="row"
                    justifyContent="space-between"
                    alignItems="center"
                    sx={{ pt: 1 }}
                  >
                    <Button
                      variant="contained"
                      sx={{
                        textTransform: "none",
                        borderRadius: 2,
                        fontSize: 12,
                      }}
                    >
                      Xem ngay
                    </Button>
                    <Typography variant="caption" sx={{ color: "#9ca3af" }}>
                      #{plan.area[0].replace(/\s+/g, "")}
                    </Typography>
                  </Stack>
                </Paper>
              </Grid>
            ))}
          </Grid>
          )}

          {/* Pagination */}
          <Stack direction="row" justifyContent="center" sx={{ mt: 4 }}>
            <Pagination 
              count={totalPages} 
              page={page}
              onChange={handlePageChange}
              color="primary" 
              showFirstButton 
              showLastButton
            />
          </Stack>
        </Grid>

        <Grid item xs={12} md={3} >
          <Paper
            sx={{
              display: "flex",
              flexDirection: "column",
              p: 3,
              borderRadius: 3,
              boxShadow: "0 8px 25px rgba(15,23,42,0.08)",
            }}
          >
            <Stack spacing={2} sx={{ flex: 1 }}>
              <Stack direction="row" alignItems="center" spacing={1}>
                <SearchIcon sx={{ color: "#1976d2" }} />
                <Typography variant="subtitle1" fontWeight={700}>
                  Tìm kiếm
                </Typography>
              </Stack>
              <TextField
                size="small"
                placeholder="Nhập tên địa điểm"
                fullWidth
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton size="small" edge="end">
                        <SearchIcon />
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
              <Divider sx={{ borderColor: "#e5e7eb" }} />
              <Typography variant="subtitle2" fontWeight={600}>
                Lọc theo địa chỉ
              </Typography>
              <TextField
                select
                size="small"
                label="Tỉnh / Thành phố"
                defaultValue="Hà Nội"
              >
                <MenuItem value="Hà Nội">Hà Nội</MenuItem>
                <MenuItem value="Tp. HCM">Tp. HCM</MenuItem>
                <MenuItem value="Đà Nẵng">Đà Nẵng</MenuItem>
              </TextField>
              <TextField
                select
                size="small"
                label="Quận / Huyện"
                defaultValue="Hoàn Kiếm"
              >
                <MenuItem value="Hoàn Kiếm">Hoàn Kiếm</MenuItem>
                <MenuItem value="Hai Bà Trưng">Hai Bà Trưng</MenuItem>
                <MenuItem value="Tây Hồ">Tây Hồ</MenuItem>
              </TextField>
              <Divider sx={{ borderColor: "#e5e7eb" }} />
              <Typography variant="subtitle2" fontWeight={600}>
                Bộ lọc bổ sung
              </Typography>

              {/* Khoảng giá */}
              <FormControl component="fieldset">
                <FormLabel
                  component="legend"
                  sx={{ fontSize: "0.875rem", fontWeight: 600, color: "#374151", mb: 1 }}
                >
                  Khoảng giá
                </FormLabel>
                <RadioGroup defaultValue="all">
                  <FormControlLabel
                    value="all"
                    control={<Radio size="small" />}
                    label="Tất cả"
                    sx={{ "& .MuiFormControlLabel-label": { fontSize: "0.875rem" } }}
                  />
                  <FormControlLabel
                    value="free"
                    control={<Radio size="small" />}
                    label="Miễn phí"
                    sx={{ "& .MuiFormControlLabel-label": { fontSize: "0.875rem" } }}
                  />
                  <FormControlLabel
                    value="0-200k"
                    control={<Radio size="small" />}
                    label="0đ - 200.000đ"
                    sx={{ "& .MuiFormControlLabel-label": { fontSize: "0.875rem" } }}
                  />
                  <FormControlLabel
                    value="200k-500k"
                    control={<Radio size="small" />}
                    label="200.000đ - 500.000đ"
                    sx={{ "& .MuiFormControlLabel-label": { fontSize: "0.875rem" } }}
                  />
                  <FormControlLabel
                    value="500k-1m"
                    control={<Radio size="small" />}
                    label="500.000đ - 1.000.000đ"
                    sx={{ "& .MuiFormControlLabel-label": { fontSize: "0.875rem" } }}
                  />
                  <FormControlLabel
                    value="1m+"
                    control={<Radio size="small" />}
                    label="Trên 1.000.000đ"
                    sx={{ "& .MuiFormControlLabel-label": { fontSize: "0.875rem" } }}
                  />
                </RadioGroup>
              </FormControl>

              {/* Độ tuổi */}
              <FormControl component="fieldset">
                <FormLabel
                  component="legend"
                  sx={{ fontSize: "0.875rem", fontWeight: 600, color: "#374151", mb: 1 }}
                >
                  Độ tuổi
                </FormLabel>
                <RadioGroup defaultValue="all">
                  <FormControlLabel
                    value="all"
                    control={<Radio size="small" />}
                    label="Tất cả"
                    sx={{ "& .MuiFormControlLabel-label": { fontSize: "0.875rem" } }}
                  />
                  <FormControlLabel
                    value="0-5"
                    control={<Radio size="small" />}
                    label="0 - 5 tuổi"
                    sx={{ "& .MuiFormControlLabel-label": { fontSize: "0.875rem" } }}
                  />
                  <FormControlLabel
                    value="5-12"
                    control={<Radio size="small" />}
                    label="5 - 12 tuổi"
                    sx={{ "& .MuiFormControlLabel-label": { fontSize: "0.875rem" } }}
                  />
                  <FormControlLabel
                    value="12-18"
                    control={<Radio size="small" />}
                    label="12 - 18 tuổi"
                    sx={{ "& .MuiFormControlLabel-label": { fontSize: "0.875rem" } }}
                  />
                  <FormControlLabel
                    value="18+"
                    control={<Radio size="small" />}
                    label="Trên 18 tuổi"
                    sx={{ "& .MuiFormControlLabel-label": { fontSize: "0.875rem" } }}
                  />
                </RadioGroup>
              </FormControl>

              <Stack
                direction="row"
                spacing={2}
                justifyContent="space-between"
                sx={{ pt: 1 }}
              >
                <Button
                  variant="contained"
                  startIcon={<FilterAltIcon />}
                  sx={{ textTransform: "none", borderRadius: 2 }}
                >
                  Lọc
                </Button>
                <Button
                  variant="outlined"
                  sx={{ textTransform: "none", color: "#6b4c00" }}
                >
                  Đặt lại
                </Button>
              </Stack>
            </Stack>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}
