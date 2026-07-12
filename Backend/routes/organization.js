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

router.put('/departments/:id', async (req, res) => {
  try {
    const department = await prisma.department.update({
      where: { id: parseInt(req.params.id) },
      data: req.body
    });
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

router.put('/categories/:id', async (req, res) => {
  try {
    const category = await prisma.category.update({
      where: { id: parseInt(req.params.id) },
      data: req.body
    });
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

router.put('/employees/:id', async (req, res) => {
  try {
    const employee = await prisma.employee.update({
      where: { id: parseInt(req.params.id) },
      data: req.body
    });
    res.json(employee);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
