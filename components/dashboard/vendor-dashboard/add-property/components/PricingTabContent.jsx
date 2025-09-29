const PricingTabContent = () => {
  return (
    <div className="col-xl-9 col-lg-11">
      <div className="row x-gap-20 y-gap-20">
        <div className="col-12">
          <div className="text-18 fw-500 mb-10">Tarif par nuit</div>
          <div className="form-input ">
            <input type="text" name="price_per_night" />
            <label className="lh-1 text-16 text-light-1">Hotel Price</label>
          </div>

       
          <div className="fw-500 mt-30">Frais sur services</div>

          <div className="d-flex mt-10">
            <div className="form-checkbox ">
              <input type="checkbox" name="name" />
              <div className="form-checkbox__mark">
                <div className="form-checkbox__icon icon-check" />
              </div>
            </div>
            <div className="text-15 lh-11 ml-10">Appliquer des frais sur les services supplémentaires</div>
          </div>
        </div>
        {/* End .col-12 */}
      </div>
      {/* End .row */}

      <div className="text-18 fw-500 mb-10 pt-30">
        Heure d'arrivéee et de départ
      </div>

      <div className="row x-gap-20 y-gap-20">
        <div className="col-md-6">
          <div className="form-input ">
            <input type="text" />
            <label className="lh-1 text-16 text-light-1">
              Time for check in
            </label>
          </div>
        </div>
        {/* End col-6 */}
        <div className="col-md-6">
          <div className="form-input ">
            <input type="text" />
            <label className="lh-1 text-16 text-light-1">
              Time for check out
            </label>
          </div>
        </div>
        {/* End col-6 */}
        <div className="col-md-6">
          <div className="form-input ">
            <input type="text" />
            <label className="lh-1 text-16 text-light-1">
              Minimum advance reservations
            </label>
          </div>
        </div>
        {/* End col-6 */}
        <div className="col-md-6">
          <div className="form-input ">
            <input type="text" />
            <label className="lh-1 text-16 text-light-1">
              Minimum day stay requirements
            </label>
          </div>
        </div>
        {/* End col-6 */}
      </div>
      {/* End row */}

      
    </div>
  );
};

export default PricingTabContent;
