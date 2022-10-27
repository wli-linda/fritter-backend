import type {Request, Response} from 'express';
import express from 'express';
import TierCollection from './collection';
import * as userValidator from '../user/middleware';
import * as followValidator from '../follow/middleware';
import * as tierValidator from '../tier/middleware';
import * as util from './util';

const router = express.Router();

/**
 * Enable/disable a user's Tiered Followers System
 *
 * @name PUT /api/tiers/status
 *
 * @return {TierResponse} - The updated tier
 * @throws {403} - If the user is not logged in
 */
router.put(
  '/status',
  [
    userValidator.isUserLoggedIn,
  ],
  async (req: Request, res: Response) => {
    const ownerId = req.session.userId as string;
    const tier = await TierCollection.toggleStatus(ownerId);
    const response = util.constructTierResponse(tier);
    res.status(200).json(response);
  }
);

/**
 * Check if follower is in the tiered followers list of followed user
 *
 * @name GET /api/tiers/:followerId?/:followedId?
 *
 * @return {boolean} - true if in the list, false otherwise
 * 
 * @throws {404} - If followerId or followedId is invalid
 * @throws {412} - If the tier doesn't exist or is not enabled for the followed user
 */
router.get(
  '/:followerId?/:followedId?',
  [
    followValidator.isFollowerUserExists,
    followValidator.isFollowedUserExists,
    tierValidator.isTierExists,
    tierValidator.isTierEnabledForUser,
  ],
  async (req: Request, res: Response) => {
    const followerId = req.params.followerId;
    const ownerId = req.params.followedId as string;
    const tierStatus = await TierCollection.findFollowerInSystem(ownerId, followerId);
    res.status(200).json({
      message: `User ${followerId} is ${tierStatus ? '' : 'not '}a tiered follower of user ${ownerId}.`,
      tierStatus: tierStatus,
    });
  }
);

/**
 * Add/remove followers from a user's overrideFollowers list
 *
 * @name PUT /api/tiers/:followerId?/:followedId?operation=addOrDelete
 *
 * @return {TierResponse} - The updated tier
 * 
 * @throws {404} - If followerId or followedId is invalid
 * @throws {412} - If the tier doesn't exist or is not enabled for the followed user
 * @throws {403} - If the user is not logged in or not the owner of the tier
 * @throws {400} - If the operation is empty
 * @throws {404} - If the operation is not valid
 */
router.put(
  '/:followerId?/:followedId?',
  [
    followValidator.isFollowerUserExists,
    followValidator.isFollowedUserExists,
    tierValidator.isTierExists,
    tierValidator.isTierEnabledForUser,
    userValidator.isUserLoggedIn,
    tierValidator.isValidTierModifier,
    tierValidator.isValidOperation,
  ],
 async (req: Request, res: Response) => {
  const operation = req.query.operation;
  const followerId = req.params.followerId;
  const ownerId = req.params.followedId;
  var tier;
  if (operation == "add") {
    tier = await TierCollection.addToOverrideFollowers(ownerId, followerId);
  } else {
    tier = await TierCollection.deleteFromOverrideFollowers(ownerId, followerId);
  }
  res.status(200).json({
    message: 'Your tier system was updated successfully.',
    tier: util.constructTierResponse(tier)
  });
 }
);

export {router as tierRouter};
