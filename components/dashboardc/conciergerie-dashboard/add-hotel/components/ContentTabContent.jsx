import HotelContent from "./content/HotelContent";
import HotelPolicy from "./content/HotelPolicy";
import BannerUploader from "./content/BannerUploader";
import FeaturedUploader from "./content/FeaturedUploader";
import GalleryUploader from "./content/GalleryUploader";
import Education from "./location/Education";
import Health from "./location/Health";
import Location from "./location/Location";
import Sorroundings from "./location/Sorroundings";
import Transportation from "./location/Transportation";

const ContentTabContent = () => {
  return (
    <>
      <div className="col-xl-10">
        <div className="text-18 fw-500 mb-10">1. Informations</div>
        <HotelContent />
        {/* End HotelContent */}

        <div className="mt-30">
          <div className="fw-500">Photo principale</div>
          <BannerUploader />
        </div>
        {/* End BannerUploader */}

        <div className="mt-30">
          <div className="fw-500">Photos du logement</div>
          <GalleryUploader />
        </div>
        {/* End GalleryUploader */}

        <div className="border-top-light mt-30 mb-30" />

        <div className="text-18 fw-500 mb-10">Hotel Policy</div>
        <HotelPolicy />
        {/* End hotelpolicy */}

        {/* End FeaturedUploader */}
      </div>
    </>
    
  );
};


export default ContentTabContent;

