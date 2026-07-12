require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  await prisma.asset.createMany({
    data: [
        { tag: "AF-0114", name: 'MacBook Pro 14"', category: "Electronics", status: "Allocated", location: "IT Floor 2", dept: "Information Technology", condition: "Good", shared: false },
        { tag: "AF-0062", name: "Epson Projector", category: "Electronics", status: "Available", location: "Conference Room A", dept: "Facilities", condition: "Good", shared: true },
        { tag: "AF-0231", name: "Ergonomic Chair", category: "Furniture", status: "Allocated", location: "Facilities Store", dept: "Facilities", condition: "Fair", shared: false },
        { tag: "AF-0045", name: "Toyota Innova", category: "Vehicles", status: "Reserved", location: "Parking B", dept: "Field Support", condition: "Good", shared: true },
        { tag: "AF-0198", name: 'Dell Monitor 27"', category: "Electronics", status: "Under Maintenance", location: "IT Store", dept: "Information Technology", condition: "Needs Repair", shared: false },
        { tag: "AF-0301", name: "Conference Table", category: "Furniture", status: "Available", location: "Meeting Room B2", dept: "Facilities", condition: "Good", shared: true },
        { tag: "AF-0087", name: "HP LaserJet Printer", category: "Office Equipment", status: "Lost", location: "—", dept: "Finance", condition: "—", shared: false },
    ]
  });

  console.log("Assets seeded successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
