import type {Types} from 'mongoose';
import {Schema, model} from 'mongoose';
import { User } from '../user/model';

export type Follow = {
  _id: Types.ObjectId; // MongoDB assigns each object this ID on creation
  followerId: Types.ObjectId;
  followedId: Types.ObjectId;
  timeFollowed: Date;
};

export type PopulatedFollow = {
  _id: Types.ObjectId; // MongoDB assigns each object this ID on creation
  followerId: User;
  followedId: User;
  timeFollowed: Date;
};

const FollowSchema = new Schema({
  followerId: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  },
  followedId: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  },
  timeFollowed: {
    type: Date,
    required: true
  }
}, {
  toObject: { virtuals: true, versionKey: false },
  toJSON: { virtuals: true, versionKey: false }
});

FollowSchema.index({ followerId: 1, followedId: 1 }, { unique: true })


const FollowModel = model<Follow>('Follow', FollowSchema);
export default FollowModel;
