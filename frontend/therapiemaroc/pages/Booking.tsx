import React, { useEffect, useState, useMemo } from 'react';
import { format, parseISO, isBefore, startOfHour } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Globe, Clock, Smartphone, User, CheckCircle, AlertCircle } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { Slot, BookingFormData, DateGroupedSlots } from '../types';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';

// Helper to format Morocco time
const formatMoroccoTime = (date: Date) => {
  return date.toLocaleTimeString('fr-FR', {
    timeZone: 'Africa/Casablanca',
    hour: '2-digit',
    minute: '2-digit'
  });
};

export const Booking: React.FC = () => {
  const [slots, setSlots] = useState<Slot[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSlot, setSelectedSlot] = useState<Slot | null>(null);
  const [formData, setFormData] = useState<BookingFormData>({ name: '', phone: '' });
  const [bookingStatus, setBookingStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');

  useEffect(() => {
    const fetchOpenSlots = async () => {
      try {
        const now = new Date().toISOString();
        const { data, error } = await supabase
          .from('slots')
          .select('*')
          .eq('status', 'open')
          .gt('start_time', now) // Only future slots
          .order('start_time', { ascending: true });

        if (error) throw error;
        setSlots(data || []);
      } catch (err) {
        console.error("Fetch error", err);
      } finally {
        setLoading(false);
      }
    };

    fetchOpenSlots();
  }, []);

  // Group slots by date for better UI
  const groupedSlots = useMemo<DateGroupedSlots>(() => {
    const groups: DateGroupedSlots = {};
    slots.forEach(slot => {
      const dateKey = format(parseISO(slot.start_time), 'yyyy-MM-dd');
      if (!groups[dateKey]) groups[dateKey] = [];
      groups[dateKey].push(slot);
    });
    return groups;
  }, [slots]);

  const handleBook = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSlot) return;

    setBookingStatus('submitting');
    
    // Generate a simple reference ID
    const refId = `RDV-${Date.now().toString().slice(-6)}`;

    try {
      // 1. Lock slot in Supabase
      const { error } = await supabase
        .from('slots')
        .update({
          status: 'booked',
          patient_name: formData.name,
          patient_phone: formData.phone,
          reference_id: refId
        })
        .eq('id', selectedSlot.id)
        .eq('status', 'open'); // Concurrency check

      if (error) throw error;

      setBookingStatus('success');

      // 2. Redirect to WhatsApp
      const startTime = parseISO(selectedSlot.start_time);
      const moroccoTime = formatMoroccoTime(startTime);
      const message = `Bonjour, je souhaite confirmer mon rendez-vous (Ref: ${refId}).\nNom: ${formData.name}\nDate: ${format(startTime, 'dd/MM/yyyy')}\nHeure Maroc: ${moroccoTime}`;
      
      // Delay slightly for UX then redirect
      setTimeout(() => {
        window.location.href = `https://wa.me/212753235215?text=${encodeURIComponent(message)}`;
      }, 1500);

    } catch (err) {
      console.error(err);
      setBookingStatus('error');
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 pb-20">
      <div className="text-center mb-10 space-y-4">
        <h1 className="text-4xl font-display font-bold text-gray-900">
          Book Your Session
        </h1>
        <p className="text-xl text-gray-500 max-w-2xl mx-auto">
          Choose a time that works for you. All times are automatically converted to your local zone.
        </p>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-healing-500"></div>
        </div>
      ) : slots.length === 0 ? (
        <div className="text-center py-20 glass-panel rounded-2xl">
          <Clock className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900">No slots available</h3>
          <p className="text-gray-500">Please check back later for new openings.</p>
        </div>
      ) : (
        <div className="grid gap-8">
          {(Object.entries(groupedSlots) as [string, Slot[]][]).map(([dateKey, daySlots]) => (
            <div key={dateKey} className="space-y-4">
              <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2 capitalize">
                <span className="w-2 h-8 bg-healing-500 rounded-full"></span>
                {format(parseISO(dateKey), 'EEEE d MMMM', { locale: fr })}
              </h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {daySlots.map(slot => {
                  const startDate = parseISO(slot.start_time);
                  const isSelected = selectedSlot?.id === slot.id;

                  return (
                    <button
                      key={slot.id}
                      onClick={() => {
                        setSelectedSlot(slot);
                        setBookingStatus('idle'); // Reset if changing slot
                        // Scroll to form on mobile
                        if (window.innerWidth < 640) {
                           setTimeout(() => document.getElementById('booking-form')?.scrollIntoView({ behavior: 'smooth' }), 100);
                        }
                      }}
                      className={`
                        relative p-4 rounded-xl border transition-all text-left group
                        ${isSelected 
                          ? 'border-healing-500 bg-healing-50 ring-2 ring-healing-200' 
                          : 'border-gray-200 bg-white hover:border-healing-300 hover:shadow-md'
                        }
                      `}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <span className={`text-2xl font-bold font-display ${isSelected ? 'text-healing-700' : 'text-gray-900'}`}>
                          {format(startDate, 'HH:mm')}
                        </span>
                        {isSelected && <CheckCircle className="w-5 h-5 text-healing-600" />}
                      </div>
                      
                      <div className="space-y-1">
                        <div className="flex items-center gap-1.5 text-xs text-gray-500">
                           <Globe className="w-3 h-3" />
                           Your time
                        </div>
                        <div className="pt-2 border-t border-gray-100 mt-2">
                           <p className="text-xs font-medium text-gray-400 uppercase tracking-wider">Morocco Time</p>
                           <p className="text-sm font-semibold text-healing-700">
                             {formatMoroccoTime(startDate)}
                           </p>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Booking Form Modal/Section */}
      {selectedSlot && (
        <div id="booking-form" className="fixed bottom-0 left-0 right-0 p-4 sm:p-0 sm:relative sm:mt-12 z-40">
          <div className="glass-panel p-6 rounded-t-2xl sm:rounded-2xl shadow-[0_-10px_40px_-15px_rgba(0,0,0,0.1)] sm:shadow-xl border-t sm:border border-white/50 max-w-2xl mx-auto animate-in slide-in-from-bottom-10 fade-in duration-300">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-gray-900">Complete Booking</h3>
                <p className="text-sm text-gray-500">
                  {format(parseISO(selectedSlot.start_time), 'EEEE d MMMM @ HH:mm', { locale: fr })}
                </p>
              </div>
              <button 
                onClick={() => setSelectedSlot(null)}
                className="text-gray-400 hover:text-gray-600 sm:hidden"
              >
                Close
              </button>
            </div>

            <form onSubmit={handleBook} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Full Name"
                  placeholder="John Doe"
                  required
                  icon={<User className="w-4 h-4" />}
                  value={formData.name}
                  onChange={e => setFormData({...formData, name: e.target.value})}
                />
                <Input
                  label="Phone Number"
                  placeholder="+212 6..."
                  required
                  type="tel"
                  icon={<Smartphone className="w-4 h-4" />}
                  value={formData.phone}
                  onChange={e => setFormData({...formData, phone: e.target.value})}
                />
              </div>

              {bookingStatus === 'error' && (
                <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg flex items-center gap-2">
                  <AlertCircle className="w-4 h-4" />
                  Slot already taken or connection failed. Please try again.
                </div>
              )}

              <Button 
                type="submit" 
                className="w-full" 
                size="lg"
                isLoading={bookingStatus === 'submitting'}
                disabled={bookingStatus === 'success'}
              >
                {bookingStatus === 'success' ? 'Redirecting to WhatsApp...' : 'Confirm Appointment via WhatsApp'}
              </Button>
              
              <p className="text-xs text-center text-gray-400 mt-2">
                You will be redirected to WhatsApp to send a pre-filled confirmation message.
              </p>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};