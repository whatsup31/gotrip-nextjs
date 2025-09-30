const PricingTabContent = () => {
  return (
    <div className="col-xl-9 col-lg-11">
      <div className="row x-gap-20 y-gap-20">
        <div className="col-12">
          <div className="text-18 fw-500 mb-10">Prix TTC de votre service</div>
          <div className="form-input ">
            <input type="text" required />
            <label className="lh-1 text-16 text-light-1">17,90€</label>
          </div>

        </div>
        {/* End .col-12 */}
      </div>
      {/* End .row */}

      <div className="text-18 fw-500 mb-10 pt-30">
Frais de livraison      </div>

      <div className="row x-gap-20 y-gap-20">
        <div className="col-md-6">
          <div className="form-input ">
            <input type="text" required />
            <label className="lh-1 text-16 text-light-1">
5€            </label>
          </div>
        </div>
        {/* End col-6 */}
      </div>
      {/* End row */}

      <div className="text-18 fw-500 mb-10 pt-30">
        Délais de livraison
      </div>

      <div className="row x-gap-20 y-gap-20">
        <div className="col-md-6">
          <div className="form-input ">
            <input type="text" required />
            <label className="lh-1 text-16 text-light-1">
              30 min
            </label>
          </div>
        </div>
        {/* End col-6 */}
      </div>
      {/* End row */}

      <div className="text-18 fw-500 mb-10 pt-30">
        Horaires d'ouverture
      </div>

      <div className="row x-gap-20 y-gap-20">
        <div className="col-md-6">
          <div className="form-input ">
            <input type="text" required />
            <label className="lh-1 text-16 text-light-1">
             Mercredi
            </label>
          </div>
        </div>
        {/* End col-6 */}
        <div className="col-md-6">
          <div className="form-input ">
            <input type="text" required />
            <label className="lh-1 text-16 text-light-1">
              10h - 22h
            </label>
          </div>
        </div>
        {/* End col-6 */}
        <div className="col-md-6">
          <div className="form-input ">
            <input type="text" required />
            <label className="lh-1 text-16 text-light-1">
              Vendredi
            </label>
          </div>
        </div>
        {/* End col-6 */}
        <div className="col-md-6">
          <div className="form-input ">
            <input type="text" required />
            <label className="lh-1 text-16 text-light-1">
            10h - 00h
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
