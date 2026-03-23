# Admin Credentials & User Management

## Admin Login Credentials

**Email:** `admin@smartfarming.com`  
**Password:** `admin123`

## Test User Accounts

### Farmer Accounts
1. **Farmer 1 (Kwame Mensah)**
   - Email: `farmer1@test.com`
   - Password: `farmer123`
   - Phone: +233501234568

2. **Farmer 2 (Ama Asante)**
   - Email: `farmer2@test.com`
   - Password: `farmer123`
   - Phone: +233501234569

### Consumer Account
- **Consumer (Kofi Owusu)**
  - Email: `consumer@test.com`
  - Password: `consumer123`
  - Phone: +233501234570

## Admin Dashboard Features

The admin can access all user information through the Admin Dashboard at `/admin`:

### User Management Tab
The admin dashboard includes a comprehensive "Users" tab that displays:

- **User ID** - Unique identifier for each user
- **Full Name** - First and last name
- **Email Address** - User's email
- **Phone Number** - Contact number
- **Role** - Admin, Farmer, or Consumer
- **Status** - Active, Inactive, or Suspended
- **Registration Date** - When the user joined

### Admin Capabilities

1. **View All Users**
   - Complete list of all registered users
   - Filter by role (Admin/Farmer/Consumer)
   - Filter by status (Active/Inactive/Suspended)
   - Search by name or email

2. **Create New Users**
   - Add new users with any role
   - Set initial status
   - Assign credentials

3. **Edit Users**
   - Update user information
   - Change role or status
   - Modify contact details

4. **Delete Users**
   - Remove users from the system
   - Confirmation required before deletion

5. **Additional Features**
   - Product approval/rejection
   - Order management
   - Audit log tracking
   - Platform statistics

## How to Access

1. Navigate to the login page
2. Enter admin credentials:
   - Email: `admin@smartfarming.com`
   - Password: `admin123`
3. Click "Login"
4. You'll be redirected to the Admin Dashboard
5. Click on the "Users" tab to view all user information

## Security Notes

- Admin credentials should be changed in production
- All passwords are hashed using bcrypt
- Admin actions are logged in the audit trail
- Only users with "Admin" role can access the admin dashboard
