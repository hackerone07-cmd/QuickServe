function StarRating({ rating = 0, reviewsCount, compact = false }) {
  const stars = [1, 2, 3, 4, 5];

  return (
    <div className={`star-rating ${compact ? 'star-rating--compact' : ''}`}>
      <div aria-hidden="true" className="star-rating__stars">
        {stars.map((star) => (
          <span
            className={star <= Math.round(rating) ? 'is-filled' : ''}
            key={star}
          >
            {'\u2605'}
          </span>
        ))}
      </div>
      <span className="star-rating__value">
        {rating.toFixed(1)}
        {typeof reviewsCount === 'number' ? ` (${reviewsCount} reviews)` : ''}
      </span>
    </div>
  );
}

export default StarRating;
