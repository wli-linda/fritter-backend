import type {NextFunction, Request, Response} from 'express';
import express from 'express';
import FollowCollection from './collection';
import TierCollection from '../tier/collection';
import * as userValidator from '../user/middleware';
import * as followValidator from '../follow/middleware';
import * as util from './util';
import { constructFreetResponse } from '../freet/util';

const router = express.Router();

/**
 * Get freets of all followed users
 *
 * @name GET /api/follows/freets
 *
 * @return {FreetResponse[]} - The array of freets from followed users
 * @throws {403} - If the user is not logged in
 */
 router.get(
  '/freets',
  [
    userValidator.isUserLoggedIn
  ],
  async (req: Request, res: Response) => {
    const userId = req.session.userId as string;
    const freets = await FollowCollection.findAllFreetsByFollowed(userId);
    const freetsResponse = freets.map(constructFreetResponse);
    res.status(200).json(freetsResponse);
  }
);

/**
 * Get if user 1 follows user 2
 *
 * @name GET /api/follows/:followerId?/:followedId?
 *
 * @param {followerId} - The follower user
 * @param {followedId} - The followed user
 * @return {FollowResponse} - The follow if it exists
 * @throws {404} - If followerId or followedId is invalid
 * @throws {412} - If follow doesn't exist
 *
 */
router.get(
  '/:followerId?/:followedId?',
  async (req: Request, res: Response, next: NextFunction) => {
    // Check if parameters were supplied
    if (req.params.followerId !== undefined && req.params.followedId !== undefined) {
      next();
      return;
    }
  },
  [
    followValidator.isFollowerUserExists,
    followValidator.isFollowedUserExists,
    followValidator.isFollowExists
  ],
  async (req: Request, res: Response) => {
    const follow = await FollowCollection.findOne(req.params.followerId as string, req.params.followedId as string);
    const response = util.constructFollowResponse(follow);
    res.status(200).json({response});
  }
);

/**
 * Follow another user
 *
 * @name POST /api/follows/:followedId?
 *
 * @param {followedId} - The user to be followed
 * @return {FollowResponse} - The created follow
 * @throws {403} - If the user is not logged in
 * @throws {404} - If followedId is invalid
 */
router.post(
  '/:followedId?',
  async (req: Request, res: Response, next: NextFunction) => {
    if (req.params.followedId !== undefined) {
      next();
      return;
    }
  },
  [
    userValidator.isUserLoggedIn,
    followValidator.isFollowedUserExists
  ],
  async (req: Request, res: Response) => {
    const followerId = (req.session.userId as string) ?? ''; // Will not be an empty string since its validated in isUserLoggedIn
    const follow = await FollowCollection.addOne(followerId, req.params.followedId as string);

    res.status(201).json({
      message: 'Your follow was created successfully.',
      follow: util.constructFollowResponse(follow)
    });
  }
);

/**
 * Unfollow another user
 *
 * @name DELETE /api/follows/:followedId?
 *
 * @return {string} - A success message
 * @throws {403} - If the user is not logged in
 * @throws {404} - If the follow doesn't exist
 * @throws {412} - If follow doesn't exist
 */
router.delete(
  '/:followedId?',
  [
    userValidator.isUserLoggedIn,
    followValidator.isFollowExists,
    followValidator.isFollowedUserExists
  ],
  async (req: Request, res: Response) => {
    const followerId = req.session.userId as string;
    const followedId = req.params.followedId as string;
    TierCollection.deleteFromTimedFollowers(followedId, followerId);
    const follow = await FollowCollection.findOne(followerId, followedId) // won't be undefined bc isFollowExists
    await FollowCollection.deleteOne(follow._id.toString());
    res.status(200).json({
      message: 'Your follow was deleted successfully.'
    });
  }
);

export {router as followRouter};
