import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  // Create admin user
  const hashedPassword = await bcrypt.hash('password123', 12)
  
  const admin = await prisma.user.upsert({
    where: { email: 'admin@construction.com' },
    update: {},
    create: {
      email: 'admin@construction.com',
      name: 'Admin User',
      role: 'ADMIN',
      password: hashedPassword,
    },
  })

  // Create employee
  const employee = await prisma.user.upsert({
    where: { email: 'employee@construction.com' },
    update: {},
    create: {
      email: 'employee@construction.com',
      name: 'John Employee',
      role: 'EMPLOYEE',
      password: hashedPassword,
    },
  })

  // Create employee record
  await prisma.employee.upsert({
    where: { userId: employee.id },
    update: {},
    create: {
      userId: employee.id,
      hourlyRate: 25.00,
    },
  })

  // Create client
  const client = await prisma.client.upsert({
    where: { name: 'ABC Construction Ltd' },
    update: {},
    create: {
      name: 'ABC Construction Ltd',
      email: 'contact@abcconstruction.com',
      phone: '+44 20 7123 4567',
      address: '123 Construction Street, London, UK',
      contactName: 'Jane Smith',
    },
  })

  // Create project
  const project = await prisma.project.upsert({
    where: { name: 'Office Building Renovation' },
    update: {},
    create: {
      name: 'Office Building Renovation',
      description: 'Complete renovation of 5-story office building',
      status: 'ACTIVE',
      budget: 500000.00,
      actualCost: 125000.00,
      percentComplete: 25.00,
      startDate: new Date('2024-01-01'),
      endDate: new Date('2024-12-31'),
      clientId: client.id,
      managerId: admin.id,
    },
  })

  // Create tasks
  const tasks = [
    {
      title: 'Demolition Work',
      description: 'Remove existing fixtures and fittings',
      status: 'COMPLETED',
      priority: 'HIGH',
      phase: 'CONSTRUCTION',
      estimatedHours: 40.00,
      loggedHours: 40.00,
      dueDate: new Date('2024-02-15'),
      projectId: project.id,
      assigneeId: employee.id,
    },
    {
      title: 'Electrical Installation',
      description: 'Install new electrical systems',
      status: 'IN_PROGRESS',
      priority: 'HIGH',
      phase: 'CONSTRUCTION',
      estimatedHours: 80.00,
      loggedHours: 20.00,
      dueDate: new Date('2024-03-30'),
      projectId: project.id,
      assigneeId: employee.id,
    },
    {
      title: 'Plumbing Installation',
      description: 'Install new plumbing systems',
      status: 'TODO',
      priority: 'MEDIUM',
      phase: 'CONSTRUCTION',
      estimatedHours: 60.00,
      loggedHours: 0.00,
      dueDate: new Date('2024-04-15'),
      projectId: project.id,
      assigneeId: employee.id,
    },
  ]

  for (const task of tasks) {
    await prisma.task.upsert({
      where: { 
        title_projectId: {
          title: task.title,
          projectId: task.projectId,
        }
      },
      update: {},
      create: task,
    })
  }

  // Create issues
  const issues = [
    {
      title: 'Water Damage Found',
      description: 'Water damage discovered in basement area',
      status: 'OPEN',
      severity: 'HIGH',
      dueDate: new Date('2024-03-01'),
      location: 'Basement Level 1',
      projectId: project.id,
      assigneeId: employee.id,
      createdById: admin.id,
    },
    {
      title: 'Permit Delay',
      description: 'Building permit approval delayed',
      status: 'IN_PROGRESS',
      severity: 'MEDIUM',
      dueDate: new Date('2024-02-28'),
      location: 'Planning Department',
      projectId: project.id,
      assigneeId: admin.id,
      createdById: admin.id,
    },
  ]

  for (const issue of issues) {
    await prisma.issue.upsert({
      where: {
        title_projectId: {
          title: issue.title,
          projectId: issue.projectId,
        }
      },
      update: {},
      create: issue,
    })
  }

  // Create supplier
  const supplier = await prisma.supplier.upsert({
    where: { name: 'Builders Supply Co' },
    update: {},
    create: {
      name: 'Builders Supply Co',
      email: 'orders@builderssupply.com',
      phone: '+44 20 7654 3210',
      address: '456 Supply Street, London, UK',
      contactName: 'Mike Johnson',
    },
  })

  // Create inventory items
  const inventoryItems = [
    {
      sku: 'CONC-001',
      name: 'Concrete Mix',
      description: 'High-strength concrete mix',
      uom: 'kg',
      onHand: 1000.00,
      minQty: 100.00,
      lastPrice: 0.50,
    },
    {
      sku: 'STEEL-001',
      name: 'Steel Rebar',
      description: '12mm steel reinforcement bar',
      uom: 'm',
      onHand: 500.00,
      minQty: 50.00,
      lastPrice: 2.50,
    },
  ]

  for (const item of inventoryItems) {
    await prisma.inventoryItem.upsert({
      where: { sku: item.sku },
      update: {},
      create: item,
    })
  }

  console.log('Database seeded successfully!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
