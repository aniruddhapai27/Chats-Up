const Conversation = require("../Models/conversationModel");
const Message = require("../Models/messageModel");
const { io } = require("../Socket/socket.js");
const { getReceiverSocketId } = require("../Socket/socket.js");

exports.sendMessage = async (req, res) => {
  try {
    const { message } = req.body;
    const { id: receiverId } = req.params;
    const senderId = req.user._id;

    let chats = await Conversation.findOne({
      participants: { $all: [senderId, receiverId] },
    });

    if (!chats) {
      chats = await Conversation.create({
        participants: [senderId, receiverId],
      });
    }

    const newMessages = new Message({
      senderId,
      receiverId,
      message: message,
      conversationId: chats._id,
    });

    if (newMessages) {
      chats.messages.push(newMessages._id);
    }

    await Promise.all([chats.save(), newMessages.save()]);

    //SOCKET.IO function
    const receiverSocketId = getReceiverSocketId(receiverId);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("newMessage", newMessages);
    }

    res.status(201).send(newMessages);
  } catch (error) {
    res.status(500).send({
      success: false,
      message: error,
    });
    console.log(`error in sendMessage ${error}`);
  }
};

exports.getMessages = async (req, res) => {
  try {
    const { id: receiverId } = req.params;
    const senderId = req.user._id;
    const chats = await Conversation.findOne({
      participants: { $all: [senderId, receiverId] },
    }).populate("messages");
    if (!chats) {
      return res.status(200).json([]);
    }
    const message = chats.messages;
    return res.status(200).send(message);
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
};
