import { useState, useEffect } from "react";

export default function ShowCode({
  children,
  code,
}: {
  children: string;
  code: string;
}) {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      if (copied) {
        setCopied(false);
      }
    }, 1000);
  }, [copied]);

  return (
    <div
      className="flex items-center justify-center w-full min-h-max sm:h-1/2 font-bold text-2xl py-4 text-center break-all cursor-pointer relative"
      onClick={() => {
        navigator.clipboard.writeText(code);
        setCopied(true);
      }}
    >
      <div
        className={`${
          copied ? "opacity-90" : "opacity-0"
        } absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none bg-white rounded p-1 transition-opacity duration-200 ease-out`}
      >
        <span className="flex items-center justify-center border rounded border-slate-200 p-2">
          COPIED
        </span>
      </div>
      {code || children}
    </div>
  );
}
