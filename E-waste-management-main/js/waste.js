import { app, db, auth } from "./bid.js";
import {
  getDatabase,
  child,
  get,
  set,
  onValue,
  ref,
  push,
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";

document.addEventListener("DOMContentLoaded", function () {
  //create const's for ids pdyEwaste,pdyPaper,pdyPlastic,pdyMetal
  const pdyEwaste = document.getElementById("pdyEwaste");
  const pdyPaper = document.getElementById("pdyPaper");
  const pdyPlastic = document.getElementById("pdyPlastic");
  const pdyMetal = document.getElementById("pdyMetal");

  onValue(ref(db, `waste/Pdy`), (snapshot) => {
    const data = snapshot.val();
    //set the values for pdyEwaste,pdyPaper,pdyPlastic,pdyMetal
    pdyEwaste.innerHTML = data.ewaste;
    pdyPaper.innerHTML = data.paper;
    pdyPlastic.innerHTML = data.plastic;
    pdyMetal.innerHTML = data.metal;
  });
});
