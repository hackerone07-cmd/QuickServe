import { useEffect, useState } from 'react';
import EmptyState from '../components/EmptyState';
import LoadingState from '../components/LoadingState';
import SectionHeading from '../components/SectionHeading';
import { getErrorMessage, getServices } from '../services/api';

function AdminDashboard() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let isMounted = true;

    async function loadDashboard() {
      try {
        const response = await getServices();
        if (isMounted) {
          setServices(response.data);
          setLoading(false);
        }
      } catch (fetchError) {
        if (isMounted) {
          setError(
            getErrorMessage(fetchError, 'We could not load admin metrics right now.'),
          );
          setLoading(false);
        }
      }
    }

    loadDashboard();

    return () => {
      isMounted = false;
    };
  }, []);

  const averagePrice =
    services.length > 0
      ? Math.round(
          services.reduce((total, service) => total + Number(service.price || 0), 0) /
            services.length,
        )
      : 0;
  const categories = [...new Set(services.map((service) => service.category))];
  const locationCounts = services.reduce((counts, service) => {
    counts[service.location] = (counts[service.location] || 0) + 1;
    return counts;
  }, {});
  const topLocation =
    Object.entries(locationCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || 'N/A';

  return (
    <div className="page-stack">
      <section className="page-hero page-hero--compact">
        <div>
          <span className="eyebrow">Admin dashboard</span>
          <h1>Monitor the current marketplace at a glance.</h1>
          <p>
            This view turns the existing service data into a clean operational summary
            without waiting on extra admin-only endpoints.
          </p>
        </div>
      </section>

      {loading ? <LoadingState label="Loading admin metrics..." /> : null}
      {!loading && error ? (
        <EmptyState description={error} title="Dashboard unavailable" />
      ) : null}
      {!loading && !error ? (
        <>
          <section className="stats-grid">
            <div className="stat-card">
              <strong>{services.length}</strong>
              <span>Total services</span>
            </div>
            <div className="stat-card">
              <strong>{categories.length}</strong>
              <span>Active categories</span>
            </div>
            <div className="stat-card">
              <strong>Rs. {averagePrice}</strong>
              <span>Average starting price</span>
            </div>
            <div className="stat-card">
              <strong>{topLocation}</strong>
              <span>Top market</span>
            </div>
          </section>

          <section className="dashboard-grid">
            <div className="glass-panel">
              <SectionHeading
                badge="Category mix"
                description="A simple visual breakdown of the marketplace catalog."
                title="Where activity is clustered"
              />
              <div className="meter-list">
                {categories.map((category) => {
                  const count = services.filter(
                    (service) => service.category === category,
                  ).length;
                  const width = `${Math.max(14, (count / services.length) * 100)}%`;

                  return (
                    <div className="meter-row" key={category}>
                      <div className="meter-row__labels">
                        <span>{category}</span>
                        <strong>{count}</strong>
                      </div>
                      <div className="meter-row__track">
                        <span className="meter-row__fill" style={{ width }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="glass-panel">
              <SectionHeading
                badge="Recent listings"
                description="Quick access to the newest items already in the catalog."
                title="Latest services"
              />
              <div className="recent-list">
                {services.slice(0, 5).map((service) => (
                  <article className="recent-list__item" key={service._id}>
                    <div>
                      <strong>{service.title}</strong>
                      <span>
                        {service.category} in {service.location}
                      </span>
                    </div>
                    <strong>Rs. {service.price}</strong>
                  </article>
                ))}
              </div>
            </div>
          </section>
        </>
      ) : null}
    </div>
  );
}

export default AdminDashboard;
