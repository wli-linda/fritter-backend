import type {Request, Response, NextFunction} from 'express';
import {Types} from 'mongoose';
import UserCollection from '../user/collection';
import FollowCollection from '../follow/collection';

/**
 * Checks if a user with id of followedId in req.params exists
 */
 const isFollowerUserExists = async (req: Request, res: Response, next: NextFunction) => {
  const id = req.params.followerId;
  const user = await UserCollection.findOneByUserId(id);
  if (!user) {
    res.status(404).json({
      error: {
        followerNotFound: `Follower user with user ID ${id} does not exist.`
      }
    });
    return;
  }
  next();
};

/**
 * Checks if a user with id of followedId in req.params exists
 */
 const isFollowedUserExists = async (req: Request, res: Response, next: NextFunction) => {
  const id = req.params.followedId;
  const user = await UserCollection.findOneByUserId(id);
  if (!user) {
    res.status(404).json({
      error: {
        followedNotFound: `Followed user with user ID ${id} does not exist.`
      }
    });
    return;
  }
  next();
};

/**
 * Checks if a follow with followerId and followedId in req.params exists
 */
const isFollowExists = async (req: Request, res: Response, next: NextFunction) => {
  const followerId = req.params.followerId || req.session.userId;
  const followedId = req.params.followedId;
  const validFormat1 = Types.ObjectId.isValid(followerId);
  const validFormat2 = Types.ObjectId.isValid(followedId)
  const follow = (validFormat1 && validFormat2) ? await FollowCollection.findOne(followerId, followedId) : '';
  if (!follow) {
    res.status(412).json({
      error: {
        followNotFound: `Follow with follow ID ${req.params.followId} does not exist.`
      }
    });
    return;
  }

  next();
};

export {
  isFollowerUserExists,
  isFollowedUserExists,
  isFollowExists,
};
