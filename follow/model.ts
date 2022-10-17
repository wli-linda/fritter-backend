import type {Types} from 'mongoose';
import {Schema, model} from 'mongoose';

export type Follow = {
  _id: Types.ObjectId; // MongoDB assigns each object this ID on creation
  followerId: Types.ObjectId
  followedId: Types.ObjectId;
  timeFollowed: Date;
};

const FollowSchema = new Schema({
  followerId: {
    type: Schema.Types.ObjectId,
    required: true
  },
  followedId: {
    type: Schema.Types.ObjectId,
    required: true
  },
  timeFollowed: {
    type: Date,
    required: true
  }
}, {
  toObject: { virtuals: true, versionKey: false },
  toJSON: { virtuals: true, versionKey: false }
});

const FollowModel = model<Follow>('Follow', FollowSchema);
export default FollowModel;
