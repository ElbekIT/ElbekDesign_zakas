"use client"; // Указываем, что этот компонент будет клиентским

import { useBase } from "@/hooks/useBase"; // Импортируем наш хук
import { BsFillTelephoneOutboundFill } from "react-icons/bs";
import { FaAngleDown } from "react-icons/fa6";
import Loading from "./Loading";
import { useState } from "react";
const ListOrder = () => {
  const { base } = useBase();
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);

  const toggleExpand = (id: string) => {
    // Если элемент уже раскрыт, то свернем его, иначе раскроем новый
    setExpandedOrderId(expandedOrderId === id ? null : id);
  };
  return (
    <>
      {base ? (
        <div className="grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-2">
          {base.map((order) => (
            <div
              key={order.id}
              className="transition-transform rounded-xl p-5 text-black shadow-xl bg-opacity-95 bg-cover max-w-full  w-96 bg-[url('https://img.freepik.com/free-vector/gray-abstract-wireframe-background_53876-99911.jpg')] max-h-full  pl-5"
            >
              <div className="card-bod flex flex-col gap-7 transition-transform">
                <h2 className="card-title">{order.name}</h2>
                <p
                  className={`${
                    expandedOrderId === order.id ? "" : "line-clamp-3"
                  }`}
                >
                  {order.design}
                </p>
              </div>
              <div className="card-actions flex items-center justify-between w-full pt-5">
                {/* <button className="btn btn-primary">Buy Now</button> */}
                <div className="flex items-center justify-center gap-2">
                  <BsFillTelephoneOutboundFill />
                  <p>+{order.number}</p>
                </div>
                <>
                  {order.design.length > 100 && (
                    <button onClick={() => toggleExpand(order.id)} className="">
                      <FaAngleDown
                        className={`${
                          expandedOrderId === order.id ? "rotate-180" : ""
                        } transition-transform`}
                      />
                    </button>
                  )}
                </>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <Loading />
      )}
    </>
  );
};

export default ListOrder;
