import React, { useEffect, useState } from 'react';
import API from '../services/Api';
import { jwtDecode } from 'jwt-decode';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import './SeatBooking.css';

const SeatBooking = ({ token }) => {
  const [seats, setSeats] = useState([]);
  const [selectedCount, setSelectedCount] = useState(1);
  const userId = jwtDecode(token).id;
  const navigate = useNavigate();
  const [message, setMessage] = useState('');
  

  useEffect(() => {
    
    const fetchSeats = async () => {
      const res = await API.get('/seats', { headers: { Authorization: `Bearer ${token}` } });
      setSeats(res.data);
    };
    fetchSeats();
  }, [token]);


  const book = async () => {
    try {
      const res = await API.post(
        '/book',
        { seatCount: parseInt(selectedCount) },
        { headers: { Authorization: `Bearer ${token}` } }
      );
  
      setSeats(res.data.seats); // All updated seats
      setMessage('Seats booked: ' + res.data.bookedSeats.join(', '));
  
      Swal.fire({
        icon: 'success',
        title: 'Seats Booked!',
        text: `Booked Seats: ${res.data.bookedSeats.join(', ')}`,
        timer: 3000,
        showConfirmButton: false,
      });
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Booking Failed',
        text: error.response?.data?.error || 'Something went wrong.',
      });
    }
  };


  const reset = async () => {
    try {
      // await API.post('/seats/reset', {}, { headers: { Authorization: token } });
      await API.post('/reset', {}, { headers: { Authorization: `Bearer ${token}`} });
      const res = await API.get('/seats', { headers: { Authorization: `Bearer ${token}` } });
      setSeats(res.data);
      setMessage('Booking reset');
      Swal.fire({
        icon: 'info',
        title: 'Booking Reset',
        text: 'All seats are now available again.',
        timer: 2000,
        showConfirmButton: false,
      });
    } catch (err) {
      Swal.fire({
        icon: 'error',
        title: 'Reset Failed',
        text: 'Please try again later.',
      });
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <div className="booking-container">
      <div className="seat-header">
        <h2>Train Seat Booking</h2>
        <button className="logout-button" onClick={logout}>Logout</button>
      </div>
      <p className="seat-message">{message}</p>

      <div className="booking-controls">
        <input
          type="number"
          value={selectedCount}
          max={7}
          min={1}
          onChange={(e) => setSelectedCount(e.target.value)}
        />
        <button onClick={book}>Book</button>
        <button onClick={reset}>Reset Booking</button>
      </div>


      <div className="seats-grid">
        {seats.map((seat) => (
          <div
            key={seat._id || seat.seatNumber}
            className={`seat ${seat.bookedBy ? 'booked' : 'available'}`}
          >
            {seat.seatNumber}
          </div>
        ))}
      </div>

      
    </div>
  );
};

export default SeatBooking;


