import React, { useState, useEffect } from 'react';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { Station } from '../../types';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../../contexts/ToastContext';
import { Search, Filter, MapPin, Phone, Clock, Zap, Star } from 'lucide-react';
import BookingModal from '../Booking/BookingModal';

const StationsPage: React.FC = () => {
  const { currentUser } = useAuth();
  const { addToast } = useToast();
  const [stations, setStations] = useState<Station[]>([]);
  const [filteredStations, setFilteredStations] = useState<Station[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStation, setSelectedStation] = useState<Station | null>(null);
  const [showBookingModal, setShowBookingModal] = useState(false);

  useEffect(() => {
    fetchStations();
  }, []);

  useEffect(() => {
    const filtered = stations.filter(station =>
      station.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      station.address.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredStations(filtered);
  }, [searchTerm, stations]);

  const fetchStations = async () => {
    try {
      const stationsRef = collection(db, 'stations');
      const querySnapshot = await getDocs(query(stationsRef, where('status', '==', 'active')));
      
      const stationsData: Station[] = [];
      querySnapshot.forEach((doc) => {
        stationsData.push({ id: doc.id, ...doc.data() } as Station);
      });
      
      setStations(stationsData);
      setFilteredStations(stationsData);
    } catch (error) {
      console.error('Error fetching stations:', error);
      addToast('Failed to load stations', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleBookNow = (station: Station) => {
    if (!currentUser) {
      addToast('Please login to book a charging slot', 'warning');
      return;
    }
    
    setSelectedStation(station);
    setShowBookingModal(true);
  };

  const getStatusColor = (availableSlots: number, totalSlots: number) => {
    const ratio = availableSlots / totalSlots;
    if (ratio > 0.5) return 'text-green-600 bg-green-100';
    if (ratio > 0.2) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading stations...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Charging Stations</h1>
          <p className="text-gray-600">Find and book available charging stations near you</p>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search by location or station name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <button className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
              <Filter className="h-5 w-5" />
              <span>Filters</span>
            </button>
          </div>
        </div>

        {/* Stations Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredStations.map((station) => (
            <div key={station.id} className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow border border-gray-200">
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">
                      {station.name}
                    </h3>
                    <div className="flex items-center text-gray-600 text-sm">
                      <MapPin className="h-4 w-4 mr-1" />
                      <span>{station.address}</span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Star className="h-4 w-4 text-yellow-500 fill-current" />
                    <span className="text-sm font-medium">4.5</span>
                  </div>
                </div>

                <div className="space-y-3 mb-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Available Slots</span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(station.availableSlots, station.totalSlots)}`}>
                      {station.availableSlots} / {station.totalSlots}
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Price per hour</span>
                    <span className="text-sm font-medium text-gray-900">₹{station.pricePerHour}</span>
                  </div>

                  <div className="flex items-center text-sm text-gray-600">
                    <Clock className="h-4 w-4 mr-1" />
                    <span>{station.operatingHours?.open || '24/7'}</span>
                  </div>

                  <div className="flex items-center text-sm text-gray-600">
                    <Phone className="h-4 w-4 mr-1" />
                    <span>{station.phone}</span>
                  </div>
                </div>

                <div className="flex space-x-3">
                  <button
                    onClick={() => handleBookNow(station)}
                    disabled={station.availableSlots === 0}
                    className={`flex-1 py-2 px-4 rounded-lg font-medium transition-colors ${
                      station.availableSlots === 0
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        : 'bg-blue-600 text-white hover:bg-blue-700'
                    }`}
                  >
                    {station.availableSlots === 0 ? 'Fully Booked' : 'Book Now'}
                  </button>
                  <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                    <MapPin className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredStations.length === 0 && (
          <div className="text-center py-12">
            <Zap className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No stations found</h3>
            <p className="text-gray-600">Try adjusting your search criteria</p>
          </div>
        )}
      </div>

      {/* Booking Modal */}
      {selectedStation && (
        <BookingModal
          isOpen={showBookingModal}
          onClose={() => {
            setShowBookingModal(false);
            setSelectedStation(null);
          }}
          station={selectedStation}
        />
      )}
    </div>
  );
};

export default StationsPage;