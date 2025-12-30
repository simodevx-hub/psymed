import React, { useMemo } from 'react';
import { 
  format, 
  startOfWeek, 
  addDays, 
  addHours, 
  setHours, 
  setMinutes, 
  isSameHour, 
  startOfDay,
  parseISO
} from 'date-fns';
import { fr } from 'date-fns/locale';
import { ChevronLeft, ChevronRight, Loader2, Trash2 } from 'lucide-react';
import { Slot } from '../../types';

interface CalendarViewProps {
  currentDate: Date;
  slots: Slot[];
  isLoading: boolean;
  onDateChange: (date: Date) => void;
  onSlotCreate: (date: Date) => void;
  onSlotDelete: (slotId: string) => void;
}

const HOURS = Array.from({ length: 13 }, (_, i) => i + 8); // 8 AM to 8 PM

export const CalendarView: React.FC<CalendarViewProps> = ({
  currentDate,
  slots,
  isLoading,
  onDateChange,
  onSlotCreate,
  onSlotDelete
}) => {
  const weekStart = useMemo(() => startOfWeek(currentDate, { weekStartsOn: 1 }), [currentDate]);
  
  const weekDays = useMemo(() => {
    return Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));
  }, [weekStart]);

  const handlePrevWeek = () => onDateChange(addDays(currentDate, -7));
  const handleNextWeek = () => onDateChange(addDays(currentDate, 7));

  // Helper to find a slot for a specific day and hour
  const getSlotForTime = (day: Date, hour: number) => {
    const targetTime = setMinutes(setHours(day, hour), 0);
    return slots.find(slot => isSameHour(parseISO(slot.start_time), targetTime));
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden flex flex-col h-[800px]">
      {/* Header */}
      <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
        <div className="flex items-center gap-4">
          <h2 className="text-lg font-bold font-display text-gray-900 capitalize">
            {format(weekStart, 'MMMM yyyy', { locale: fr })}
          </h2>
          <div className="flex bg-white rounded-lg border border-gray-200 p-0.5">
            <button onClick={handlePrevWeek} className="p-1 hover:bg-gray-100 rounded-md">
              <ChevronLeft className="w-5 h-5 text-gray-600" />
            </button>
            <button onClick={handleNextWeek} className="p-1 hover:bg-gray-100 rounded-md">
              <ChevronRight className="w-5 h-5 text-gray-600" />
            </button>
          </div>
        </div>
        
        <div className="flex items-center gap-4 text-sm">
           <div className="flex items-center gap-2">
             <div className="w-3 h-3 rounded-full bg-white border border-gray-300"></div>
             <span className="text-gray-600">Empty</span>
           </div>
           <div className="flex items-center gap-2">
             <div className="w-3 h-3 rounded-full bg-healing-100 border border-healing-300"></div>
             <span className="text-gray-600">Open</span>
           </div>
           <div className="flex items-center gap-2">
             <div className="w-3 h-3 rounded-full bg-blue-100 border border-blue-300"></div>
             <span className="text-gray-600">Booked</span>
           </div>
        </div>
      </div>

      {/* Grid Container - Scrollable */}
      <div className="flex-1 overflow-auto relative">
        {isLoading && (
          <div className="absolute inset-0 bg-white/50 backdrop-blur-sm z-10 flex items-center justify-center">
            <Loader2 className="w-8 h-8 text-healing-600 animate-spin" />
          </div>
        )}

        <div className="min-w-[800px]">
          {/* Days Header */}
          <div className="grid grid-cols-8 border-b border-gray-100 sticky top-0 bg-white z-20">
            <div className="p-3 text-center border-r border-gray-100 bg-gray-50/50">
              <span className="text-xs font-semibold text-gray-400">GMT+1</span>
            </div>
            {weekDays.map((day) => (
              <div key={day.toString()} className="p-3 text-center border-r border-gray-100 bg-gray-50/30">
                <div className="text-xs font-medium text-gray-500 uppercase">
                  {format(day, 'EEE', { locale: fr })}
                </div>
                <div className={`text-sm font-bold mt-1 ${
                  startOfDay(day).getTime() === startOfDay(new Date()).getTime() 
                    ? 'text-healing-600 bg-healing-50 w-8 h-8 rounded-full flex items-center justify-center mx-auto' 
                    : 'text-gray-900'
                }`}>
                  {format(day, 'd')}
                </div>
              </div>
            ))}
          </div>

          {/* Time Slots */}
          <div className="divide-y divide-gray-100">
            {HOURS.map((hour) => (
              <div key={hour} className="grid grid-cols-8 min-h-[60px]">
                {/* Time Label */}
                <div className="p-2 border-r border-gray-100 text-xs text-gray-500 text-right pr-4 pt-4 bg-gray-50/20">
                  {hour}:00
                </div>

                {/* Days Cells */}
                {weekDays.map((day) => {
                  const slot = getSlotForTime(day, hour);
                  const isBooked = slot?.status === 'booked';
                  const isOpen = slot?.status === 'open';

                  return (
                    <div 
                      key={`${day.toISOString()}-${hour}`} 
                      className="border-r border-gray-100 relative group transition-colors hover:bg-gray-50"
                    >
                      {slot ? (
                        <div className={`absolute inset-1 rounded-lg p-2 text-xs flex flex-col justify-between transition-all ${
                          isBooked 
                            ? 'bg-blue-100 text-blue-800 border border-blue-200' 
                            : 'bg-healing-100 text-healing-800 border border-healing-200 hover:bg-healing-200'
                        }`}>
                          <span className="font-semibold">
                            {isBooked ? slot.patient_name || 'Booked' : 'Open'}
                          </span>
                          
                          {/* Admin Actions */}
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              if (confirm('Are you sure you want to delete this slot?')) {
                                onSlotDelete(slot.id);
                              }
                            }}
                            className="self-end p-1 text-red-500 hover:bg-red-100 rounded opacity-0 group-hover:opacity-100 transition-opacity"
                            title="Delete Slot"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => onSlotCreate(setMinutes(setHours(day, hour), 0))}
                          className="w-full h-full opacity-0 group-hover:opacity-100 flex items-center justify-center"
                        >
                          <div className="w-6 h-6 rounded-full bg-gray-100 text-gray-400 flex items-center justify-center hover:bg-healing-100 hover:text-healing-600 transition-colors">
                            +
                          </div>
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};