require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  await prisma.department.createMany({
    data: [
      { name: "Information Technology", head: "Priya Shah", parent: "—", status: "Active" },
      { name: "Facilities", head: "Rahul Nair", parent: "—", status: "Active" },
      { name: "Field Support", head: "Amit Verma", parent: "Information Technology", status: "Active" },
      { name: "Finance", head: "Unassigned", parent: "—", status: "Inactive" },
    ]
  });

  await prisma.category.createMany({
    data: [
      { name: "Electronics", fields: "Warranty Period, Serial No.", assetCount: 84 },
      { name: "Furniture", fields: "Material, Dimensions", assetCount: 52 },
      { name: "Vehicles", fields: "Registration No., Fuel Type", assetCount: 12 },
      { name: "Office Equipment", fields: "Warranty Period", assetCount: 30 },
    ]
  });

  await prisma.employee.createMany({
    data: [
      { name: "Priya Shah", email: "priya.shah@org.com", password: "password123", dept: "Information Technology", role: "Department Head", status: "Active" },
      { name: "Raj Malhotra", email: "raj.malhotra@org.com", password: "password123", dept: "Facilities", role: "Asset Manager", status: "Active" },
      { name: "Amit Verma", email: "amit.verma@org.com", password: "password123", dept: "Field Support", role: "Employee", status: "Active" },
      { name: "Neha Kapoor", email: "neha.kapoor@org.com", password: "password123", dept: "Finance", role: "Employee", status: "Inactive" },
      { name: "Sana Iyer", email: "sana.iyer@org.com", password: "password123", dept: "Information Technology", role: "Employee", status: "Active" },
    ]
  });

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

  console.log("Database seeded successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
