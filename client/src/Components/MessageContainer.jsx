import React, { useEffect, useState, useRef } from "react";
import { TiMessages } from "react-icons/ti";
import { useAuth } from "../Context/AuthContext";
import { IoArrowBackSharp, IoSend } from "react-icons/io5";
import { useConversation } from "../Context/ConversationContext";
import axios from "axios";
import { useSocketContext } from "../Context/SocketContext";

const MessageContainer = ({ onBackUser }) => {
  const { authUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const [sendData, setSendData] = useState("");
  const {
    selectedConversation,
    setSelectedConversation,
    messages,
    setMessages,
  } = useConversation();
  const lastMessage = useRef();
  const { socket } = useSocketContext();

  useEffect(() => {
    socket?.on("newMessage", (newMessage) => {
      // const sound = new Audio(notify);
      // sound.play();

      setMessages((prevMessages) => [...prevMessages, newMessage]);
    });
    return () => socket?.off("newMessage");
  }, [socket, setMessages, messages]);

  useEffect(() => {
    setTimeout(() => {
      lastMessage.current?.scrollIntoView({ behaviour: "smooth" });
    }, 200);
  });

  useEffect(() => {
    const getMessages = async () => {
      setLoading(true);
      try {
        const res = await axios.get(
          `/api/message/${selectedConversation?._id}`
        );
        const { data } = res;
        setLoading(false);
        setMessages(data);
      } catch (error) {
        setLoading(false);
        console.log(error);
      }
    };
    if (selectedConversation?._id) getMessages();
  }, [selectedConversation?._id, setMessages]);

  const handelMessages = (e) => {
    setSendData(e.target.value);
  };

  const handelSubmit = async (e) => {
    e.preventDefault();
    setSending(true);
    try {
      const res = await axios.post(
        `/api/message/send/${selectedConversation?._id}`,
        { message: sendData }
      );
      const { data } = res;
      console.log(data);
      setSending(false);
      setMessages([...messages, data]);
    } catch (error) {
      setSending(false);
      console.log(error);
    }
    setSendData("");
  };

  return (
    <div className="lg:min-w-[400px] h-[99%] flex flex-col py-2">
      {selectedConversation === null ? (
        <div className="flex items-center justify-center w-full h-full">
          <div className="px-4 text-center text-2xl text-gray-900 font-semibold flex flex-col items-center gap-2">
            <p className="text-2xl">Welcome!!👋 {authUser.username}😉</p>
            <p className="text-lg">Select a chat to start messaging</p>
            <TiMessages className="text-6xl text-center" />
          </div>
        </div>
      ) : (
        <>
          <div className="flex justify-between gap-1 bg-sky-600 md:px-2 rounded-lg h-10 md:h-12">
            <div className="flex gap-2 md:justify-between items-center w-full">
              <div className="lg:hidden ml-1 self-center">
                <button
                  onClick={() => onBackUser(true)}
                  className="bg-white rounded-full px-2 py-1"
                >
                  <IoArrowBackSharp size={25} />
                </button>
              </div>
              <div className="flex justify-between mr-2 gap-2">
                <div className="self-center">
                  <img
                    className="rounded-full w-6 h-6 md:w-10 md:h-10 cursor-pointer"
                    src={selectedConversation?.profilepic}
                  />
                </div>
                <span className="text-gray-950 self-center text-sm md:text-xl font-bold">
                  {selectedConversation?.username}
                </span>
              </div>
            </div>
          </div>

          <div className="flex-1 overflow-auto custom-scrollbar">
            {loading && (
              <div className="flex w-full h-full flex-col items-center justify-center gap-4 bg-transparent">
                <div className="animate-spin h-6 w-6 border-4 border-blue-500 border-t-transparent rounded-full"></div>
              </div>
            )}
            {!loading && messages?.length === 0 && (
              <p className="text-center text-white items-center">
                Send a message to start Conversation
              </p>
            )}
            {!loading &&
              messages?.length > 0 &&
              messages?.map((message) => (
                <div
                  className="text-white  break-words "
                  key={message?._id}
                  ref={lastMessage}
                >
                  <div
                    className={`flex  ${
                      message.senderId === authUser._id
                        ? "justify-end"
                        : "justify-start"
                    } my-2`}
                  >
                    <div
                      className={`px-4 py-2 w-4/5 h-fit text-wrap rounded-lg max-w-xs ${
                        message.senderId === authUser._id
                          ? "bg-sky-600 text-white"
                          : "bg-gray-300 text-black"
                      }`}
                    >
                      {message?.message}
                    </div>
                  </div>
                  <div
                    className={`text-xs flex text-gray-400 ${
                      message.senderId === authUser._id
                        ? "justify-end"
                        : "justify-start"
                    }`}
                  >
                    {new Date(message?.createdAt).toLocaleDateString("en-IN")}{" "}
                    {new Date(message?.createdAt).toLocaleTimeString("en-IN", {
                      hour: "numeric",
                      minute: "numeric",
                    })}
                  </div>
                </div>
              ))}
          </div>
          <form
            onSubmit={handelSubmit}
            className="rounded-full text-black p-2 bg-gray-100 flex items-center"
          >
            <input
              value={sendData}
              onChange={handelMessages}
              required
              id="message"
              type="text"
              className="w-full bg-transparent outline-none px-4 h-10 rounded-full"
              placeholder="Type a message..."
            />
            <button type="submit">
              {sending ? (
                <div className="animate-spin h-6 w-6 border-4 border-blue-500 border-t-transparent rounded-full"></div>
              ) : (
                <IoSend
                  size={25}
                  className="text-sky-700 cursor-pointer rounded-full bg-gray-800 w-10 h-auto p-2"
                />
              )}
            </button>
          </form>
        </>
      )}
    </div>
  );
};

export default MessageContainer;
