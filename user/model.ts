import type {Types} from 'mongoose';
import {Schema, model} from 'mongoose';

/**
 * This file defines the properties stored in a User
 * DO NOT implement operations here ---> use collection file
 */

// Type definition for User on the backend
export type User = {
  _id: Types.ObjectId; // MongoDB assigns each object this ID on creation
  username: string;
  password: string;
  dateJoined: Date;
};

// Mongoose schema definition for interfacing with a MongoDB table
// Users stored in this table will have these fields, with the
// type given by the type property, inside MongoDB
const UserSchema = new Schema({
  // The user's username
  username: {
    type: String,
    required: true
  },
  // The user's password
  password: {
    type: String,
    required: true
  },
  // The date the user joined
  dateJoined: {
    type: Date,
    required: true
  }
}, {
  toObject: { virtuals: true, versionKey: false },
  toJSON: { virtuals: true, versionKey: false }
});

// UserSchema.virtual('comments', {
//   ref: 'Comment',
//   localField: '_id',
//   foreignField: 'authorId'
// });

// UserSchema.virtual('followers', {
//   ref: 'Follow',
//   localField: '_id',
//   foreignField: 'followedId'
// });

// UserSchema.virtual('followings', {
//   ref: 'Follow',
//   localField: '_id',
//   foreignField: 'followerId'
// });

// UserSchema.virtual('tiers', {
//   ref: 'Tier',
//   localField: '_id',
//   foreignField: 'ownerId'
// });


const UserModel = model<User>('User', UserSchema);
export default UserModel;
