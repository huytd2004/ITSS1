const express = require('express')
const app = express()
const database = require('./config/database.js');
const bodyParser = require('body-parser');
const cors = require('cors'); // THÊM MỚI: Import cors

//cấu hình env
require('dotenv').config()

const port = process.env.PORT || 3000

// THÊM MỚI: Cấu hình CORS cho phép mọi nguồn (hoặc cấu hình cụ thể domain frontend của bạn)
app.use(cors());

// Middlewares: parse JSON and x-www-form-urlencoded BEFORE mounting routes
app.use(express.json())
app.use(bodyParser.urlencoded({ extended: true }))

app.get('/', (req, res) => {
  res.send('Hello World!')
})

//kết nối database
database.connect();

// Routes
const route = require('./routes/index.routes')
route(app); // Gọi hàm route đã định nghĩa ở bước 2

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
