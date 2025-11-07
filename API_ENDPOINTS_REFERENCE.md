# API ENDPOINTS QUICK REFERENCE

## Base URL
```
Development: http://localhost:5000/api
Production: https://api.gracelandacademy.edu.ng/api
```

## Authentication Endpoints

| Method | Endpoint | Description | Request Body |
|--------|----------|-------------|--------------|
| POST | `/auth/login` | User login | `{ username, password, role }` |
| PUT | `/auth/change-password` | Change password | `{ oldPassword, newPassword }` |

## User Management

| Method | Endpoint | Description | Request Body |
|--------|----------|-------------|--------------|
| POST | `/users` | Create user | `{ username, email, role, linkedId, password }` |
| GET | `/users` | Get all users | - |
| GET | `/users/:id` | Get user by ID | - |
| PUT | `/users/:id` | Update user | `{ ...userData }` |
| DELETE | `/users/:id` | Delete user | - |

## Classes

| Method | Endpoint | Description | Request Body |
|--------|----------|-------------|--------------|
| POST | `/classes` | Create class | `{ name, level, section, capacity }` |
| GET | `/classes` | Get all classes | - |
| GET | `/classes/:id` | Get class by ID | - |
| PUT | `/classes/:id` | Update class | `{ ...classData }` |
| DELETE | `/classes/:id` | Delete class | - |
| GET | `/class/:classId/students` | Get students in class | - |

## Subjects

| Method | Endpoint | Description | Query Params |
|--------|----------|-------------|--------------|
| POST | `/subjects` | Create subject | `{ name, code, department, isCore }` |
| GET | `/subjects` | Get all subjects | `?classId=` |
| GET | `/subjects/:id` | Get subject by ID | - |
| PUT | `/subjects/:id` | Update subject | `{ ...subjectData }` |
| DELETE | `/subjects/:id` | Delete subject | - |

## Class-Subject Assignments

| Method | Endpoint | Description | Query Params |
|--------|----------|-------------|--------------|
| POST | `/class-subjects` | Assign teacher to subject | `{ classId, subjectId, teacherId }` |
| GET | `/class-subjects` | Get assignments | `?teacherId=&classId=` |
| PUT | `/class-subjects/:id` | Update assignment | `{ ...assignmentData }` |
| DELETE | `/class-subjects/:id` | Delete assignment | - |

## Students

| Method | Endpoint | Description | Query Params |
|--------|----------|-------------|--------------|
| POST | `/students` | Create student | `{ firstName, lastName, classId, ... }` |
| GET | `/students` | Get all students | `?parentId=&classId=` |
| GET | `/students/:id` | Get student by ID | - |
| PUT | `/students/:id` | Update student | `{ ...studentData }` |
| DELETE | `/students/:id` | Delete student | - |
| POST | `/students/:id/link-parent` | Link parent to student | `{ parentId }` |

## Teachers

| Method | Endpoint | Description | Request Body |
|--------|----------|-------------|--------------|
| POST | `/teachers` | Create teacher | `{ firstName, lastName, email, ... }` |
| GET | `/teachers` | Get all teachers | - |
| GET | `/teachers/:id` | Get teacher by ID | - |
| PUT | `/teachers/:id` | Update teacher | `{ ...teacherData }` |
| DELETE | `/teachers/:id` | Delete teacher | - |

## Parents

| Method | Endpoint | Description | Request Body |
|--------|----------|-------------|--------------|
| POST | `/parents` | Create parent | `{ firstName, lastName, email, phone }` |
| GET | `/parents` | Get all parents | - |
| GET | `/parents/:id` | Get parent by ID | - |
| PUT | `/parents/:id` | Update parent | `{ ...parentData }` |
| DELETE | `/parents/:id` | Delete parent | - |

## Accountants

| Method | Endpoint | Description | Request Body |
|--------|----------|-------------|--------------|
| POST | `/accountants` | Create accountant | `{ firstName, lastName, email, ... }` |
| GET | `/accountants` | Get all accountants | - |
| GET | `/accountants/:id` | Get accountant by ID | - |
| PUT | `/accountants/:id` | Update accountant | `{ ...accountantData }` |
| DELETE | `/accountants/:id` | Delete accountant | - |

## Sessions & Terms

| Method | Endpoint | Description | Request Body |
|--------|----------|-------------|--------------|
| GET | `/sessions` | Get all sessions | - |
| PUT | `/sessions/:id/activate` | Activate session | - |
| GET | `/terms` | Get all terms | - |
| PUT | `/terms/:id/activate` | Activate term | - |

## Scores

| Method | Endpoint | Description | Request Body/Params |
|--------|----------|-------------|---------------------|
| POST | `/scores/bulk` | Create multiple scores | `{ scores: [...] }` |
| POST | `/scores/submit` | Submit scores | `{ scoreIds: [...] }` |
| GET | `/scores/class/:classId` | Get class scores | `?subjectId=&term=&session=` |
| GET | `/scores/export` | Export scores CSV | `?class=&subject=&term=&session=` |
| POST | `/scores/import` | Import scores CSV | FormData with file |

