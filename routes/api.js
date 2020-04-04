const router = require("express").Router();
const Transaction = require("../models/transaction");
const TransactionType=require("../models/transactionType");
const Balance = require ("../models/balance");

router.get("/api/balance",function(req,res){
  Balance.findOne({name:"MyBalance"})
  .then(dbBalance => {
    res.json(dbBalance)
    })
    .catch(err => {
      res.status(400).json(err);
    
});
});

 router.post("/api/balance/:id", function(req,res){
   var updateBalance = req.params.id;
   updateBalance=parseFloat(updateBalance);
   console.log(updateBalance);
Balance.findOneAndUpdate({name:"MyBalance"},{value:updateBalance})
.then((dbBalance) => {
  res.json(dbBalance)
  })
.catch(err => {
  res.status(400).json(err);
});
});

router.get("/api/withdraw", function(req,res){
TransactionType.findOne({name:"withdraw"})
.populate("transactions")
.then((dbWithdraws)=>res.json(dbWithdraws))
.catch(err => {
  res.status(400).json(err);
});
})
router.get("/api/deposite", function(req,res){
  TransactionType.findOne({name:"deposite"})
  .populate("transactions")
  .then((dbDeposites)=>res.json(dbDeposites))
  .catch(err => {
    res.status(400).json(err);
  });
  })
router.post("/api/deposite", function(req, res) {
  var body = req.body;
  
  Transaction.create({name:body.name,type:body.type,value:parseFloat(body.value)})
    
 .then(({_id}) => TransactionType.findOneAndUpdate({name:"deposite"},{$push: {transactions:_id}},{new:true}))
    .then((dbTransaction) => {
      res.json(dbTransaction);
    })
    .catch(err => {
      res.status(400).json(err);
    });
});

router.post("/api/withdraw", function(req,res) {
  var body = req.body;
  var newValue = parseFloat(body.value)
 
  Transaction.create({name:body.name,type:body.type,value:newValue})
    
 .then(({_id}) => TransactionType.findOneAndUpdate({name:"withdraw"},{$push: {transactions:_id}},{new:true}))
    .then((dbTransaction)=> {
      res.json(dbTransaction);
    })
    .catch(err => {
      res.status(400).json(err);
    });
});
router.post("/api/deleteWithdraw/:id",function(req,res){
  var deleteID = req.params.id; 
  console.log(deleteID);
  Transaction.deleteOne({_id:deleteID},
    function(deleteID){console.log(deleteID);
    TransactionType.findOneAndUpdate({name:"withdraw"},{$pull:{transactions:deleteID}})})
    .then((dbTransaction) => {
      res.json(dbTransaction);
    })
    .catch(err => {
      res.status(400).json(err);
    });
})
router.post("/api/deleteDeposite/:id",function(req,res){
  var deleteID = req.params.id;
  console.log(deleteID);
  Transaction.deleteOne({_id:deleteID},
    function(deleteID){console.log(deleteID);
    TransactionType.findOneAndUpdate({name:"deposite"},{$pull:{transactions:deleteID}})})
    .then((dbTransaction) => {
      res.json(dbTransaction);
    })
    .catch(err => {
      res.status(400).json(err);
    });
})


// router.post("/api/deposite/bulk", ({ body }, res) => {
//   Transaction.insertMany(body)
//   .then(({_id})=>{TransactionType.findOneAndUpdate({name:"deposite"},{$push:{transactions:_id}},{new:true})})
//     .then((dbTransaction) => {
//       res.json(dbTransaction);
//     })
//     .catch(err => {
//       res.status(400).json(err);
//     });
// });

// router.post("/api/withdraw/bulk", ({ body }, res) => {
//   Transaction.insertMany(body)
//   .then(({_id})=>{TransactionType.findOneAndUpdate({name:"withdraw"},{$push:{transactions:_id}},{new:true})})
//     .then((dbTransaction) => {
//       res.json(dbTransaction);
//     })
//     .catch(err => {
//       res.status(400).json(err);
//     });
// });

// router.post("/api/balance/bulk", ({ body }, res) => {
//   balance.findOneAndUpdate({name:"myBalance"},{value:body.value})
//     .then((dbTransaction) => {
//       res.json(dbTransaction);
//     })
//     .catch(err => {
//       res.status(400).json(err);
//     });
// });



// router.get("/api/transaction", (req, res) => {
//   Transaction.find({})
//     .sort({ date: -1 })
//     .then((dbTransaction) => {
//       res.json(dbTransaction);
//     })
//     .catch(err => {
//       res.status(400).json(err);
//     });
// });

module.exports = router;
