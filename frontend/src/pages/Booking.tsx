
import { useEffect, useState, type FormEvent } from 'react'
import { supabase } from '../lib/supabase'
import { Container } from '../components/layout/Container'
import { Button } from '../components/ui/Button'
import { Card } from '../components/ui/Card'
import { Input } from '../components/ui/Input'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'

type Slot = {
    id: string
    start_time: string
    end_time: string
    status: 'open' | 'booked' | 'pending'
}

export default function Booking() {
    const [slots, setSlots] = useState<Slot[]>([])
    const [loading, setLoading] = useState(true)
    const [selectedSlot, setSelectedSlot] = useState<Slot | null>(null)

    // Form State
    const [name, setName] = useState('')
    const [phone, setPhone] = useState('')
    const [bookingLoading, setBookingLoading] = useState(false)

    useEffect(() => {
        fetchSlots()
    }, [])

    const fetchSlots = async () => {
        const { data } = await supabase
            .from('slots')
            .select('*')
            .eq('status', 'open')
            .gt('start_time', new Date().toISOString()) // Only future slots
            .order('start_time', { ascending: true })

        setSlots(data || [])
        setLoading(false)
    }

    const handleBook = async (e: FormEvent) => {
        e.preventDefault()
        if (!selectedSlot) return
        setBookingLoading(true)

        const refId = 'RDV-' + Math.random().toString(36).substr(2, 5).toUpperCase()

        // 1. Update DB
        const { error } = await supabase
            .from('slots')
            .update({
                status: 'pending',
                patient_name: name,
                patient_phone: phone,
                reference_id: refId
            })
            .eq('id', selectedSlot.id)
            .eq('status', 'open') // Optimistic lock check

        if (error) {
            alert('Désolé, ce créneau n\'est plus disponible.')
            fetchSlots()
            setSelectedSlot(null)
            setBookingLoading(false)
            return
        }

        // 2. Redirect to WhatsApp
        const marocTime = new Date(selectedSlot.start_time).toLocaleTimeString('fr-FR', {
            timeZone: 'Africa/Casablanca', hour: '2-digit', minute: '2-digit'
        })
        const dateStr = format(new Date(selectedSlot.start_time), 'dd/MM/yyyy', { locale: fr })

        const message = `Bonjour, je souhaite confirmer mon RDV du ${dateStr} à ${marocTime} (Ref: ${refId}). Mon nom est ${name}.`
        const whatsappUrl = `https://wa.me/212753235215?text=${encodeURIComponent(message)}`

        // Use window.open to avoid blocking if possible, or location.href
        window.location.href = whatsappUrl
    }

    return (
        <Container className="py-8 max-w-3xl">
            <div className="text-center mb-8">
                <h1 className="text-3xl font-bold font-sans text-primary-700">Prendre Rendez-vous</h1>
                <p className="text-gray-600 mt-2">Choisissez un créneau ci-dessous.</p>
            </div>

            {loading ? <div className="text-center">Chargement...</div> : (
                <div className="space-y-4">
                    {slots.map(slot => (
                        <Card key={slot.id} className={`p-4 transition-all ${selectedSlot?.id === slot.id ? 'ring-2 ring-primary-500 bg-primary-50/50' : 'hover:bg-gray-50'}`}>
                            <div className="flex justify-between items-center cursor-pointer" onClick={() => setSelectedSlot(slot)}>
                                <div>
                                    <p className="font-semibold text-lg capitalize text-gray-900">
                                        {format(new Date(slot.start_time), 'EEEE d MMMM', { locale: fr })}
                                    </p>
                                    <div className="flex flex-col sm:flex-row sm:gap-4 text-sm text-gray-600">
                                        <span>
                                            🕒 Maroc: <span className="font-medium text-primary-700">
                                                {new Date(slot.start_time).toLocaleTimeString('fr-FR', { timeZone: 'Africa/Casablanca', hour: '2-digit', minute: '2-digit' })}
                                            </span>
                                        </span>
                                        <span>
                                            Votre heure: <span className="font-medium">
                                                {format(new Date(slot.start_time), 'HH:mm')}
                                            </span>
                                        </span>
                                    </div>
                                </div>
                                <Button size="sm" variant={selectedSlot?.id === slot.id ? 'primary' : 'outline'}>
                                    {selectedSlot?.id === slot.id ? 'Sélectionné' : 'Choisir'}
                                </Button>
                            </div>

                            {selectedSlot?.id === slot.id && (
                                <form onSubmit={handleBook} className="mt-6 pt-4 border-t border-gray-200 animate-in fade-in slide-in-from-top-2">
                                    <div className="space-y-4">
                                        <Input
                                            label="Votre Nom Complet"
                                            required
                                            value={name}
                                            onChange={e => setName(e.target.value)}
                                            placeholder="Ex: Amine Benali"
                                        />
                                        <Input
                                            label="Téléphone (WhatsApp)"
                                            required
                                            type="tel"
                                            value={phone}
                                            onChange={e => setPhone(e.target.value)}
                                            placeholder="Ex: 06 12 34 56 78"
                                        />
                                        <Button type="submit" className="w-full bg-[#25D366] hover:bg-[#128C7E] text-white shadow-lg" isLoading={bookingLoading}>
                                            Confirmer via WhatsApp
                                        </Button>
                                        <p className="text-xs text-gray-500 text-center">
                                            Vous serez redirigé vers WhatsApp pour finaliser la réservation.
                                        </p>
                                    </div>
                                </form>
                            )}
                        </Card>
                    ))}

                    {slots.length === 0 && (
                        <div className="text-center py-12 bg-gray-50 rounded-2xl">
                            <p className="text-gray-500">Aucun créneau disponible pour le moment.</p>
                            <p className="text-sm text-gray-400 mt-1">Revenez plus tard ou contactez-nous directement.</p>
                        </div>
                    )}
                </div>
            )}
        </Container>
    )
}
