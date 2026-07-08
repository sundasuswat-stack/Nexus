import React, { useState, useMemo } from 'react';
import { Calendar, dateFnsLocalizer, Views, SlotInfo } from 'react-big-calendar';
import { format, parse, startOfWeek, getDay } from 'date-fns';
import { enUS } from 'date-fns/locale';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';

// Calendar localization setup
const locales = { 'en-US': enUS };
const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek: () => startOfWeek(new Date(), { weekStartsOn: 1 }),
  getDay,
  locales,
});

// Types
interface MeetingEvent {
  id: string;
  title: string;
  start: Date;
  end: Date;
  status: 'available' | 'pending' | 'confirmed' | 'declined';
  requester?: string;
  note?: string;
}

const contacts = [
  'Michael Rodriguez',
  'Sarah Chen',
  'David Park',
  'Amara Okafor',
];

export const MeetingsPage: React.FC = () => {
  const [events, setEvents] = useState<MeetingEvent[]>([
    {
      id: '1',
      title: 'Available Slot',
      start: new Date(new Date().setHours(10, 0, 0, 0)),
      end: new Date(new Date().setHours(11, 0, 0, 0)),
      status: 'available',
    },
    {
      id: '2',
      title: 'Meeting with Michael Rodriguez',
      start: new Date(new Date().setDate(new Date().getDate() + 1)),
      end: new Date(new Date().setDate(new Date().getDate() + 1)),
      status: 'pending',
      requester: 'Michael Rodriguez',
    },
    {
      id: '3',
      title: 'Investor Call',
      start: new Date(new Date().setDate(new Date().getDate() + 2)),
      end: new Date(new Date().setDate(new Date().getDate() + 2)),
      status: 'confirmed',
    },
  ]);

  const [selectedEvent, setSelectedEvent] = useState<MeetingEvent | null>(null);
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [requestContact, setRequestContact] = useState(contacts[0]);
  const [requestDate, setRequestDate] = useState('');
  const [requestTime, setRequestTime] = useState('10:00');
  const [requestNote, setRequestNote] = useState('');

  // Add new availability slot by clicking/dragging on calendar
  const handleSelectSlot = (slotInfo: SlotInfo) => {
    const newEvent: MeetingEvent = {
      id: Date.now().toString(),
      title: 'Available Slot',
      start: slotInfo.start,
      end: slotInfo.end,
      status: 'available',
    };
    setEvents((prev) => [...prev, newEvent]);
  };

  const handleSelectEvent = (event: MeetingEvent) => {
    setSelectedEvent(event);
  };

  const acceptMeeting = (id: string) => {
    setEvents((prev) =>
      prev.map((e) => (e.id === id ? { ...e, status: 'confirmed' } : e))
    );
    setSelectedEvent(null);
  };

  const declineMeeting = (id: string) => {
    setEvents((prev) =>
      prev.map((e) => (e.id === id ? { ...e, status: 'declined' } : e))
    );
    setSelectedEvent(null);
  };

  const openRequestModal = () => {
    const defaultDate = new Date();
    defaultDate.setDate(defaultDate.getDate() + 3);
    setRequestDate(defaultDate.toISOString().split('T')[0]);
    setRequestTime('10:00');
    setRequestContact(contacts[0]);
    setRequestNote('');
    setShowRequestModal(true);
  };

  const sendMeetingRequest = () => {
    if (!requestDate) return;
    const [hours, minutes] = requestTime.split(':').map(Number);
    const start = new Date(requestDate);
    start.setHours(hours, minutes, 0, 0);
    const end = new Date(start);
    end.setHours(end.getHours() + 1);

    const newEvent: MeetingEvent = {
      id: Date.now().toString(),
      title: `Meeting with ${requestContact}`,
      start,
      end,
      status: 'pending',
      requester: requestContact,
      note: requestNote.trim() || undefined,
    };
    setEvents((prev) => [...prev, newEvent]);
    setShowRequestModal(false);
  };

  // Color-code events based on status
  const eventStyleGetter = (event: MeetingEvent) => {
    let backgroundColor = '#3B82F6'; // primary
    if (event.status === 'pending') backgroundColor = '#F59E0B'; // accent/warning
    if (event.status === 'confirmed') backgroundColor = '#22C55E'; // success
    if (event.status === 'declined') backgroundColor = '#EF4444'; // error
    if (event.status === 'available') backgroundColor = '#14B8A6'; // secondary

    return {
      style: {
        backgroundColor,
        borderRadius: '6px',
        opacity: 0.9,
        color: 'white',
        border: 'none',
        display: 'block',
      },
    };
  };

  const confirmedMeetings = useMemo(
    () => events.filter((e) => e.status === 'confirmed'),
    [events]
  );

  return (
    <div className="p-6">
      <div className="mb-6 flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Meeting Scheduling</h1>
          <p className="text-gray-500 mt-1">
            Manage your availability, meeting requests, and confirmed meetings.
          </p>
        </div>
        <Button variant="primary" onClick={openRequestModal}>
          Request Meeting
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calendar Section */}
        <div className="lg:col-span-2">
          <Card className="p-4">
            <div style={{ height: '600px' }}>
              <Calendar
                localizer={localizer}
                events={events}
                startAccessor="start"
                endAccessor="end"
                selectable
                onSelectSlot={handleSelectSlot}
                onSelectEvent={handleSelectEvent}
                eventPropGetter={eventStyleGetter}
                defaultView={Views.WEEK}
                views={[Views.MONTH, Views.WEEK, Views.DAY]}
              />
            </div>
          </Card>
        </div>

        {/* Sidebar: Confirmed Meetings + Legend */}
        <div className="space-y-6">
          <Card className="p-4">
            <h2 className="text-lg font-semibold text-gray-900 mb-3">
              Confirmed Meetings
            </h2>
            {confirmedMeetings.length === 0 ? (
              <p className="text-gray-500 text-sm">No confirmed meetings yet.</p>
            ) : (
              <ul className="space-y-2">
                {confirmedMeetings.map((m) => (
                  <li
                    key={m.id}
                    className="text-sm p-2 bg-success-50 border border-success-500/20 rounded-md"
                  >
                    <p className="font-medium text-gray-900">{m.title}</p>
                    <p className="text-gray-500">
                      {format(m.start, 'PPP p')}
                    </p>
                  </li>
                ))}
              </ul>
            )}
          </Card>

          <Card className="p-4">
            <h2 className="text-lg font-semibold text-gray-900 mb-3">Legend</h2>
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-secondary-500" /> Available
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-accent-500" /> Pending Request
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-success-500" /> Confirmed
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-error-500" /> Declined
              </div>
            </div>
            <p className="text-xs text-gray-400 mt-3">
              Tip: click and drag on the calendar to block out an availability slot.
            </p>
          </Card>
        </div>
      </div>

      {/* Modal for selected event (accept/decline pending requests) */}
      {selectedEvent && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <Card className="p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {selectedEvent.title}
            </h3>
            <p className="text-gray-500 text-sm mb-1">
              {format(selectedEvent.start, 'PPP p')} — {format(selectedEvent.end, 'p')}
            </p>
            {selectedEvent.note && (
              <p className="text-gray-500 text-sm mb-1 italic">"{selectedEvent.note}"</p>
            )}

            <div className="flex justify-end gap-2 mt-4">
              <Button variant="ghost" onClick={() => setSelectedEvent(null)}>
                Close
              </Button>
              {selectedEvent.status === 'pending' && (
                <>
                  <Button variant="error" onClick={() => declineMeeting(selectedEvent.id)}>
                    Decline
                  </Button>
                  <Button variant="success" onClick={() => acceptMeeting(selectedEvent.id)}>
                    Accept
                  </Button>
                </>
              )}
            </div>
          </Card>
        </div>
      )}

      {/* Request Meeting Modal */}
      {showRequestModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <Card className="p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Request a Meeting
            </h3>

            <label className="block text-sm font-medium text-gray-700 mb-1">With</label>
            <select
              value={requestContact}
              onChange={(e) => setRequestContact(e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2 mb-3 focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              {contacts.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>

            <div className="grid grid-cols-2 gap-3 mb-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                <input
                  type="date"
                  value={requestDate}
                  onChange={(e) => setRequestDate(e.target.value)}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Time</label>
                <input
                  type="time"
                  value={requestTime}
                  onChange={(e) => setRequestTime(e.target.value)}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
            </div>

            <label className="block text-sm font-medium text-gray-700 mb-1">Message (optional)</label>
            <textarea
              value={requestNote}
              onChange={(e) => setRequestNote(e.target.value)}
              rows={3}
              placeholder="What would you like to discuss?"
              className="w-full border border-gray-300 rounded-md px-3 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-primary-500"
            />

            <div className="flex justify-end gap-2">
              <Button variant="ghost" onClick={() => setShowRequestModal(false)}>
                Cancel
              </Button>
              <Button variant="primary" onClick={sendMeetingRequest}>
                Send Request
              </Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};