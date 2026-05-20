import React from "react";

const AuthCard = ({ title, children }) => {
  const [first, second] = title.split(" ");

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-[2000]">

      <div className="w-[420px] bg-white rounded-xl shadow-lg p-10">
        <h2 className="text-center text-2xl font-semibold mb-8">
          <span className="text-green-600">{first}</span> {second}
        </h2>

        {children}
      </div>

    </div>
  );
};

export default AuthCard;
