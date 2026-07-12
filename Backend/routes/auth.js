const { Router } = require('express');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();
const router = Router();

router.post('/login', async (req, res) => {
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

router.post('/signup', async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const user = await prisma.employee.create({
      data: { name, email, password, role: 'Employee' }
    });
    res.json({ token: 'mock-token', user });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
