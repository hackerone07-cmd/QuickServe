import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SectionHeading from '../components/SectionHeading';
import { createService, getErrorMessage } from '../services/api';

const categories = ['Plumber', 'Electrician', 'Carpenter', 'Cleaner', 'Other'];

function Upload() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    category: 'Plumber',
    title: '',
    description: '',
    price: '',
    location: '',
    availability: '',
  });
  const [files, setFiles] = useState([]);
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setSubmitting(true);
    setMessage('');

    const payload = new FormData();
    payload.append('category', form.category);
    payload.append('title', form.title);
    payload.append('description', form.description);
    payload.append('price', form.price);
    payload.append('location', form.location);

    form.availability
      .split('\n')
      .map((slot) => slot.trim())
      .filter(Boolean)
      .forEach((slot) => payload.append('availability', slot));

    files.forEach((file) => {
      payload.append('images', file);
    });

    try {
      const response = await createService(payload);
      navigate(`/services/${response.data._id}`);
    } catch (error) {
      setMessage(getErrorMessage(error, 'We could not publish that service.'));
      setSubmitting(false);
      return;
    }

    setSubmitting(false);
  }

  return (
    <div className="page-stack">
      <section className="page-hero page-hero--compact">
        <div>
          <span className="eyebrow">Provider studio</span>
          <h1>Create a polished service listing that looks strong on every screen.</h1>
          <p>
            This form supports your backend service upload flow and keeps the layout
            easy to use on narrow devices too.
          </p>
        </div>
      </section>

      <section className="glass-panel">
        <SectionHeading
          badge="Service setup"
          description="Add structured service details, availability slots, and supporting images."
          title="Publish a new listing"
        />

        <form className="form-grid" onSubmit={handleSubmit}>
          <label className="field">
            <span>Category</span>
            <select
              onChange={(event) =>
                setForm((current) => ({ ...current, category: event.target.value }))
              }
              value={form.category}
            >
              {categories.map((categoryOption) => (
                <option key={categoryOption} value={categoryOption}>
                  {categoryOption}
                </option>
              ))}
            </select>
          </label>

          <label className="field">
            <span>Title</span>
            <input
              onChange={(event) =>
                setForm((current) => ({ ...current, title: event.target.value }))
              }
              placeholder="Emergency plumbing visit"
              required
              type="text"
              value={form.title}
            />
          </label>

          <label className="field">
            <span>Price</span>
            <input
              min="0"
              onChange={(event) =>
                setForm((current) => ({ ...current, price: event.target.value }))
              }
              placeholder="799"
              required
              type="number"
              value={form.price}
            />
          </label>

          <label className="field">
            <span>Location</span>
            <input
              onChange={(event) =>
                setForm((current) => ({ ...current, location: event.target.value }))
              }
              placeholder="Bengaluru"
              required
              type="text"
              value={form.location}
            />
          </label>

          <label className="field field--full">
            <span>Description</span>
            <textarea
              onChange={(event) =>
                setForm((current) => ({ ...current, description: event.target.value }))
              }
              placeholder="Explain what is included, expected timing, and service boundaries."
              rows="5"
              value={form.description}
            />
          </label>

          <label className="field field--full">
            <span>Availability</span>
            <textarea
              onChange={(event) =>
                setForm((current) => ({ ...current, availability: event.target.value }))
              }
              placeholder={"Mon 9-11 AM\nTue 2-5 PM\nSat 10-1 PM"}
              rows="4"
              value={form.availability}
            />
          </label>

          <label className="field field--full">
            <span>Images</span>
            <input
              accept="image/*"
              multiple
              onChange={(event) => setFiles(Array.from(event.target.files || []))}
              type="file"
            />
          </label>

          {files.length > 0 ? (
            <div className="upload-preview">
              {files.map((file) => (
                <span className="upload-preview__chip" key={file.name}>
                  {file.name}
                </span>
              ))}
            </div>
          ) : null}

          <button className="button button--primary" disabled={submitting} type="submit">
            {submitting ? 'Publishing service...' : 'Publish service'}
          </button>
          {message ? <p className="form-message">{message}</p> : null}
        </form>
      </section>
    </div>
  );
}

export default Upload;
