# Backend Completion Guide

This guide will help you complete the remaining 30% of the backend implementation. All the hard work is done - you just need to follow the patterns!

## 📊 Current Status

**✅ Complete (70%)**
- All 16 database models
- All middleware (auth, validation, upload, etc.)
- All utilities and services
- Core controllers (auth, student, score)
- Core routes (auth, student, score)
- PDF generation, CSV import/export
- Socket.io real-time notifications
- Complete documentation

**⏳ Remaining (30%)**
- 10 additional controllers
- 10 additional routes
- Sequelize migrations (optional - schema SQL provided)

---

## 🎯 Step-by-Step Completion

### Step 1: Create User Controller

Create `src/controllers/userController.js`:

```javascript
const bcrypt = require('bcryptjs');
const { User } = require('../models');
const { successResponse, errorResponse, paginatedResponse } = require('../utils/responseFormatter');
const { logActivity } = require('../middleware/activityLogger');
const { Op } = require('sequelize');

const getUsers = async (req, res, next) => {
  try {
    const { page = 1, limit = 20, role, status, search } = req.query;
    const offset = (page - 1) * limit;

    const where = {};
    if (role) where.role = role;
    if (status) where.status = status;
    if (search) {
      where[Op.or] = [
        { name: { [Op.like]: `%${search}%` } },
        { email: { [Op.like]: `%${search}%` } }
      ];
    }

    const { count, rows } = await User.findAndCountAll({
      where,
      attributes: { exclude: ['password_hash'] },
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [['created_at', 'DESC']]
    });

    return paginatedResponse(res, rows, page, limit, count);
  } catch (error) {
    next(error);
  }
};

const getUserById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const user = await User.findByPk(id, {
      attributes: { exclude: ['password_hash'] }
    });

    if (!user) {
      return errorResponse(res, 404, 'User not found');
    }

    return successResponse(res, 200, 'User retrieved', user);
  } catch (error) {
    next(error);
  }
};

const createUser = async (req, res, next) => {
  try {
    const { name, email, phone, role, password } = req.body;
    
    const hashedPassword = await bcrypt.hash(password, 10);
    
    const user = await User.create({
      name,
      email,
      phone,
      role,
      password_hash: hashedPassword,
      status: 'active'
    });

    await logActivity(req, 'CREATE_USER', 'users', user.id, { email, role });

    const userData = user.toJSON();
    delete userData.password_hash;

    return successResponse(res, 201, 'User created successfully', userData);
  } catch (error) {
    next(error);
  }
};

const updateUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, phone, role, status } = req.body;

    const user = await User.findByPk(id);

    if (!user) {
      return errorResponse(res, 404, 'User not found');
    }

    await user.update({ name, phone, role, status });

    await logActivity(req, 'UPDATE_USER', 'users', user.id);

    const userData = user.toJSON();
    delete userData.password_hash;

    return successResponse(res, 200, 'User updated successfully', userData);
  } catch (error) {
    next(error);
  }
};

const deleteUser = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (parseInt(id) === req.user.id) {
      return errorResponse(res, 400, 'Cannot delete your own account');
    }

    const user = await User.findByPk(id);

    if (!user) {
      return errorResponse(res, 404, 'User not found');
    }

    await user.destroy();

    await logActivity(req, 'DELETE_USER', 'users', id);

    return successResponse(res, 200, 'User deleted successfully');
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser
};
```

### Step 2: Create User Routes

Create `src/routes/userRoutes.js`:

