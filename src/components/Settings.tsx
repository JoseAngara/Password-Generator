import { useEffect, useState } from "react";
import { MdClose } from "react-icons/md";

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

export default function Settings({
  showSettings,
  handleShowSettings,
  encryptationKey,
  setKey,
  serviceUtilities: { serviceList, handleAddService, handleRemoveService },
  emailUtilities: { emailList, handleAddEmail, handleRemoveEmail },
}: {
  showSettings: boolean;
  handleShowSettings: (value: boolean) => void;
  encryptationKey: string;
  setKey: (key: string) => void;
  serviceUtilities: {
    serviceList: Service[];
    handleAddService: (name: string, comment: string, url: string) => void;
    handleRemoveService: (serviceId: string) => void;
  };
  emailUtilities: {
    emailList: Email[];
    handleAddEmail: (email: string, comment: string) => void;
    handleRemoveEmail: (emailId: string) => void;
  };
}) {
  const [showComponent, setShowComponent] = useState(showSettings);
  const [actualKey, setActualKey] = useState(encryptationKey);
  const [keyValue, setKeyValue] = useState("");

  useEffect(() => {
    setShowComponent(showSettings);
  }, [showSettings]);

  useEffect(() => {
    setActualKey(encryptationKey);
  }, [encryptationKey]);

  return (
    <div
      className={`${
        showComponent ? "opacity-100" : "opacity-0 pointer-events-none"
      } absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 container h-screen bg-slate-500/50 flex justify-center items-center transition-opacity duration-200 ease-in-out`}
    >
      <div className="bg-white w-10/12 p-2">
        <header>
          <h2>Settings</h2>
          <span onClick={() => handleShowSettings(false)}>
            <MdClose size={"2em"} />
          </span>
        </header>
        <div>
          <p>
            Here is your key, this key is used to generate your passwords. It is
            genereated randomly the first time you open the app, but you can
            change it here if you had already one.
          </p>
          <div>
            <span>{encryptationKey}</span>
          </div>
          <form
            onSubmit={(event) => {
              setKey(keyValue);
              event.preventDefault();
            }}
          >
            <input
              type="text"
              id="setKey"
              value={keyValue}
              onChange={(event) => setKeyValue(event.target.value)}
            />
            <button type="submit">Change key</button>
          </form>
        </div>
        <ServiceDataManager
          serviceList={serviceList}
          onAddService={handleAddService}
          onRemoveService={handleRemoveService}
        />
        <EmailDataManager
          emailList={emailList}
          onAddEmail={handleAddEmail}
          onRemoveEmail={handleRemoveEmail}
        />
      </div>
    </div>
  );
}

function ServiceDataManager({
  serviceList,
  onAddService,
  onRemoveService,
}: {
  serviceList: Service[];
  onAddService: (name: string, comment: string, url: string) => void;
  onRemoveService: (serviceId: string) => void;
}) {
  const [serviceName, setServiceName] = useState("");
  const [comments, setComments] = useState("");
  const [url, setUrl] = useState("");

  return (
    <div className="">
      <header>
        <h3>Service Manager</h3>
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

function EmailDataManager({
  emailList,
  onAddEmail,
  onRemoveEmail,
}: {
  emailList: Email[];
  onAddEmail: (email: string, comment: string) => void;
  onRemoveEmail: (emailId: string) => void;
}) {
  const [email, setEmail] = useState("");
  const [comments, setComments] = useState("");

  return (
    <div className="">
      <header>
        <h3>E-mail Manager</h3>
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
