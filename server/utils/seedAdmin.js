const User = require('../models/User');
const Company = require('../models/Company');

const seedAdmin = async () => {
  try {
    // ── 1. Super Admin (Controls All 5 Companies) ──
    const superUsername = 'sayam_2207';
    const superEmail = 'superadmin@hiraagro.com';
    const superPassword = 'Kalpesh@#2008';

    let superAdmin = await User.findOne({
      $or: [
        { role: 'super_admin' },
        { username: superUsername }
      ]
    }).select('+password');

    if (superAdmin) {
      superAdmin.name = 'Sayam (Super Admin)';
      superAdmin.username = superUsername;
      superAdmin.email = superEmail;
      superAdmin.role = 'super_admin';
      superAdmin.companyId = null;

      const isPassValid = await superAdmin.comparePassword(superPassword);
      if (!isPassValid) {
        superAdmin.password = superPassword;
      }
      await superAdmin.save();
      console.log(`✅ Super Admin ready — Username: "${superUsername}"`);
    } else {
      await User.create({
        name: 'Sayam (Super Admin)',
        username: superUsername,
        email: superEmail,
        password: superPassword,
        role: 'super_admin',
        companyId: null
      });
      console.log(`✅ Super Admin created — Username: "${superUsername}"`);
    }

    // ── 2. Company Specific Admins (5 Companies) ──
    const companyAdmins = [
      {
        slug: 'hira-agro',
        name: 'Admin (Hira Agro Industry)',
        username: 'admin',
        email: 'hiraagroindustry51@gmail.com',
        password: 'admin@123'
      },
      {
        slug: 'vishakha-kalpesh-mutha',
        name: 'Admin (Vishakha Kalpesh Mutha)',
        username: 'admin_vkm',
        email: 'vkm@hiraagro.com',
        password: 'vkm@123'
      },
      {
        slug: 'hiraben-dilip-mutha',
        name: 'Admin (Hiraben Dilip Mutha)',
        username: 'admin_hdm',
        email: 'hdm@hiraagro.com',
        password: 'hdm@123'
      },
      {
        slug: 'vishakha-agro',
        name: 'Admin (Vishakha Agro)',
        username: 'admin_va',
        email: 'va@hiraagro.com',
        password: 'va@123'
      },
      {
        slug: 'vishakha-rice-mill',
        name: 'Admin (Vishakha Rice Mill)',
        username: 'admin_vrm',
        email: 'vrm@hiraagro.com',
        password: 'vrm@123'
      }
    ];

    for (const adminData of companyAdmins) {
      const company = await Company.findOne({ slug: adminData.slug });
      if (!company) continue;

      let adminUser = await User.findOne({
        $or: [
          { username: adminData.username },
          { email: adminData.email }
        ]
      }).select('+password');

      if (adminUser) {
        adminUser.name = adminData.name;
        adminUser.username = adminData.username;
        adminUser.email = adminData.email;
        adminUser.role = 'admin';
        adminUser.companyId = company._id;

        const isPassValid = await adminUser.comparePassword(adminData.password);
        if (!isPassValid) {
          adminUser.password = adminData.password;
        }
        await adminUser.save();
        console.log(`✅ ${adminData.name} ready — Username: "${adminData.username}"`);
      } else {
        await User.create({
          name: adminData.name,
          username: adminData.username,
          email: adminData.email,
          password: adminData.password,
          role: 'admin',
          companyId: company._id
        });
        console.log(`✅ ${adminData.name} created — Username: "${adminData.username}"`);
      }
    }

  } catch (error) {
    console.error('Error seeding admin accounts:', error.message);
  }
};

module.exports = seedAdmin;
