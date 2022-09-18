import { useState, useReducer } from "react";
import { sha512 } from "js-sha512";
import { hexToUtf8 } from "./utils/Encrypt";

function App() {
  console.log(hexToUtf8(sha512("hello world")));

  return <div></div>;
}

export default App;
