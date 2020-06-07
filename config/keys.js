let mongoURI;
if (process.env.NODE_ENV === 'production') {
  mongoURI = "mongodb+srv://new-user-1:NdLRDGOKpSch3PIW@practice-j7nnl.mongodb.net/EmailCampainger";
} else {
  mongoURI = "mongodb://localhost:27017/EmailCampainger"
}

module.exports = {
  mongoURI,
  secretOrKey: "thisismysecret"
};