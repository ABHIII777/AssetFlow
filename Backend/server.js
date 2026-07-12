const express = require('express');
const cors = require('cors');
const { PrismaClient } = require('@prisma/client');
require('dotenv').config();

const app = express();
const prisma = new PrismaClient();

app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;

// ==========================================
// AUTHENTICATION
// ==========================================
app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await prisma.employee.findUnique({ where: { email } });
    if (!user || user.password !== password) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }
    res.json({ token: 'mock-token', user });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/auth/signup', async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const user = await prisma.employee.create({
      data: { name, email, password }
    });
    res.json({ token: 'mock-token', user });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ==========================================
// ORGANIZATION SETUP
// ==========================================
app.get('/api/departments', async (req, res) => {
  try {
    const departments = await prisma.department.findMany();
    res.json(departments);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/departments', async (req, res) => {
  try {
    const department = await prisma.department.create({ data: req.body });
    res.json(department);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/categories', async (req, res) => {
  try {
    const categories = await prisma.category.findMany();
    res.json(categories);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/categories', async (req, res) => {
  try {
    const category = await prisma.category.create({ data: req.body });
    res.json(category);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/employees', async (req, res) => {
  try {
    const employees = await prisma.employee.findMany();
    // exclude passwords
    const safeEmployees = employees.map(({ password, ...rest }) => rest);
    res.json(safeEmployees);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ==========================================
// ASSETS
// ==========================================
app.get('/api/assets', async (req, res) => {
  try {
    const assets = await prisma.asset.findMany();
    res.json(assets);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/assets', async (req, res) => {
  try {
    const asset = await prisma.asset.create({ data: req.body });
    res.json(asset);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ==========================================
// ALLOCATIONS / TRANSFERS
// ==========================================
app.get('/api/allocations', async (req, res) => {
  try {
    const allocations = await prisma.allocation.findMany();
    res.json(allocations);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/allocations', async (req, res) => {
  try {
    const { asset, assignedTo, date, status, notes } = req.body;
    
    // Validate if the asset is already allocated
    const tag = asset.split(' ')[0];
    const assetRecord = await prisma.asset.findUnique({ where: { tag } });
    
    if (assetRecord && assetRecord.status === 'Allocated') {
      return res.status(409).json({ error: `Asset ${tag} is already allocated.` });
    }

    const allocation = await prisma.allocation.create({ data: { asset, assignedTo, date, status, notes } });
    
    // Update asset status
    if (assetRecord) {
      await prisma.asset.update({
        where: { id: assetRecord.id },
        data: { status: 'Allocated' }
      });
    }

    res.json(allocation);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});



app.get('/api/transfers', async (req, res) => {
  try {
    const transfers = await prisma.transfer.findMany();
    res.json(transfers);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/transfers', async (req, res) => {
  try {
    const transfer = await prisma.transfer.create({ data: req.body });
    res.json(transfer);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/transfers/:id', async (req, res) => {
  try {
    const transfer = await prisma.transfer.update({
      where: { id: parseInt(req.params.id) },
      data: req.body
    });
    res.json(transfer);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/allocations/:id', async (req, res) => {
  try {
    const allocation = await prisma.allocation.update({
      where: { id: parseInt(req.params.id) },
      data: req.body
    });
    res.json(allocation);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ==========================================
// BOOKINGS
// ==========================================
app.get('/api/bookings', async (req, res) => {
  try {
    const bookings = await prisma.booking.findMany();
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/bookings', async (req, res) => {
  try {
    const booking = await prisma.booking.create({ data: req.body });
    res.json(booking);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/bookings/:id', async (req, res) => {
  try {
    const booking = await prisma.booking.update({
      where: { id: parseInt(req.params.id) },
      data: req.body
    });
    res.json(booking);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/bookings/:id', async (req, res) => {
  try {
    const booking = await prisma.booking.delete({
      where: { id: parseInt(req.params.id) }
    });
    res.json({ message: "Booking deleted", booking });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


// ==========================================
// MAINTENANCE
// ==========================================
app.get('/api/maintenance', async (req, res) => {
  try {
    const requests = await prisma.maintenanceRequest.findMany();
    res.json(requests);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/maintenance', async (req, res) => {
  try {
    const request = await prisma.maintenanceRequest.create({ data: req.body });
    res.json(request);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});



// ==========================================
// AUDITS
// ==========================================
app.get('/api/audits', async (req, res) => {
  try {
    const cycles = await prisma.auditCycle.findMany();
    res.json(cycles);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/audits', async (req, res) => {
  try {
    const cycle = await prisma.auditCycle.create({ data: req.body });
    res.json(cycle);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/discrepancies', async (req, res) => {
  try {
    const discrepancies = await prisma.discrepancy.findMany();
    res.json(discrepancies);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ==========================================
// NOTIFICATIONS & LOGS
// ==========================================
app.get('/api/notifications', async (req, res) => {
  try {
    const notifications = await prisma.notification.findMany();
    res.json(notifications);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/logs', async (req, res) => {
  try {
    const logs = await prisma.log.findMany();
    res.json(logs);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Backend server running on http://localhost:${PORT}`);
});
