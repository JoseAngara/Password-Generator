import React, { useState, useReducer } from "react";
import { v4 as uuidv4 } from "uuid";
import { useSemiPersistentReducer } from "../utils/custom-hooks";

type Email = {
  email: string;
  id: string;
};

type EmailAction =
  | {
      type: "ADD_EMAIL";
      email: string;
    }
  | {
      type: "REMOVE_EMAIL";
      id: string;
    };

type Service = {
  name: string;
  value: string;
  id: string;
};

type ServiceAction =
  | {
      type: "ADD_SERVICE";
      name: string;
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
      return state.concat({
        name: action.name,
        value: uuidv4(),
        id: uuidv4(),
      });
    }
    case "REMOVE_SERVICE": {
      return state.filter((service) => service.id !== action.id);
    }
  }
};

let initialServices: Service[] = [];
let initialEmail: Email[] = [];

function passwordForm() {
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

  const handleAddEmail = (email: string): void => {
    dispatchEmailList({ type: "ADD_EMAIL", email });
  };

  const handleRemoveEmail = (emailId: string): void => {
    dispatchEmailList({ type: "REMOVE_EMAIL", id: emailId });
  };

  const handleAddService = (serviceName: string): void => {
    dispatchServiceList({ type: "ADD_SERVICE", name: serviceName });
  };

  const handleRemoveService = (serviceId: string): void => {
    dispatchServiceList({ type: "REMOVE_SERVICE", id: serviceId });
  };
  return (
    <div>
      <form action="">
        <fieldset>
          <legend>Account Data</legend>
          <label htmlFor="service">Service</label>
          <select name="services" id="service">
            {serviceList.map((service) => (
              <option value={service.value}>{service.name}</option>
            ))}
          </select>

          <label htmlFor="email">E-mail</label>
          <input type="email" />
        </fieldset>
      </form>
    </div>
  );
}

function UserDataManager({
  serviceList,
  emailList,
  onAddService,
  onRemoveService,
  onAddEmail,
  onRemoveEmail,
}: {
  serviceList: Service[];
  emailList: Email[];
  onAddService: (serviceName: string) => void;
  onRemoveService: (serviceId: string) => void;
  onAddEmail: (email: string) => void;
  onRemoveEmail: (emailId: string) => void;
}) {
  type DataAction =
    | {
        type: "ADD_SERVICE";
        name: string;
      }
    | {
        type: "ADD_EMAIL";
        email: string;
      };

  const handleAddData = (action: DataAction) => {
    switch (action.type) {
      case "ADD_EMAIL": {
        return onAddEmail(action.email);
      }
      case "ADD_SERVICE": {
        return onAddService(action.name);
      }
    }
  };

  return (
    <div>
      <h1>User Data Manager</h1>
      <div>
        <ul>
          {serviceList.map((service) => (
            <li>
              {service.name}
              <button onClick={() => onRemoveService(service.id)}>
                Remove
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
