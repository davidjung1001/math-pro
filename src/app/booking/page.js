import BookingClient from "./BookingClient"; // adjust path as needed

export const metadata = {
  title: "Book a Math Session – Stillwater Math Pro",
  description:
    "Schedule a free consultation or math tutoring session with Stillwater Math Pro. Choose a date, view real-time availability, and reserve your session.",
  alternates: {
    canonical: "https://stillymathpro.com/booking",
  },
};

export default function BookingPage() {
  return <BookingClient />;
}
