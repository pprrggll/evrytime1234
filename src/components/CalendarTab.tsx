import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Plus, Clock, X } from 'lucide-react';

interface CalendarEvent {
  id: string;
  teamId: string;
  title: string;
  date: string;
  time: string;
  description: string;
  createdBy: string;
}

interface CalendarTabProps {
  teamId: string;
  user: any;
}

export default function CalendarTab({ teamId, user }: CalendarTabProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [showNewEvent, setShowNewEvent] = useState(false);

  useEffect(() => {
    loadEvents();
  }, [teamId]);

  const loadEvents = () => {
    const savedEvents = localStorage.getItem(`events_${teamId}`);
    if (savedEvents) {
      setEvents(JSON.parse(savedEvents));
    }
  };

  const saveEvents = (updatedEvents: CalendarEvent[]) => {
    localStorage.setItem(`events_${teamId}`, JSON.stringify(updatedEvents));
    setEvents(updatedEvents);
  };

  const addEvent = (title: string, date: string, time: string, description: string) => {
    const newEvent: CalendarEvent = {
      id: Math.random().toString(36).substr(2, 9),
      teamId,
      title,
      date,
      time,
      description,
      createdBy: user.id
    };
    saveEvents([...events, newEvent]);
  };

  const deleteEvent = (eventId: string) => {
    saveEvents(events.filter(e => e.id !== eventId));
  };

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days: (Date | null)[] = [];
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    
    // Add all days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day));
    }
    
    return days;
  };

  const getEventsForDate = (date: Date) => {
    const dateStr = date.toISOString().split('T')[0];
    return events.filter(e => e.date === dateStr);
  };

  const goToPreviousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
  };

  const goToNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));
  };

  const days = getDaysInMonth(currentDate);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const selectedDateEvents = selectedDate ? getEventsForDate(selectedDate) : [];

  return (
    <div className="flex gap-6">
      {/* Calendar View */}
      <div className="flex-1">
        {/* Calendar Header */}
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl text-gray-900">
            {currentDate.toLocaleDateString('ko-KR', { year: 'numeric', month: 'long' })}
          </h3>
          <div className="flex items-center gap-2">
            <button
              onClick={goToPreviousMonth}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ChevronLeft className="size-5" />
            </button>
            <button
              onClick={() => setCurrentDate(new Date())}
              className="px-3 py-1.5 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              오늘
            </button>
            <button
              onClick={goToNextMonth}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ChevronRight className="size-5" />
            </button>
          </div>
        </div>

        {/* Calendar Grid */}
        <div className="border border-gray-200 rounded-lg overflow-hidden">
          {/* Weekday Headers */}
          <div className="grid grid-cols-7 bg-gray-50 border-b border-gray-200">
            {['일', '월', '화', '수', '목', '금', '토'].map((day, i) => (
              <div
                key={day}
                className={`py-2 text-center text-sm ${
                  i === 0 ? 'text-red-600' : i === 6 ? 'text-blue-600' : 'text-gray-700'
                }`}
              >
                {day}
              </div>
            ))}
          </div>

          {/* Calendar Days */}
          <div className="grid grid-cols-7">
            {days.map((day, index) => {
              if (!day) {
                return <div key={`empty-${index}`} className="aspect-square border-b border-r border-gray-200" />;
              }

              const dayEvents = getEventsForDate(day);
              const isToday = day.getTime() === today.getTime();
              const isSelected = selectedDate && day.getTime() === selectedDate.getTime();

              return (
                <button
                  key={day.toISOString()}
                  onClick={() => setSelectedDate(day)}
                  className={`aspect-square p-2 border-b border-r border-gray-200 hover:bg-gray-50 transition-colors ${
                    isToday ? 'bg-blue-50' : ''
                  } ${isSelected ? 'ring-2 ring-blue-500 ring-inset' : ''}`}
                >
                  <div className={`text-sm mb-1 ${
                    isToday ? 'inline-flex items-center justify-center size-6 bg-blue-600 text-white rounded-full' : 'text-gray-900'
                  }`}>
                    {day.getDate()}
                  </div>
                  {dayEvents.length > 0 && (
                    <div className="space-y-1">
                      {dayEvents.slice(0, 2).map(event => (
                        <div
                          key={event.id}
                          className="text-xs bg-blue-100 text-blue-800 px-1 py-0.5 rounded truncate"
                        >
                          {event.title}
                        </div>
                      ))}
                      {dayEvents.length > 2 && (
                        <div className="text-xs text-gray-500">+{dayEvents.length - 2}</div>
                      )}
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Event List Sidebar */}
      <div className="w-80 flex flex-col">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg text-gray-900">
            {selectedDate
              ? selectedDate.toLocaleDateString('ko-KR', { month: 'long', day: 'numeric' })
              : '일정'}
          </h3>
          <button
            onClick={() => setShowNewEvent(true)}
            className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="size-4" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto space-y-3">
          {selectedDate ? (
            selectedDateEvents.length > 0 ? (
              selectedDateEvents.map(event => (
                <div key={event.id} className="bg-white p-4 rounded-lg border border-gray-200">
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="text-gray-900">{event.title}</h4>
                    <button
                      onClick={() => deleteEvent(event.id)}
                      className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                    >
                      <X className="size-4" />
                    </button>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                    <Clock className="size-4" />
                    {event.time}
                  </div>
                  {event.description && (
                    <p className="text-sm text-gray-600">{event.description}</p>
                  )}
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-gray-400 text-sm">
                이 날짜에 일정이 없습니다
              </div>
            )
          ) : (
            <div className="text-center py-8 text-gray-400 text-sm">
              날짜를 선택하세요
            </div>
          )}
        </div>
      </div>

      {/* New Event Modal */}
      {showNewEvent && (
        <NewEventModal
          onClose={() => setShowNewEvent(false)}
          onAdd={addEvent}
          initialDate={selectedDate || new Date()}
        />
      )}
    </div>
  );
}

interface NewEventModalProps {
  onClose: () => void;
  onAdd: (title: string, date: string, time: string, description: string) => void;
  initialDate: Date;
}

function NewEventModal({ onClose, onAdd, initialDate }: NewEventModalProps) {
  const [title, setTitle] = useState('');
  const [date, setDate] = useState(initialDate.toISOString().split('T')[0]);
  const [time, setTime] = useState('09:00');
  const [description, setDescription] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (title) {
      onAdd(title, date, time, description);
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-xl max-w-md w-full p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="text-lg text-gray-900 mb-4">새 일정 추가</h3>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm text-gray-700 mb-1.5">
              제목 <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="팀 미팅"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm text-gray-700 mb-1.5">날짜</label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-700 mb-1.5">시간</label>
              <input
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm text-gray-700 mb-1.5">설명</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              rows={3}
              placeholder="일정에 대한 설명 (선택사항)"
            />
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              취소
            </button>
            <button
              type="submit"
              className="flex-1 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              추가
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
