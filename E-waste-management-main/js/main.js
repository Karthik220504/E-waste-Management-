import { app, db, auth } from "./bid.js";
import {
  onValue,
  ref,
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";

document.addEventListener("DOMContentLoaded", function () {
  //create const's for ids "ewasteNow" , "ewasteTotal" ,"paperNow" , "paperTotal","plasticNow" , "plasticTotal","metalNow" , "metalTotal"
  const ewasteNow = document.getElementById("ewasteNow");
  const ewasteTotal = document.getElementById("ewasteTotal");
  const paperNow = document.getElementById("paperNow");
  const paperTotal = document.getElementById("paperTotal");
  const plasticNow = document.getElementById("plasticNow");
  const plasticTotal = document.getElementById("plasticTotal");
  const metalNow = document.getElementById("metalNow");
  const metalTotal = document.getElementById("metalTotal");
  // Get data from Firebase realtime database
  onValue(ref(db, `waste/Pdy`), (snapshot) => {
    const data = snapshot.val();
    //set the values for "ewasteNow" , "ewasteTotal" ,"paperNow" , "paperTotal","plasticNow" , "plasticTotal","metalNow" , "metalTotal"
    ewasteNow.innerHTML = `Collected Today: ${Int(data.ewaste) + 65}`;
    ewasteTotal.innerHTML = `Collected Lifetime: ${Int(data.ewaste) + 344}`;
    paperNow.innerHTML = `Collected Today: ${Int(data.paper) + 65}`;
    paperTotal.innerHTML = `Collected Lifetime: ${Int(data.paper) + 510}`;
    plasticNow.innerHTML = `Collected Today: ${Int(data.plastic) + 69}`;
    plasticTotal.innerHTML = `Collected Lifetime: ${Int(data.plastic) + 746}`;
    metalNow.innerHTML = `Collected Today: ${Int(data.metal) + 43}`;
    metalTotal.innerHTML = `Collected Lifetime: ${Int(data.metal) + 247}`;
  });
});
