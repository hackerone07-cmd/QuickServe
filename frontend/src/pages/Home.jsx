import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import EmptyState from '../components/EmptyState';
import LoadingState from '../components/LoadingState';
import SectionHeading from '../components/SectionHeading';
import ServiceCard from '../components/ServiceCard';
import { getErrorMessage, getServices } from '../services/api';

const highlights = [
  {
    title: 'Responsive from first click',
    description:
      'Designed to feel smooth on phones, tablets, and full desktop dashboards.',
  },
  {
    title: 'Built for real service flows',
    description:
      'Discovery, booking, provider uploads, and booking management all connect to your API.',
  },
  {
    title: 'Clear actions everywhere',
    description:
      'Every major screen gives people a next step, not just information.',
  },
];

function Home() {
  const [state, setState] = useState({
    services: [],
    loading: true,
    error: '',
    source: 'api',
  });

  useEffect(() => {
    let isMounted = true;

    async function loadServices() {
      try {
        const response = await getServices();

        if (isMounted) {
          setState({
            services: response.data,
            loading: false,
            error: '',
            source: response.source,
          });
        }
      } catch (error) {
        if (isMounted) {
          setState({
            services: [],
            loading: false,
            error: getErrorMessage(error, 'Unable to load services right now.'),
            source: 'api',
          });
        }
      }
    }

    loadServices();

    return () => {
      isMounted = false;
    };
  }, []);

  const featuredServices = state.services.slice(0, 3);
  const categories = [...new Set(state.services.map((service) => service.category))];

  return (
    <div className="page-stack">
      <section className="hero-panel">
        <div className="hero-panel__content">
          <span className="eyebrow">Local services, polished UX</span>
          <h1>Find trusted pros and book home help without friction.</h1>
          <p>
            QuickServe brings service discovery, scheduling, and provider management
            into a frontend that feels fast, clear, and modern on every screen size.
          </p>
          <div className="hero-panel__actions">
            <Link className="button button--primary" to="/services">
              Explore services
            </Link>
            <Link className="button button--secondary" to="/register">
              Create your account
            </Link>
          </div>
          <div className="hero-metrics">
            <div>
              <strong>{state.services.length || '06+'}</strong>
              <span>Service listings</span>
            </div>
            <div>
              <strong>{categories.length || '05'}</strong>
              <span>Popular categories</span>
            </div>
            <div>
              <strong>{state.source === 'mock' ? 'Demo' : 'Live'}</strong>
              <span>Marketplace mode</span>
            </div>
          </div>
        </div>

        <div className="hero-panel__card">
          <div className="hero-surface">
            <p>Today's service pulse</p>
            <h2>Fast booking flow</h2>
            <ul>
              <li>Search and filter services by category, location, and budget.</li>
              <li>Review availability before sending a booking request.</li>
              <li>Track provider confirmations from a dedicated bookings dashboard.</li>
            </ul>
            <Link className="text-link" to="/upload">
              List a provider service
            </Link>
          </div>
        </div>
      </section>

      <section className="glass-panel">
        <SectionHeading
          badge="Why it works"
          description="The UI is set up to feel dependable and alive instead of generic."
          title="An interactive marketplace shell for QuickServe"
        />
        <div className="feature-grid">
          {highlights.map((highlight) => (
            <article className="feature-card" key={highlight.title}>
              <h3>{highlight.title}</h3>
              <p>{highlight.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="page-section">
        <SectionHeading
          badge="Featured services"
          description="Pulled from your service API when available, with graceful demo fallback for public browsing."
          title="See the marketplace in action"
          action={
            <Link className="button button--ghost" to="/services">
              Browse all
            </Link>
          }
        />

        {state.loading ? <LoadingState label="Loading featured services..." /> : null}
        {!state.loading && state.error ? (
          <EmptyState
            description={state.error}
            title="Services are taking a break"
          />
        ) : null}
        {!state.loading && !state.error ? (
          <div className="service-grid">
            {featuredServices.map((service) => (
              <ServiceCard key={service._id} service={service} />
            ))}
          </div>
        ) : null}
      </section>

      <section className="cta-band">
        <div>
          <span className="eyebrow">Built for customers and providers</span>
          <h2>Want to test the provider flow too?</h2>
          <p>
            Provider users can add services, review incoming bookings, and keep their
            schedule visible to customers.
          </p>
        </div>
        <div className="cta-band__actions">
          <Link className="button button--secondary" to="/register">
            Register as provider
          </Link>
          <Link className="button button--ghost" to="/bookings">
            Open bookings dashboard
          </Link>
        </div>
      </section>
    </div>
  );
}

export default Home;
