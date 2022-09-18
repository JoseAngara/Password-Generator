import { useState, useReducer, useEffect } from "react";

export function useSemiPersistentState<A>(
  key: string,
  initialState: A
): [A, React.Dispatch<A>] {
  let valueInStorage = localStorage.getItem(key);
  const [value, setValue] = useState(
    valueInStorage !== null ? JSON.parse(valueInStorage) : initialState
  );

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value));
  }, [value, key]);

  return [value, setValue];
}

export function useSemiPersistentReducer<S, A>(
  key: string,
  reducer: (prevState: S, action: A) => S,
  initialValue: S
): [value: S, dispatchValue: React.Dispatch<A>] {
  let valueInStorage = localStorage.getItem(key);
  const [value, dispatchValue] = useReducer(
    reducer,
    valueInStorage !== null ? JSON.parse(valueInStorage) : initialValue
  );

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value));
  }, [value, key]);

  return [value, dispatchValue];
}
