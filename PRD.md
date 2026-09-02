# Asset Management System - Product Requirements Document

## Overview

The Asset Management System is a comprehensive web-based application for tracking and managing organizational assets. It provides separate dashboards for administrators and company users to manage companies, employees, branches, departments, asset categories, and assets efficiently.

## Technology Stack

### Frontend
- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: TailwindCSS
- **State Management**: React Hooks (custom hooks for data fetching)
- **Authentication**: JWT with Google OAuth integration
- **API Client**: Custom apiRequest utility

### Backend
- **Runtime**: Node.js with Express
- **Database**: PostgreSQL (Neon)
- **Authentication**: JWT with bcrypt for password hashing
- **API**: RESTful API with proper error handling
- **CORS**: Configured for cross-origin requests

## Features

### Admin Dashboard
- **Company Management**: View, create, edit, and block companies
- **Employee Management**: View, create, edit, and manage employees
- **User Statistics**: Overview of total companies, employees, and assets
- **Role-Based Access**: Admin-only access to all company data

### Company Dashboard
- **Asset Overview**: View total assets, sold assets, and scraped assets
- **Branch Management**: Create, edit, and manage company branches
- **Department Management**: Create, edit, and manage company departments
- **Asset Categories**: Create and manage asset categories
- **Asset Management**: Full CRUD operations for assets
- **User Profile**: View profile, change password, logout

### Authentication
- **Google OAuth**: Sign in with Google account
- **JWT Authentication**: Secure token-based authentication
- **Role-Based Authorization**: Admin, Company User, and Employee roles
- **Avatar Display**: Google profile picture integration

## Setup Instructions

### Prerequisites
- Node.js (v18 or higher)
- PostgreSQL database (Neon recommended)
- Google Cloud Console project (for OAuth)

### Backend Setup

1. **Navigate to backend directory**
   ```bash
   cd asset_backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   Create a `.env` file in the backend root:
   ```env
   DATABASE_URL=your_neon_postgresql_url
   JWT_SECRET=your_jwt_secret_key
   GOOGLE_CLIENT_ID=your_google_client_id
   GOOGLE_CLIENT_SECRET=your_google_client_secret
   CORS_ORIGIN=http://localhost:3001
   PORT=3000
   ```

4. **Initialize database**
   ```bash
   # Run the setup endpoint
   curl http://localhost:3000/setup
   
   # Or run the seed script
   node src/seedDatabase.js
   ```

5. **Start backend server**
   ```bash
   npm start
   ```
   Backend will run on `http://localhost:3000`

### Frontend Setup

1. **Navigate to frontend directory**
   ```bash
   cd asset-management
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   Create a `.env.local` file in the frontend root:
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:3000
   NEXT_PUBLIC_GOOGLE_CLIENT_ID=your_google_client_id
   ```

4. **Start frontend development server**
   ```bash
   npm run dev
   ```
   Frontend will run on `http://localhost:3001`

## Database Seeding

The project includes a comprehensive seed script to populate the database with sample data:

```bash
cd asset_backend
node src/seedDatabase.js
```

This creates:
- 1 Admin user
- 1 Company with dashboard user
- 5 Branches
- 5 Departments
- 5 Asset Categories
- 5 Assets
- 5 Employees

### Seed Login Credentials

After seeding, use these credentials to test:

**Admin Login:**
- Email: `admin@assetmanagement.com`
- Password: `admin123`

**Company Dashboard Login:**
- Email: `company@techcorp.com`
- Password: `company123`

**Employee Login:**
- Email: `rajesh@techcorp.com`
- Password: `employee123`

## User Flows

### Admin User Flow

1. **Login**
   - Navigate to `http://localhost:3001`
   - Click "Sign in with Google" or use admin credentials
   - Redirect to Admin Dashboard

2. **Manage Companies**
   - View all companies in a table
   - Click "Add Company" to create new company
   - Click "Edit" to modify company details
   - Click "Block" to block a company

3. **Manage Employees**
   - View all employees across companies
   - Add new employees
   - Edit employee details
   - Recycle employees

### Company User Flow

1. **Login**
   - Navigate to `http://localhost:3001`
   - Use company dashboard credentials
   - Redirect to Company Dashboard

2. **View Dashboard**
   - See asset statistics (total, sold, scraped)
   - View branch and department tables
   - View asset usage by department and branch

3. **Manage Branches**
   - Navigate to Branch Management
   - View all branches with details
   - Create new branches
   - Edit branch information
   - Block branches

4. **Manage Departments**
   - Navigate to Department Management
   - View all departments
   - Create new departments
   - Edit department details
   - Delete departments

5. **Manage Asset Categories**
   - Navigate to Asset Categories
   - View all categories
   - Create new categories
   - Edit category details
   - Delete categories

6. **Manage Assets**
   - Navigate to Assets
   - View all assets with details
   - Filter by category
   - Search assets
   - Create new assets
   - Edit asset information
   - Delete assets

### Employee User Flow

1. **Login**
   - Navigate to `http://localhost:3001`
   - Use employee credentials
   - Redirect to Employee Dashboard

2. **View Assigned Assets**
   - View assets assigned to the employee
   - Update asset status
   - Report asset issues

