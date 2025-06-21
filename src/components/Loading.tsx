import React from "react";

function Loading() {
  return (
    <div className="fixed inset-0 flex items-center justify-center">
      <div className=" flex flex-col items-center justify-center">
        <p className="loading loading-ring loading-lg size-28 "></p>
        <p className="text-3xl font-bold pl-5">Loading...</p>
      </div>
    </div>
  );
}

export default Loading;
