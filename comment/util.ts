import type {HydratedDocument} from 'mongoose';
import moment from 'moment';
import type {Comment} from '../comment/model';

// Update this if you add a property to the Comment type!
type CommentResponse = {
  _id: string;
  postId: string;
  authorId: string;
  datePosted: string;
  content: string;
};

/**
 * Encode a date as an unambiguous string
 *
 * @param {Date} date - A date object
 * @returns {string} - formatted date as string
 */
const formatDate = (date: Date): string => moment(date).format('MMMM Do YYYY, h:mm:ss a');

/**
 * Transform a raw Comment object from the database into an object
 * with all the information needed by the frontend
 *
 * @param {HydratedDocument<Comment>} comment - A comment
 * @returns {CommentResponse} - The comment object formatted for the frontend
 */
const constructCommentResponse = (comment: HydratedDocument<Comment>): CommentResponse => {
  const commentCopy: Comment = {
    ...comment.toObject({
      versionKey: false // Cosmetics; prevents returning of __v property
    })
  };
  return {
    ...commentCopy,
    _id: commentCopy._id.toString(),
    postId: commentCopy.postId.toString(),
    authorId: commentCopy.authorId.toString(),
    datePosted: formatDate(comment.datePosted),
  };
};

export {
  constructCommentResponse
};
