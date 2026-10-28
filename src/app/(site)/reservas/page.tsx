import { PageHero } from '@/components/site/PageHero';
import { ReservationForm } from '@/components/site/ReservationForm';
import { getBlockedDates, getSettings } from '@/lib/availability';
import { addDays, todayStr } from '@/lib/dates';
import { getContent } from '@/lib/content';

export const metadata = {
  title: 'Reservá tu mesa',
  description: 'Reservá online tu mesa, merienda, tarde de té o festejo en Olivia Pastelería y Café, Mendoza. Elegí fecha y horario en un minuto.',
  alternates: { canonical: '/reservas' },
};

export const dynamic = 'force-dynamic';

export default async function ReservasPage({ searchParams }: { searchParams: Promise<{ tipo?: string; menu?: string }> }) {
  const { tipo, menu } = await searchParams;
  const [settings, blocked, tea, meriendas, contact] = await Promise.all([getSettings(), getBlockedDates(), getContent('tardes-de-te'), getContent('meriendas'), getContent('contacto')]);
  const today = todayStr();

  return (
    <>
      <PageHero eyebrow="Reservas" title="Reservá" script="tu mesa" description="Elegí el día y el horario, y nosotros te la guardamos. Te confirmamos por WhatsApp." image="/img/reservas-header.jpg" imageAlt="Café con arte latte en una taza de cerámica floral" />
      <section className="container-x max-w-3xl py-14">
        <ReservationForm
          today={today}
          maxDate={addDays(today, settings.maxAdvanceDays)}
          openWeekdays={settings.openWeekdays}
          blocked={blocked}
          maxPartySize={settings.maxPartySize}
          reservationsOpen={settings.reservationsOpen}
          closedMessage={settings.closedMessage}
          initialType={tipo?.toUpperCase()}
          initialMenu={menu}
          tea={{ menus: tea.menus.filter((m) => m.visible), minGuests: tea.minGuests, depositPct: tea.depositPct, schedule: tea.schedule }}
          meriendaOpen={meriendas.reservable}
          whatsappNumber={contact.whatsappNumber}
        />
      </section>
    </>
  );
}
