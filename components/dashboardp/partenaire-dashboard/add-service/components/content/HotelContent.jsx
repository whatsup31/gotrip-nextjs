const HotelContent = () => {
  return (
    <div className="row x-gap-20 y-gap-20">
      <div className="col-12">
        <div className="form-input ">
          <input type="text" name="title" />
          <label className="lh-1 text-16 text-light-1">Chargeur iPhone 17 Pro Max</label>
        </div>
      </div>
      {/* End Name */}

      <div className="col-12">
        <div className="form-input ">
          <textarea name="description" rows={5} defaultValue={""} />
          <label className="lh-1 text-16 text-light-1">Chargeur type usb-c pour smartphone apple</label>
        </div>
      </div>
      {/* End Content */}

      <div className="col-12">
        <div className="form-input ">
          <input type="text" name="category" />
          <label className="lh-1 text-16 text-light-1">@phoneworld</label>
        </div>
      </div>
      {/* End youtube Video */}
    </div>
  );
};

export default HotelContent;
