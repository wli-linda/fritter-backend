import type {NextFunction, Request, Response} from 'express';
import express from 'express';
import CommentCollection from './collection';
import * as userValidator from '../user/middleware';
import * as freetValidator from '../freet/middleware';
import * as commentValidator from '../comment/middleware';
import * as util from './util';

const router = express.Router();

/**
 * Get comments by post.
 *
 * @name GET /api/comments/:freetId?
 *
 * @return {CommentResponse[]} - An array of comments in the post
 * @throws {404} - If freetId is invalid
 *
 */
router.get(
  '/:freetId?',
  async (req: Request, res: Response, next: NextFunction) => {
    // Check if freetId parameter was supplied
    if (req.params.freetId !== undefined) {
      next();
      return;
    }
  },
  [
    freetValidator.isFreetExists,
  ],
  async (req: Request, res: Response) => {
    const postComments = await CommentCollection.findAllByFreetId(req.params.freetId as string);
    const response = postComments.map(util.constructCommentResponse);
    res.status(200).json(response);
  }
);

/**
 * Create a new comment for a post.
 *
 * @name POST /api/comments/:freetId?
 *
 * @param {string} content - The content of the comment
 * @return {CommentResponse} - The created comment
 * @throws {403} - If the user is not logged in
 * @throws {404} - If freetId is invalid
 * @throws {400} - If the comment content is empty or a stream of empty spaces
 * @throws {413} - If the comment content is more than 140 characters long
 */
router.post(
  '/:freetId?',
  async (req: Request, res: Response, next: NextFunction) => {
    // Check if freetId query parameter was supplied
    if (req.params.freetId !== undefined) {
      next();
      return;
    }
  },
  [
    userValidator.isUserLoggedIn,
    freetValidator.isFreetExists,
    commentValidator.isValidCommentContent
  ],
  async (req: Request, res: Response) => {
    const userId = (req.session.userId as string) ?? ''; // Will not be an empty string since its validated in isUserLoggedIn
    const comment = await CommentCollection.addOne(req.params.freetId as string, userId, req.body.content);

    res.status(201).json({
      message: 'Your comment was created successfully.',
      comment: util.constructCommentResponse(comment)
    });
  }
);

/**
 * Delete a comment
 *
 * @name DELETE /api/comments/:commentId?
 *
 * @return {string} - A success message
 * @throws {403} - If the user is not logged in or is not the author of
 *                 the comment
 * @throws {404} - If the commentId is not valid
 */
router.delete(
  '/:commentId?',
  [
    userValidator.isUserLoggedIn,
    commentValidator.isCommentExists,
    commentValidator.isValidCommentModifier
  ],
  async (req: Request, res: Response) => {
    await CommentCollection.deleteOne(req.params.commentId);
    res.status(200).json({
      message: 'Your comment was deleted successfully.'
    });
  }
);

export {router as commentRouter};
