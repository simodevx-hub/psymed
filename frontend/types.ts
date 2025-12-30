export type SlotStatus = 'open' | 'booked' | 'pending';

export interface Slot {
  id: string;
  start_time: string; // ISO String
  end_time: string;   // ISO String
  status: SlotStatus;
  patient_name?: string | null;
  patient_phone?: string | null;
  reference_id?: string | null;
  created_at: string;
}

export interface BookingFormData {
  name: string;
  phone: string;
}

export interface DateGroupedSlots {
  [date: string]: Slot[];
}