# EV Charging Station Booking System

A modern React application for booking electric vehicle charging stations with real-time availability and user management.

## Features

- **User Authentication**: Secure login and registration with Firebase Auth
- **Station Discovery**: Find nearby charging stations with real-time availability
- **Booking System**: Reserve charging slots in advance
- **Profile Management**: Update user information and vehicle details
- **Real-time Updates**: Live availability updates and booking confirmations
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Admin Panel**: Manage stations, bookings, and users (admin only)

## Tech Stack

- **Frontend**: React 18, TypeScript, Tailwind CSS
- **Backend**: Firebase (Authentication, Firestore, Storage)
- **Icons**: Lucide React
- **Build Tool**: Vite
- **Deployment**: Firebase Hosting

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- Firebase project with Authentication and Firestore enabled

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure Firebase:
   - Update `src/lib/firebase.ts` with your Firebase configuration
   - Deploy Firestore rules: `firebase deploy --only firestore:rules`

4. Start the development server:
   ```bash
   npm run dev
   ```

### Firebase Configuration

1. Create a new Firebase project
2. Enable Authentication with Email/Password
3. Enable Firestore Database
4. Update the Firebase configuration in `src/lib/firebase.ts`

### Database Structure

```
users/
  - uid (string)
  - email (string)
  - displayName (string)
  - phoneNumber (string)
  - vehicleModel (string)
  - isAdmin (boolean)
  - createdAt (timestamp)

stations/
  - name (string)
  - address (string)
  - phone (string)
  - coordinates (object)
  - totalSlots (number)
  - availableSlots (number)
  - pricePerHour (number)
  - status (string)
  - operatingHours (object)
  - createdAt (timestamp)

bookings/
  - userId (string)
  - stationId (string)
  - startTime (timestamp)
  - endTime (timestamp)
  - totalHours (number)
  - totalCost (number)
  - status (string)
  - vehicleDetails (object)
  - createdAt (timestamp)
```

## Security Features

- **Authentication**: Email/password authentication with Firebase Auth
- **Authorization**: Role-based access control (admin vs regular users)
- **Data Validation**: Client-side and server-side validation
- **Firestore Rules**: Secure database access rules
- **Real-time Updates**: Secure real-time data synchronization

## Access Control

The application implements proper access control to prevent "Access Denied" errors:

- Users can only access their own bookings and profile
- Station data is publicly readable but only admins can modify
- Proper authentication checks throughout the application
- Secure Firestore rules prevent unauthorized access

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

MIT License - see LICENSE file for details