import { Link } from 'react-router-dom';
import StarRating from './StarRating';

function ServiceCard({ service }) {
  const providerName =
    typeof service.providerId === 'object'
      ? service.providerId?.name
      : 'QuickServe Pro';

  return (
    <article className="service-card">
      <div className="service-card__media">
        {service.images?.[0] ? (
          <img alt={service.title} src={service.images[0]} />
        ) : (
          <div className="service-card__placeholder">
            <span>{service.category}</span>
          </div>
        )}
        <span className="service-card__tag">{service.category}</span>
      </div>

      <div className="service-card__body">
        <div className="service-card__topline">
          <p>{service.location}</p>
          <strong>Rs. {service.price}</strong>
        </div>
        <h3>{service.title}</h3>
        <p>{service.description}</p>
        <div className="service-card__meta">
          <StarRating compact rating={Number(service.rating || 0)} />
          <span>{providerName}</span>
        </div>
        <div className="service-card__footer">
          <span>{service.availability?.[0] || 'Flexible scheduling'}</span>
          <Link className="button button--secondary" to={`/services/${service._id}`}>
            View details
          </Link>
        </div>
      </div>
    </article>
  );
}

export default ServiceCard;
