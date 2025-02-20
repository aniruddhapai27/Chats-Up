const Conversation = require("../Models/conversationModel");
const User = require("../Models/userModel");

exports.getUserBySearch = async (req, res) => {
  try {
    const search = req.query.search || "";
    const currentUserId = req.user._id;
    const user = await User.find({
      $and: [
        {
          $or: [
            { username: { $regex: ".*" + search + ".*", $options: "i" } },
            { fullname: { $regex: ".*" + search + ".*", $options: "i" } },
          ],
        },
        {
          _id: { $ne: currentUserId },
        },
      ],
    })
      .select("-password")
      .select("email");

    res.status(200).json(user);
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

// exports.getCurrentChats = async (req, res) => {
//   try {
//     const currentUserId = req.user._id;
//     const currentChatters = await Conversation.find({
//       participants: currentUserId,
//     }).sort({ updatedAt: -1 });

//     if (!currentChatters || currentChatters.length == 0)
//       return res.status(200).json([]);

//     const participantIds = currentChatters.reduce((ids, conversations) => {
//       const otherParticipants = conversations.participants.filter(
//         (id) => id !== currentUserId
//       );
//       return [...ids, ...otherParticipants];
//     }, []);
//     const otherParticipantIds = participantIds.filter(
//       (id) => id.toString() !== currentUserId.toString()
//     );

//     const user = await User.find({ _id: { $in: otherParticipantIds } }).select(
//       "-password -email"
//     );
//     const users = otherParticipantIds.map((id) =>
//       user.find((user) => user._id.toString() === id.toString())
//     );
//     res.status(200).json(users);
//   } catch (error) {
//     return res.status(500).json({
//       success: false,
//       message: "Internal Server Error",
//     });
//   }
// };

exports.getCurrentChats = async (req, res) => {
  try {
    const currentUserId = req.user._id;

    // Fetch conversations where the current user is a participant
    const currentChatters = await Conversation.find({
      participants: currentUserId,
    }).sort({ updatedAt: -1 });

    // If no chats exist, return an empty array
    if (!currentChatters || currentChatters.length === 0) {
      return res.status(200).json([]);
    }

    // Extract participant IDs excluding the current user
    const participantIds = currentChatters.reduce((ids, conversation) => {
      const otherParticipants = conversation.participants.filter(
        (id) => id.toString() !== currentUserId.toString()
      );
      return [...ids, ...otherParticipants];
    }, []);

    const otherParticipentsIDS = participantIds.filter(
      (id) => id.toString() !== currentUserId.toString()
    );

    // Fetch user details for the extracted participant IDs
    const user = await User.find({ _id: { $in: participantIds } }).select(
      "-password -email"
    );
    const users = otherParticipentsIDS.map((id) =>
      user.find((user) => user._id.toString() === id.toString())
    );

    res.status(200).json(users);
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};
