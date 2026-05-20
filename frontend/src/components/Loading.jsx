import React from "react";

const Loading = () => (
  <div className="py-10 text-center flex flex-col items-center gap-3">
    <div className="w-8 h-8 border-4 border-green-600 border-t-transparent rounded-full animate-spin"></div>
    <div className="text-gray-600 text-sm">Loading...</div>
  </div>
);

export default Loading;
