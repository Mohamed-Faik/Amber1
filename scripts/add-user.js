const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function addUser() {
  try {
    const email = 'medfaik3@gmail.com';
    const password = 'Msimo.faik99';
    
    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: email }
    });
    
    if (existingUser) {
      console.log('User already exists with email:', email);
      // Update password if user exists
      const hashedPassword = await bcrypt.hash(password, 12);
      await prisma.user.update({
        where: { email: email },
        data: {
          hashedPassword: hashedPassword,
          status: 'Active',
          role: 'ADMIN'
        }
      });
      console.log('User password updated and set to ADMIN');
      return;
    }
    
    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);
    
    // Create user
    const user = await prisma.user.create({
      data: {
        email: email,
        hashedPassword: hashedPassword,
        name: 'Admin User',
        status: 'Active',
        role: 'ADMIN',
        created_at: new Date(),
        updated_at: new Date()
      }
    });
    
    console.log('User created successfully:');
    console.log('Email:', user.email);
    console.log('Role:', user.role);
    console.log('Status:', user.status);
    console.log('ID:', user.id);
    
  } catch (error) {
    console.error('Error creating user:', error);
  } finally {
    await prisma.$disconnect();
  }
}

addUser();

