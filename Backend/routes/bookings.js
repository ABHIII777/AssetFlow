const { Router } = require('express');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();
const router = Router();

async function hasOverlap(resource, startTime, endTime, excludeId) {
  const where = {
    resource,
    status: { not: 'Cancelled' },
    AND: [
      { startTime: { lt: endTime } },
      { endTime: { gt: startTime } }
    ]
  };
  if (excludeId) {
    where.id = { not: excludeId };
  }
  const conflicting = await prisma.booking.findMany({ where });
  return conflicting.length > 0;
}

router.get('/', async (req, res) => {
  try {
    const { user, role } = req.query;
    const where = {};
    if (role !== 'Admin' && user) {
      where.user = user;
    }
    const bookings = await prisma.booking.findMany({ where, orderBy: { startTime: 'desc' } });
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const { resource, user, startTime, endTime } = req.body;
    if (!resource || !user || !startTime || !endTime) {
      return res.status(400).json({ error: 'All fields are required.' });
    }
    if (new Date(startTime) >= new Date(endTime)) {
      return res.status(400).json({ error: 'End time must be after start time.' });
    }
    if (await hasOverlap(resource, startTime, endTime)) {
      return res.status(409).json({ error: 'Time slot overlaps with an existing booking.' });
    }
    const booking = await prisma.booking.create({
      data: { resource, user, startTime, endTime, status: 'Upcoming' }
    });

    await prisma.notification.create({
      data: {
        message: `Booking confirmed for ${booking.resource}`,
        time: new Date().toISOString(),
        type: 'system',
        targetUser: booking.user
      }
    });

    res.json(booking);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const { resource, user, startTime, endTime } = req.body;
    if (!resource || !user || !startTime || !endTime) {
      return res.status(400).json({ error: 'All fields are required.' });
    }
    if (new Date(startTime) >= new Date(endTime)) {
      return res.status(400).json({ error: 'End time must be after start time.' });
    }
    if (await hasOverlap(resource, startTime, endTime, id)) {
      return res.status(409).json({ error: 'Time slot overlaps with an existing booking.' });
    }
    const booking = await prisma.booking.update({
      where: { id },
      data: { resource, user, startTime, endTime }
    });
    res.json(booking);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const bookingId = parseInt(req.params.id);
    const booking = await prisma.booking.findUnique({ where: { id: bookingId } });

    if (!booking) return res.status(404).json({ error: 'Booking not found' });

    const startTimeObj = new Date(booking.startTime);
    if (!isNaN(startTimeObj.getTime())) {
      const now = new Date();
      const diffMs = startTimeObj.getTime() - now.getTime();
      const diffHours = diffMs / (1000 * 60 * 60);

      if (diffHours < 1 && diffHours >= 0) {
        return res.status(400).json({ error: 'Cannot cancel resource booking within 1 hour of the start time.' });
      }
    }

    await prisma.booking.delete({ where: { id: bookingId } });
    res.json({ message: 'Booking cancelled', booking });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
