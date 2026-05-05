import { startTransition, useDeferredValue, useEffect, useState } from 'react';
import EmptyState from '../components/EmptyState';
import LoadingState from '../components/LoadingState';
import SectionHeading from '../components/SectionHeading';
import ServiceCard from '../components/ServiceCard';
import { getErrorMessage, getServices } from '../services/api';

function Services() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('All');
  const [location, setLocation] = useState('All');
  const [sortBy, setSortBy] = useState('recommended');
  const deferredQuery = useDeferredValue(query);

  useEffect(() => {
    let isMounted = true;

    async function loadServices() {
      try {
        const response = await getServices();
        if (isMounted) {
          setServices(response.data);
          setLoading(false);
        }
      } catch (fetchError) {
        if (isMounted) {
          setError(
            getErrorMessage(fetchError, 'We could not load the services right now.'),
          );
          setLoading(false);
        }
      }
    }

    loadServices();

    return () => {
      isMounted = false;
    };
  }, []);

  const categories = ['All', ...new Set(services.map((service) => service.category))];
  const locations = ['All', ...new Set(services.map((service) => service.location))];

  let filteredServices = services.filter((service) => {
    const searchText = deferredQuery.trim().toLowerCase();
    const matchesSearch =
      !searchText ||
      service.title.toLowerCase().includes(searchText) ||
      service.description?.toLowerCase().includes(searchText) ||
      service.location.toLowerCase().includes(searchText);
    const matchesCategory = category === 'All' || service.category === category;
    const matchesLocation = location === 'All' || service.location === location;

    return matchesSearch && matchesCategory && matchesLocation;
  });

  if (sortBy === 'price-low') {
    filteredServices = [...filteredServices].sort((a, b) => a.price - b.price);
  }

  if (sortBy === 'price-high') {
    filteredServices = [...filteredServices].sort((a, b) => b.price - a.price);
  }

  if (sortBy === 'rating') {
    filteredServices = [...filteredServices].sort(
      (a, b) => Number(b.rating || 0) - Number(a.rating || 0),
    );
  }

  return (
    <div className="page-stack">
      <section className="page-hero page-hero--compact">
        <div>
          <span className="eyebrow">Services marketplace</span>
          <h1>Browse, compare, and shortlist providers quickly.</h1>
          <p>
            Search across categories, locations, and price points with a layout tuned
            for quick scanning on mobile and desktop.
          </p>
        </div>
      </section>

      <section className="glass-panel">
        <SectionHeading
          badge="Smart filters"
          description="The search bar and category chips respond instantly as you explore."
          title="Find the right service faster"
        />

        <div className="filter-panel">
          <label className="field">
            <span>Search</span>
            <input
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Try plumber, cleaner, Bangalore..."
              type="search"
              value={query}
            />
          </label>

          <label className="field">
            <span>Category</span>
            <select
              onChange={(event) =>
                startTransition(() => setCategory(event.target.value))
              }
              value={category}
            >
              {categories.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </label>

          <label className="field">
            <span>Location</span>
            <select
              onChange={(event) =>
                startTransition(() => setLocation(event.target.value))
              }
              value={location}
            >
              {locations.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </label>

          <label className="field">
            <span>Sort by</span>
            <select onChange={(event) => setSortBy(event.target.value)} value={sortBy}>
              <option value="recommended">Recommended</option>
              <option value="rating">Top rated</option>
              <option value="price-low">Price: low to high</option>
              <option value="price-high">Price: high to low</option>
            </select>
          </label>
        </div>

        <div className="filter-summary">
          <span>{filteredServices.length} matches</span>
          <button
            className="button button--ghost"
            onClick={() => {
              setQuery('');
              setCategory('All');
              setLocation('All');
              setSortBy('recommended');
            }}
            type="button"
          >
            Reset filters
          </button>
        </div>
      </section>

      {loading ? <LoadingState label="Loading the marketplace..." /> : null}
      {!loading && error ? (
        <EmptyState description={error} title="Services unavailable" />
      ) : null}
      {!loading && !error && filteredServices.length === 0 ? (
        <EmptyState
          description="Try widening the location or category filters to surface more providers."
          title="No services match those filters"
        />
      ) : null}
      {!loading && !error && filteredServices.length > 0 ? (
        <section className="service-grid">
          {filteredServices.map((service) => (
            <ServiceCard key={service._id} service={service} />
          ))}
        </section>
      ) : null}
    </div>
  );
}

export default Services;
