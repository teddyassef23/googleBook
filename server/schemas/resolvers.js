
const { User } = require('../models');
const { AuthenticationError } = require('apollo-server-express');
const { signToken } = require('../utils/auth'); 

const resolvers = {
  Query: {
    me: async (parent, args, context) => {
      if (context.user) {
        return await User.findOne({ _id: context.user._id });
      }
      throw new AuthenticationError('You need to be logged in!');
    },
  },
  Mutation: {
    login: async (parent, { email, password }) => {
      const user = await User.findOne({ email });

      if (!user) {
        throw new AuthenticationError('Invalid email or password!');
      }

      const correctPassword = await user.isCorrectPassword(password);

      if (!correctPassword) {
        throw new AuthenticationError('Invalid email or password!');
      }

      const token = signToken({ username: user.username, email: user.email, _id: user._id });
      return { token, user };
    },
    addUser: async (parent, { username, email, password }) => {
        try {
          const user = await User.create({ username, email, password });
          const token = signToken({ username, email, _id: user._id });
          return { token, user };
        } catch (error) {
          console.error('Error creating user:', error);
          throw new Error('Failed to create user.');
        }
      },
      
      saveBook: async (parent, { bookData }, context) => {
        const { user } = context;
  
        if (!user) {
          throw new AuthenticationError('You need to be logged in to save a book.');
        }
  
        try {
          const updatedUser = await User.findByIdAndUpdate(
            user._id,
            { $addToSet: { savedBooks: bookData } }, 
            { new: true }
          );
  
          return updatedUser;
        } catch (err) {
          console.error(err);
          throw new Error('Failed to save the book.');
        }
      }, removeBook: async (parent, { bookId }, context) => {
        const { user } = context;
  
        if (!user) {
          throw new AuthenticationError('You need to be logged in to remove a book.');
        }
  
        try {
          const updatedUser = await User.findByIdAndUpdate(
            user._id,
            { $pull: { savedBooks: { bookId } } },
            { new: true }
          );
  
          return updatedUser;
        } catch (err) {
          console.error(err);
          throw new Error('Failed to remove the book.');
        }
      }
    
  
  },
};

module.exports = resolvers;
