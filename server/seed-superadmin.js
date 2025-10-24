import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User.js';

dotenv.config();

// Conectar a MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB connected successfully');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

// Crear o actualizar super admin
const createSuperAdmin = async () => {
  try {
    const superAdminEmail = process.env.SUPER_ADMIN_EMAIL || 'superadmin@alcel.com';
    const superAdminPassword = process.env.SUPER_ADMIN_PASSWORD || 'SuperAdmin123!';
    const superAdminName = process.env.SUPER_ADMIN_NAME || 'Super Administrator';

    // Buscar si ya existe el super admin
    let superAdmin = await User.findOne({ email: superAdminEmail });

    if (superAdmin) {
      console.log('✅ Super Admin already exists:', superAdminEmail);
      
      // Asegurar que tenga los valores correctos
      if (!superAdmin.isSuperAdmin || superAdmin.role !== 'admin' || !superAdmin.isActive) {
        // No podemos cambiar isSuperAdmin porque es immutable, 
        // pero podemos asegurar role y isActive
        superAdmin.role = 'admin';
        superAdmin.isActive = true;
        await superAdmin.save();
        console.log('✅ Super Admin properties updated');
      }
    } else {
      // Crear nuevo super admin
      superAdmin = new User({
        email: superAdminEmail,
        password: superAdminPassword,
        name: superAdminName,
        role: 'admin',
        isSuperAdmin: true,
        isActive: true
      });

      await superAdmin.save();
      console.log('✅ Super Admin created successfully!');
      console.log('📧 Email:', superAdminEmail);
      console.log('🔑 Password:', superAdminPassword);
      console.log('\n⚠️  IMPORTANT: Change the password after first login!');
    }

    return superAdmin;
  } catch (error) {
    console.error('❌ Error creating Super Admin:', error);
    throw error;
  }
};

// Ejecutar seed
const runSeed = async () => {
  try {
    await connectDB();
    await createSuperAdmin();
    console.log('\n✅ Seed completed successfully');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seed failed:', error);
    process.exit(1);
  }
};

runSeed();