```javascript
const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const userController = require('../controllers/userController');
const { authenticate } = require('../middleware/auth');
const { isAdmin } = require('../middleware/authorize');
const validate = require('../middleware/validate');

const createUserValidation = [
  body('name').notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Valid email is required'),
  body('role').isIn(['admin', 'teacher', 'class_teacher', 'accountant', 'parent']).withMessage('Invalid role'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters')
];

const updateUserValidation = [
  body('name').optional().notEmpty().withMessage('Name cannot be empty'),
  body('role').optional().isIn(['admin', 'teacher', 'class_teacher', 'accountant', 'parent']).withMessage('Invalid role'),
  body('status').optional().isIn(['active', 'inactive']).withMessage('Invalid status')
];

router.get('/', authenticate, isAdmin, userController.getUsers);
router.get('/:id', authenticate, isAdmin, userController.getUserById);
router.post('/', authenticate, isAdmin, createUserValidation, validate, userController.createUser);
router.put('/:id', authenticate, isAdmin, updateUserValidation, validate, userController.updateUser);
router.delete('/:id', authenticate, isAdmin, userController.deleteUser);

module.exports = router;
```

### Step 3: Repeat for Other Controllers

Follow the same pattern for:

#### Session Controller (`sessionController.js`)
- `getSessions()` - Get all sessions
- `createSession()` - Create new session
- `updateSession()` - Update session
- `activateSession()` - Set as active session

#### Term Controller (`termController.js`)
- `getTerms()` - Get all terms
- `createTerm()` - Create new term
- `updateTerm()` - Update term
- `activateTerm()` - Set as active term

#### Class Controller (`classController.js`)
- `getClasses()` - Get all classes
- `getClassById()` - Get single class
- `createClass()` - Create new class
- `updateClass()` - Update class
- `deleteClass()` - Delete class

#### Subject Controller (`subjectController.js`)
- `getSubjects()` - Get all subjects
- `createSubject()` - Create subject
- `updateSubject()` - Update subject
- `deleteSubject()` - Delete subject
- `assignTeacher()` - Assign teacher to subject/class

#### Compiled Result Controller (`compiledResultController.js`)
- `getCompiledResults()` - Get results for class
- `compileResult()` - Compile student result
- `submitResult()` - Submit for approval
- `getPendingApprovals()` - Get pending (admin)
- `approveResult()` - Approve result (admin)
- `rejectResult()` - Reject result (admin)
- `getStudentResult()` - Get student's result
- `downloadResultPDF()` - Generate PDF

#### Payment Controller (`paymentController.js`)
- `getPayments()` - Get all payments
- `recordPayment()` - Record new payment
- `verifyPayment()` - Verify payment (accountant)
- `rejectPayment()` - Reject payment (accountant)
- `getStudentPayments()` - Get student's payments

#### Fee Controller (`feeController.js`)
- `getFeeStructures()` - Get fee structures
- `createFeeStructure()` - Create fee structure
- `updateFeeStructure()` - Update fee structure
- `getFeeByClass()` - Get fees for specific class/term

#### Notification Controller (`notificationController.js`)
- `getNotifications()` - Get user's notifications
- `sendNotification()` - Send notification (admin)
- `markAsRead()` - Mark notification as read

#### Report Controller (`reportController.js`)
- `getPaymentReport()` - Payment summary report
- `getClassPerformance()` - Class performance report
- `getStudentReport()` - Individual student report

#### Activity Log Controller (`activityLogController.js`)
- `getActivityLogs()` - Get activity logs (admin)
- `getMyActivity()` - Get current user's activity

---

## 🔧 Quick Reference

### Common Imports for Controllers
```javascript
const { Model } = require('../models');
const { successResponse, errorResponse, paginatedResponse } = require('../utils/responseFormatter');
const { logActivity } = require('../middleware/activityLogger');
const { Op } = require('sequelize');
```

### Common Route Structure
```javascript
const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const controller = require('../controllers/xxxController');
const { authenticate } = require('../middleware/auth');
const { authorize, isAdmin } = require('../middleware/authorize');
const validate = require('../middleware/validate');

// Define validation rules
const createValidation = [
  body('field').notEmpty().withMessage('Field is required')
];

// Define routes
router.get('/', authenticate, controller.getAll);
router.post('/', authenticate, isAdmin, createValidation, validate, controller.create);
router.put('/:id', authenticate, isAdmin, controller.update);
router.delete('/:id', authenticate, isAdmin, controller.delete);

module.exports = router;
```

### Update index.js

