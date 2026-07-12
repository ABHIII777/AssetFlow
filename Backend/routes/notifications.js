const { Router } = require('express');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();
const router = Router();

router.get('/notifications', async (req, res) => {
  try {
    const { user, role } = req.query;
    const where = {};
    if (role !== 'Admin' && user) {
      where.targetUser = user;
    }
    const notifications = await prisma.notification.findMany({
      where,
      orderBy: { id: 'desc' }
    });
    res.json(notifications);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/logs', async (req, res) => {
  try {
    const logs = await prisma.log.findMany();
    res.json(logs);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
