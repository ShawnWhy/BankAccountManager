const express = require("express");
const mongoose = require("mongoose");

const db = require("./models/index");

const PORT = process.env.PORT || 3000;

const app = express();



app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(express.static("public"));

mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost/BudgetTracker", {
  useNewUrlParser: true,
  useFindAndModify: false,
  useUnifiedTopology: true
});

db.Balance.findOneAndUpdate({},{name:"MyBalance",value:1000},{new:true,upsert:true})
.then(dbBalance=>{
  console.log(JSON.stringify(dbBalance))
})
.catch(err => {
  console.log(err);
});

  
db.Transaction.create({name:"payCheck",type:"deposite",value:600})
.then(({_id})=>
 db.TransactionType.findOneAndUpdate({name:"deposite"},{$push: { transactions: _id } },{new:true,upsert:true},
))

.then(dbtransaction=>{console.log(JSON.stringify(dbtransaction))})
.catch(err => {
  console.log(err);
});

db.Transaction.create({name:"buy shrubbery",type:"deposite",value:30})
.then(({_id})=>
 db.TransactionType.findOneAndUpdate({name:"withdraw"},{$push: { transactions: _id } },{new:true,upsert:true},
function(){db.Transaction.create({name:"rent ",type:"deposite",value:700})
.then(({_id})=> 
db.TransactionType.findOneAndUpdate({name:"withdraw"},{$push: { transactions: _id } },{new:true,upsert:true},
))}

))
.then(dbtransaction=>{console.log(JSON.stringify(dbtransaction))})
.catch(err => {
  console.log(err);
});
// db.TransactionType.findOneAndUpdate({name:"withdraw"},{new:true, upsert:true},
// ()=> db.Transaction.findOneAndUpdate({name:"bought some shrubbery",type:"withdraw",value:30},
// (({_id})=> db.TransactionType.findOneAndUpdate({name:"withdraw"},{$push:{transactions:_id}},{new:true},
// ()=>db.Transaction.findOneAndUpdate({name:"rent money",type:"withdraw",value:500},
// (({_id})=> db.TransactionType.findOneAndUpdate({name:"withdraw"},{$push:{transactions:_id}},{new:true})))))))
// .then(function(dbTransactionType){
//   console.log(dbTransactionType)
// })
// .catch(err => {
//   console.log(err);
// });






// routes
app.use(require("./routes/api"));

app.listen(PORT, () => {
  console.log(`App running on port ${PORT}!`);
});
