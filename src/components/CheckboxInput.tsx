import { ImCheckboxUnchecked, ImCheckboxChecked } from "react-icons/im";

export default function CheckboxInput({
  id,
  checked,
  handleChange,
  children,
}: {
  id: string;
  checked: boolean;
  handleChange: () => void;
  children: string;
}) {
  return (
    <div className="flex items-center select-none py-1">
      <input
        className="w-0 h-0"
        type="checkbox"
        name={id}
        id={id}
        checked={checked}
        onChange={handleChange}
      />
      <label className="flex items-center" htmlFor={id}>
        <div className="mr-1">
          {checked ? <ImCheckboxChecked /> : <ImCheckboxUnchecked />}
        </div>
        {children}
      </label>
    </div>
  );
}
