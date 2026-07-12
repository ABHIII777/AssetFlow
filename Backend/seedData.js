require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log("Seeding Admin User...");
  // Remove old dummy users and ensure clean admin
  await prisma.employee.deleteMany({});
  await prisma.employee.create({
    data: { name: "System Admin", email: "admin@assetflow.com", password: "admin@assetflow89", role: "Admin", status: "Active" }
  });

  console.log("Seeding Allocations...");
  await prisma.allocation.deleteMany({});
  await prisma.allocation.createMany({
    data: [
        { asset: 'AF-0114 — MacBook Pro 14"', assignedTo: "Priya Shah", date: "2026-05-02", status: "Overdue", notes: "Please return to IT." },
        { asset: "AF-0231 — Ergonomic Chair", assignedTo: "Amit Verma", date: "2026-06-10", status: "Active", notes: "" },
        { asset: "AF-0045 — Toyota Innova", assignedTo: "Field Support (dept)", date: "2026-06-28", status: "Active", notes: "" },
        { asset: "AF-0173 — iPad Air", assignedTo: "Sana Iyer", date: "2026-04-14", status: "Overdue", notes: "Need replacement." },
        { asset: "AF-0056 — Standing Desk", assignedTo: "Neha Kapoor", date: "2026-06-01", status: "Active", notes: "" },
    ]
  });

  console.log("Seeding Transfers...");
  await prisma.transfer.deleteMany({});
  await prisma.transfer.createMany({
    data: [
        { asset: 'AF-0114 — MacBook Pro 14"', from: "Priya Shah", to: "Raj Malhotra", reason: "Project Reassignment", status: "Pending", date: "2026-07-08" },
        { asset: "AF-0301 — Conference Table", from: "Facilities", to: "IT Floor 2", reason: "Office move", status: "Approved", date: "2026-07-05" },
    ]
  });

  console.log("Seeding Bookings...");
  await prisma.booking.deleteMany({});
  await prisma.booking.createMany({
    data: [
        { resource: "Room B2", user: "Priya Shah", startTime: "2026-07-12 09:00", endTime: "2026-07-12 10:00", status: "Completed" },
        { resource: "Room B2", user: "Raj Malhotra", startTime: "2026-07-12 10:00", endTime: "2026-07-12 11:00", status: "Ongoing" },
        { resource: "Toyota Innova", user: "Field Support", startTime: "2026-07-13 08:00", endTime: "2026-07-13 18:00", status: "Upcoming" },
        { resource: "Conference Room A", user: "Sana Iyer", startTime: "2026-07-14 14:00", endTime: "2026-07-14 15:30", status: "Upcoming" },
        { resource: "Room B2", user: "Neha Kapoor", startTime: "2026-07-11 13:00", endTime: "2026-07-11 14:00", status: "Cancelled" },
    ]
  });

  console.log("Seeding Maintenance Requests...");
  await prisma.maintenanceRequest.deleteMany({});
  await prisma.maintenanceRequest.createMany({
    data: [
        { asset: 'AF-0198 — Dell Monitor 27"', issue: "Screen flickering intermittently", priority: "High", status: "Pending", loggedBy: "Sana Iyer", date: "2026-07-01" },
        { asset: "AF-0045 — Toyota Innova", issue: "AC not cooling", priority: "Medium", status: "Approved", loggedBy: "Field Support", date: "2026-07-02" },
        { asset: "AF-0301 — Conference Table", issue: "Leg bracket loose", priority: "Low", status: "Technician Assigned", loggedBy: "Facilities", date: "2026-07-03" },
        { asset: 'AF-0114 — MacBook Pro 14"', issue: "Battery draining fast", priority: "Medium", status: "In Progress", loggedBy: "Priya Shah", date: "2026-07-04" },
        { asset: "AF-0062 — Epson Projector", issue: "Bulb replacement", priority: "High", status: "Resolved", loggedBy: "Facilities", date: "2026-07-05" },
    ]
  });

  console.log("Seeding Audit Cycles...");
  await prisma.auditCycle.deleteMany({});
  await prisma.auditCycle.createMany({
    data: [
        { name: "Q3 Corporate IT Audit", startDate: "2026-07-01", status: "In Progress", progress: 65 },
        { name: "Facilities Furniture Check", startDate: "2026-06-15", status: "Completed", progress: 100 },
        { name: "Annual Field Vehicles Audit", startDate: "2026-08-01", status: "Scheduled", progress: 0 },
    ]
  });

  console.log("Seeding Discrepancies...");
  await prisma.discrepancy.deleteMany({});
  await prisma.discrepancy.createMany({
    data: [
        { asset: "AF-0198 — Dell Monitor", expectedLocation: "IT Store", actualLocation: "Unknown", status: "Investigating" },
        { asset: "AF-0087 — HP Printer", expectedLocation: "Finance", actualLocation: "Admin block", status: "Resolved" },
        { asset: "AF-0211 — Projector", expectedLocation: "Room A", actualLocation: "Room C", status: "Pending Update" },
    ]
  });

  console.log("Seeding Notifications...");
  await prisma.notification.deleteMany({});
  await prisma.notification.createMany({
    data: [
        { message: "Maintenance Request #19 approved for AF-0045.", time: "10 mins ago", type: "system" },
        { message: "Booking conflict for 'Conference Room A' resolved.", time: "1 hour ago", type: "alert" },
        { message: "Q3 Audit is 65% complete. 12 discrepancies found.", time: "2 hours ago", type: "system" },
        { message: "Transfer request TR-092 pending your approval.", time: "1 day ago", type: "alert" },
    ]
  });

  console.log("Seeding Logs...");
  await prisma.log.deleteMany({});
  await prisma.log.createMany({
    data: [
        { action: "Priya Shah created new asset AF-0402", time: "10:45 AM" },
        { action: "Amit Verma marked AF-0198 as Under Maintenance", time: "09:30 AM" },
        { action: "System generated monthly depreciation report", time: "01:00 AM" },
        { action: "Admin updated permissions for 'Finance' department", time: "Yesterday" },
    ]
  });

  console.log("All data seeded successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
