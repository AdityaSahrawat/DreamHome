# Branch Management API

This directory contains API routes for managing branches in the DreamHome system.

## Authorization

- **GET /api/branches**: **Public access** - Anyone can view branches
- **POST /api/branches**: **Owner access only** - Only users with "owner" role can create branches

## API Endpoints

### 1. Get All Branches
**GET** `/api/branches`

Fetch all branches ordered by name. **No authentication required.**

**Response:**
```json
{
  "message": "Branches fetched successfully",
  "branches": [
    {
      "id": 1,
      "name": "Main Branch",
      "location": "Downtown",
      "createdAt": "2025-09-05T12:00:00.000Z"
    },
    {
      "id": 2,
      "name": "North Branch",
      "location": "North District",
      "createdAt": "2025-09-05T12:30:00.000Z"
    }
  ]
}
```

### 2. Create New Branch (Owner Only)
**POST** `/api/branches`

Create a new branch. **Restricted to owners only.**

**Headers:**
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Request:**
```json
{
  "name": "West Branch",
  "location": "West District"
}
```

**Response:**
```json
{
  "message": "Branch created successfully",
  "branch": {
    "id": 3,
    "name": "West Branch",
    "location": "West District",
    "createdAt": "2025-09-05T13:00:00.000Z"
  }
}
```

**Error Responses:**
- `403`: Only owners can create branches
- `409`: A branch with this name already exists
- `400`: Name and location are required

## Owner Features

### Branch Management Dashboard
Owners have access to a dedicated Branch Management section in their profile that includes:

- **View all branches**: Display existing branches with names, locations, and creation dates
- **Create new branches**: Form to add new branches with validation
- **Real-time updates**: Automatically refresh branch list after creation
- **Validation**: Prevents duplicate branch names

### UI Components
- Interactive branch creation form
- Responsive branch grid layout
- Loading states and error handling
- Success/error notifications

## Usage

### Frontend Integration
```javascript
// Fetch all branches
const response = await fetch('/api/branches');
const { branches } = await response.json();

// Create a new branch (owner only)
const newBranch = await fetch('/api/branches', {
  method: 'POST',
  headers: { 
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json' 
  },
  body: JSON.stringify({
    name: 'South Branch',
    location: 'South District'
  })
});
```

### Owner Dashboard Access
1. Login as owner
2. Navigate to profile page
3. Branch Management section appears automatically
4. Use "Create Branch" button to add new branches
