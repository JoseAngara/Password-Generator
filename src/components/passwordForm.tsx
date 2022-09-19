import { useState, useReducer } from "react";
import { MdSettings, MdLock } from "react-icons/md";
import Settings from "./Settings";
import CheckboxInput from "./CheckboxInput";
import {
  Email,
  EmailAction,
  Service,
  ServiceAction,
  GeneratorData,
  GeneratorAction,
} from "../utils/types";

const generatorDataReducer = (
  state: GeneratorData,
  action: GeneratorAction
) => {
  switch (action.type) {
    case "SET_LENGTH": {
      return {
        ...state,
        length: action.length,
      };
    }
    case "TOGGLE_LOWERCASE": {
      return {
        ...state,
        includeLowercase: !state.includeLowercase,
      };
    }
    case "TOGGLE_UPPERCASE": {
      return {
        ...state,
        includeUppercase: !state.includeUppercase,
      };
    }
    case "TOGGLE_NUMBERS": {
      return {
        ...state,
        includeNumbers: !state.includeNumbers,
      };
    }
    case "TOGGLE_SYMBOLS": {
      return {
        ...state,
        includeSymbols: !state.includeSymbols,
      };
    }
  }
};

export default function PasswordForm({
  serviceList,
  dispatchServiceList,
  emailList,
  dispatchEmailList,
  onSubmit,
  encryptationKey,
  setKey,
}: {
  serviceList: Service[];
  dispatchServiceList: (action: ServiceAction) => void;
  emailList: Email[];
  dispatchEmailList: (action: EmailAction) => void;
  onSubmit: (
    serviceValue: string,
    email: string,
    generatorData: GeneratorData
  ) => void;
  encryptationKey: string;
  setKey: (key: string) => void;
}) {
  const [service, setService] = useState("");
  const [email, setEmail] = useState("");
  const [showSettings, setShowSettings] = useState(false);
  const [generatorData, dispatchGeneratorData] = useReducer(
    generatorDataReducer,
    {
      length: 20,
      includeUppercase: true,
      includeLowercase: true,
      includeNumbers: true,
      includeSymbols: true,
    }
  );

  const handleAddEmail = (email: string, comment: string): void => {
    dispatchEmailList({ type: "ADD_EMAIL", email, comment });
  };

  const handleRemoveEmail = (emailId: string): void => {
    dispatchEmailList({ type: "REMOVE_EMAIL", id: emailId });
  };

  const handleAddService = (
    name: string,
    comment: string,
    url: string
  ): void => {
    dispatchServiceList({
      type: "ADD_SERVICE",
      serviceData: { name, comment, url },
    });
  };

  const handleRemoveService = (serviceId: string): void => {
    dispatchServiceList({ type: "REMOVE_SERVICE", id: serviceId });
  };

  return (
    <div className="">
      <header className="flex justify-between items-center text-lg mb-4">
        <h1 className="flex items-center font-bold tracking-wide uppercase text-2xl">
          <MdLock size={"1.5em"} />
          Password Generator
        </h1>
        <span className="cursor-pointer" onClick={() => setShowSettings(true)}>
          <MdSettings size={"2em"} />
        </span>
      </header>
      <Settings
        encryptationKey={encryptationKey}
        showSettings={showSettings}
        handleShowSettings={setShowSettings}
        setKey={setKey}
        serviceUtilities={{
          serviceList,
          handleAddService,
          handleRemoveService,
        }}
        emailUtilities={{ emailList, handleAddEmail, handleRemoveEmail }}
      />
      <form
        className="flex flex-col items-center"
        onSubmit={(event) => {
          onSubmit(service, email, generatorData);
          setEmail("");
          event.preventDefault();
        }}
      >
        <fieldset className="border border-slate-400 p-2 rounded flex flex-col mb-2 w-full">
          <legend className="font-medium">Account Data</legend>
          <label className="font-medium" htmlFor="service">
            Service
          </label>
          <select
            className="bg-slate-200 border px-2 appearance-none"
            name="services"
            id="service"
            value={service}
            onChange={(event) => setService(event.target.value)}
          >
            <option className="" value="">
              Without service
            </option>
            {serviceList.map((service) => (
              <option
                className="hover:bg-slate-800 hover:text-white"
                key={service.id}
                value={service.value}
              >
                {service.name}
              </option>
            ))}
          </select>

          <label className="font-medium" htmlFor="email">
            E-mail
          </label>
          <input
            className="bg-slate-200 border px-2  appearance-none"
            type="email"
            id="email"
            list="emaillist"
            value={email}
            autoComplete="off"
            placeholder="example@provider.com"
            required
            onChange={(event) => setEmail(event.target.value)}
          />
          <datalist id="emaillist">
            {emailList.map((email) => (
              <option key={email.id} value={email.email} />
            ))}
          </datalist>
        </fieldset>

        <fieldset className="border border-slate-400 p-2 rounded flex flex-col w-full">
          <legend className="font-medium">Generator Data</legend>
          <div className="relative flex flex-col py-1">
            <label className="font-medium" htmlFor="length">
              Character Length
            </label>
            <input
              className="appearance-none h-2 rounded-lg bg-slate-200"
              type="range"
              name="length"
              id="length"
              min={8}
              max={60}
              value={generatorData.length}
              onChange={(event) =>
                dispatchGeneratorData({
                  type: "SET_LENGTH",
                  length: Number(event.target.value),
                })
              }
            />
            <span className="font-medium absolute right-0">
              {generatorData.length}
            </span>
          </div>

          <CheckboxInput
            id="uppercase"
            checked={generatorData.includeUppercase}
            handleChange={() =>
              dispatchGeneratorData({ type: "TOGGLE_UPPERCASE" })
            }
          >
            Include uppercase
          </CheckboxInput>

          <CheckboxInput
            id="lowercase"
            checked={generatorData.includeLowercase}
            handleChange={() =>
              dispatchGeneratorData({ type: "TOGGLE_LOWERCASE" })
            }
          >
            Include lowercase
          </CheckboxInput>

          <CheckboxInput
            id="numbers"
            checked={generatorData.includeNumbers}
            handleChange={() =>
              dispatchGeneratorData({ type: "TOGGLE_NUMBERS" })
            }
          >
            Include numbers
          </CheckboxInput>

          <CheckboxInput
            id="symbols"
            checked={generatorData.includeSymbols}
            handleChange={() =>
              dispatchGeneratorData({ type: "TOGGLE_SYMBOLS" })
            }
          >
            Include symbols
          </CheckboxInput>
        </fieldset>
        <button
          className="bg-slate-800 text-white font-bold px-4 py-2 tracking-widest rounded my-4"
          type="submit"
        >
          Generate
        </button>
      </form>
    </div>
  );
}