After creating each route file, add it to `src/index.js`:

```javascript
// Add at top with other imports
const userRoutes = require('./routes/userRoutes');
const sessionRoutes = require('./routes/sessionRoutes');
// ... etc

// Add with other route definitions
app.use('/api/users', userRoutes);
app.use('/api/sessions', sessionRoutes);
// ... etc
```

---

## 🧪 Testing Checklist

After creating each controller/route:

1. ✅ Import Postman collection
2. ✅ Login to get token
3. ✅ Test GET endpoint
4. ✅ Test POST endpoint
5. ✅ Test PUT endpoint
6. ✅ Test DELETE endpoint
7. ✅ Test with invalid data
8. ✅ Test authorization (different roles)

---

## 📝 Validation Rules Reference

Common validation patterns:

```javascript
// Required field
body('field').notEmpty().withMessage('Field is required')

// Email
body('email').isEmail().withMessage('Valid email required')

// Number
body('amount').isNumeric().withMessage('Must be a number')

// Enum
body('status').isIn(['active', 'inactive']).withMessage('Invalid status')

// Length
body('password').isLength({ min: 6 }).withMessage('Min 6 characters')

// Optional field
body('field').optional().notEmpty().withMessage('Cannot be empty if provided')

// Date
body('date').isISO8601().withMessage('Valid date required')

// Integer
body('id').isInt().withMessage('Must be an integer')

// Decimal
body('score').isFloat({ min: 0, max: 100 }).withMessage('Score must be 0-100')
```

---

## 🚀 Deployment After Completion

Once all files are created:

1. **Test Locally**
   ```bash
   npm run dev
   # Test all endpoints
   ```

2. **Run Migrations** (if created)
   ```bash
   npm run migrate
   ```

3. **Seed Database**
   ```bash
   npm run seed
   ```

4. **Deploy to Render/Railway**
   - Push to GitHub
   - Connect repository
   - Add environment variables
   - Deploy

5. **Test Production**
   - Update Postman baseUrl to production URL
   - Test all endpoints
   - Verify file uploads work
   - Test PDF generation
   - Test Socket.io connections

---

## 💡 Pro Tips

1. **Copy-Paste Wisely**: Use existing controllers as templates
2. **Test Incrementally**: Test each endpoint as you create it
3. **Check Models**: Refer to model files for field names
4. **Use Postman**: Import collection and test everything
5. **Read Errors**: Error messages will guide you
6. **Check Logs**: Use `console.log()` for debugging
7. **Follow Patterns**: All code follows same structure

---

## 🆘 Common Issues & Solutions

### Issue: "Cannot find module"
**Solution**: Check import path, ensure file exists

### Issue: "Validation error"
**Solution**: Check model constraints, ensure required fields provided

### Issue: "Unauthorized"
**Solution**: Ensure token is valid, check role permissions

### Issue: "Foreign key constraint"
**Solution**: Ensure referenced record exists (e.g., class_id must exist in classes table)

---

## ✅ Final Checklist

Before considering complete:

- [ ] All 10 controllers created
- [ ] All 10 routes created
- [ ] All routes added to `src/index.js`
- [ ] Tested with Postman
- [ ] Documentation updated
- [ ] Environment variables set
- [ ] Database seeded
- [ ] Deployed to hosting platform
- [ ] Production tested
- [ ] SSL configured
- [ ] Backups scheduled

---

## 📚 Additional Resources

- **Sequelize Docs**: https://sequelize.org/docs/v6/
- **Express Docs**: https://expressjs.com/
- **Express Validator**: https://express-validator.github.io/
- **JWT**: https://jwt.io/

---

## 🎓 Learning Path

If you're new to this stack:

1. Start with User controller (simplest)
2. Move to Session/Term (similar pattern)
3. Then Class/Subject (relationships)
4. Finally Payment/Result (complex logic)

Each one builds on the previous!

---

**You've got this! The hard part is done. Just follow the patterns and you'll complete it in no time! 🚀**

---

Generated: November 7, 2024
