import {Types} from 'mongoose';
import {Schema, model} from 'mongoose';

export type Tier = {
  _id: Types.ObjectId; // MongoDB assigns each object this ID on creation
  isEnable: boolean;
  timeLimit: number;
  timedFollowers: Types.Array<Types.ObjectId>;
  overrideFollowers: Types.Array<Types.ObjectId>;
};

const TierSchema = new Schema({
  isEnabled: {
    type: Boolean,
    required: true
  },
  timeLimit: {
    type: Number,
    required: true
  },
  timedFollowers: {
    type: Types.Array,
    required: true
  },
  overrideFollowers: {
    type: Types.Array,
    required: true
  },
});

const TierModel = model<Tier>('Tier', TierSchema);
export default TierModel;
