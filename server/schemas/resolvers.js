const { AuthenticationError } = require("apollo-server-express");
const { User, Book } = require("../models");
const { signToken } = require("../utils/auth");

const resolvers = {
  // sets resolver to query users saved books
  Query: {
    me: async (parent, args, context) => {
      if (context.user) {
        return User.findOne({ _id: context.user._id }).populate("savedBooks");
      }
      throw new AuthenticationError("you must be logged in");
    },
  },
  // mutations mutate datat
  Mutation: {
    // creates a user
    createUser: async (parent, { username, email, password }) => {
      const user = await User.create({ username, email, password });
      const token = signToken(user);
      if (!user) {
        throw new AuthenticationError("sorry something went wrong");
      }
      return { token, user };
    },
    // creates a login
    login: async (parent, { email, password }) => {
      const user = await User.findOne({ email });

      if (!user) {
        throw new AuthenticationError("incorrect email");
      }
      const rightPass = await user.isCorrectPassword(password);

      if (!rightPass) {
        throw new AuthenticationError("something is wrong");
      }
      const token = signToken(user);
      return { token, user };
    },
    // creates saved book
    saveBook: async (parent, { input }, context) => {
      if (context.user) {
        const userInfo = await User.findByIdAndUpdate(
          context.user._id,
          { $addToSet: { savedBooks: input } },
          { new: true }
        ).populate("savedBooks");
        return userInfo;
      }
      throw new AuthenticationError("must be logged in");
    },
    // deletes a book
    deleteBook: async (parent, { bookId }, context) => {
      if (context.user) {
        const userInfo = await User.findByIdAndUpdate(
          context.user._id,
          { $pull: { savedBooks: { bookId } } },
          { new: true }
        );
        return userInfo;
      }
      throw new AuthenticationError("must be logged in");
    },
  },
};

module.exports = resolvers;
