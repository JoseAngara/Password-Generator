import { useState, useReducer, useEffect, useRef } from "react";

export function useSemiPersistentState<A>(
  key: string,
  initialState: A,
  onMount = false
): [A, React.Dispatch<A>] {
  const isMounted = useRef(onMount);
  let valueInStorage = localStorage.getItem(key) || "null";
  const [value, setValue] = useState(
    JSON.parse(valueInStorage) || initialState
  );

  useEffect(() => {
    if (!isMounted.current) {
      isMounted.current = true;
    } else {
      localStorage.setItem(key, JSON.stringify(value));
    }
  }, [value, key]);

  return [value, setValue];
}

export function useSemiPersistentReducer<S, A>(
  key: string,
  reducer: (prevState: S, action: A) => S,
  initialValue: S,
  onMount = false
): [value: S, dispatchValue: React.Dispatch<A>] {
  const isMounted = useRef(onMount);
  let valueInStorage = localStorage.getItem(key) || "null";
  const [value, dispatchValue] = useReducer(
    reducer,
    JSON.parse(valueInStorage) || initialValue
  );

  useEffect(() => {
    if (!isMounted.current) {
      isMounted.current = true;
    } else {
      localStorage.setItem(key, JSON.stringify(value));
    }
  }, [value, key]);

  return [value, dispatchValue];
}
