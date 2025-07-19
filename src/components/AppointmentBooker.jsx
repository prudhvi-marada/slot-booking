import { useState, useEffect } from 'react';
import './AppointmentBooker.css';

const AppointmentBooker = () => {
  const start = 9;
  const end = 17;

  const [date, setDate] = useState(getToday());
  const [s, setS] = useState([]);
  const [booked, setBooked] = useState({});
  const [confirm, setConfirm] = useState('');
  const [admin, setAdmin] = useState('');

  function getToday() {
    return new Date().toISOString().split('T')[0];
  }

  useEffect(() => {
    const saved = localStorage.getItem('bookedSlots');
    if (saved) {
      setBooked(JSON.parse(saved));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('bookedSlots', JSON.stringify(booked));
  }, [booked]);

  useEffect(() => {
    const temp = [];
    for (let h = start; h < end; h++) {
      temp.push(`${pad(h)}:00`);
      temp.push(`${pad(h)}:30`);
    }
    setS(temp);
    setConfirm('');
  }, [date]);

  const pad = (n) => (n < 10 ? '0' + n : n);

  const handleBook = (slot) => {
    const curr = booked[date] || [];
    if (!curr.includes(slot)) {
      const up = { ...booked, [date]: [...curr, slot] };
      setBooked(up);
      setConfirm(`✅ Appointment booked for ${slot} on ${date}`);
    }
  };

  const isTaken = (slot) => {
    return booked[date]?.includes(slot);
  };

  const handleAdmin = () => {
    if (!admin) return;
    const curr = booked[date] || [];
    if (!curr.includes(admin)) {
      const up = { ...booked, [date]: [...curr, admin] };
      setBooked(up);
    }
    setAdmin('');
  };

  return (
    <div className="appointment-container">
      <h2>Appointment Slot Booker</h2>

      <div className="date-picker">
        <label>Select Date: </label>
        <input
          type="date"
          value={date}
          onChange={(e) => {
            setDate(e.target.value);
            setConfirm('');
          }}
        />
      </div>

      <p><strong>Working Hours:</strong> 9:00 AM – 5:00 PM</p>

      <div className="slots-list">
        {s.map((slot) => (
          <button
            key={slot}
            className={`slot-button ${isTaken(slot) ? 'booked' : 'available'}`}
            onClick={() => !isTaken(slot) && handleBook(slot)}
            disabled={isTaken(slot)}
          >
            {slot} {isTaken(slot) ? ' Booked' : ' Available'}
          </button>
        ))}
      </div>

      {confirm && <div className="confirmation">{confirm}</div>}

      <div className="admin-panel">
        <h4>Admin: Pre-book a Slot</h4>
        <input
          type="text"
          placeholder="e.g., 14:30"
          value={admin}
          onChange={(e) => setAdmin(e.target.value)}
        />
        <button onClick={handleAdmin}>Book Slot</button>
      </div>
    </div>
  );
};

export default AppointmentBooker;
