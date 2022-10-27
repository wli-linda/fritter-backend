import type {Request, Response, NextFunction} from 'express';
import {Types} from 'mongoose';
import UserCollection from '../user/collection';
import CategoryCollection from './collection';


/**
 * Checks if a category with ownerId matching req.params.followedId exists
 */
 const isCategoryExists = async (req: Request, res: Response, next: NextFunction) => {
  const validFormat = Types.ObjectId.isValid(req.params.categoryId);
  const category = validFormat ? await CategoryCollection.findOne(req.params.categoryId) : '';
  if (!category) {
    res.status(412).json({
      error: {
        categoryNotFound: `Category with ID ${req.params.categoryId} does not exist.`
      }
    });
    return;
  }

  next();
};

/**
 * Checks if an author with given authorId in req.params exists
 */
 const isAuthorExists = async (req: Request, res: Response, next: NextFunction) => {
  const user = await UserCollection.findOneByUserId(req.params.authorId as string);
  if (!user) {
    res.status(404).json({
      error: `A user with ID ${req.params.authorId as string} does not exist.`
    });
    return;
  }

  next();
};

/**
 * Checks if the currently logged-in user matches the authorId of the given category
 */
const isValidCategoryModifier = async (req: Request, res: Response, next: NextFunction) => {
  const {authorId} = await CategoryCollection.findOne(req.params.categoryId);
  if (req.session.userId !== authorId._id.toString()) {
    res.status(403).json({
      error: 'Cannot modify other users\' categorys.'
    });
    return;
  }

  next();
};

/**
 * Checks if the name of the category in req.body is valid, i.e not a stream of empty
 * spaces and not more than 15 characters
 */
 const isValidCategoryName = (req: Request, res: Response, next: NextFunction) => {
  const {name} = req.body as {name: string};
  if (!name.trim()) {
    res.status(400).json({
      error: 'Category name must be at least one character long.'
    });
    return;
  }

  if (name.length > 15) {
    res.status(413).json({
      error: 'Category name must be no more than 15 characters.'
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
  isCategoryExists,
  isAuthorExists,
  isValidCategoryModifier,
  isValidCategoryName,
  isValidOperation
};
