import {HydratedDocument, Types} from 'mongoose';
import UserCollection from '../user/collection';
import type {Category} from './model';
import CategoryModel from './model';

class CategoryCollection {
  /**
   * Create new category
   *
   * @param {string} authorId - The id of the author of the category
   * @param {string} name - The name of the category
   * @return {Promise<HydratedDocument<Category>>} - The newly created Category
   */
  static async addOne(authorId: Types.ObjectId | string, name: string): 
  Promise<HydratedDocument<Category>> {
    const items = new Array<Types.ObjectId>();
    const category = new CategoryModel({
        authorId,
        name,
        items
    });
    await category.save(); 
    return category.populate('authorId');
  }

  /**
   * Find a category by categoryId
   *
   * @param {string} categoryId - The id of the category to find
   * @return {Promise<HydratedDocument<Category>> | Promise<null> } - The category with the given commentId, if any
   */
   static async findOne(categoryId: Types.ObjectId | string): Promise<HydratedDocument<Category>> {
    return CategoryModel.findOne({_id: categoryId}).populate('authorId');
  }
  
  /**
   * Find all categories by the same author
   * 
   * @param {string} authorId - The id of the author of the category
   * @returns {Promise<HydratedDocument<Tier>> | Promise<null> } The category with the given ownerId, if any
   */
      static async findAllByAuthor(authorId: Types.ObjectId | string): Promise<Array<HydratedDocument<Category>>> {
        const author = await UserCollection.findOneByUserId(authorId);
        return CategoryModel.find({authorId: author._id}).populate('authorId');
  }

  /** 
    * Add an item to items of category.
    * 
    * @param {string} categoryId - The id of the category
    * @param {string} itemId - The id of the item to be added 
    * @return {Promise<HydratedDocument<Category>>} - The updated category
    */
   static async addItemToCategory(categoryId: Types.ObjectId | string, itemId: Types.ObjectId | string):
   Promise<HydratedDocument<Category>> {
    await CategoryModel.updateOne(
        {_id: categoryId}, 
        {$addToSet: {items: itemId}}
    );
    const category =  await CategoryModel.findOne({_id: categoryId});
    return category.populate('authorId');
  }
   
  /** 
    * Remove an item to items of category.
    * 
    * @param {string} categoryId - The id of the category
    * @param {string} itemId - The id of the item to be added 
    * @return {Promise<HydratedDocument<Category>>} - The updated category
    */
   static async deleteItemFromCategory(categoryId: Types.ObjectId | string, itemId: Types.ObjectId | string):
   Promise<HydratedDocument<Category>> {
    await CategoryModel.updateOne(
        {_id: categoryId}, 
        {$pull: {items: {$in: itemId}}}
    );
    const category =  await CategoryModel.findOne({_id: categoryId});
    return category.populate('authorId');
  }

  /**
   * Delete a category.
   *
   * @param {string} categoryId - The categoryId of category to delete
   * @return {Promise<Boolean>} - true if the category has been deleted, false otherwise
   */
   static async deleteOne(categoryId: Types.ObjectId | string): Promise<boolean> {
    const category = await CategoryModel.deleteOne({_id: categoryId});
    return category !== null;
  }

  /**
   * Delete all the categories associated with a user.
   *
   * @param {string} userId - The id of the user.
   */
   static async deleteManybyUser(userId: Types.ObjectId | string): Promise<void> {
    await CategoryModel.deleteMany({authorId: userId});
  }
}

export default CategoryCollection;
