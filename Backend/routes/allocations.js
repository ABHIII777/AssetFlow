const { Router } = require('express');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();
const router = Router();

router.get('/allocations', async (req, res) => {
  try {
    const { user, role } = req.query;
    const where = {};
    if (role !== 'Admin' && user) {
      where.assignedTo = user;
    }
    const allocations = await prisma.allocation.findMany({ where });
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
    const { user, role } = req.query;
    const where = {};
    if (role !== 'Admin' && user) {
      where.OR = [{ from: user }, { to: user }];
    }
    const transfers = await prisma.transfer.findMany({ where });
    res.json(transfers);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/transfers', async (req, res) => {
  try {
    const { to, toDept } = req.body;
    const employee = await prisma.employee.findFirst({
      where: { name: to, dept: toDept }
    });

    if (!employee) {
      return res.status(400).json({ error: `User '${to}' not found in department '${toDept}'` });
    }

    const transfer = await prisma.transfer.create({
      data: {
        asset: req.body.asset,
        from: req.body.from,
        to: req.body.to,
        reason: req.body.reason,
        status: req.body.status,
        date: req.body.date
      }
    });

    await prisma.notification.create({
      data: {
        message: `New transfer request for ${transfer.asset} to ${transfer.to}`,
        time: new Date().toISOString(),
        type: 'alert',
        targetUser: 'Admin User'
      }
    });

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

    if (req.body.status === 'Approved') {
      await prisma.allocation.updateMany({
        where: { asset: transfer.asset, assignedTo: transfer.from, status: 'Active' },
        data: { status: 'Returned' }
      });
      await prisma.allocation.create({
        data: {
          asset: transfer.asset,
          assignedTo: transfer.to,
          date: new Date().toISOString().split('T')[0],
          status: 'Active',
          notes: 'Transferred from ' + transfer.from
        }
      });
      await prisma.notification.create({
        data: {
          message: `Transfer of ${transfer.asset} approved`,
          time: new Date().toISOString(),
          type: 'system',
          targetUser: transfer.to
        }
      });
    }

    res.json(transfer);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
