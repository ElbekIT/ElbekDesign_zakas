"use client";

import { BaseDoc, FormValue } from "@/components/interface";
import {
  Dispatch,
  FormEvent,
  SetStateAction,
  useEffect,
  useState,
} from "react";
import {
  collection,
  addDoc,
  serverTimestamp,
  query,
  orderBy,
  onSnapshot,
  QueryDocumentSnapshot,
} from "firebase/firestore";
import { db } from "@/firebase/firebaseConfig";

// Хук для работы с Firebase
const useBase = () => {
  const [base, setBase] = useState<BaseDoc[] | null>(null);

  // Получение данных из Firestore
  useEffect(() => {
    const q = query(collection(db, "order"), orderBy("createAt"));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const cities: BaseDoc[] = [];
      querySnapshot.forEach((doc: QueryDocumentSnapshot) => {
        const data = doc.data();
        cities.push({
          id: doc.id,
          name: data.name || "", // обработайте возможное отсутствие поля
          number: data.number || "",
          design: data.design || "",
          createAt: data.createAt || 0, // или задайте значение по умолчанию
        });
      });
      setBase(cities);
    });

    return () => unsubscribe(); // Отписываемся от слушателя
  }, []);

  // Обработка отправки данных
  const handleSumbit = async (
    e: FormEvent,
    FormValue: FormValue,
    setFormData: Dispatch<SetStateAction<FormValue>>
  ) => {
    e.preventDefault();
    await addDoc(collection(db, "order"), {
      ...FormValue,
      createAt: serverTimestamp(),
    });
    setFormData({
      name: "",
      number: +998,
      design: "",
    });
  };

  return { handleSumbit, base };
};

export { useBase };
