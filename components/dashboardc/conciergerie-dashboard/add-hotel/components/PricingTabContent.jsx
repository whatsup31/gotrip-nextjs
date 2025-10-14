// components/dashboardc/conciergerie-dashbord/add-hotel/components/PricingTabContent.jsx
const PricingTabContent = () => {
  return (
    <div className="col-xl-9 col-lg-11">
      <div className="row x-gap-20 y-gap-20">
        <div className="col-12">
          <div className="text-18 fw-500 mb-10">Tarif par nuit</div>
          <div className="form-input">
            <input type="text" name="price_per_night" />
            <label className="lh-1 text-16 text-light-1">Hotel Price</label>
          </div>

          <div className="fw-500 mt-30">Frais sur services</div>
          <div className="d-flex mt-10">
            <div className="form-checkbox">
              <input type="checkbox" name="apply_services_fee" />
              <div className="form-checkbox__mark">
                <div className="form-checkbox__icon icon-check" />
              </div>
            </div>
            <div className="text-15 lh-11 ml-10">
              Appliquer des frais sur les services supplémentaires
            </div>
          </div>
        </div>
      </div>

      <div className="text-18 fw-500 mb-10 pt-30">
        Heure d&apos;arrivée et de départ
      </div>

      <div className="row x-gap-20 y-gap-20">
        <div className="col-md-6">
          <div className="form-input">
            <input type="text" name="checkin_time" />
            <label className="lh-1 text-16 text-light-1">Time for check in</label>
          </div>
        </div>

        <div className="col-md-6">
          <div className="form-input">
            <input type="text" name="checkout_time" />
            <label className="lh-1 text-16 text-light-1">Time for check out</label>
          </div>
        </div>

        <div className="col-md-6">
          <div className="form-input">
            <input type="text" name="min_advance_reservations" />
            <label className="lh-1 text-16 text-light-1">
              Minimum advance reservations
            </label>
          </div>
        </div>

        <div className="col-md-6">
          <div className="form-input">
            <input type="text" name="min_day_stay_requirements" />
            <label className="lh-1 text-16 text-light-1">
              Minimum day stay requirements
            </label>
          </div>
        </div>
      </div>

    </div>
  )
}

export default PricingTabContent
