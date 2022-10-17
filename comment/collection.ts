import type {HydratedDocument, Types} from 'mongoose';
import type {Comment} from './model';
import CommentModel from './model';
import FreetCollection from '../freet/collection';

class CommentCollection {
  /**
   * Add a comment to the collection
   *
   * @param {string} postId - The id of the post of the comment
   * @param {string} authorId - The id of the author of the comment
   * @param {string} content - The content of the comment
   * @return {Promise<HydratedDocument<Comment>>} - The newly created Comment
   */
  static async addOne(postId: Types.ObjectId | string, authorId: Types.ObjectId | string, content: string): 
  Promise<HydratedDocument<Comment>> {
    const date = new Date();
    const comment = new CommentModel({
      postId,
      authorId,
      datePosted: date,
      content,
    });
    await comment.save(); // Saves freet to MongoDB
    return comment.populate('postId', 'authorId');
  }

  /**
   * Find a comment by commentId
   *
   * @param {string} commentId - The id of the comment to find
   * @return {Promise<HydratedDocument<Comment>> | Promise<null> } - The comment with the given commentId, if any
   */
  static async findOne(commentId: Types.ObjectId | string): Promise<HydratedDocument<Comment>> {
    return CommentModel.findOne({_id: commentId}).populate('postId', 'authorId');
  }

  /**
   * Get all the comments by given post
   *
   * @param {string} username - The username of author of the comments
   * @return {Promise<HydratedDocument<Comment>[]>} - An array of all of the comments
   */
  static async findAllByPostId(postId: Types.ObjectId | string): Promise<Array<HydratedDocument<Comment>>> {
    const post = await FreetCollection.findOne(postId);
    return CommentModel.find({postId: post._id}).populate('postId', 'authorId');
  }

  /**
   * Delete a comment with given commentId.
   *
   * @param {string} commentId - The commentId of comment to delete
   * @return {Promise<Boolean>} - true if the comment has been deleted, false otherwise
   */
  static async deleteOne(commentId: Types.ObjectId | string): Promise<boolean> {
    const comment = await CommentModel.deleteOne({_id: commentId});
    return comment !== null;
  }

  /**
   * Delete all the comments in the given post
   *
   * @param {string} postId - The id of post of comments
   */
   static async deleteManybyPost(postId: Types.ObjectId | string): Promise<void> {
    await CommentModel.deleteMany({postId});
  }

  /**
   * Delete all the comments by the given author
   *
   * @param {string} authorId - The id of author of comments
   */
  static async deleteManybyAuthor(authorId: Types.ObjectId | string): Promise<void> {
    await CommentModel.deleteMany({authorId});
  }
}

export default CommentCollection;
