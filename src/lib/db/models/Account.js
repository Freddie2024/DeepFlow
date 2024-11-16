import mongoose from "mongoose";

const AccountSchema = new mongoose.Schema({
  provider: String,
  type: String,
  providerAccountId: String,
  access_token: String,
  token_type: String,
  id_token: String,
  userId: mongoose.Types.ObjectId,
});

const Account =
  mongoose.models.Account || mongoose.model("Account", AccountSchema);

export default Account;
