import React from "react";
import { InputFormProps } from "./interface";

const InputForm: React.FC<InputFormProps> = ({
  name,
  lebal,
  classInput,
  textarea,
  type = "text",
  classDiv,
  value,
  onChange,
}) => {
  return (
    <label
      htmlFor={name}
      className={`${classDiv} h-full flex flex-col justify-start gap-1`}
    >
      <span className="opacity-80 font-bold text-base pl-3">{lebal}</span>
      {textarea ? (
        <textarea
          name={name}
          className={`${classInput} bg-white w-full rounded-2xl outline-none h-52 resize-none px-5 py-2 font-mono focus:border-blue-500 focus:border-2`}
          value={value}
          onChange={onChange}
        />
      ) : (
        <input
          name={name}
          type={type}
          value={value}
          className={`${classInput} bg-white font-bold rounded-xl focus:border-blue-500 focus:border-2 outline-none h-10 pl-5 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none`}
          onChange={onChange}
        />
      )}
    </label>
  );
};

export default InputForm;
