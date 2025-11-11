// components/activity-single/Overview.jsx
const Overview = ({ service }) => {
  const description =
    service?.description ||
    "Ce service ne possède pas encore de description détaillée.";

  return (
    <>
      <div className="row x-gap-40 y-gap-40">
        <div className="col-12">
          <h3 className="text-22 fw-500">Overview</h3>

          <p className="text-dark-1 text-15 mt-20">{description}</p>
        </div>

        <div className="col-md-6">
          <h5 className="text-16 fw-500">Zone couverte</h5>
          <div className="text-15 mt-10">
            {service?.area || "Zone indiquée par le prestataire"}
          </div>
        </div>

        <div className="col-md-6">
          <h5 className="text-16 fw-500">Durée &amp; catégorie</h5>
          <div className="text-15 mt-10">
            {service?.duration_min
              ? `${service.duration_min} minutes`
              : "Durée à préciser"}
            {service?.category ? ` • ${service.category}` : null}
          </div>
        </div>

        <div className="col-12">
          <h5 className="text-16 fw-500">Highlights</h5>
          <ul className="list-disc text-15 mt-10">
            {service?.delivery_time_label && (
              <li>Créneau : {service.delivery_time_label}</li>
            )}
            <li>
              Prix à partir de{" "}
              <strong>{service?.price ? `${service.price} €` : "à définir"}</strong>
            </li>
            {service?.policy && <li>Politique : {service.policy}</li>}
          </ul>
        </div>
      </div>
    </>
  );
};

export default Overview;
