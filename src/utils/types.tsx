export type Email = {
  email: string;
  comment: string;
  id: string;
};

export type EmailAction =
  | {
      type: "ADD_EMAIL";
      email: string;
      comment: string;
    }
  | {
      type: "REMOVE_EMAIL";
      id: string;
    };

export type Service = {
  name: string;
  value: string;
  url: string;
  comment: string;
  id: string;
};

export type ServiceAction =
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

export type GeneratorData = {
  length: number;
  includeUppercase: boolean;
  includeLowercase: boolean;
  includeNumbers: boolean;
  includeSymbols: boolean;
};

export type GeneratorAction =
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
