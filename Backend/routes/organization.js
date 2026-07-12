const { Router } = require('express');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();
const router = Router();

router.get('/departments', async (req, res) => {
  try {
    const departments = await prisma.department.findMany();
    res.json(departments);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/departments', async (req, res) => {
  try {
    const department = await prisma.department.create({ data: req.body });
    res.json(department);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/categories', async (req, res) => {
  try {
    const categories = await prisma.category.findMany();
    res.json(categories);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/categories', async (req, res) => {
  try {
    const category = await prisma.category.create({ data: req.body });
    res.json(category);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/employees', async (req, res) => {
  try {
    const employees = await prisma.employee.findMany();
    const safeEmployees = employees.map(({ password, ...rest }) => rest);
    res.json(safeEmployees);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// TODO: add auth middleware to verify the requester is Admin
router.put('/employees/:id', async (req, res) => {
  const { role, dept } = req.body;
  try {
    // Prevent anyone from creating an Admin via this endpoint
    if (role === 'Admin') {
      return res.status(403).json({ error: 'Cannot promote to Admin through this endpoint' });
    }

    const employee = await prisma.employee.update({
      where: { id: parseInt(req.params.id) },
      data: { role, dept }
    });
    const { password, ...safe } = employee;
    res.json(safe);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
