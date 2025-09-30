import HotelContent from "./content/HotelContent";
import HotelPolicy from "./content/HotelPolicy";
import BannerUploader from "./content/BannerUploader";
import FeaturedUploader from "./content/FeaturedUploader";
import GalleryUploader from "./content/GalleryUploader";

const ContentTabContent = () => {
  return (
    <>
      <div className="col-xl-10">
        <div className="text-18 fw-500 mb-10">Informations</div>
        <HotelContent />
        {/* End HotelContent */}

        <div className="mt-30">
          <div className="fw-500">Photo principale</div>
          <BannerUploader />
        </div>
        {/* End BannerUploader */}

        <div className="mt-30">
          <div className="fw-500">Autres photos</div>
          <GalleryUploader />
        </div>
        {/* End GalleryUploader */}

        <div className="border-top-light mt-30 mb-30" />

        <div className="text-18 fw-500 mb-10">CGV</div>
        <HotelPolicy />
        {/* End hotelpolicy */}

        {/* End FeaturedUploader */}
      </div>
    </>
  );
};

export default ContentTabContent;
