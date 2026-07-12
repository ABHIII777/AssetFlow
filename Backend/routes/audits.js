const { Router } = require('express');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();
const router = Router();

router.get('/audits', async (req, res) => {
  try {
    const cycles = await prisma.auditCycle.findMany();
    res.json(cycles);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/audits', async (req, res) => {
  try {
    const cycle = await prisma.auditCycle.create({ data: req.body });
    res.json(cycle);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/discrepancies', async (req, res) => {
  try {
    const discrepancies = await prisma.discrepancy.findMany();
    res.json(discrepancies);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
