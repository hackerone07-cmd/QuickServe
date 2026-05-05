function SectionHeading({ badge, title, description, action }) {
  return (
    <div className="section-heading">
      <div>
        {badge ? <span className="eyebrow">{badge}</span> : null}
        <h2>{title}</h2>
        {description ? <p>{description}</p> : null}
      </div>
      {action ? <div>{action}</div> : null}
    </div>
  );
}

export default SectionHeading;
