const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Receiver = require('./ReceiverSchema');


const CampaignUserSchema = new Schema({
    customId: {
        type: String,
        required: true
    },
    campaignId: {
        type: Schema.Types.ObjectId,
        required: true
    },
    count: {
        type: Number,
        default: 0
    },
    userData: {
        type: [Receiver]
    }
});

CampaignUserSchema.index({customId: 1});
CampaignUserSchema.index({campaignId: 1});

module.exports = CampaignUser = mongoose.model("campaignuser", CampaignUserSchema);
