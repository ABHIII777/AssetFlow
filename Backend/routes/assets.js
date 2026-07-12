const { Router } = require('express');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();
const router = Router();

function requireAssetCreator(req, res, next) {
  const role = req.headers['x-user-role'];
  if (role === 'Admin' || role === 'Asset Manager') {
    return next();
  }
  return res.status(403).json({ error: 'Only Admin or Asset Manager can create assets.' });
}

router.get('/', async (req, res) => {
  try {
    const assets = await prisma.asset.findMany();
    res.json(assets);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/', requireAssetCreator, async (req, res) => {
  try {
    const asset = await prisma.asset.create({ data: req.body });
    res.json(asset);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
