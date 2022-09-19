import { useEffect, useState } from "react";

type Service = {
  name: string;
  value: string;
  url: string;
  comment: string;
  id: string;
};

type Email = {
  email: string;
  comment: string;
  id: string;
};

export function ServiceDataManager({
  serviceList,
  show,
  onAddService,
  onRemoveService,
}: {
  serviceList: Service[];
  show: boolean;
  onAddService: (name: string, comment: string, url: string) => void;
  onRemoveService: (serviceId: string) => void;
}) {
  const [serviceName, setServiceName] = useState("");
  const [comments, setComments] = useState("");
  const [url, setUrl] = useState("");
  const [showComponent, setShowComponent] = useState(show);

  useEffect(() => {
    setShowComponent(show);
  }, [show]);

  return (
    <div className={`${showComponent ? "opacity-100" : "opacity-0"}`}>
      <header>
        <h2>Service Manager</h2>
      </header>
      <div>
        <table>
          <tbody>
            {serviceList.map((service) => (
              <tr key={service.id}>
                <th>
                  <a href={service.url}>{service.name}</a>
                </th>
                <td>{service.comment || "No comment"}</td>
                <td>
                  <button onClick={() => onRemoveService(service.id)}>
                    Remove
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <form
          onSubmit={(event) => {
            onAddService(serviceName, comments, url);
            setServiceName("");
            setComments("");
            setUrl("");
            event.preventDefault();
          }}
        >
          <h3>Add Service</h3>
          <label htmlFor="serviceName">Name</label>
          <input
            type="text"
            id="serviceName"
            autoComplete="off"
            value={serviceName}
            required
            onChange={(event) => setServiceName(event.target.value)}
          />

          <label htmlFor="comments">Comments</label>
          <input
            type="text"
            id="comments"
            autoComplete="off"
            value={comments}
            onChange={(event) => setComments(event.target.value)}
          />

          <label htmlFor="url">URL</label>
          <input
            type="url"
            name="url"
            id="url"
            autoComplete="off"
            value={url}
            required
            onChange={(event) => setUrl(event.target.value)}
          />
          <button type="submit">Create service</button>
        </form>
      </div>
    </div>
  );
}

export function EmailDataManager({
  emailList,
  show,
  onAddEmail,
  onRemoveEmail,
}: {
  emailList: Email[];
  show: boolean;
  onAddEmail: (email: string, comment: string) => void;
  onRemoveEmail: (emailId: string) => void;
}) {
  const [email, setEmail] = useState("");
  const [comments, setComments] = useState("");
  const [showComponent, setShowComponent] = useState(show);

  useEffect(() => {
    setShowComponent(show);
  }, [show]);

  return (
    <div className={`${showComponent ? "opacity-100" : "opacity-0"}`}>
      <header>
        <h2>E-mail Manager</h2>
      </header>
      <table>
        <tbody>
          {emailList.map((email) => (
            <tr key={email.id}>
              <th>{email.email}</th>
              <td>{email.comment || "No comment"}</td>
              <td>
                <button onClick={() => onRemoveEmail(email.id)}>Remove</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <form
        onSubmit={(event) => {
          onAddEmail(email, comments);
          setEmail("");
          setComments("");
          event.preventDefault();
        }}
      >
        <label htmlFor="emailName">E-mail</label>
        <input
          type="email"
          id="emailName"
          autoComplete="off"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          required
        />

        <label htmlFor="emailComments">Comments</label>
        <input
          type="text"
          id="emailComments"
          autoComplete="off"
          value={comments}
          onChange={(event) => setComments(event.target.value)}
        />
        <button type="submit">Create E-mail</button>
      </form>
    </div>
  );
}
