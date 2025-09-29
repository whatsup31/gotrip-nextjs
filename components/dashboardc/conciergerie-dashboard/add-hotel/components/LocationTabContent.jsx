import Education from "./location/Education";
import Health from "./location/Health";
import Location from "./location/Location";
import Sorroundings from "./location/Sorroundings";
import Transportation from "./location/Transportation";

const LocationTabContent = () => {
  return (
    <div className="col-xl-10">
      <div className="text-18 fw-500 mb-10">Adresse du logement</div>
      <Location />
    </div>
  );
};

export default LocationTabContent;
