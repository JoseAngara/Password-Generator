import React, { useState, useReducer, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import { getPin } from "../utils/encrypt";
import { useSemiPersistentReducer } from "../utils/custom-hooks";
import { capitalizeFirstLetter } from "../utils/format-strings";
import { ServiceDataManager, EmailDataManager } from "./data-managers";

type Email = {
  email: string;
  comment: string;
  id: string;
};

type EmailAction =
  | {
      type: "ADD_EMAIL";
      email: string;
      comment: string;
    }
  | {
      type: "REMOVE_EMAIL";
      id: string;
    };

type Service = {
  name: string;
  value: string;
  url: string;
  comment: string;
  id: string;
};

type ServiceAction =
  | {
      type: "ADD_SERVICE";
      serviceData: {
        name: string;
        comment: string;
        url: string;
      };
    }
  | {
      type: "REMOVE_SERVICE";
      id: string;
    };

const emailReducer = (state: Email[], action: EmailAction) => {
  switch (action.type) {
    case "ADD_EMAIL": {
      return state.concat({
        email: action.email,
        comment: action.comment,
        id: uuidv4(),
      });
    }
    case "REMOVE_EMAIL": {
      return state.filter((email) => email.id !== action.id);
    }
  }
};

const serviceReducer = (state: Service[], action: ServiceAction) => {
  switch (action.type) {
    case "ADD_SERVICE": {
      if (
        state.every(
          (service) =>
            service.name !== capitalizeFirstLetter(action.serviceData.name)
        )
      ) {
        let key = localStorage.getItem("key") || "";
        return state.concat({
          name: capitalizeFirstLetter(action.serviceData.name),
          value: getPin(20, key, action.serviceData.name),
          comment: action.serviceData.comment,
          url: action.serviceData.url,
          id: uuidv4(),
        });
      }
      return state;
    }
    case "REMOVE_SERVICE": {
      return state.filter((service) => service.id !== action.id);
    }
  }
};

type GeneratorData = {
  length: number;
  includeUppercase: boolean;
  includeLowercase: boolean;
  includeNumbers: boolean;
  includeSymbols: boolean;
};

type GeneratorAction =
  | {
      type: "SET_LENGTH";
      length: number;
    }
  | {
      type: "TOGGLE_UPPERCASE";
    }
  | {
      type: "TOGGLE_LOWERCASE";
    }
  | {
      type: "TOGGLE_NUMBERS";
    }
  | {
      type: "TOGGLE_SYMBOLS";
    };

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

let initialServices: Service[] = [
  {
    name: "Facebook",
    comment: "",
    url: "https://www.facebook.com",
    value: uuidv4(),
    id: uuidv4(),
  },
  {
    name: "Twitter",
    comment: "",
    url: "https://twitter.com/",
    value: uuidv4(),
    id: uuidv4(),
  },
  {
    name: "League of Legends",
    comment: "LAN server",
    url: "https://www.leagueoflegends.com/es-mx/",
    value: uuidv4(),
    id: uuidv4(),
  },
];
let initialEmail: Email[] = [
  { email: "jmeh1992@gmail.com", comment: "Personal e-mail", id: uuidv4() },
  {
    email: "j-m-eh@hotmail.com",
    comment: "My first hotmail mail",
    id: uuidv4(),
  },
];

export default function PasswordForm({
  encryptationKey,
  onSubmit,
}: {
  encryptationKey: string;
  onSubmit: (
    serviceValue: string,
    email: string,
    generatorData: GeneratorData
  ) => void;
}) {
  const [serviceList, dispatchServiceList] = useSemiPersistentReducer(
    "service-list",
    serviceReducer,
    initialServices
  );

  const [emailList, dispatchEmailList] = useSemiPersistentReducer(
    "email-list",
    emailReducer,
    initialEmail
  );

  const [service, setService] = useState("");
  const [email, setEmail] = useState("");
  const [showServiceData, setShowServiceData] = useState(false);
  const [showEmailData, setShowEmailData] = useState(false);
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

  const handleServiceData = () => setShowServiceData(!showServiceData);

  const handleEmailData = () => setShowEmailData(!showEmailData);

  return (
    <div>
      <header>
        <h1>Password Generator</h1>
        <button onClick={() => console.log("hello")}>Settings</button>
      </header>
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
      <ServiceDataManager
        serviceList={serviceList}
        show={showServiceData}
        onAddService={handleAddService}
        onRemoveService={handleRemoveService}
      />

      <EmailDataManager
        emailList={emailList}
        show={showEmailData}
        onAddEmail={handleAddEmail}
        onRemoveEmail={handleRemoveEmail}
      />
    </div>
  );
}