## API Endpoints

### Authentication
- `POST /api/auth/login/admin` - Admin login
- `POST /api/auth/login/company` - Company login
- `POST /api/auth/google` - Google OAuth login
- `POST /api/auth/refresh` - Refresh JWT token

### Admin Routes
- `GET /api/dashboard/companies` - List all companies
- `POST /api/dashboard/companies` - Create company
- `PUT /api/dashboard/companies/:id` - Update company
- `DELETE /api/dashboard/companies/:id` - Delete company
- `POST /api/dashboard/companies/:id/block` - Block company
- `GET /api/dashboard/employees` - List all employees
- `POST /api/dashboard/employees` - Create employee
- `PUT /api/dashboard/employees/:id` - Update employee
- `DELETE /api/dashboard/employees/:id` - Delete employee
- `POST /api/dashboard/employees/:id/recycle` - Recycle employee

### Company Dashboard Routes
- `GET /api/dashboard/org/branches` - List branches
- `POST /api/dashboard/org/branches` - Create branch
- `PUT /api/dashboard/org/branches/:id` - Update branch
- `DELETE /api/dashboard/org/branches/:id` - Delete branch
- `GET /api/dashboard/org/departments` - List departments
- `POST /api/dashboard/org/departments` - Create department
- `PUT /api/dashboard/org/departments/:id` - Update department
- `DELETE /api/dashboard/org/departments/:id` - Delete department
- `GET /api/dashboard/org/categories` - List asset categories
- `POST /api/dashboard/org/categories` - Create category
- `PUT /api/dashboard/org/categories/:id` - Update category
- `DELETE /api/dashboard/org/categories/:id` - Delete category
- `GET /api/dashboard/assets` - List assets
- `POST /api/dashboard/assets` - Create asset
- `PUT /api/dashboard/assets/:id` - Update asset
- `DELETE /api/dashboard/assets/:id` - Delete asset

### Dashboard Data
- `GET /api/dashboard/stats` - Get dashboard statistics
- `GET /api/dashboard/branches` - Get branch data
- `GET /api/dashboard/departments` - Get department data
- `GET /api/dashboard/asset-usage` - Get asset usage data

## Form Validations

The application includes comprehensive field validations:

### Email Validation
- Must be valid email format
- Required for most forms

### Phone Validation
- Must be 10-15 digits
- Supports international format with +

### Password Validation
- Minimum 6 characters
- At least one uppercase letter
- At least one lowercase letter
- At least one number

### GST Validation
- Indian GST format (15 characters)
- Optional field

### Pincode Validation
- 6-digit Indian pincode
- Optional field

### Date Validation
- Valid date format
- Future date validation where applicable

### Number Validation
- Must be valid number
- Positive number validation where applicable

## Error Handling

### Frontend Error Handling
- All API calls include try-catch blocks
- User-friendly error messages displayed
- Loading states for better UX
- Error boundaries for component errors

### Backend Error Handling
- Centralized error handling middleware
- Proper HTTP status codes
- Error logging for debugging
- Validation error responses

## Security Features

### Authentication
- JWT token-based authentication
- Token expiration handling
- Refresh token mechanism
- Secure password hashing with bcrypt

### Authorization
- Role-based access control
- Route protection middleware
- Company data isolation

### Data Security
- SQL injection prevention (parameterized queries)
- XSS protection (input sanitization)
- CORS configuration
- Environment variable protection

## Performance Optimization

### Frontend
- React hooks for efficient state management
- Lazy loading of components
- Optimistic UI updates
- Debounced search inputs

### Backend
- Database connection pooling
- Efficient query optimization
- Response caching where appropriate
- Pagination for large datasets

## Browser Compatibility

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## Deployment

### Backend Deployment
1. Set up PostgreSQL database (Neon recommended)
2. Configure environment variables
3. Deploy to Node.js hosting (Vercel, Railway, etc.)
4. Run database migrations
5. Execute seed script

### Frontend Deployment
1. Configure production environment variables
2. Build the application: `npm run build`
3. Deploy to Vercel, Netlify, or similar
4. Configure CORS for production backend URL

## Troubleshooting

### Common Issues

**Database Connection Error**
- Verify DATABASE_URL in .env file
- Check database server status
- Ensure SSL configuration is correct

**CORS Error**
- Verify CORS_ORIGIN in backend .env
- Check frontend API_URL configuration
- Ensure both servers are running

**Authentication Error**
- Verify JWT_SECRET is set
- Check token expiration
- Clear browser cookies/localStorage

**API 404 Errors**
- Verify backend server is running
- Check API endpoint paths
- Ensure proper authentication headers

## Future Enhancements

- [ ] Asset transfer workflow
- [ ] Asset decommissioning process
- [ ] Advanced reporting and analytics
- [ ] File upload for asset images
- [ ] Barcode/QR code generation for assets
- [ ] Mobile app development
- [ ] Real-time notifications
- [ ] Audit logging
- [ ] Multi-language support
- [ ] Advanced search and filtering

## Support

For issues or questions:
- Check the troubleshooting section
- Review API documentation
- Check browser console for errors
- Verify backend logs for server errors

## License

This project is proprietary and confidential.
