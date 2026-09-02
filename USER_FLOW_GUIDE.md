# Asset Management System - User Flow Guide

## Table of Contents
1. [Admin Dashboard User Flow](#admin-dashboard-user-flow)
2. [Company Dashboard User Flow](#company-dashboard-user-flow)
3. [Authentication Flow](#authentication-flow)
4. [Common Operations](#common-operations)
5. [Troubleshooting](#troubleshooting)

---

## Admin Dashboard User Flow

### 1. Login to Admin Dashboard

**Step 1:** Navigate to the application
- Open browser and go to `http://localhost:3001`

**Step 2:** Login as Admin
- Click on "Sign in with Google" OR
- Enter admin credentials:
  - Email: `admin@assetmanagement.com`
  - Password: `admin123`

**Step 3:** Access Admin Dashboard
- After successful login, you will be redirected to the Admin Dashboard
- The dashboard shows an overview of all companies and employees

### 2. Manage Companies

#### View All Companies
- Navigate to the Companies section
- View a table showing all registered companies with details:
  - Company Name
  - Company Email
  - Mobile Number
  - GST Number
  - Unique Code
  - Subscription Status
  - Total Users
  - Status (Active/Blocked)

#### Add New Company
1. Click the "Add Company" button
2. Fill in the required fields:
   - Company Name (required)
   - Company GST (optional)
   - Mobile Number (required)
   - Company Email (required)
   - Unique Code (required)
   - Subscription Name (optional)
   - Subscription From Date (optional)
   - Subscription To Date (optional)
   - Total User In Company (optional)
3. Click "Save" to create the company
4. The company will be added to the database and appear in the list

#### Edit Company Details
1. Click the "Edit" button next to the company you want to modify
2. Update the desired fields in the modal
3. Click "Save Changes" to update the company
4. Changes are immediately reflected in the database

#### Block/Unblock Company
1. Click the "Block" button next to the company
2. Confirm the action when prompted
3. The company status changes to "Blocked"
4. Blocked companies cannot access their dashboard
5. To unblock, click "Unblock" and confirm

#### Delete Company
1. Click the "Delete" button next to the company
2. Confirm the deletion when prompted
3. The company and all associated data are permanently removed

### 3. Manage Employees

#### View All Employees
- Navigate to the Employees section
- View a table showing all employees across companies:
  - Employee Name
  - Company Name
  - Mobile Number
  - Designation
  - Email
  - Status

#### Add New Employee
1. Click the "Add Employee" button
2. Fill in the required fields:
   - Company Name (required)
   - Employee Name (required)
   - Mobile Number (required)
   - Designation (required)
   - Email (required)
   - Password (optional)
3. Click "Save" to create the employee
4. The employee will be added to the database

#### Edit Employee Details
1. Click the "Edit" button next to the employee
2. Update the desired fields
3. Click "Save Changes" to update
4. Changes are saved to the database

#### Recycle Employee
1. Click the "Recycle" button next to the employee
2. Provide a reason for recycling
3. The employee status changes to "Recycled"
4. Recycled employees can be recovered later

#### Recover Employee
1. Click the "Recover" button next to a recycled employee
2. The employee status changes back to "Active"
3. The employee can access the system again

### 4. View Dashboard Statistics
- **Total Companies**: Number of registered companies
- **Total Employees**: Number of employees across all companies
- **Active Companies**: Number of currently active companies
- **Blocked Companies**: Number of blocked companies

---

## Company Dashboard User Flow

### 1. Login to Company Dashboard

**Step 1:** Navigate to the application
- Open browser and go to `http://localhost:3001`

**Step 2:** Login as Company User
- Click on "Sign in with Google" OR
- Enter company dashboard credentials:
  - Email: `company@techcorp.com`
  - Password: `company123`

**Step 3:** Access Company Dashboard
- After successful login, you will be redirected to the Company Dashboard
- The dashboard shows asset statistics and organizational data

### 2. View Dashboard Overview

#### Asset Statistics
- **Total Assets**: Total number of assets owned by the company
- **Active Assets**: Number of currently active assets
- **Sold Assets**: Number of assets that have been sold
- **Scraped Assets**: Number of assets that have been scrapped

#### Branch Overview
- View all branches in a table format
- See branch details:
  - Branch Name
  - Address
  - Pincode
  - Category (Long term/Short term/No)
  - Status

#### Department Overview
- View all departments in a table format
- See department details:
  - Department Name
  - Department Manager
  - Number of employees

#### Asset Usage by Department
- View asset distribution across departments
- See which departments have the most assets

#### Asset Usage by Branch
- View asset distribution across branches
- See which branches have the most assets

### 3. Manage Branches

#### View All Branches
- Navigate to "Branch Management" from the sidebar
- View all branches in card or table format
- Each branch shows:
  - Branch Name
  - Address
  - Category
  - Status
  - Action buttons (Edit, Block)

#### Add New Branch
1. Click the "Add Branch" button
2. Fill in the required fields:
   - Branch Name (required)
   - Address (required)
   - Pincode (optional)
   - Category (required) - Select from:
     - Yes, Long term
     - Yes, Short term
     - No
3. Click "Save" to create the branch
4. The branch is added to the database and appears in the list

#### Edit Branch
1. Click the "Edit" button on a branch card
2. Update the desired fields
3. Click "Save Changes" to update
4. Changes are immediately saved to the database

#### Block Branch
1. Click the "Block" button on a branch card
2. Confirm the action
3. The branch status changes to "Blocked"
4. Assets in blocked branches cannot be transferred

### 4. Manage Departments

#### View All Departments
- Navigate to "Department Management" from the sidebar
- View all departments in card or table format
- Each department shows:
  - Department Name
  - Department Manager
  - Action buttons (Edit, Delete)

#### Add New Department
1. Click the "Add Department" button
2. Fill in the required fields:
   - Department Name (required)
   - Department Manager (optional)
3. Click "Save" to create the department
4. The department is added to the database

#### Edit Department
1. Click the "Edit" button on a department card
2. Update the desired fields
3. Click "Save Changes" to update
4. Changes are saved to the database

#### Delete Department
1. Click the "Delete" button on a department card
2. Confirm the deletion
3. The department is permanently removed from the database

### 5. Manage Asset Categories

#### View All Categories
- Navigate to "Asset Categories" from the sidebar
- View all categories in table format
- Each category shows:
  - Category Name
  - Category Code
  - Action buttons (Edit, Delete)

#### Add New Category
1. Click the "Add Category" button
2. Fill in the required fields:
   - Category Name (required)
   - Category Code (optional)
3. Click "Save" to create the category
4. The category is added to the database

#### Edit Category
1. Click the "Edit" button next to a category
2. Update the desired fields
3. Click "Save Changes" to update
4. Changes are saved to the database

#### Delete Category
1. Click the "Delete" button next to a category
2. Confirm the deletion
3. The category is permanently removed
4. Assets in this category will have their category set to null

### 6. Manage Assets

#### View All Assets
- Navigate to "Assets" from the sidebar
- View all assets in a table with details:
  - Asset Name
  - Category
  - Branch
  - Department
  - Serial Number
  - Purchase Date
  - Purchase Price
  - Status
  - Action buttons (Edit, Delete)

#### Filter Assets
- Use the filter dropdown to filter by:
  - Category
  - Status
- Use the search box to search by:
  - Asset Name
  - Description

#### Add New Asset
1. Click the "Add Asset" button
2. Fill in the required fields:
   - Asset Name (required)
   - Description (optional)
   - Category (required) - Select from existing categories
   - Branch (required) - Select from existing branches
   - Department (required) - Select from existing departments
   - Serial Number (optional)
   - Purchase Date (optional)
   - Purchase Price (optional)
   - Current Value (optional)
   - Condition (optional)
   - Location (optional)
   - Image URL (optional)
3. Click "Save" to create the asset
4. The asset is added to the database

#### Edit Asset
1. Click the "Edit" button next to an asset
2. Update the desired fields
3. Click "Save Changes" to update
4. Changes are saved to the database

#### Delete Asset
1. Click the "Delete" button next to an asset
2. Confirm the deletion
3. The asset is permanently removed from the database

### 7. Manage Profile

#### View Profile
- Navigate to "Profile" from the sidebar
- View your profile information:
  - Username
  - Email
  - Role
  - Company Name

#### Change Password
1. Navigate to "Profile" from the sidebar
2. Click "Change Password"
3. Enter current password
4. Enter new password
5. Confirm new password
6. Click "Change Password" to update
7. Password is updated in the database

#### Logout
1. Click the logout button in the sidebar or header
2. Confirm logout
3. You will be redirected to the login page
4. Your session token is invalidated

---

## Authentication Flow

### Google OAuth Login
1. Click "Sign in with Google"
2. Select your Google account
3. Grant permissions to the application
4. You will be redirected to the appropriate dashboard based on your role
5. Your Google profile picture will be displayed as your avatar

### Manual Login
1. Enter your email and password
2. Click "Login"
3. If credentials are valid, you will receive a JWT token
4. The token is stored in localStorage
5. You will be redirected to the appropriate dashboard

### Token Management
- JWT tokens expire after 24 hours
- Tokens are automatically sent with every API request
- If a token expires, you will be redirected to the login page
- Logout invalidates the token immediately

---

## Common Operations

### Form Validations
All forms include real-time validation:
- **Email**: Must be a valid email format
- **Phone**: Must be 10-15 digits
- **Password**: Minimum 6 characters, at least one uppercase, one lowercase, one number
- **GST**: Must be valid Indian GST format (15 characters)
- **Pincode**: Must be 6 digits
- **Required Fields**: Marked with red asterisk (*)

### Error Handling
- **Validation Errors**: Displayed below the field with red text
- **API Errors**: Displayed as error banners at the top of the page
- **Network Errors**: Displayed with retry options
- **Loading States**: Spinners and disabled buttons during operations

### Data Refresh
- Most data refreshes automatically after CRUD operations
- Manual refresh available via page reload
- Real-time updates for collaborative environments

---

## Troubleshooting

### Login Issues
**Problem:** Cannot login with credentials
- **Solution:** 
  - Verify email and password are correct
  - Check if account is blocked (contact admin)
  - Clear browser cache and cookies
  - Try logging in with Google OAuth

**Problem:** Google OAuth not working
- **Solution:**
  - Verify Google Client ID is configured
  - Check browser console for errors
  - Ensure popup blockers are disabled
  - Try in incognito mode

### Data Not Loading
**Problem:** Dashboard shows no data
- **Solution:**
  - Check if backend server is running (port 3000)
  - Verify database connection
  - Check browser console for API errors
  - Ensure you have proper permissions

**Problem:** Add/Update operations not working
- **Solution:**
  - Check form validation errors
  - Verify all required fields are filled
  - Check browser console for API errors
  - Ensure backend server is running
  - Verify JWT token is valid

### API Errors
**Problem:** 401 Unauthorized
- **Solution:** Your token has expired, login again

**Problem:** 403 Forbidden
- **Solution:** You don't have permission for this action, contact admin

**Problem:** 404 Not Found
- **Solution:** The requested resource doesn't exist, check the URL

**Problem:** 500 Server Error
- **Solution:** Backend server error, check server logs

### Performance Issues
**Problem:** Slow page load
- **Solution:**
  - Check internet connection
  - Clear browser cache
  - Close other browser tabs
  - Check server performance

### Mobile Issues
**Problem:** Layout broken on mobile
- **Solution:**
  - Use landscape mode
  - Update browser to latest version
  - Try different mobile browser

---

## Quick Reference

### Admin Credentials
- Email: `admin@assetmanagement.com`
- Password: `admin123`

### Company Dashboard Credentials
- Email: `company@techcorp.com`
- Password: `company123`

### Server URLs
- Frontend: `http://localhost:3001`
- Backend: `http://localhost:3000`
- Health Check: `http://localhost:3000/health`

### Important Notes
- Always logout when done
- Keep your password secure
- Report any bugs to the development team
- Regularly update your password
- Use strong passwords with special characters

---

## Support

For additional help or questions:
1. Check this user flow guide
2. Review the PRD documentation
3. Check browser console for errors
4. Contact the development team
5. Report issues with screenshots and error messages

---

**Last Updated:** August 27, 2026
**Version:** 1.0
