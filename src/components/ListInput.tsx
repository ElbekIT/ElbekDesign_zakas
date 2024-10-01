"use client";
import { ChangeEvent, useState } from "react";
import InputForm from "./InputForm";
import { FormValue } from "./interface";
import { FiSend } from "react-icons/fi";
import { useBase } from "@/hooks/useBase";
function ListInput() {
  const [formData, setFormData] = useState<FormValue>({
    name: "",
    number: +998,
    design: "",
  });

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const { handleSumbit } = useBase();

  return (
    <>
      <InputForm
        name="name"
        lebal="Name"
        type="text"
        textarea={false}
        value={formData.name}
        classDiv="md:col-start-1 md:col-end-2 md:row-start-1 md:row-end-2 justify-end"
        onChange={handleChange}
      />
      <InputForm
        name="number"
        lebal="Number"
        type="number"
        textarea={false}
        value={formData.number}
        classDiv="md:col-start-2 md:col-end-3 md:row-start-1 md:row-end-2 justify-end"
        onChange={handleChange}
      />
      <InputForm
        name="design"
        lebal="Dizayn"
        type="text"
        textarea={true}
        value={formData.design}
        classDiv="md:col-start-1 md:col-end-3 md:row-start-2 md:row-end-3"
        onChange={handleChange}
      />
      <div className=" w-full justify-end flex items-end md:col-start-1 md:col-end-3  ">
        <button
          type="button"
          className="btn btn-primary text-lg font-bold font-mono items-center max-w-full w-72"
          onClick={(e) => {
            handleSumbit(e, formData, setFormData);
          }}
        >
          SEND <FiSend />
        </button>
      </div>
    </>
  );
}

export default ListInput;
