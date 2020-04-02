
let myChart;
var balance;
var withdrawArray=[];
var depositeArrays=[];
var withdrawTotal;
var depositeTotal;
var depositeTable = $(".depositeTable");
var withdrawTable = $(".withdrawTable");
var balance = $("#balance");


$(".alert").hide();
$("form").hide();

$.get("/api/balance")
  .then(response => {
    console.log(response);
    balance=response.value;
    console.log(balance);
    if(balance<1000){
      $(".alert").show(50);
    }
    $(".balance").text(`you have $ ${balance} American Dollars in the Bank`);
  })
$.get("/api/deposite")
  .then(response => {
    console.log(response)
    depositeTotal=0;
    depositeArrays=response.transactions;
    console.log(depositeArrays);
    depositeArrays.forEach(function(item){
      depositeTotal+=item.value
      var logDiv = $("<div>");
      logDiv.addClass("logDiv")
      logDiv.text(` ${item.name} $ ${item.value}`);
      var deleteButton =$("<div>");
      deleteButton.text("delete");
      deleteButton.addClass("deleteLogButton depositeLogDelete");
      deleteButton.attr("valueID",item._id)
      deleteButton.attr("numberID",item.value)
      logDiv.append(deleteButton)
      depositeTable.append(logDiv);

    })
    console.log(depositeTotal);
    $("#totalDeposites").text(`$ ${depositeTotal}`)

    
    
  });
  $.get("/api/withdraw")
  
    .then(response => {
      console.log(response)
      withdrawTotal=0;
      withdrawArray=response.transactions;
      console.log(withdrawArray);
      withdrawArray.forEach(function(item){
        withdrawTotal+=item.value
        var logDiv = $("<div>");
        logDiv.addClass("logDiv")
        logDiv.text(` ${item.name} $ ${item.value}`);
        var deleteButton =$("<div>");
        deleteButton.text("delete");
        deleteButton.addClass("deleteLogButton withdrawLogDelete");
        deleteButton.attr("valueID",item._id)
        deleteButton.attr("numberID",item.value)

        logDiv.append(deleteButton)
        withdrawTable.append(logDiv);
  
      })
      console.log(withdrawTotal);
    $("#totalWithdraws").text(`$ ${withdrawTotal}`)
    });



function populateTotal() {
  // reduce transaction amounts to a single total value
  const total = transactions.reduce((total, t) => {
    return total + parseInt(t.value);
  }, 0);

  const totalEl = document.querySelector("#total");
  totalEl.textContent = total;
}

function populateTable() {
  const tbody = document.querySelector("#tbody");
  tbody.innerHTML = "";

  transactions.forEach(transaction => {
    // create and populate a table row
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${transaction.name}</td>
      <td>${transaction.value}</td>
    `;

    tbody.appendChild(tr);
  });
}

$(document).on("click",".withdrawLogDelete",function(event){
  event.preventDefault;
  event.stopPropogation;
  var deleteID = event.target.getAttribute("valueid");
  var deleteNumber = event.target.getAttribute("numberid");
  deleteNumber=parseFloat(deleteNumber);
  console.log(deleteID) ;
  balance +=deleteNumber;
  console.log(balance);
  balance= balance.toString()
  $.post("/api/balance/"+balance).then(result=>{
    console.log(JSON.stringify(result))
  });
  $.post("/api/deleteWithdraw/"+ deleteID).then(result=>{
    console.log(result);
    location.reload();
  })

})
$(document).on("click",".depositeLogDelete",function(event){
  event.preventDefault;
  event.stopPropogation;
  var deleteID = event.target.getAttribute("valueid");
  var deleteNumber = event.target.getAttribute("numberid");
  deleteNumber=parseFloat(deleteNumber);
  console.log(deleteID) ;
  balance -= deleteNumber;
  console.log(balance);
  $.post("/api/balance/"+ balance).then(result=>{
    console.log(result)
  })
  $.post("/api/deleteDeposite/"+ deleteID,).then(result=>{
    console.log(result)
    location.reload();
  })

})
$("#submitButton").on("click",function(event){
event.stopPropogation;
event.preventDefault;
var type=$("#select").val();
var value=$("#TransactionAmount").val();
var name=$("#TransactionName").val();
console.log(type);
console.log(value);
console.log(name);

var newBody = {
  "name":name,
  "type":type,
  "value":value
};
console.log(newBody);
if(type=="deposite"){
  $.post("/api/deposite",newBody,
  ).then(
    result=>{console.log(result)})
    balance+=parseFloat(value);
    console.log(balance);
  $.post("api/balance/"+balance).then(result=>
    console.log(result))
  }
  else{
$.post("/api/withdraw",newBody).then(
  result=>{console.log(result)})
  balance-=parseFloat(value);
  console.log(balance);
$.post("api/balance/"+ balance).then(result=>
  console.log(result))
}

})
// function populateChart() {
//   // copy array and reverse it
//   const reversed = transactions.slice().reverse();
//   let sum = 0;

//   // create date labels for chart
//   const labels = reversed.map(t => {
//     const date = new Date(t.date);
//     return `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`;
//   });

//   // create incremental values for chart
//   const data = reversed.map(t => {
//     sum += parseInt(t.value);
//     return sum;
//   });

//   // remove old chart if it exists
//   if (myChart) {
//     myChart.destroy();
//   }

//   const ctx = document.getElementById("my-chart").getContext("2d");

//   myChart = new Chart(ctx, {
//     type: "line",
//     data: {
//       labels,
//       datasets: [
//         {
//           label: "Total Over Time",
//           fill: true,
//           backgroundColor: "#6666ff",
//           data
//         }
//       ]
//     }
//   });
// }

function sendTransaction(isAdding) {
  const nameEl = document.querySelector("#t-name");
  const amountEl = document.querySelector("#t-amount");
  const errorEl = document.querySelector(".form .error");

  // validate form
  if (nameEl.value === "" || amountEl.value === "") {
    errorEl.textContent = "Missing Information";
    return;
  } else {
    errorEl.textContent = "";
  }

  // create record
  const transaction = {
    name: nameEl.value,
    value: amountEl.value,
    date: new Date().toISOString()
  };

  // if subtracting funds, convert amount to negative number
  if (!isAdding) {
    transaction.value *= -1;
  }

  // add to beginning of current array of data
  transactions.unshift(transaction);

  // re-run logic to populate ui with new record
  populateChart();
  populateTable();
  populateTotal();

  // also send to server
  fetch("/api/transaction", {
    method: "POST",
    body: JSON.stringify(transaction),
    headers: {
      Accept: "application/json, text/plain, */*",
      "Content-Type": "application/json"
    }
  })
    .then(response => response.json())
    .then(data => {
      if (data.errors) {
        errorEl.textContent = "Missing Information";
      } else {
        // clear form
        nameEl.value = "";
        amountEl.value = "";
      }
    })
    .catch(err => {
      // fetch failed, so save in indexed db
      saveRecord(transaction);

      // clear form
      nameEl.value = "";
      amountEl.value = "";
    });
}

$("#select").on("change", function(event){
event.preventDefault;
event.stopPropogation;
$("form").show();
})
// document.querySelector("#add-btn").addEventListener("click", function(event) {
//   event.preventDefault();
//   sendTransaction(true);
// });

// document.querySelector("#sub-btn").addEventListener("click", function(event) {
//   event.preventDefault();
//   sendTransaction(false);
// });
