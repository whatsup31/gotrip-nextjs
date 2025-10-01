const ContactInfo = () => {
  const contactContent = [
    {
      id: 1,
      title: "Live support",
      action: "mailto:hello@omi.com",
      text: "hello@omi.com",
    },
  ];
  return (
    <>
      {contactContent.map((item) => (
        <div className="col-sm-6" key={item.id}>
          <div className={"text-14"}>{item.title}</div>
          <a href={item.action} className="text-18 fw-500 mt-5">
            {item.text}
          </a>
        </div>
      ))}
    </>
  );
};

export default ContactInfo;
