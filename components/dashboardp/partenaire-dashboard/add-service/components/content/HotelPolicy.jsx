const HotelPolicy = () => {
  return (
    <>
      <div className="row x-gap-20 y-gap-20">
        <div className="col-12">
          <div className="form-input ">
            <input type="text" />
            <label className="lh-1 text-16 text-light-1">
              Pas d'échange aprés ouverture
            </label>
          </div>
        </div>
      </div>
      {/* End hotel rating standard */}

      <div className="mt-20">
        <div className="fw-500 mb-20">Spécifications supplémentaires</div>
        <div className="overflow-scroll scroll-bar-1">
          <table className="table-5 -border-bottom col-12">
            <thead className="bg-light-2">
              <tr>
                <th>Titre</th>
                <th>Contenu</th>
                <th />
              </tr>
            </thead>
            {/* End thead */}

            <tbody>
              <tr>
                <td className="col-5">
                  <div className="form-input ">
                    <input type="text" />
                    <label className="lh-1 text-16 text-light-1">
                      Marque du produit
                    </label>
                  </div>
                </td>
                {/* End td */}

                <td className="col-7">
                  <div className="form-input ">
                    <textarea rows={5} defaultValue={""} />
                    <label className="lh-1 text-16 text-light-1">Produit officiel Apple</label>
                  </div>
                </td>
                {/* End td */}

                <td className="col-auto">
                  <button className="flex-center bg-light-2 rounded-4 size-35">
                    <i className="icon-trash-2 text-16 text-light-1" />
                  </button>
                </td>
                {/* End td */}
              </tr>
              {/* End tr */}

              <tr>
                <td className="col-5">
                  <div className="form-input ">
                    <input type="text" />
                    <label className="lh-1 text-16 text-light-1">
                      Prise murale
                    </label>
                  </div>
                </td>
                {/* End td */}

                <td className="col-7">
                  <div className="form-input ">
                    <textarea rows={5} defaultValue={""} />
                    <label className="lh-1 text-16 text-light-1">Adapteur usb-c pour prise murale inclus</label>
                  </div>
                </td>
                {/* End td */}

                <td className="col-auto">
                  <button className="flex-center bg-light-2 rounded-4 size-35">
                    <i className="icon-trash-2 text-16 text-light-1" />
                  </button>
                </td>
                {/* End td */}
              </tr>
              {/* End tr */}
            </tbody>
          </table>
        </div>
        {/* End overflow */}

        <div className="d-flex justify-end">
          <button className="button -md -blue-1 bg-blue-1-05 text-blue-1 mt-20">
            Add Item
          </button>
        </div>
      </div>
      {/* End policy */}
    </>
  );
};

export default HotelPolicy;
