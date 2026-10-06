import { getServices, getStaff } from "@/lib/data";
import BookingForm from "@/components/BookingForm";

export const dynamic = "force-dynamic";
export const metadata = { title: "Book an Appointment" };

export default async function BookPage({ searchParams }) {
  const sp = await searchParams; // Next 16: searchParams is async
  const [services, staff] = await Promise.all([getServices(), getStaff()]);

  return (
    <div className="mx-auto max-w-2xl px-6 py-16">
      <div className="text-center">
        <p className="reveal text-xs uppercase tracking-[0.2em] text-accent">Appointments</p>
        <h1 className="reveal mt-2 font-serif text-5xl text-ink">Book your visit</h1>
        <p className="reveal mx-auto mt-3 max-w-md text-muted">
          Choose a service and a time that suits you. We&apos;ll confirm your appointment shortly.
        </p>
      </div>
      <div className="reveal mt-10">
        <BookingForm services={services} staff={staff} preselect={sp?.service || ""} />
      </div>
    </div>
  );
}
