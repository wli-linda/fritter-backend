import type {HydratedDocument, Types} from 'mongoose';
import type {Follow} from './model';
import FollowModel from './model';
import { User } from '../user/model';
import { Freet } from '../freet/model';
import UserCollection from '../user/collection';
import FreetCollection from '../freet/collection';

class FollowCollection {
  /**
   * Follow another user
   *
   * @param {string} followerId - The id of the post of the follow
   * @param {string} followedId - The id of the author of the follow
   * @return {Promise<HydratedDocument<Follow>>} - The newly created Follow
   */
  static async addOne(followerId: Types.ObjectId | string, followedId: Types.ObjectId | string): 
  Promise<HydratedDocument<Follow>> {
    console.log("aaddOne");
    const date = new Date();
    const follow = new FollowModel({
      followerId,
      followedId,
      timeFollowed: date,
    });
    await follow.save(); // Saves freet to MongoDB
    return (await follow.populate('followerId')).populate('followedId');
  }

  /**
   * Find whether user 1 follows user 2
   *
   * @param {string} followerId - The id of the post of the follow
   * @param {string} followedId - The id of the author of the follow
   * @return {Promise<HydratedDocument<Follow>>} - The newly created Follow
   */
   static async findOne(followerId: Types.ObjectId | string, followedId: Types.ObjectId | string): 
   Promise<HydratedDocument<Follow>> {
    return FollowModel.findOne({followerId: followerId, followedId: followedId}).populate('followerId').populate('followedId');
   }

  /**
   * Get all the followed list of a user
   *
   * @param {string} userId - The userId of the user
   * @return {Promise<HydratedDocument<Follow>[]>} - An array of all of the followed of the user
   */
  static async findAllByUserId(userId: Types.ObjectId | string): Promise<Array<HydratedDocument<Follow>>> {
    const user = await UserCollection.findOneByUserId(userId);
    return FollowModel.find({followerId: user._id}).populate('followerId').populate('followedId');
  }

  /**
   * Get all the posts from the followed list of a user
   *
   * @param {string} userId - The userId of the user
   * @return {Promise<HydratedDocument<Freet>[]>} - An array of all of the followed's posts of the user
   */
  static async findAllPostsByFollowed(userId: Types.ObjectId | string): Promise<Array<HydratedDocument<Freet>>> {
    const follows = await this.findAllByUserId(userId);
    const getFreets = async function (follow: Follow) {
      const user = await UserCollection.findOneByUserId(follow.followedId);
      const freets = await FreetCollection.findAllByUsername(user.username);
      return Promise.all(freets.map((freet) => freet.populate('authorId')));
    }

    const res = new Array<HydratedDocument<Freet>>();
    for (let i = 0; i < follows.length; i++) {
      const freets = await getFreets(follows.at(i));
      res.concat(freets);
    }
    return res

    // holy moly........... why is it so hard to use accumulators here :(((
    // https://stackoverflow.com/questions/65322191/typescript-how-to-set-types-for-accumulated-value-and-initialvalue-on-reduce-fun
    // https://stackoverflow.com/questions/47968144/array-map-with-accumulator-in-javascript 
    // const empty = new Array<HydratedDocument<Freet>>();
    // return follows.map((acc : Array<HydratedDocument<Freet>> => follow => {
    //   const freets = getFreets(follow);
    //   return acc.concat(freets)
    // })(empty));

    // const concatFreets = async function (acc: Promise<Array<HydratedDocument<Freet>>>, follow: Follow) {
    //   const freets = await getFreets(follow);
    //   return (await acc).concat(freets)
    // }

    // const init = new Array<HydratedDocument<Freet>>();
    // const freets = follows.reduce((acc, follow) => concatFreets(acc, follow), init);
    // return freets

    // const freets = new Array<HydratedDocument<Freet>>();
    // follows.forEach( (follow: Follow) => {
    //   const user = UserCollection.findOneByUserId(follow.followedId);
    //   const freets = FreetCollection.findAllByUsername(user.username);
    // 
    // })
  }

  /**
   * Unfollow another user.
   *
   * @param {string} followId - The followId of follow to delete
   * @return {Promise<Boolean>} - true if the follow has been deleted, false otherwise
   */
  static async deleteOne(followId: Types.ObjectId | string): Promise<boolean> {
    const follow = await FollowModel.deleteOne({_id: followId});
    return follow !== null;
  }

  /**
   * Delete all the follows associated with a user.
   *
   * @param {string} userId - The id of the user.
   */
   static async deleteManybyUser(userId: Types.ObjectId | string): Promise<void> {
    await FollowModel.deleteMany({followerId: userId});
    await FollowModel.deleteMany({followedId: userId});
  }
}

export default FollowCollection;
