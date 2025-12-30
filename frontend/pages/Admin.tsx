import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { addHours, formatISO } from 'date-fns';
import { supabase } from '../lib/supabase';
import { Slot } from '../types';
import { CalendarView } from '../components/admin/CalendarView';
import { Button } from '../components/ui/Button';
import { LogOut } from 'lucide-react';

export const Admin: React.FC = () => {
  const navigate = useNavigate();
  const [slots, setSlots] = useState<Slot[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentDate, setCurrentDate] = useState(new Date());

  useEffect(() => {
    checkUser();
    fetchSlots();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const checkUser = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      navigate('/login');
    }
  };

  const fetchSlots = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('slots')
        .select('*');
      
      if (error) throw error;
      setSlots(data || []);
    } catch (err) {
      console.error('Error fetching slots:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSlotCreate = async (date: Date) => {
    // Optimistic UI update
    const tempId = Math.random().toString();
    const newSlot: Slot = {
      id: tempId,
      start_time: formatISO(date),
      end_time: formatISO(addHours(date, 1)),
      status: 'open',
      created_at: new Date().toISOString()
    };
    
    setSlots([...slots, newSlot]);

    try {
      const { data, error } = await supabase.from('slots').insert({
        start_time: newSlot.start_time,
        end_time: newSlot.end_time,
        status: 'open'
      }).select().single();

      if (error) throw error;
      
      // Replace temp with real
      setSlots(prev => prev.map(s => s.id === tempId ? data : s));
    } catch (err) {
      console.error("Failed to create slot", err);
      // Revert
      setSlots(prev => prev.filter(s => s.id !== tempId));
      alert("Failed to create slot. Check console.");
    }
  };

  const handleSlotDelete = async (id: string) => {
    const originalSlots = [...slots];
    setSlots(prev => prev.filter(s => s.id !== id));

    try {
      const { error } = await supabase.from('slots').delete().eq('id', id);
      if (error) throw error;
    } catch (err) {
      console.error("Failed to delete slot", err);
      setSlots(originalSlots);
      alert("Failed to delete slot.");
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/login');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-display font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-500">Manage your availability and upcoming sessions.</p>
        </div>
        <Button variant="outline" onClick={handleLogout} className="gap-2">
          <LogOut className="w-4 h-4" />
          Sign Out
        </Button>
      </div>

      <CalendarView 
        currentDate={currentDate}
        slots={slots}
        isLoading={loading}
        onDateChange={setCurrentDate}
        onSlotCreate={handleSlotCreate}
        onSlotDelete={handleSlotDelete}
      />
    </div>
  );
};