import React, { useState } from 'react';
import { X, Calendar, Clock, CreditCard, Info } from 'lucide-react';
import { addDoc, collection, updateDoc, doc } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../../contexts/ToastContext';
import { Station, Booking } from '../../types';

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  station: Station;
}

const BookingModal: React.FC<BookingModalProps> = ({ isOpen, onClose, station }) => {
  const { currentUser } = useAuth();
  const { addToast } = useToast();
  const [loading, setLoading] = useState(false);
  const [bookingData, setBookingData] = useState({
    date: '',
    startTime: '',
    hours: 1,
    vehicleModel: '',
    registrationNumber: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;

    setLoading(true);
    try {
      const startDateTime = new Date(`${bookingData.date}T${bookingData.startTime}`);
      const endDateTime = new Date(startDateTime.getTime() + bookingData.hours * 60 * 60 * 1000);
      
      const booking: Omit<Booking, 'id'> = {
        userId: currentUser.uid,
        stationId: station.id,
        startTime: startDateTime,
        endTime: endDateTime,
        totalHours: bookingData.hours,
        totalCost: bookingData.hours * station.pricePerHour,
        status: 'pending',
        vehicleDetails: {
          model: bookingData.vehicleModel,
          registrationNumber: bookingData.registrationNumber
        },
        createdAt: new Date()
      };

      await addDoc(collection(db, 'bookings'), booking);
      
      // Update station availability
      await updateDoc(doc(db, 'stations', station.id), {
        availableSlots: station.availableSlots - 1
      });

      addToast('Booking confirmed successfully!', 'success');
      onClose();
    } catch (error) {
      console.error('Error creating booking:', error);
      addToast('Failed to create booking. Please try again.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setBookingData(prev => ({
      ...prev,
      [name]: name === 'hours' ? parseInt(value) : value
    }));
  };

  const totalCost = bookingData.hours * station.pricePerHour;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Book Charging Slot</h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          {/* Station Info */}
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <h3 className="font-semibold text-gray-900 mb-2">{station.name}</h3>
            <p className="text-sm text-gray-600 mb-2">{station.address}</p>
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">Price per hour: ₹{station.pricePerHour}</span>
              <span className="text-green-600 font-medium">
                {station.availableSlots} slots available
              </span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Date and Time */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  <Calendar className="h-4 w-4 inline mr-1" />
                  Date
                </label>
                <input
                  type="date"
                  name="date"
                  value={bookingData.date}
                  onChange={handleChange}
                  min={new Date().toISOString().split('T')[0]}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  <Clock className="h-4 w-4 inline mr-1" />
                  Start Time
                </label>
                <input
                  type="time"
                  name="startTime"
                  value={bookingData.startTime}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Duration */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Duration (hours)
              </label>
              <select
                name="hours"
                value={bookingData.hours}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {[1, 2, 3, 4, 5, 6, 8, 12].map(hour => (
                  <option key={hour} value={hour}>
                    {hour} hour{hour > 1 ? 's' : ''}
                  </option>
                ))}
              </select>
            </div>

            {/* Vehicle Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Vehicle Model
                </label>
                <input
                  type="text"
                  name="vehicleModel"
                  value={bookingData.vehicleModel}
                  onChange={handleChange}
                  placeholder="e.g., Tesla Model 3"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Registration Number
                </label>
                <input
                  type="text"
                  name="registrationNumber"
                  value={bookingData.registrationNumber}
                  onChange={handleChange}
                  placeholder="e.g., MH12AB1234"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Cost Summary */}
            <div className="bg-blue-50 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Total Cost</span>
                <span className="text-2xl font-bold text-blue-600">₹{totalCost}</span>
              </div>
              <div className="text-xs text-gray-500 mt-1">
                {bookingData.hours} hour{bookingData.hours > 1 ? 's' : ''} × ₹{station.pricePerHour}/hour
              </div>
            </div>

            {/* Important Info */}
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <div className="flex items-start space-x-2">
                <Info className="h-5 w-5 text-yellow-600 mt-0.5 flex-shrink-0" />
                <div className="text-sm text-yellow-800">
                  <p className="font-medium mb-1">Important Information:</p>
                  <ul className="list-disc list-inside space-y-1 text-xs">
                    <li>Please arrive within 15 minutes of your scheduled time</li>
                    <li>Late arrivals may result in slot cancellation</li>
                    <li>Cancellations must be made at least 2 hours in advance</li>
                    <li>Payment will be collected at the station</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex space-x-3">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-3 px-4 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 py-3 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
              >
                {loading ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                ) : (
                  <>
                    <CreditCard className="h-5 w-5 mr-2" />
                    Confirm Booking
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default BookingModal;