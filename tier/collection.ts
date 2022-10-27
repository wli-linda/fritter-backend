import type {HydratedDocument, Types} from 'mongoose';
import type {Tier} from './model';
import TierModel from './model';

class TierCollection {

    /** 
     * Add a tier to the collection
     * 
     * @param {string} ownerId - The id of the owner of the tier system
     * @return {Promise<HydratedDocument<Tier>>} - The newly created Tier
     */
    static async addOne(ownerId: Types.ObjectId | string): Promise<HydratedDocument<Tier>> {
        const isEnabled = false;
        const timedFollowers = new Array<Types.ObjectId>();
        const overrideFollowers = new Array<Types.ObjectId>();
        const tier = new TierModel({
            ownerId, isEnabled, timedFollowers, overrideFollowers
        });
        await tier.save();
        return tier.populate('ownerId');
    }

    /** 
     * Add a follower of longer than 7 days to the timedFollowers field of the tier system associated with ownerId
     * 
     * @param {string} ownerId - The id of the owner of the tier system 
     * @param {string} followerId - The id of the follower to be added 
     * @return {Promise<HydratedDocument<Tier>>} - The updated Tier
     */
    static async addToTimedFollowers(ownerId: Types.ObjectId | string, followerId: Types.ObjectId | string):
    Promise<HydratedDocument<Tier>> {
        var tier =  await TierModel.findOne({ownerId: ownerId});
        if (!tier) {
            tier = await TierCollection.addOne(ownerId);
        } 
        await TierModel.updateOne(
            {ownerId: ownerId}, 
            {$addToSet: {timedFollowers: followerId}}
        );
        return tier.populate('ownerId');
    }

    /** 
     * Add a follower to the overrideFollowers field of the tier system associated with ownerId
     * 
     * @param {string} ownerId - The id of the owner of the tier system
     * @param {string} followerId - The id of the follower to be added 
     * @return {Promise<HydratedDocument<Tier>>} - The updated Tier
     */
     static async addToOverrideFollowers(ownerId: Types.ObjectId | string, followerId: Types.ObjectId | string):
     Promise<HydratedDocument<Tier>> {
        var tier =  await TierModel.findOne({ownerId: ownerId});
        if (!tier) {
            tier = await TierCollection.addOne(ownerId);
        } 
        await TierModel.updateOne(
            {ownerId: ownerId}, 
            {$addToSet: {overrideFollowers: followerId}}
        );
        return tier.populate('ownerId');
     }
    
    /**
     * Toggles the status of the tier system so that it's enabled/disabled
     * 
     * @param {string} ownerId - The id of the owner of the tier system
     * @returns {Promise<boolean>} The isEnabled status after toggling
     */
    static async toggleStatus(ownerId: Types.ObjectId | string): Promise<HydratedDocument<Tier>> {
        var tier = await TierModel.findOne({ownerId: ownerId});
        if (!tier) {
            tier = await TierCollection.addOne(ownerId);
        } 
        const currStatus = tier.isEnabled;
        tier.isEnabled = !currStatus;
        await tier.save()
        return tier.populate("ownerId");
    }

    /**
     * Find a tier by ownerId
     * 
     * @param {string} ownerId - The id of the owner of the tier system
     * @returns {Promise<HydratedDocument<Tier>> | Promise<null> } The tier system with the given ownerId, if any
     */
    static async findOneByOwner(ownerId: Types.ObjectId | string): Promise<HydratedDocument<Tier>> {
        return TierModel.findOne({ownerId: ownerId}).populate('ownerId');
    }


    // https://www.mongodb.com/docs/manual/reference/operator/query-logical/
    /**
     * Find a tier by ownerId
     * 
     * @param {string} ownerId - The id of the owner of the tier system
     * @param {string} followerId - The id of the follower to be checked 
     * @returns {Promise<HydratedDocument<Tier>> | Promise<null> } The tier system with the given ownerId, if any
     */
     static async findFollowerInSystem(ownerId: Types.ObjectId | string, followerId: Types.ObjectId | string): Promise<boolean> {
        const tier = await TierModel.findOne({
            $and: [
                {ownerId: ownerId},
                {$or: [
                    {timedFollowers: {$in: followerId}},
                    {overrideFollowers: {$in: followerId}}
                ]}
            ]
        });
        return !tier ? false : true;
    }

    /**
     * Delete a tier with given ownerId
     * 
     * @param {string} ownerId - The id of the owner of the tier system 
     * @returns {Promise<boolean>} - true if the tier has been deleted, false otherwise
     */
    static async deleteOne(ownerId: Types.ObjectId | string): Promise<boolean> {
        const tier = await TierModel.deleteOne({ownerId: ownerId});
        return tier !== null;
    }

    // https://www.mongodb.com/docs/manual/reference/operator/update/pull/
    // https://www.mongodb.com/docs/manual/reference/operator/query/in/ 
    /** 
     * Delete a follower from the timedFollowers field of the tier system associated with ownerId
     * 
     * @param {string} ownerId - The id of the owner of the tier system 
     * @param {string} followerId - The id of the follower to be added 
     * @return {Promise<HydratedDocument<Tier>>} - The updated Tier
     */
    static async deleteFromTimedFollowers(ownerId: Types.ObjectId | string, followerId: Types.ObjectId | string):
    Promise<HydratedDocument<Tier>> {
        await TierModel.updateOne(
            {ownerId: ownerId}, 
            {$pull: {timedFollowers: {$in: followerId}}}
        )
        const tier =  await TierModel.findOne({ownerId: ownerId}).populate("ownerId");
        return tier;
    }

    /** 
     * Delete a follower from the timedFollowers field of the tier system associated with ownerId
     * 
     * @param {string} ownerId - The id of the owner of the tier system 
     * @param {string} followerId - The id of the follower to be added 
     * @return {Promise<HydratedDocument<Tier>>} - The updated Tier
     */
     static async deleteFromOverrideFollowers(ownerId: Types.ObjectId | string, followerId: Types.ObjectId | string):
     Promise<HydratedDocument<Tier>> {
         await TierModel.updateOne(
             {ownerId: ownerId}, 
             {$pull: {overrideFollowers: {$in: followerId}}}
         )
         const tier =  await TierModel.findOne({ownerId: ownerId}).populate("ownerId");
         return tier;
     }
}

export default TierCollection;