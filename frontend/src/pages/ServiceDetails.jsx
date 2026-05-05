import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import EmptyState from '../components/EmptyState';
import LoadingState from '../components/LoadingState';
import StarRating from '../components/StarRating';
import { useAuth } from '../context/useAuth';
import {
  createBooking,
  createReview,
  getErrorMessage,
  getProviderReviews,
  getServiceById,
} from '../services/api';

function ServiceDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [service, setService] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeImage, setActiveImage] = useState(0);
  const [bookingForm, setBookingForm] = useState({
    date: '',
    time: '',
    notes: '',
  });
  const [reviewForm, setReviewForm] = useState({
    rating: 5,
    comment: '',
  });
  const [bookingMessage, setBookingMessage] = useState('');
  const [reviewMessage, setReviewMessage] = useState('');
  const [submittingBooking, setSubmittingBooking] = useState(false);
  const [submittingReview, setSubmittingReview] = useState(false);

  useEffect(() => {
    let isMounted = true;

    async function loadService() {
      try {
        const serviceResponse = await getServiceById(id);
        const providerId =
          typeof serviceResponse.data.providerId === 'object'
            ? serviceResponse.data.providerId?._id
            : serviceResponse.data.providerId;
        const reviewResponse = await getProviderReviews(providerId);

        if (isMounted) {
          setService(serviceResponse.data);
          setReviews(
            reviewResponse.data.filter(
              (review) =>
                String(review.serviceId?._id || review.serviceId) ===
                String(serviceResponse.data._id),
            ),
          );
          setLoading(false);
        }
      } catch (fetchError) {
        if (isMounted) {
          setError(
            getErrorMessage(fetchError, 'We could not load this service right now.'),
          );
          setLoading(false);
        }
      }
    }

    loadService();

    return () => {
      isMounted = false;
    };
  }, [id]);

  if (loading) {
    return <LoadingState label="Loading service details..." />;
  }

  if (error || !service) {
    return (
      <EmptyState
        description={error || 'The requested service could not be found.'}
        title="Service unavailable"
        action={
          <Link className="button button--primary" to="/services">
            Return to services
          </Link>
        }
      />
    );
  }

  const provider =
    typeof service.providerId === 'object'
      ? service.providerId
      : {
          name: 'QuickServe Pro',
          email: 'provider@quickserve.app',
          phone: '+91 90000 00000',
        };
  const images = service.images?.length ? service.images : [null];
  const averageRating =
    reviews.length > 0
      ? reviews.reduce((total, review) => total + Number(review.rating || 0), 0) /
        reviews.length
      : Number(service.rating || 0);

  async function handleBookingSubmit(event) {
    event.preventDefault();
    setBookingMessage('');

    if (!user) {
      navigate('/login', { state: { from: { pathname: `/services/${id}` } } });
      return;
    }

    setSubmittingBooking(true);

    try {
      await createBooking({
        providerId: provider._id || service.providerId,
        serviceId: service._id,
        ...bookingForm,
      });
      setBookingMessage('Booking request sent successfully.');
      setBookingForm({ date: '', time: '', notes: '' });
    } catch (submitError) {
      setBookingMessage(
        getErrorMessage(submitError, 'We could not send that booking request.'),
      );
    } finally {
      setSubmittingBooking(false);
    }
  }

  async function handleReviewSubmit(event) {
    event.preventDefault();
    setReviewMessage('');

    if (!user) {
      navigate('/login', { state: { from: { pathname: `/services/${id}` } } });
      return;
    }

    setSubmittingReview(true);

    try {
      const response = await createReview({
        providerId: provider._id || service.providerId,
        serviceId: service._id,
        rating: Number(reviewForm.rating),
        comment: reviewForm.comment,
      });
      setReviews((currentReviews) => [
        {
          ...response.data,
          customerId: {
            ...(typeof response.data.customerId === 'object'
              ? response.data.customerId
              : {}),
            name: user.name,
          },
          serviceId: { _id: service._id, title: service.title },
        },
        ...currentReviews,
      ]);
      setReviewMessage('Review submitted. Thanks for sharing feedback.');
      setReviewForm({ rating: 5, comment: '' });
    } catch (submitError) {
      setReviewMessage(
        getErrorMessage(submitError, 'We could not submit your review.'),
      );
    } finally {
      setSubmittingReview(false);
    }
  }

  return (
    <div className="page-stack">
      <section className="detail-layout">
        <div className="detail-gallery">
          <div className="detail-gallery__featured">
            {images[activeImage] ? (
              <img alt={service.title} src={images[activeImage]} />
            ) : (
              <div className="detail-gallery__placeholder">
                <span>{service.category}</span>
              </div>
            )}
          </div>

          <div className="detail-gallery__thumbs">
            {images.map((image, index) => (
              <button
                className={index === activeImage ? 'is-active' : ''}
                key={`${service._id}-${index + 1}`}
                onClick={() => setActiveImage(index)}
                type="button"
              >
                {image ? (
                  <img alt={`${service.title} preview ${index + 1}`} src={image} />
                ) : (
                  <span>{index + 1}</span>
                )}
              </button>
            ))}
          </div>
        </div>

        <div className="detail-sidebar">
          <span className="eyebrow">{service.category}</span>
          <h1>{service.title}</h1>
          <p className="lead">{service.description}</p>
          <StarRating rating={averageRating} reviewsCount={reviews.length} />
          <div className="detail-price">
            <strong>Rs. {service.price}</strong>
            <span>Starting price</span>
          </div>

          <div className="stack-list">
            <div className="stack-list__item">
              <strong>Location</strong>
              <span>{service.location}</span>
            </div>
            <div className="stack-list__item">
              <strong>Provider</strong>
              <span>{provider.name}</span>
            </div>
            <div className="stack-list__item">
              <strong>Contact</strong>
              <span>{provider.email || 'Available after booking'}</span>
            </div>
            <div className="stack-list__item">
              <strong>Phone</strong>
              {provider.phone ? (
                <a className="contact-link" href={`tel:${provider.phone}`}>
                  {provider.phone}
                </a>
              ) : (
                <span>Phone not available</span>
              )}
            </div>
          </div>
        </div>
      </section>

      <section className="detail-content">
        <div className="glass-panel">
          <SectionHeading
            badge="Availability"
            description="Customers can inspect service windows before sending a booking request."
            title="Published schedule"
          />
          <div className="availability-grid">
            {(service.availability?.length ? service.availability : ['Flexible scheduling']).map(
              (slot) => (
                <div className="availability-chip" key={slot}>
                  {slot}
                </div>
              ),
            )}
          </div>
        </div>

        <div className="detail-split">
          <section className="glass-panel">
            <SectionHeading
              badge="Book now"
              description="A clean request form for customers with quick validation."
              title="Send a booking request"
            />
            <form className="form-grid" onSubmit={handleBookingSubmit}>
              <label className="field">
                <span>Date</span>
                <input
                  min={new Date().toISOString().split('T')[0]}
                  onChange={(event) =>
                    setBookingForm((current) => ({
                      ...current,
                      date: event.target.value,
                    }))
                  }
                  required
                  type="date"
                  value={bookingForm.date}
                />
              </label>
              <label className="field">
                <span>Time</span>
                <input
                  onChange={(event) =>
                    setBookingForm((current) => ({
                      ...current,
                      time: event.target.value,
                    }))
                  }
                  placeholder="10:30 AM"
                  required
                  type="text"
                  value={bookingForm.time}
                />
              </label>
              <label className="field field--full">
                <span>Notes</span>
                <textarea
                  onChange={(event) =>
                    setBookingForm((current) => ({
                      ...current,
                      notes: event.target.value,
                    }))
                  }
                  placeholder="Share access notes, urgency, or task details..."
                  rows="4"
                  value={bookingForm.notes}
                />
              </label>
              <button
                className="button button--primary"
                disabled={submittingBooking}
                type="submit"
              >
                {submittingBooking ? 'Sending request...' : 'Request booking'}
              </button>
            </form>
            {bookingMessage ? <p className="form-message">{bookingMessage}</p> : null}
          </section>

          <section className="glass-panel">
            <SectionHeading
              badge="Reviews"
              description="The page supports viewing and posting provider feedback."
              title="Customer feedback"
            />
            <form className="form-grid" onSubmit={handleReviewSubmit}>
              <label className="field">
                <span>Rating</span>
                <select
                  onChange={(event) =>
                    setReviewForm((current) => ({
                      ...current,
                      rating: event.target.value,
                    }))
                  }
                  value={reviewForm.rating}
                >
                  {[5, 4, 3, 2, 1].map((value) => (
                    <option key={value} value={value}>
                      {value} star{value > 1 ? 's' : ''}
                    </option>
                  ))}
                </select>
              </label>
              <label className="field field--full">
                <span>Comment</span>
                <textarea
                  onChange={(event) =>
                    setReviewForm((current) => ({
                      ...current,
                      comment: event.target.value,
                    }))
                  }
                  placeholder="What stood out about the service?"
                  rows="4"
                  value={reviewForm.comment}
                />
              </label>
              <button
                className="button button--secondary"
                disabled={submittingReview}
                type="submit"
              >
                {submittingReview ? 'Sending review...' : 'Post review'}
              </button>
            </form>
            {reviewMessage ? <p className="form-message">{reviewMessage}</p> : null}

            <div className="review-list">
              {reviews.length > 0 ? (
                reviews.map((review) => (
                  <article className="review-card" key={review._id}>
                    <div className="review-card__header">
                      <div>
                        <strong>{review.customerId?.name || 'QuickServe user'}</strong>
                        <span>{review.serviceId?.title || service.title}</span>
                      </div>
                      <StarRating compact rating={Number(review.rating || 0)} />
                    </div>
                    <p>{review.comment || 'No written comment provided.'}</p>
                  </article>
                ))
              ) : (
                <EmptyState
                  description="This service has not received reviews yet."
                  title="No reviews yet"
                />
              )}
            </div>
          </section>
        </div>
      </section>
    </div>
  );
}

function SectionHeading({ badge, title, description }) {
  return (
    <div className="section-heading">
      <div>
        <span className="eyebrow">{badge}</span>
        <h2>{title}</h2>
        <p>{description}</p>
      </div>
    </div>
  );
}

export default ServiceDetails;
