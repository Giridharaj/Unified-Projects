export interface User {
  uid: string;
  email: string;
  displayName: string;
  phoneNumber?: string;
  vehicleModel?: string;
  isAdmin?: boolean;
  createdAt: Date;
}

export interface Station {
  id: string;
  name: string;
  address: string;
  phone: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  totalSlots: number;
  availableSlots: number;
  pricePerHour: number;
  amenities: string[];
  operatingHours: {
    open: string;
    close: string;
  };
  status: 'active' | 'maintenance' | 'inactive';
  createdAt: Date;
}

export interface Booking {
  id: string;
  userId: string;
  stationId: string;
  startTime: Date;
  endTime: Date;
  totalHours: number;
  totalCost: number;
  status: 'pending' | 'confirmed' | 'active' | 'completed' | 'cancelled';
  vehicleDetails?: {
    model: string;
    registrationNumber: string;
  };
  createdAt: Date;
}

export interface Toast {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info' | 'warning';
}