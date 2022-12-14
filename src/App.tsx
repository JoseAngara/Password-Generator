import { useState } from "react";
import { capitalizeFirstLetter } from "./utils/format-strings";
import {
  useSemiPersistentState,
  useSemiPersistentReducer,
} from "./utils/custom-hooks";
import PasswordForm from "./components/passwordForm";
import ShowCode from "./components/ShowCode";
import { v4 as uuidv4 } from "uuid";
import { getPassword, getPin } from "./utils/Encrypt";
import {
  Email,
  EmailAction,
  Service,
  ServiceAction,
  GeneratorData,
} from "./utils/types";

type SecurityCodes = {
  password: string;
  pin: string;
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

let initialServices: Service[] = [];
let initialEmail: Email[] = [];

function App() {
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

  const [encryptationKey, setEncryptationKey] = useSemiPersistentState(
    "key",
    uuidv4(),
    true
  );
  const [securityCodes, setSecurityCodes] = useState({
    password: "",
    pin: "",
  });

  const createCodes = (
    length: number,
    serviceValue: string,
    email: string,
    regex: RegExp
  ): SecurityCodes => {
    return {
      password: getPassword(
        length,
        encryptationKey,
        serviceValue + email,
        regex
      ),
      pin: getPin(length, encryptationKey, serviceValue + email),
    };
  };

  const changeEncryptationKey = (key: string) => {
    setEncryptationKey(key);
  };

  const createRegEx = (generatorData: GeneratorData) => {
    return new RegExp(
      `[${generatorData.includeLowercase ? "a-z" : ""}${
        generatorData.includeUppercase ? "A-Z" : ""
      }${generatorData.includeNumbers ? "0-9" : ""}${
        generatorData.includeSymbols ? "!-/:-@[-`{-~" : ""
      }]`,
      "g"
    );
  };

  const handleCreate = (
    serviceValue: string,
    email: string,
    generatorData: GeneratorData
  ) => {
    let regex = createRegEx(generatorData);

    setSecurityCodes(
      createCodes(generatorData.length, serviceValue, email, regex)
    );
  };
  return (
    <div className="container h-screen flex items-center justify-center relative text-slate-800 font-roboto">
      <main className="w-11/12 sm:grid sm:grid-cols-2 lg:w-2/3 sm:gap-4">
        <PasswordForm
          encryptationKey={encryptationKey}
          serviceList={serviceList}
          dispatchServiceList={dispatchServiceList}
          emailList={emailList}
          dispatchEmailList={dispatchEmailList}
          onSubmit={handleCreate}
          setKey={changeEncryptationKey}
        />
        <div className="flex flex-col items-center sm:justify-center border border-slate-400 p-2 rounded font-fira-mono select-none">
          <ShowCode code={securityCodes.password}>PASSWORD</ShowCode>
          <div className="w-full border-b border-slate-400"></div>
          <ShowCode code={securityCodes.pin}>PIN</ShowCode>
        </div>
      </main>
    </div>
  );
}

export default App;
