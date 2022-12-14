const User = require("../models/user");
const TokenGenerator = require("../models/token_generator");


/**
 * Actions for Users
 * Create: ***
 */
const UsersController = {
  Create: (req, res) => {
    // create new instance of User from request info
    const user = new User(req.body);
    // save this to the database
    user.save((err) => {
      if (err) {
        // error sets resonse status and returns json object
        res.status(400).json({message: 'Bad request'})
      } else {
        // response is successfully created (note 201)
        // only returns a json object
        res.status(201).json({ message: 'OK' });
      }
    });
  },

  Get: async (req, res) => {
    const { id } = req.params;
    const user = await User.findById(id);
    const token = await TokenGenerator.jsonwebtoken(req.user_id);
    res.status(200).json({ message: "OK", token: token, full_name: user.full_name, bio: user.bio, birthday: user.birthday, hometown: user.hometown, occupation: user.occupation, relationship_status: user.relationship_status, joined: user.createdAt, profile_pic: user.profile_pic, friends: user.friends
  })
  },

  Update: async (req, res) => {
    const data = req.body;
    // the user id
    const { id } = req.params;
    let user;

    if (data.type === "friends") {
      if (data.isFriend) {
        user = await User.findByIdAndUpdate(
          { _id: id },
          { $pull: { friends: data.user_id } },
          { new: true }
        );
      } else {
        user = await User.findByIdAndUpdate(
          { _id: id },
          { $addToSet: { friends: data.user_id } },
          { new: true }
        );
      }
    }
    // TODO: error: if same then post will return the same info
    const token = await TokenGenerator.jsonwebtoken(req.user_id);
    res.status(202).json({ message: "OK", token: token, user: user });
  }
};

module.exports = UsersController;
