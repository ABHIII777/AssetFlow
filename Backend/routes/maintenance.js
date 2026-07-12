const { Router } = require('express');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();
const router = Router();

router.get('/', async (req, res) => {
  try {
    const { user, role } = req.query;
    const where = {};
    if (role !== 'Admin' && user) {
      where.loggedBy = user;
    }
    const requests = await prisma.maintenanceRequest.findMany({ where });
    res.json(requests);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const request = await prisma.maintenanceRequest.create({ data: req.body });
    res.json(request);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const request = await prisma.maintenanceRequest.update({
      where: { id: parseInt(req.params.id) },
      data: req.body
    });
    res.json(request);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
