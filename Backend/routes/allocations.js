const { Router } = require('express');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();
const router = Router();

router.get('/allocations', async (req, res) => {
  try {
    const allocations = await prisma.allocation.findMany();
    res.json(allocations);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/allocations', async (req, res) => {
  try {
    const { asset, assignedTo, date, status, notes } = req.body;

    const tag = asset.split(' ')[0];
    const assetRecord = await prisma.asset.findUnique({ where: { tag } });

    if (assetRecord && assetRecord.status === 'Allocated') {
      return res.status(409).json({ error: `Asset ${tag} is already allocated.` });
    }

    const allocation = await prisma.allocation.create({ data: { asset, assignedTo, date, status, notes } });

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

router.put('/allocations/:id', async (req, res) => {
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

router.get('/transfers', async (req, res) => {
  try {
    const transfers = await prisma.transfer.findMany();
    res.json(transfers);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/transfers', async (req, res) => {
  try {
    const transfer = await prisma.transfer.create({ data: req.body });
    res.json(transfer);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put('/transfers/:id', async (req, res) => {
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

module.exports = router;
