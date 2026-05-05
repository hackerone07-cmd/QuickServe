import { useEffect, useState } from 'react';
import EmptyState from '../components/EmptyState';
import LoadingState from '../components/LoadingState';
import SectionHeading from '../components/SectionHeading';
import StatusBadge from '../components/StatusBadge';
import { useAuth } from '../context/useAuth';
import {
  getErrorMessage,
  getProviderBookings,
  getUserBookings,
  updateBookingStatus,
} from '../services/api';

const providerActions = ['confirmed', 'completed', 'cancelled'];

function Bookings() {
  const { user } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let isMounted = true;

    async function loadBookings() {
      try {
        const response =
          user?.role === 'provider' || user?.role === 'admin'
            ? await getProviderBookings()
            : await getUserBookings();

        if (isMounted) {
          setBookings(response.data);
          setLoading(false);
        }
      } catch (fetchError) {
        if (isMounted) {
          setError(
            getErrorMessage(fetchError, 'We could not load bookings right now.'),
          );
          setLoading(false);
        }
      }
    }

    loadBookings();

    return () => {
      isMounted = false;
    };
  }, [user?.role]);

  async function handleStatusChange(bookingId, status) {
    try {
      await updateBookingStatus(bookingId, status);
      setBookings((currentBookings) =>
        currentBookings.map((booking) =>
          booking._id === bookingId ? { ...booking, status } : booking,
        ),
      );
    } catch (updateError) {
      setError(
        getErrorMessage(updateError, 'We could not update that booking status.'),
      );
    }
  }

  const stats = {
    total: bookings.length,
    pending: bookings.filter((booking) => booking.status === 'pending').length,
    confirmed: bookings.filter((booking) => booking.status === 'confirmed').length,
    completed: bookings.filter((booking) => booking.status === 'completed').length,
  };
  const isProviderView = user?.role === 'provider' || user?.role === 'admin';

  return (
    <div className="page-stack">
      <section className="page-hero page-hero--compact">
        <div>
          <span className="eyebrow">Bookings</span>
          <h1>
            {isProviderView
              ? 'Manage incoming requests and update their status.'
              : 'Track your service requests in one clean dashboard.'}
          </h1>
          <p>
            This screen is role-aware and shifts between customer tracking and provider
            operational control.
          </p>
        </div>
      </section>

      <section className="stats-grid">
        <div className="stat-card">
          <strong>{stats.total}</strong>
          <span>Total bookings</span>
        </div>
        <div className="stat-card">
          <strong>{stats.pending}</strong>
          <span>Pending</span>
        </div>
        <div className="stat-card">
          <strong>{stats.confirmed}</strong>
          <span>Confirmed</span>
        </div>
        <div className="stat-card">
          <strong>{stats.completed}</strong>
          <span>Completed</span>
        </div>
      </section>

      <section className="glass-panel">
        <SectionHeading
          badge="Live booking queue"
          description="Cards collapse cleanly on mobile and expose status controls for providers."
          title="Current requests"
        />

        {loading ? <LoadingState label="Loading bookings..." /> : null}
        {!loading && error ? (
          <EmptyState description={error} title="Bookings unavailable" />
        ) : null}
        {!loading && !error && bookings.length === 0 ? (
          <EmptyState
            description="Once booking requests are created, they will show up here."
            title="No bookings yet"
          />
        ) : null}
        {!loading && !error && bookings.length > 0 ? (
          <div className="booking-list">
            {bookings.map((booking) => {
              const contactPerson = isProviderView
                ? booking.customerId
                : booking.providerId;
              const phoneNumber = contactPerson?.phone;

              return (
                <article className="booking-card" key={booking._id}>
                  <div className="booking-card__header">
                    <div>
                      <h3>{booking.serviceId?.title || 'Service booking'}</h3>
                      <p>
                        {isProviderView
                          ? `Customer: ${booking.customerId?.name || 'Unknown'}`
                          : `Provider: ${booking.providerId?.name || 'Unknown'}`}
                      </p>
                    </div>
                    <StatusBadge status={booking.status} />
                  </div>

                  <div className="booking-card__body">
                    <div>
                      <strong>Date</strong>
                      <span>{booking.date}</span>
                    </div>
                    <div>
                      <strong>Time</strong>
                      <span>{booking.time}</span>
                    </div>
                    <div>
                      <strong>Notes</strong>
                      <span>{booking.notes || 'No notes added.'}</span>
                    </div>
                    <div>
                      <strong>Phone</strong>
                      {phoneNumber ? (
                        <a className="contact-link" href={`tel:${phoneNumber}`}>
                          {phoneNumber}
                        </a>
                      ) : (
                        <span>Phone not available</span>
                      )}
                    </div>
                  </div>

                  {isProviderView ? (
                    <div className="booking-card__actions">
                      {providerActions.map((status) => (
                        <button
                          className="button button--ghost"
                          key={status}
                          onClick={() => handleStatusChange(booking._id, status)}
                          type="button"
                        >
                          Mark {status}
                        </button>
                      ))}
                    </div>
                  ) : null}
                </article>
              );
            })}
          </div>
        ) : null}
      </section>
    </div>
  );
}

export default Bookings;
