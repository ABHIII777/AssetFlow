const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();

app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 4000;

app.use('/api/auth', require('./routes/auth'));
app.use('/api', require('./routes/organization'));
app.use('/api/assets', require('./routes/assets'));
app.use('/api', require('./routes/allocations'));
app.use('/api/bookings', require('./routes/bookings'));
app.use('/api/maintenance', require('./routes/maintenance'));
app.use('/api', require('./routes/audits'));
app.use('/api', require('./routes/notifications'));

app.listen(PORT, () => {
  console.log(`Backend server running on http://localhost:${PORT}`);
});
