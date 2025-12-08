// app/contact/page.js
export const metadata = {
  title: "Contact – Stilly Math Pro",
  description: "Get in touch with Stilly Math Pro. Submit your questions or schedule a free consultation.",
  alternates: {
    canonical: "https://www.stillymathpro.com/contact",
  },
};

import ContactClient from "./ContactClient";

export default function ContactPage() {
  return <ContactClient />;
}
