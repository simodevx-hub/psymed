
import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import { Container } from '../components/layout/Container'
import { Button } from '../components/ui/Button'
import { CalendarView } from '../components/admin/CalendarView'


// Types
type Slot = {
    id: string
    start_time: string
    end_time: string
    status: 'open' | 'booked' | 'pending'
    patient_name?: string
    patient_phone?: string
}

export default function Admin() {
    const [slots, setSlots] = useState<Slot[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetchSlots()
    }, [])

    const fetchSlots = async () => {
        setLoading(true)
        const { data, error } = await supabase
            .from('slots')
            .select('*')
            .order('start_time', { ascending: true })

        if (error) {
            console.error('Error fetching slots:', error)
        } else {
            setSlots(data || [])
        }
        setLoading(false)
    }


    const handleDelete = async (id: string) => {
        if (!confirm('Supprimer ce créneau ?')) return

        const { error } = await supabase.from('slots').delete().eq('id', id)
        if (error) {
            alert('Erreur: ' + error.message)
        } else {
            fetchSlots()
        }
    }

    const handleAddSlot = async (date: Date) => {
        const end = new Date(date)
        end.setHours(end.getHours() + 1)

        const { error } = await supabase.from('slots').insert({
            start_time: date.toISOString(),
            end_time: end.toISOString(),
            status: 'open'
        })

        if (error) alert('Erreur: ' + error.message)
        else fetchSlots()
    }

    return (
        <Container className="py-8 h-screen flex flex-col">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-3xl font-bold font-sans text-gray-900">Tableau de bord</h1>
                    <p className="text-gray-500">Gérez vos disponibilités en cliquant sur le calendrier.</p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" onClick={fetchSlots} isLoading={loading}>Actualiser</Button>
                </div>
            </div>

            <div className="flex-1 min-h-0 bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <CalendarView
                    slots={slots}
                    loading={loading}
                    onAddSlot={handleAddSlot}
                    onDeleteSlot={handleDelete}
                />
            </div>
        </Container>
    )
}
