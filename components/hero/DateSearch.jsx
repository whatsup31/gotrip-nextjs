// components/hero/hero-5/DateSearch.jsx
"use client";
import DatePicker, { DateObject } from "react-multi-date-picker";

export default function DateSearch({ checkin = "", checkout = "", onChange }) {
  const value = [
    checkin ? new DateObject(new Date(checkin)) : new DateObject(),
    checkout ? new DateObject(new Date(checkout)) : new DateObject().add(1, "day"),
  ];
  return (
    <div className="text-15 text-light-1 ls-2 lh-16 custom_dual_datepicker">
      <DatePicker
        inputClass="custom_input-picker"
        containerClassName="custom_container-picker"
        value={value}
        onChange={(dates) => {
          const [d1, d2] = dates || [];
          onChange?.({
            checkin: d1 ? new Date(d1).toISOString().slice(0, 10) : "",
            checkout: d2 ? new Date(d2).toISOString().slice(0, 10) : "",
          });
        }}
        numberOfMonths={2}
        offsetY={10}
        range
        rangeHover
        format="MMMM DD YYYY"
      />
    </div>
  );
}
