import React, { useEffect, useState } from "react";
import { FaSearch } from "react-icons/fa";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { IoArrowBackSharp } from "react-icons/io5";
import { BiLogOut } from "react-icons/bi";
import { useAuth } from "../Context/AuthContext";
import { useConversation } from "../Context/ConversationContext";
import { useSocketContext } from "../Context/SocketContext";
import { BACKEND_URL } from "../../utils";
const Sidebar = ({ onSelectUser }) => {
  const navigate = useNavigate();
  const { authUser, setAuthUser } = useAuth();
  const [searchInput, setSearchInput] = useState("");
  const [searchUser, setSearchUser] = useState([]);
  const [chatUser, setChatUser] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [newMessageUsers, setNewMessageUsers] = useState(null);
  const { setSelectedConversation, messages } = useConversation();
  const { onlineUser, socket } = useSocketContext();

  const nowOnline = chatUser.map((user) => user._id);
  const isOnline = nowOnline.map((userId) => onlineUser?.includes(userId));

  useEffect(() => {
    socket?.on("newMessage", (newMessage) => {
      setNewMessageUsers(newMessage);

      // Move the new chats to come to the top
      setChatUser((prevChats) => {
        const sender = prevChats.find(
          (chat) => chat._id === newMessage.senderId
        );
        if (!sender) return prevChats;
        const filteredChats = prevChats.filter(
          (chat) => chat._id !== newMessage.senderId
        );
        return [sender, ...filteredChats];
      });
    });
    return () => socket?.off("newMessage");
  }, [socket, messages, chatUser]);

  useEffect(() => {
    const chatUserHandler = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`${BACKEND_URL}/api/user/current-chats`, {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          },
        });
        const { data } = res;
        setLoading(false);
        setChatUser(data);
      } catch (error) {
        setLoading(false);
        console.log(error);
      }
    };
    chatUserHandler();
  }, []);

  // Show user from the search result
  const handleSearchSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.get(
        `${BACKEND_URL}/api/user/search?search=${searchInput}`,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const { data } = res;
      setLoading(false);
      if (data.length === 0) {
        toast.info("User not found");
      } else {
        setSearchUser(data);
      }
    } catch (error) {
      setLoading(true);
    }
  };

  // Show which user is selected
  const handleUserClick = (user) => {
    onSelectUser(user);
    setSelectedConversation(user);
    setSelectedUserId(user._id);
    setNewMessageUsers("");
  };

  // Back from search result
  const handleSearchBack = () => {
    setSearchUser([]);
    setSearchInput("");
  };

  // Logout
  const handleLogOut = async () => {
    const confirmLogout = window.prompt("Enter username to LOGOUT: ");
    if (confirmLogout === authUser?.username) {
      setLoading(true);
      try {
        const res = await axios.post(`${BACKEND_URL}/api/auth/logout`, {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          },
        });
        const { data } = res;
        setLoading(false);

        toast.info(data.message);
        localStorage.removeItem("chatapp");
        setAuthUser(null);
        navigate("/login");
      } catch (error) {
        setLoading(false);
      }
    } else {
      toast.info("Logout Cancelled");
    }
  };

  return (
    <div className="h-full w-full px-1">
      <div className="flex justify-between w-full gap-4">
        <form
          onSubmit={handleSearchSubmit}
          className="w-full flex items-center justify-between bg-white rounded-full"
        >
          <input
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            type="text"
            className="px-4 w-4/5 bg-transparent outline-none rounded-full"
            placeholder="Search user"
          />
          <button className="p-4  hover:bg-gray-200 rounded-full text-black">
            <FaSearch />
          </button>
        </form>
        <img
          onClick={() => navigate(`/profile/${authUser?._id}`)}
          src={authUser?.profilepic}
          className="self-center h-12 w-12 rounded-[50%]  hover:scale-110 cursor-pointer border object-cover"
          alt="User"
        />
      </div>
      <div className="h-px bg-gray-300 my-2"></div>
      {searchUser?.length > 0 ? (
        <>
          <div className="min-h-[70%] max-h-[80%] overflow-y-auto">
            {searchUser.map((user) => (
              <div key={user._id}>
                <div
                  onClick={() => handleUserClick(user)}
                  className={`flex gap-3 items-center rounded p-2 py-1 cursor-pointer ${
                    selectedUserId === user?._id ? "bg-sky-500" : ""
                  }`}
                >
                  <div className="w-12 h-12 rounded-full overflow-hidden">
                    <img
                      src={user.profilepic}
                      alt="user"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <p className="font-bold text-gray-950">{user.username}</p>
                </div>
                <div className="h-px bg-gray-300"></div>
              </div>
            ))}
          </div>
          <div className="mt-auto px-1 py-1 flex">
            <button
              onClick={handleSearchBack}
              className="bg-white rounded-full p-2"
            >
              <IoArrowBackSharp size={25} />
            </button>
          </div>
        </>
      ) : (
        <>
          <div className="min-h-[70%] max-h-[80%] overflow-y-auto">
            {chatUser.length === 0 ? (
              <div className="font-bold text-center text-xl text-yellow-500">
                <h1>Why are you Alone!!🤔</h1>
                <h1>Search username to chat</h1>
              </div>
            ) : (
              chatUser.map((user, idx) => (
                <div key={user._id}>
                  <div
                    onClick={() => handleUserClick(user)}
                    className={`flex gap-3 items-center relative rounded p-2 py-1 cursor-pointer   ${
                      selectedUserId === user?._id ? "bg-sky-500" : ""
                    }`}
                  >
                    <div className="w-12 h-12 rounded-full overflow relative ">
                      <div
                        className={`absolute right-0  w-3 h-3 bg-green-500   rounded-full ${
                          isOnline[idx] ? "" : "hidden"
                        }`}
                      ></div>
                      <img
                        src={user.profilepic}
                        alt="user"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <p className="font-bold text-gray-950">{user.username}</p>

                    {newMessageUsers?.receiverId === authUser?._id &&
                    newMessageUsers?.senderId === user?._id ? (
                      <div className="rounded-full bg-green-700 text-sm text-white px-2 absolute right-2">
                        +1
                      </div>
                    ) : null}
                  </div>
                  <div className="h-px bg-gray-300"></div>
                </div>
              ))
            )}
          </div>
          <div className="mt-auto px-1 py-1 flex items-center gap-2">
            <button
              onClick={handleLogOut}
              className="hover:bg-red-600 bg-red-400 p-2 cursor-pointer hover:text-white rounded-lg"
            >
              <BiLogOut size={25} />
            </button>
            <p className="text-sm py-1 ">Logout</p>
          </div>
        </>
      )}
    </div>
  );
};

export default Sidebar;
