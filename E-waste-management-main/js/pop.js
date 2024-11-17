import { app, db, auth } from "./bid.js";
import {
  getDatabase,
  child,
  get,
  set,
  ref,
  push,
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";
document.addEventListener("DOMContentLoaded", function () {
  // Get the bid button and popup
  var bidButton = document.getElementById("bidButton");
  var bidPopup = document.getElementById("bidPopup");
  var thankYouPopup = document.getElementById("thankYouPopup");
  console.log("Pop");
  // Display the popup when the bid button is clicked
  bidButton.addEventListener("click", function () {
    bidPopup.style.display = "block";
  });

  // Close the bid popup when the close button is clicked
  var closePopup = document.getElementById("closePopup");
  closePopup.addEventListener("click", function () {
    bidPopup.style.display = "none";
  });

  // Close the bid popup when clicking outside of it
  window.addEventListener("click", function (event) {
    if (event.target === bidPopup) {
      bidPopup.style.display = "none";
    }
  });

  // Submit bid form
  var bidForm = document.getElementById("bidForm");
  bidForm.addEventListener("submit", function (event) {
    event.preventDefault();
    var bidRate = document.getElementById("bidRate").value;
    //create value in db
    const uid = auth.currentUser.uid;
    console.log(uid);
    push(ref(db, `Bid/Pdy`), {
      bidRate: bidRate,
      uid: uid,
    });
    // Show Thank You popup
    showThankYouPopup();
  });

  // Function to show the Thank You popup
  function showThankYouPopup() {
    // Call the function to retrieve all bids under "Bid/Pdy"
    bidPopup.style.display = "none"; // Hide bid popup
    thankYouPopup.style.display = "block";

    // Close popups after 3 seconds (adjust the time as needed)
    setTimeout(function () {
      bidPopup.style.display = "none";
      thankYouPopup.style.display = "none";
    }, 3000);
  }
});

//Getting all Bid values
const dbRef = ref(getDatabase());
function getAllBids() {
  get(child(dbRef, `Bid/Pdy`))
    .then((snapshot) => {
      if (snapshot.exists()) {
        let allValues = snapshot.val();
        //console.log(allValues);
        snapshot.forEach((childSnapshot) => {
          const childKey = childSnapshot.key;
          const childData = childSnapshot.val();
          console.log(childData.bidRate);
          // ...
        });
      } else {
        console.log("No data available");
      }
    })
    .catch((error) => {
      console.error(error);
    });
}

//setInterval(getAllBids, 1000);
