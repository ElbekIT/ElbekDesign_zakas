import { ChangeEvent } from "react";

export interface InputFormProps {
  name: string;
  lebal: string;
  type: string;
  textarea: boolean;
  classInput?: string;
  classDiv: string;
  value?: number | string;
  onChange: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}

export interface FormValue {
  name: string;
  number: number;
  design: string;
}
export interface BaseDoc {
  id: string;
  name: string;
  number: string;
  design: string;
  createAt: string | number;
}
