import { db } from '@/firebase';
import { collection, addDoc, Timestamp } from 'firebase/firestore';
import emailjs from '@emailjs/nodejs'; // only on server-side

export async function POST(req) {
  try {
    const { name, email, selectedDate, selectedTime } = await req.json();

    // Save booking to Firestore
    await addDoc(collection(db, 'bookings'), {
      name,
      email,
      time: selectedTime,
      date: Timestamp.fromDate(new Date(selectedDate)),
    });

    // Send email using EmailJS
    const serviceId = process.env.EMAILJS_SERVICE_ID;
    const templateId = process.env.EMAILJS_TEMPLATE_ID;
    const publicKey = process.env.EMAILJS_PUBLIC_KEY;
    const privateKey = process.env.EMAILJS_PRIVATE_KEY;

    const templateParams = {
      
      user_name: name,
      user_email: email,
      date: new Date(selectedDate).toLocaleDateString(),
      time: selectedTime,
    };

    await emailjs.send(serviceId, templateId, templateParams, {
      publicKey,
      privateKey,
    });

    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: 'Failed to book' }), {
      status: 500,
    });
  }
}
