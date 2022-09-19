import { useEffect, useState } from "react";
import { ItemInfo } from "./ItemInfo";
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
      } absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 container h-screen bg-slate-500/50 flex justify-center items-center transition-opacity duration-200 ease-in-out z-10 py-4`}
    >
      <div className="bg-white w-10/12 p-2 max-h-full sm:w-[30rem] overflow-auto relative">
        <div>
          <header className="flex justify-between items-center text-lg">
            <h2 className="font-bold tracking-wide uppercase">Settings</h2>
            <span
              className="cursor-pointer"
              onClick={() => handleShowSettings(false)}
            >
              <MdClose size={"2em"} />
            </span>
          </header>
          <div>
            <p className="my-2 mb-4 text-slate-500">
              Here is your key, this key is used to generate your passwords. It
              is genereated randomly the first time you open the app, but you
              can change it here if you had already one.
            </p>
            <div className="mb-4">
              <span className=" block w-full text-center font-bold text-sm">
                {encryptationKey}
              </span>
            </div>
            <form
              className="flex items-center py-2 w-full"
              onSubmit={(event) => {
                setKey(keyValue);
                event.preventDefault();
              }}
            >
              <input
                className="bg-slate-200 border px-2  appearance-none mr-2 grow"
                type="text"
                id="setKey"
                autoComplete="off"
                value={keyValue}
                onChange={(event) => setKeyValue(event.target.value)}
              />
              <button
                className="bg-slate-800 text-white font-bold px-2 py-1 tracking-widest rounded shrink-0"
                type="submit"
              >
                Change
              </button>
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
    <div className="mb-8 mt-4">
      <header>
        <h3 className="font-bold tracking-wide uppercase mb-2">
          Service Manager
        </h3>
      </header>
      <div>
        <ul className="w-full divide-y mb-6">
          {serviceList.map((service) => (
            <ItemInfo
              key={service.id}
              item={service}
              handleRemoveItem={onRemoveService}
            />
          ))}
        </ul>
        <form
          onSubmit={(event) => {
            onAddService(serviceName, comments, url);
            setServiceName("");
            setComments("");
            setUrl("");
            event.preventDefault();
          }}
        >
          <fieldset className="border border-slate-400 p-2 rounded flex flex-col w-full">
            <legend className="font-medium">Add Service</legend>
            <label className="font-medium" htmlFor="serviceName">
              Name
            </label>
            <input
              className="bg-slate-200 border px-2  appearance-none"
              type="text"
              id="serviceName"
              autoComplete="off"
              value={serviceName}
              required
              onChange={(event) => setServiceName(event.target.value)}
            />
            <label className="font-medium" htmlFor="comments">
              Comments
            </label>
            <input
              className="bg-slate-200 border px-2  appearance-none"
              type="text"
              id="comments"
              autoComplete="off"
              value={comments}
              onChange={(event) => setComments(event.target.value)}
            />
            <label className="font-medium" htmlFor="url">
              URL
            </label>
            <input
              className="bg-slate-200 border px-2  appearance-none"
              type="url"
              name="url"
              id="url"
              autoComplete="off"
              value={url}
              required
              onChange={(event) => setUrl(event.target.value)}
            />
            <button
              className="bg-slate-800 text-white font-bold px-4 py-2 tracking-widest rounded mt-4"
              type="submit"
            >
              Create service
            </button>
          </fieldset>
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
    <div className="mb-8 mt-4">
      <header>
        <h3 className="font-bold tracking-wide uppercase mb-2">
          E-mail Manager
        </h3>
      </header>
      <ul className="w-full divide-y mb-6">
        {emailList.map((email) => (
          <ItemInfo
            key={email.id}
            item={email}
            handleRemoveItem={onRemoveEmail}
          />
        ))}
      </ul>
      <form
        onSubmit={(event) => {
          onAddEmail(email, comments);
          setEmail("");
          setComments("");
          event.preventDefault();
        }}
      >
        <fieldset className="border border-slate-400 p-2 rounded flex flex-col w-full">
          <legend>Add E-mail</legend>
          <label className="font-medium" htmlFor="emailName">
            E-mail
          </label>
          <input
            className="bg-slate-200 border px-2  appearance-none"
            type="email"
            id="emailName"
            autoComplete="off"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
          />
          <label className="font-medium" htmlFor="emailComments">
            Comments
          </label>
          <input
            className="bg-slate-200 border px-2  appearance-none"
            type="text"
            id="emailComments"
            autoComplete="off"
            value={comments}
            onChange={(event) => setComments(event.target.value)}
          />
          <button
            className="bg-slate-800 text-white font-bold px-4 py-2 tracking-widest rounded mt-4"
            type="submit"
          >
            Create E-mail
          </button>
        </fieldset>
      </form>
    </div>
  );
}
