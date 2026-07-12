const { Router } = require('express');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();
const router = Router();

router.get('/', async (req, res) => {
  try {
    const bookings = await prisma.booking.findMany();
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const booking = await prisma.booking.create({ data: req.body });
    res.json(booking);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put('/:id', async (req, res) => {
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

router.delete('/:id', async (req, res) => {
  try {
    const booking = await prisma.booking.delete({
      where: { id: parseInt(req.params.id) }
    });
    res.json({ message: "Booking deleted", booking });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