## Compiled Results

| Method | Endpoint | Description | Query Params |
|--------|----------|-------------|--------------|
| GET | `/compiled/:classId` | Get compiled results | `?term=&session=` |
| POST | `/compiled/:classId/save` | Save compiled result | `{ ...resultData }` |
| POST | `/compiled/:classId/submit` | Submit for approval | - |
| GET | `/results/student/:studentId` | Get student result | `?term=&session=` |
| GET | `/results/student/:studentId/pdf` | Download result PDF | `?term=&session=` |

## Results Approval

| Method | Endpoint | Description | Request Body |
|--------|----------|-------------|--------------|
| GET | `/results/pending` | Get pending approvals | - |
| POST | `/results/:id/approve` | Approve result | `{ approvedBy }` |
| POST | `/results/:id/reject` | Reject result | `{ reason }` |

## Fees

| Method | Endpoint | Description | Query Params |
|--------|----------|-------------|--------------|
| POST | `/fees` | Create fee structure | `{ classId, term, tuitionFee, ... }` |
| GET | `/fees` | Get fee structures | `?class=&term=&session=` |
| PUT | `/fees/:id` | Update fee structure | `{ ...feeData }` |
| DELETE | `/fees/:id` | Delete fee structure | - |

## Payments

| Method | Endpoint | Description | Request Body |
|--------|----------|-------------|--------------|
| POST | `/payments` | Create payment (online) | `{ studentId, amount, ... }` |
| POST | `/payments/manual` | Record manual payment | `{ studentId, amount, method }` |
| POST | `/payments/:id/verify` | Verify payment | - |
| GET | `/payments/pending` | Get pending payments | - |
| POST | `/payments/proof` | Upload payment proof | FormData with file |
| GET | `/payments/student/:studentId` | Get student payments | - |

## Notifications

| Method | Endpoint | Description | Request Body |
|--------|----------|-------------|--------------|
| GET | `/notifications` | Get all notifications | - |
| POST | `/notifications/send` | Send notification | `{ title, message, targetAudience }` |
| PUT | `/notifications/:id/read` | Mark as read | - |
| DELETE | `/notifications/:id` | Delete notification | - |

## Promotions

| Method | Endpoint | Description | Query Params |
|--------|----------|-------------|--------------|
| POST | `/promotions/compute` | Compute promotions | `?session=` |
| POST | `/promotions/promote` | Promote students | `{ studentIds, classMapping }` |

## Admissions

| Method | Endpoint | Description | Request Body |
|--------|----------|-------------|--------------|
| GET | `/admissions/status` | Get admission status | - |
| POST | `/admissions/apply` | Submit application | `{ ...applicationData }` |

## Settings

| Method | Endpoint | Description | Request Body |
|--------|----------|-------------|--------------|
| GET | `/settings/school` | Get school settings | - |
| PUT | `/settings/school` | Update school settings | `{ schoolName, motto, ... }` |
| GET | `/settings/bank-account` | Get bank settings | - |
| PUT | `/settings/bank-account` | Update bank settings | `{ bankName, accountNumber, ... }` |

## Activity Logs

| Method | Endpoint | Description | Query Params |
|--------|----------|-------------|--------------|
| GET | `/activity-logs` | Get activity logs | `?action=&date=` |

## Socket.io Events

### Client → Server
- `join_room` - Join a specific room (role-based)
- `leave_room` - Leave a room

### Server → Client
- `notification:new` - New notification received
- `notification:read` - Notification marked as read
- `result:submitted` - Result submitted for approval
- `result:approved` - Result approved
- `result:rejected` - Result rejected
- `payment:received` - New payment received
- `payment:verified` - Payment verified
- `announcement` - System announcement
- `system:update` - System update notification

## Response Format

### Success Response
```json
{
  "success": true,
  "data": { ... },
  "message": "Operation successful"
}
```

### Error Response
```json
{
  "success": false,
  "error": "Error message",
  "details": { ... }
}
```

## Authentication

All endpoints (except `/auth/login` and `/admissions/*`) require authentication.

Include JWT token in request headers:
```
Authorization: Bearer <token>
```

Token is automatically added by axios interceptor when using the API service.

## File Uploads

For file uploads (CSV import, payment proof), use `multipart/form-data`:

```typescript
const formData = new FormData();
formData.append('file', fileObject);
await api.scores.import(formData);
```

## Pagination

Some endpoints support pagination (to be implemented):
```
?page=1&limit=20
```

## Filtering

Use query parameters for filtering:
```
/students?classId=5&status=Active
/scores/class/3?term=First%20Term&session=2024/2025
```

## Rate Limiting

API is rate-limited to prevent abuse:
- 100 requests per 15 minutes per IP
- Exceeding limit returns 429 status

## CORS

CORS is enabled for:
- Development: `http://localhost:5173`
- Production: Your deployed frontend URL

Update backend `.env` to configure allowed origins.
