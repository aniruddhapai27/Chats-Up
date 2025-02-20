import React, { useState } from "react";
import Sidebar from "./Sidebar";
import MessageContainer from "./MessageContainer";

const Home = () => {
  const [selectedUser, setSelectedUser] = useState(null);
  const [isSidebarVisible, setIsSidebarVisible] = useState(true);

  const handleUserSelect = (user) => {
    setSelectedUser(user);
    setIsSidebarVisible(false);
  };

  const handleShowSidebar = () => {
    setIsSidebarVisible(true);
    setSelectedUser(null);
  };

  return (
    <div className="flex justify-between min-w-full lg:min-w-[550px] lg:max-w-[65%] px-2 h-[95%] lg:h-full rounded-xl shadow-lg bg-white/10 bg-clip-padding backdrop-filter backdrop-blur-lg bg-opacity-10 ">
      <div
        className={`w-full py-2 lg:flex ${
          isSidebarVisible ? "block" : "hidden"
        }`}
      >
        <Sidebar onSelectUser={handleUserSelect} />
      </div>
      <div
        className={`w-px bg-gray-300 mx-3 lg:flex ${
          isSidebarVisible ? "block" : "hidden"
        } ${selectedUser ? "block" : "hidden"}`}
      ></div>
      <div
        className={`w-full lg:min-w-fit overflow-x-hidden  ${
          selectedUser ? "block" : "hidden lg:flex"
        }  rounded-xl shadow-lg backdrop-filter `}
      >
        <MessageContainer onBackUser={handleShowSidebar} />
      </div>
    </div>
  );
};

export default Home;
