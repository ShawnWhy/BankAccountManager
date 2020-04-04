let db;
const request = window.indexedDB.open("bankAccount", 1);

request.onupgradeneeded = function(event) {
  const db = event.target.result;
  db.createObjectStore("withdraw", { keyPath: "id" },{ autoIncrement: true });
  db.createObjectStore("deposite", { keyPath: "id" },{ autoIncrement: true });
  db.createObjectStore("balance", { keyPath: "id" },{ autoIncrement: true });

};

request.onsuccess = function(event) {
  db = event.target.result;

  // check if app is online before reading from db
  if (navigator.onLine) {
    checkBalance();
    checkDatabase("withdraw");
    checkDatabase("deposite");
    


  }
};

request.onerror = function(event) {
  console.log("Woops! " + event.target.errorCode);
};

function saveBalance(balance){
  const transaction=db.transaction(["balance"],"readwrite");
  const store = transaction.objectStore("balance");
  // const getCursorRequest = toDoListStore.openCursor();
getCursorRequest.onsuccess = e => {
  const cursor = e.target.result;
  if (cursor) {
    if (cursor.id==1) {
     cursor.update({value:balance});}
    cursor.continue();
  }
}; 

}
function deleteRecord(name,collection){
  const transation = db.transaction([collection],"readwrite");
  const store = transaction.objectStore(collection);

}
function initializeBalance(initialAmount){

}

function saveRecord(record,collection) {
  const transaction = db.transaction([collection], "readwrite");
  const store = transaction.objectStore(collection);

  store.add(record);
}
function checkBalance(){
  const transaction = db.transaction(["balance"],"readwrite");
  const store = transaction.objectStore("balance");
  const getOne = store.getAll();

  getOne.onsuccess = function(){
    console.log(getOne.result)
    if(getOne.result[0].value){
      fetch("/api/balance",{
        method:"POST",
        body:parseFloat(getOne.result.value)
      })
      .then(() => {
        // delete records if successful
        const transaction = db.transaction(["balance"], "readwrite");
        const store = transaction.objectStore("balance");
        store.clear();
      });

    }
  }}
  



function checkDatabase(database) {
  const transaction = db.transaction([database], "readwrite");
  const store = transaction.objectStore(database);
  const getAll = store.getAll();

  getAll.onsuccess = function() {
    if (getAll.result.length > 0) {
      for(var i=0;i<getAll.result.length;i++){
        var newBody ={ name:getAll.result[i].name,
          value : getAll.result[i].value,
          type : getAll.result[i].type} 
          console.log(newBody);
      fetch("/api/"+database, {
        method: "POST",
        body: newBody,
        headers: {
          Accept: "application/json, text/plain, */*",
          "Content-Type": "application/json"
        }
      })
      .then(response => response.json())
      .catch(err=>{console.log(err)})
        .then(() => {
          // delete records if successful
          const transaction = db.transaction([database], "readwrite");
          const store = transaction.objectStore(database);
          store.clear();
        });
    }
  };
}}

// listen for app coming back online
window.addEventListener("online", function(){
  checkBalance();
  checkDatabase("withdraw");
  checkDatabase("deposite");
 
});



// export function checkForIndexedDb() {
//   if (!window.indexedDB) {
//     console.log("Your browser doesn't support a stable version of IndexedDB.");
//     return false;
//   }
//   return true;
// }

// export function useIndexedDb(databaseName, storeName, method, object) {
//   return new Promise((resolve, reject) => {
//     const request = window.indexedDB.open(databaseName, 1);
//     let db,
//       tx,
//       store;

//     request.onupgradeneeded = function(e) {
//       const db = request.result;
//       db.createObjectStore(storeName, { keyPath: "_id" });
//     };

//     request.onerror = function(e) {
//       console.log("There was an error");
//     };

//     request.onsuccess = function(e) {
//       db = request.result;
//       tx = db.transaction(storeName, "readwrite");
//       store = tx.objectStore(storeName);

//       db.onerror = function(e) {
//         console.log("error");
//       };
//       if (method === "put") {
//         store.put(object);
//       } else if (method === "get") {
//         const all = store.getAll();
//         all.onsuccess = function() {
//           resolve(all.result);
//         };
//       } else if (method === "delete") {
//         store.delete(object._id);
//       }
//       tx.oncomplete = function() {
//         db.close();
//       };
//     };
//   });
// }
// const getCursorRequest = toDoListStore.openCursor();
// getCursorRequest.onsuccess = e => {
//   const cursor = e.target.result;
//   if (cursor) {
//     if (cursor.value.status === "in-progress") {
//       const todo = cursor.value;
//       todo.status = "complete";
//       cursor.update(todo);
//     }
//     cursor.continue();
//   }
// }; 
