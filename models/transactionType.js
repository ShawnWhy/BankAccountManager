const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const TransactionTypeSchema = new Schema({
  name: {
    type: String,
    unique: true
  },
  transactions: [
    {
      type: Schema.Types.ObjectId,
      ref: "Transaction"
    }
  ]
});

const TransactionType = mongoose.model("TransactionType", TransactionTypeSchema);

module.exports = TransactionType;