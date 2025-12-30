
import { useState, useMemo } from 'react'
import { startOfWeek, addDays, addHours, startOfDay, isSameDay, parseISO, format } from 'date-fns'
import { fr } from 'date-fns/locale'
import { ChevronLeft, ChevronRight, Loader2, Trash2 } from 'lucide-react'
import { cn } from '../../lib/utils'

// Types (should be shared ideally)
type Slot = {
    id: string
    start_time: string
    end_time: string
    status: 'open' | 'booked' | 'pending'
    patient_name?: string
    patient_phone?: string
}

interface CalendarViewProps {
    slots: Slot[]
    onAddSlot: (start: Date) => void
    onDeleteSlot: (id: string) => void
    loading?: boolean
}

export function CalendarView({ slots, onAddSlot, onDeleteSlot, loading }: CalendarViewProps) {
    const [currentDate, setCurrentDate] = useState(new Date())

    // Calendar Config
    const startHour = 8 // 8 AM
    const endHour = 20 // 8 PM
    const hours = useMemo(() => {
        const h = []
        for (let i = startHour; i < endHour; i++) h.push(i)
        return h
    }, [])

    const weekStart = startOfWeek(currentDate, { weekStartsOn: 1 }) // Monday
    const weekDays = useMemo(() => Array.from({ length: 7 }).map((_, i) => addDays(weekStart, i)), [weekStart])

    const nextWeek = () => setCurrentDate(addDays(currentDate, 7))
    const prevWeek = () => setCurrentDate(addDays(currentDate, -7))
    const today = () => setCurrentDate(new Date())

    // Helpers
    const getSlotsForCell = (day: Date, hour: number) => {
        return slots.filter(slot => {
            const slotStart = parseISO(slot.start_time)
            const isSameDate = isSameDay(slotStart, day)
            const slotHour = slotStart.getHours()
            return isSameDate && slotHour === hour
        })
    }

    const handleCellClick = (day: Date, hour: number) => {
        const date = startOfDay(day)
        date.setHours(hour)
        onAddSlot(date)
    }

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden flex flex-col h-[800px]">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-gray-50/50">
                <div className="flex items-center gap-2">
                    <h2 className="text-lg font-bold capitalize text-gray-900 w-48">
                        {format(currentDate, 'MMMM yyyy', { locale: fr })}
                    </h2>
                    <div className="flex items-center bg-white rounded-lg border border-gray-200 shadow-sm">
                        <button onClick={prevWeek} className="p-2 hover:bg-gray-50 rounded-l-lg border-r border-gray-200 transition-colors"><ChevronLeft size={20} /></button>
                        <button onClick={today} className="px-4 py-2 text-sm font-medium hover:bg-gray-50 transition-colors">Aujourd'hui</button>
                        <button onClick={nextWeek} className="p-2 hover:bg-gray-50 rounded-r-lg border-l border-gray-200 transition-colors"><ChevronRight size={20} /></button>
                    </div>
                </div>
                <div className="flex gap-4 text-sm">
                    <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-green-100 border border-green-300"></div>Disponible</div>
                    <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-blue-100 border border-blue-300"></div>Réservé</div>
                </div>
            </div>

            {/* Grid */}
            <div className="flex-1 overflow-y-auto">
                <div className="grid grid-cols-[60px_repeat(7,1fr)] min-w-[800px]">
                    {/* Header Row (Days) */}
                    <div className="sticky top-0 z-20 bg-white border-b border-gray-100 h-12"></div>
                    {weekDays.map(day => (
                        <div key={day.toString()} className={cn(
                            "sticky top-0 z-20 bg-white border-b border-gray-100 border-l border-gray-50 p-2 text-center",
                            isSameDay(day, new Date()) && "bg-primary-50/30"
                        )}>
                            <div className="text-xs font-medium text-gray-500 uppercase">{format(day, 'EEE', { locale: fr })}</div>
                            <div className={cn(
                                "text-lg font-bold mx-auto w-8 h-8 rounded-full flex items-center justify-center mt-1",
                                isSameDay(day, new Date()) ? "bg-primary-600 text-white shadow-md shadow-primary-200" : "text-gray-900"
                            )}>{format(day, 'd')}</div>
                        </div>
                    ))}

                    {/* Time Rows */}
                    {hours.map(hour => (
                        <>
                            {/* Time Label */}
                            <div key={`label-${hour}`} className="sticky left-0 bg-white z-10 border-b border-gray-50 border-r border-gray-100 text-xs text-gray-400 text-right pr-2 py-2 -mt-2.5 h-20">
                                {hour}:00
                            </div>

                            {/* Day Cells */}
                            {weekDays.map(day => {
                                const cellSlots = getSlotsForCell(day, hour)
                                const isPast = addHours(day, hour) < new Date()

                                return (
                                    <div
                                        key={`${day}-${hour}`}
                                        className={cn(
                                            "relative border-b border-gray-50 border-l border-gray-50 h-20 group transition-colors",
                                            !isPast && "hover:bg-gray-50/80 cursor-pointer"
                                        )}
                                        onClick={() => !isPast && handleCellClick(day, hour)}
                                    >
                                        {/* Add Trigger (Visible on Hover) */}
                                        {!isPast && cellSlots.length === 0 && (
                                            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 flex items-center justify-center pointer-events-none">
                                                <span className="text-2xl font-light text-primary-300">+</span>
                                            </div>
                                        )}

                                        {/* Slots */}
                                        <div className="absolute inset-1 space-y-1 overflow-hidden pointer-events-none">
                                            {cellSlots.map(slot => (
                                                <div
                                                    key={slot.id}
                                                    className={cn(
                                                        "h-full rounded-lg px-2 py-1 text-xs border border-l-4 shadow-sm pointer-events-auto flex flex-col justify-between group/slot transition-all hover:scale-[1.02] hover:shadow-md",
                                                        slot.status === 'open' ? "bg-green-50 border-green-200 border-l-green-500 text-green-900"
                                                            : slot.status === 'booked' ? "bg-blue-50 border-blue-200 border-l-blue-500 text-blue-900"
                                                                : "bg-yellow-50 border-yellow-200 border-l-yellow-500 text-yellow-900"
                                                    )}
                                                    onClick={(e) => {
                                                        e.stopPropagation()
                                                        onDeleteSlot(slot.id)
                                                    }}
                                                >
                                                    <div>
                                                        <span className="font-semibold block">
                                                            {slot.status === 'open' ? 'Libre' : slot.patient_name || 'Réservé'}
                                                        </span>
                                                        {slot.status !== 'open' && (
                                                            <span className="text-[10px] opacity-75">{slot.patient_phone}</span>
                                                        )}
                                                    </div>
                                                    {loading ? <Loader2 className="w-3 h-3 animate-spin ml-auto" /> : (
                                                        <button className="opacity-0 group-hover/slot:opacity-100 absolute top-1 right-1 p-1 hover:bg-black/10 rounded text-current transition-opacity">
                                                            <Trash2 size={12} />
                                                        </button>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )
                            })}
                        </>
                    ))}
                </div>
            </div>
        </div>
    )
}
