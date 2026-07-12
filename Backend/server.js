const express = require('express');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const organizationRoutes = require('./routes/organization');
const assetRoutes = require('./routes/assets');
const allocationRoutes = require('./routes/allocations');
const bookingRoutes = require('./routes/bookings');
const maintenanceRoutes = require('./routes/maintenance');
const auditRoutes = require('./routes/audits');
const notificationRoutes = require('./routes/notifications');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api', organizationRoutes);
app.use('/api/assets', assetRoutes);
app.use('/api', allocationRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/maintenance', maintenanceRoutes);
app.use('/api', auditRoutes);
app.use('/api', notificationRoutes);

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`Backend server running on http://localhost:${PORT}`);
});
