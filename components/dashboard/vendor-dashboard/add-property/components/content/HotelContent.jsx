const HotelContent = () => {
  return (
    <div className="row x-gap-20 y-gap-20">
      <div className="col-12">
        <div className="form-input ">
          <input type="text" name="title" required />
          <label className="lh-1 text-16 text-light-1">Hotel Name</label>
        </div>
      </div>

      <div className="col-12">
        <div className="form-input ">
          <textarea name="description"  rows={5} defaultValue={""} />
          <label className="lh-1 text-16 text-light-1">Content</label>
        </div>
      </div>

      <div className="col-12">
        <div className="form-input ">
          <input type="text" name="video_url" />
          <label className="lh-1 text-16 text-light-1">Youtube Video</label>
        </div>
      </div>
    </div>
  );
};

export default HotelContent;
