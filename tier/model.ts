import {Types} from 'mongoose';
import {Schema, model} from 'mongoose';
import {User} from '../user/model';

export type Tier = {
  _id: Types.ObjectId; // MongoDB assigns each object this ID on creation
  ownerId: Types.ObjectId;
  isEnabled: boolean;
  // timeLimit: number;
  timedFollowers: Types.Array<Types.ObjectId>;
  overrideFollowers: Types.Array<Types.ObjectId>;
};

export type PopulatedTier = {
  _id: Types.ObjectId; // MongoDB assigns each object this ID on creation
  ownerId: User;
  isEnabled: boolean;
  timedFollowers: Types.Array<Types.ObjectId>;
  overrideFollowers: Types.Array<Types.ObjectId>;
};

const TierSchema = new Schema({
  ownerId: {
    type: Schema.Types.ObjectId,
    required: true
  },
  isEnabled: {
    type: Boolean,
    required: true
  },
  // timeLimit: {
  //   type: Number,
  //   required: true
  // },
  timedFollowers: {
    type: [Types.ObjectId],
    required: true
  },
  overrideFollowers: {
    type: [Types.ObjectId],
    required: true
  },
}, {
  toObject: { virtuals: true, versionKey: false },
  toJSON: { virtuals: true, versionKey: false }
});

TierSchema.index({ ownerId: 1 }, { unique: true })

const TierModel = model<Tier>('Tier', TierSchema);
export default TierModel;
