const bcrypt = require('bcryptjs');
const { sequelize, User, Session, Term, Class, Subject, ClassSubject, Student } = require('../models');

const seedDatabase = async () => {
  try {
    console.log('🌱 Starting database seeding...');

    // Clear existing data (development only!)
    if (process.env.NODE_ENV === 'development') {
      await sequelize.sync({ force: true });
      console.log('✓ Database cleared');
    }

    // 1. Create Users
    const hashedPassword = await bcrypt.hash('admin123', 10);
    
    const admin = await User.create({
      role: 'admin',
      name: 'System Administrator',
      email: 'admin@gra.edu.ng',
      phone: '+2348012345678',
      password_hash: hashedPassword,
      status: 'active'
    });

    const teacher1 = await User.create({
      role: 'teacher',
      name: 'Mr. John Okafor',
      email: 'john.okafor@gra.edu.ng',
      phone: '+2348023456789',
      password_hash: hashedPassword,
      status: 'active'
    });

    const classTeacher = await User.create({
      role: 'class_teacher',
      name: 'Mrs. Sarah Ibrahim',
      email: 'sarah.ibrahim@gra.edu.ng',
      phone: '+2348034567890',
      password_hash: hashedPassword,
      status: 'active'
    });

    const accountant = await User.create({
      role: 'accountant',
      name: 'Mr. Ahmed Bello',
      email: 'ahmed.bello@gra.edu.ng',
      phone: '+2348045678901',
      password_hash: hashedPassword,
      status: 'active'
    });

    const parent = await User.create({
      role: 'parent',
      name: 'Mrs. Grace Adeyemi',
      email: 'grace.adeyemi@gmail.com',
      phone: '+2348056789012',
      password_hash: hashedPassword,
      status: 'active'
    });

    console.log('✓ Users created');

    // 2. Create Academic Session
    const session = await Session.create({
      name: '2024/2025',
      is_active: true
    });

    console.log('✓ Session created');

    // 3. Create Terms
    const term1 = await Term.create({
      name: 'First Term',
      session_id: session.id,
      is_active: true,
      start_date: '2024-09-01',
      end_date: '2024-12-15',
      next_term_begins: '2025-01-06'
    });

    await Term.create({
      name: 'Second Term',
      session_id: session.id,
      is_active: false,
      start_date: '2025-01-06',
      end_date: '2025-04-15',
      next_term_begins: '2025-04-28'
    });

    await Term.create({
      name: 'Third Term',
      session_id: session.id,
      is_active: false,
      start_date: '2025-04-28',
      end_date: '2025-07-20',
      next_term_begins: '2025-09-01'
    });

    console.log('✓ Terms created');

    // 4. Create Classes
    const jss1a = await Class.create({
      name: 'JSS 1A',
      level: 'JSS 1',
      class_teacher_id: classTeacher.id,
      capacity: 40,
      status: 'active'
    });

    const jss1b = await Class.create({
      name: 'JSS 1B',
      level: 'JSS 1',
      capacity: 40,
      status: 'active'
    });

    const sss1a = await Class.create({
      name: 'SSS 1A',
      level: 'SSS 1',
      capacity: 35,
      status: 'active'
    });

    console.log('✓ Classes created');

    // 5. Create Subjects
    const mathematics = await Subject.create({
      name: 'Mathematics',
      code: 'MTH',
      is_core: true,
      status: 'active'
    });

    const english = await Subject.create({
      name: 'English Language',
      code: 'ENG',
      is_core: true,
      status: 'active'
    });

    const physics = await Subject.create({
      name: 'Physics',
      code: 'PHY',
      is_core: true,
      status: 'active'
    });

    const chemistry = await Subject.create({
      name: 'Chemistry',
      code: 'CHM',
      is_core: true,
      status: 'active'
    });

    const biology = await Subject.create({
      name: 'Biology',
      code: 'BIO',
      is_core: true,
      status: 'active'
    });

    console.log('✓ Subjects created');

    // 6. Assign Subjects to Classes
    await ClassSubject.create({
      class_id: jss1a.id,
      subject_id: mathematics.id,
      teacher_id: teacher1.id,
      session_id: session.id
    });

    await ClassSubject.create({
      class_id: jss1a.id,
      subject_id: english.id,
      teacher_id: classTeacher.id,
      session_id: session.id
    });

    await ClassSubject.create({
      class_id: jss1b.id,
      subject_id: mathematics.id,
      teacher_id: teacher1.id,
      session_id: session.id
    });

    console.log('✓ Subject assignments created');

    // 7. Create Students
    const students = [
      {
        reg_no: 'GRA/2024/001',
        full_name: 'Adeyemi Chioma Grace',
        dob: '2010-05-15',
        gender: 'Female',
        class_id: jss1a.id,
        parent_id: parent.id,
        genotype: 'AA',
        blood_group: 'O+',
        parent_phone: '+2348056789012',
        parent_email: 'grace.adeyemi@gmail.com',
        status: 'active'
      },
      {
        reg_no: 'GRA/2024/002',
        full_name: 'Bello Muhammad Abubakar',
        dob: '2010-08-22',
        gender: 'Male',
        class_id: jss1a.id,
        genotype: 'AS',
        blood_group: 'A+',
        status: 'active'
      },
      {
        reg_no: 'GRA/2024/003',
        full_name: 'Okonkwo Chinedu Emmanuel',
        dob: '2010-03-10',
        gender: 'Male',
        class_id: jss1a.id,
        genotype: 'AA',
        blood_group: 'B+',
        status: 'active'
      },
      {
        reg_no: 'GRA/2024/004',
        full_name: 'Ibrahim Fatima Zahra',
        dob: '2010-11-30',
        gender: 'Female',
        class_id: jss1b.id,
        genotype: 'AA',
        blood_group: 'O+',
        status: 'active'
      },
      {
        reg_no: 'GRA/2024/005',
        full_name: 'Eze Blessing Chidinma',
        dob: '2010-07-18',
        gender: 'Female',
        class_id: jss1b.id,
        genotype: 'AS',
        blood_group: 'AB+',
        status: 'active'
      }
    ];

    for (const studentData of students) {
      await Student.create(studentData);
    }

    console.log('✓ Students created');

    console.log('\n✅ Database seeding completed successfully!');
    console.log('\n📝 Default Credentials:');
    console.log('   Admin: admin@gra.edu.ng / admin123');
    console.log('   Teacher: john.okafor@gra.edu.ng / admin123');
    console.log('   Class Teacher: sarah.ibrahim@gra.edu.ng / admin123');
    console.log('   Accountant: ahmed.bello@gra.edu.ng / admin123');
    console.log('   Parent: grace.adeyemi@gmail.com / admin123');
    console.log('\n🎓 Sample Data Created:');
    console.log('   - 1 Academic Session (2024/2025)');
    console.log('   - 3 Terms');
    console.log('   - 3 Classes');
    console.log('   - 5 Subjects');
    console.log('   - 5 Students');
    console.log('   - 3 Subject Assignments\n');

    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding error:', error);
    process.exit(1);
  }
};

// Run seeder
seedDatabase();
