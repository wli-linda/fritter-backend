import type {Types} from 'mongoose';
import {Schema, model} from 'mongoose';

export type Filter = {
  _id: Types.ObjectId; // MongoDB assigns each object this ID on creation
  categoryName: string;
  categoryItems: Types.Array<Types.ObjectId>;
};

const FilterSchema = new Schema({
  categoryName: {
    type: String,
    required: true
  },
  categoryItems: {
    type: Schema.Types.Array,
    required: true
  }
});

const FilterModel = model<Filter>('Filter', FilterSchema);
export default FilterModel;
