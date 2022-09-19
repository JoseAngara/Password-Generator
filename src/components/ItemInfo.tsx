import { useState } from "react";
import { Email, Service } from "../utils/types";

type Item = {
  name?: string;
  url?: string;
  email?: string;
  comment: string;
  id: string;
};

export function ItemInfo({
  item,
  handleRemoveItem,
}: {
  item: Item;
  handleRemoveItem: (itemId: string) => void;
}) {
  const [showComment, setShowComment] = useState(false);

  return (
    <li
      className="even:bg-slate-200 flex"
      onClick={() => setShowComment(!showComment)}
    >
      <span className="grow font-bold overflow-y-hidden">
        {item.url ? (
          <a className="text-slate-500" target={"_blank"} href={item.url}>
            {item.name}
          </a>
        ) : (
          `${item.email}`
        )}
      </span>

      <button
        className="flex shrink-0 justify-center items-center w-1/3 bg-slate-800 text-white border-0 rounded ml-2"
        onClick={() => handleRemoveItem(item.id)}
      >
        Remove
      </button>
    </li>
  );
}
