import { useState, useReducer } from "react";
import { useSemiPersistentState } from "./utils/custom-hooks";
import PasswordForm from "./components/passwordForm";
import { v4 as uuidv4 } from "uuid";
import { getPassword, getPin } from "./utils/encrypt";

type SecurityCodes = {
  password: string;
  pin: string;
};

type GeneratorData = {
  length: number;
  includeUppercase: boolean;
  includeLowercase: boolean;
  includeNumbers: boolean;
  includeSymbols: boolean;
};

function App() {
  const [encryptationKey, setEncryptationKey] = useSemiPersistentState(
    "key",
    uuidv4()
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
    <div>
      <main>
        <PasswordForm
          encryptationKey={encryptationKey}
          onSubmit={handleCreate}
        />
        <div>
          <span>{securityCodes.password || "password"}</span>
          <span>{securityCodes.pin || "pin"}</span>
        </div>
      </main>
    </div>
  );
}

export default App;
