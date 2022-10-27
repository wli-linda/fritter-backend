import type {Types} from 'mongoose';
import {Schema, model} from 'mongoose';
import {User} from '../user/model';

export type Category = {
  _id: Types.ObjectId; // MongoDB assigns each object this ID on creation
  authorId: Types.ObjectId;
  name: string;
  items: Types.Array<Types.ObjectId>;
};

export type PopulatedCategory = {
  _id: Types.ObjectId; // MongoDB assigns each object this ID on creation
  authorId: User;
  name: string;
  items: Types.Array<Types.ObjectId>;
};

const CategorySchema = new Schema({
  authorId: {
    type: Schema.Types.ObjectId,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  items: {
    type: [Schema.Types.ObjectId],
    required: true
  }
}, {
  toObject: { virtuals: true, versionKey: false },
  toJSON: { virtuals: true, versionKey: false }
});

CategorySchema.index({ authorId: 1, name: 1 }, { unique: true });

const CategoryModel = model<Category>('Category', CategorySchema);
export default CategoryModel;
