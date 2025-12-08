'use client';

import { useState, useEffect } from 'react';
import { db } from '@/firebase';
import {
  collection,
  getDocs,
  query,
  where,
  Timestamp,
  addDoc,
} from 'firebase/firestore';
import { Calendar } from 'react-date-range';
import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';
import emailjs from '@emailjs/browser';

const generateTimeSlots = () => {
  const slots = [];
  let hour = 18;
  let minute = 0;

  while (hour < 22 || (hour === 21 && minute <= 30)) {
    const hour12 = hour > 12 ? hour - 12 : hour;
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const formatted = `${hour12}:${minute === 0 ? '00' : '30'} ${ampm}`;
    slots.push(formatted);
    minute += 30;
    if (minute === 60) {
      minute = 0;
      hour++;
    }
  }

  return slots;
};

const availableTimeSlots = generateTimeSlots();

export default function BookingClient() {
  const [selectedDate, setSelectedDate] = useState(null);
  const [bookedSlots, setBookedSlots] = useState([]);
  const [selectedTime, setSelectedTime] = useState('');
  const [form, setForm] = useState({ name: '', email: '' });
  const [status, setStatus] = useState('');

  useEffect(() => {
    if (!selectedDate) return;

    const fetchBookedSlots = async () => {
      const start = new Date(selectedDate);
      start.setHours(0, 0, 0, 0);
      const end = new Date(selectedDate);
      end.setHours(23, 59, 59, 999);

      const q = query(
        collection(db, 'bookings'),
        where('date', '>=', Timestamp.fromDate(start)),
        where('date', '<=', Timestamp.fromDate(end))
      );

      const querySnapshot = await getDocs(q);
      const booked = querySnapshot.docs.map((doc) => doc.data().time.trim());
      setBookedSlots(booked);
      setSelectedTime('');
    };

    fetchBookedSlots();
  }, [selectedDate]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.name || !form.email || !selectedTime || !selectedDate) {
      setStatus('Please complete all fields.');
      return;
    }

    setStatus('Sending booking...');

    try {
      await addDoc(collection(db, 'bookings'), {
        name: form.name,
        email: form.email,
        date: Timestamp.fromDate(selectedDate),
        time: selectedTime,
        createdAt: Timestamp.now(),
      });

      const adminParams = {
        recipient: 'Stillwater Math Pro Team',
        introText: 'You have received a new booking request:',
        user_name: form.name,
        user_email: form.email,
        selected_date: selectedDate.toDateString(),
        selected_time: selectedTime,
        email: 'opatmath@gmail.com',
        footerText: 'Please review and confirm this booking at your earliest convenience.',
      };

      await emailjs.send(
        'service_dm26ec6',
        'template_frg4men',
        adminParams,
        'lbYksoLilwFR_9FNF'
      );

      const userParams = {
        user_name: form.name,
        user_email: form.email,
        selected_date: selectedDate.toDateString(),
        selected_time: selectedTime,
        email: form.email,
        recipient: form.name,
        introText: 'Thank you for your booking!',
        footerText: 'We look forward to seeing you at your consultation.',
      };

      await emailjs.send(
        'service_dm26ec6',
        'template_frg4men',
        userParams,
        'lbYksoLilwFR_9FNF'
      );

      setStatus('Booking confirmed! Confirmation emails sent.');
      setForm({ name: '', email: '' });
      setSelectedTime('');
      setSelectedDate(null);
      setBookedSlots([]);
    } catch (error) {
      console.error(error);
      setStatus('Something went wrong sending email or saving booking.');
    }
  };

  return (
    <main className="max-w-3xl mx-auto px-4 py-12">
      <button
        onClick={() => window.history.back()}
        className="mb-4 flex items-center text-blue-600 hover:underline"
        aria-label="Go back"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5 mr-1"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
        </svg>
        Back
      </button>

      <h1 className="text-3xl font-bold mb-6">Book a Consultation</h1>

      <div className="grid md:grid-cols-2 gap-8">
        <div>
          <Calendar
            date={selectedDate || new Date()}
            onChange={setSelectedDate}
            minDate={new Date()}
          />

          {selectedDate && (
            <div className="mt-4">
              <h2 className="font-semibold mb-2">Available Time Slots</h2>
              <div className="grid grid-cols-3 gap-2">
                {availableTimeSlots.map((slot) => {
                  const isBooked = bookedSlots.includes(slot.trim());
                  return (
                    <button
                      key={slot}
                      disabled={isBooked}
                      onClick={() => setSelectedTime(slot)}
                      className={`px-3 py-2 rounded border text-sm ${
                        isBooked
                          ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                          : selectedTime === slot
                          ? 'bg-blue-600 text-white'
                          : 'bg-white text-gray-800 hover:bg-blue-100'
                      }`}
                    >
                      {slot}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Your Name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="w-full px-4 py-2 border rounded"
            required
          />
          <input
            type="email"
            placeholder="Your Email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className="w-full px-4 py-2 border rounded"
            required
          />
          <div>
            <label className="text-gray-600">Selected Time:</label>
            <div className="text-lg font-medium mt-1">
              {selectedTime || 'None'}
            </div>
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
          >
            Confirm Booking
          </button>
          {status && (
            <div className="text-sm text-gray-700 mt-2">{status}</div>
          )}
        </form>
      </div>
    </main>
  );
}
