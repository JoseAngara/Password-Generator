import React, { useState, useReducer, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import { MdSettings } from "react-icons/md";
import Settings from "./Settings";
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
      <header className="flex justify-between items-center text-lg">
        <h1 className="font-bold tracking-wide uppercase">
          Password Generator
        </h1>
        <span onClick={() => setShowSettings(true)}>
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
        onSubmit={(event) => {
          onSubmit(service, email, generatorData);
          event.preventDefault();
        }}
      >
        <fieldset>
          <legend>Account Data</legend>
          <label htmlFor="service">Service</label>
          <select
            name="services"
            id="service"
            value={service}
            onChange={(event) => setService(event.target.value)}
          >
            <option value="">Without service</option>
            {serviceList.map((service) => (
              <option key={service.id} value={service.value}>
                {service.name}
              </option>
            ))}
          </select>

          <label htmlFor="email">E-mail</label>
          <input
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

        <fieldset>
          <legend>Generator Data</legend>
          <label htmlFor="length">Character Length</label>
          <input
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
          <span>{generatorData.length}</span>

          <input
            type="checkbox"
            name="uppercase"
            id="uppercase"
            checked={generatorData.includeUppercase}
            onChange={() =>
              dispatchGeneratorData({
                type: "TOGGLE_UPPERCASE",
              })
            }
          />
          <label htmlFor="uppercase">Include uppercase letters</label>

          <input
            type="checkbox"
            name="lowercase"
            id="lowercase"
            checked={generatorData.includeLowercase}
            onChange={() =>
              dispatchGeneratorData({
                type: "TOGGLE_LOWERCASE",
              })
            }
          />
          <label htmlFor="lowercase">Include lowercase letters</label>

          <input
            type="checkbox"
            name="numbers"
            id="numbers"
            checked={generatorData.includeNumbers}
            onChange={() =>
              dispatchGeneratorData({
                type: "TOGGLE_NUMBERS",
              })
            }
          />
          <label htmlFor="numbers">Include numbers</label>

          <input
            type="checkbox"
            name="symbols"
            id="symbols"
            checked={generatorData.includeSymbols}
            onChange={() =>
              dispatchGeneratorData({
                type: "TOGGLE_SYMBOLS",
              })
            }
          />
          <label htmlFor="symbols">Include symbols</label>
        </fieldset>
        <button type="submit">Generate</button>
      </form>
    </div>
  );
}
