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

// CommentSchema.index({ freetId: 1, authorId: 1, content: 1 }, { unique: false })


const FollowModel = model<Follow>('Follow', FollowSchema);
export default FollowModel;
