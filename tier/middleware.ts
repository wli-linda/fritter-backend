import type {Request, Response, NextFunction} from 'express';
import {Types} from 'mongoose';
import TierCollection from '../tier/collection';


/**
 * Checks if a tier with ownerId matching req.params.followedId exists
 */
 const isTierExists = async (req: Request, res: Response, next: NextFunction) => {
  console.log("isTierExists")
  const validFormat = Types.ObjectId.isValid(req.params.followedId);
  const tier = validFormat ? await TierCollection.findOneByOwner(req.params.followedId) : '';
  if (!tier || !tier.isEnabled) {
    res.status(412).json({
      error: {
        tierNotFound: `Tier with owner ID ${req.params.followedId} does not exist.`
      }
    });
    return;
  }

  next();
};

/**
 * Checks if a tier with ownerId matching req.params.followedId is enabled
 */
const isTierEnabledForUser = async (req: Request, res: Response, next: NextFunction) => {
  const validFormat = Types.ObjectId.isValid(req.params.followedId);
  const tier = validFormat ? await TierCollection.findOneByOwner(req.params.followedId) : ''; // should always follow isTierExists
  if (!tier || !tier.isEnabled) {
    res.status(412).json({
      error: {
        tierNotFound: `Tier with owner ID ${req.params.followedId} is not enabled.`
      }
    });
    return;
  }

  next();
};

/**
 * Checks if the current user matches the followedId in req.params
 */
const isValidTierModifier = async (req: Request, res: Response, next: NextFunction) => {
  const userId = req.params.followedId;
  if (req.session.userId !== userId.toString()) {
    res.status(403).json({
      error: 'Cannot modify other users\' tiers.'
    });
    return;
  }

  next();
};

/**
 * Checks if the operation supplied in req.query.operation is valid
 */
 const isValidOperation = async (req: Request, res: Response, next: NextFunction) => {
  const operation = req.query.operation;
  if (!operation) {
    res.status(400).json({
      error: 'Provided tier operation must be nonempty ("add" or "delete").'
    });
    return;
  }
  
  if (operation !== "add" && operation !== "delete") {
    res.status(404).json({
      error: `Provided tier operation ${operation} isn't recognized ("add" or "delete").`
    });
    return;
  }

  next();
};

export {
  isTierExists,
  isTierEnabledForUser,
  isValidTierModifier,
  isValidOperation
};
