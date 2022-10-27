import type {Request, Response} from 'express';
import express from 'express';
import TierCollection from './collection';
import * as userValidator from '../user/middleware';
import * as followValidator from '../follow/middleware';
import * as tierValidator from '../tier/middleware';
import * as util from './util';

const router = express.Router();

// PUT toggle user's system status
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

// GET check if user1 is in user2's sys
// TODO
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

// PUT add/remove from set
// /:followerId?/:followedId?operation=addOrDelete
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
