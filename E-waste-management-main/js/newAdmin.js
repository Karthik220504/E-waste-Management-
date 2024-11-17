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
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

document.addEventListener("DOMContentLoaded", function () {
  // Get the bid button and popup
  var bidButtonAdmin = document.getElementById("bidButtonAdmin");
  var bidPopupAdmin = document.getElementById("bidPopupAdmin");
  var thankYouPopupAdmin = document.getElementById("thankYouPopupAdmin");
  // Display the popup when the bid button is clicked
  bidButtonAdmin.addEventListener("click", function () {
    bidPopupAdmin.style.display = "block";
  });

  // Close the bid popup when the close button is clicked
  var closePopupAdmin = document.getElementById("closePopupAdmin");
  closePopupAdmin.addEventListener("click", function () {
    bidPopupAdmin.style.display = "none";
  });

  // Close the bid popup when clicking outside of it
  window.addEventListener("click", function (event) {
    if (event.target === bidPopupAdmin) {
      bidPopupAdmin.style.display = "none";
    }
  });
});

function clearBidRatesAndFormsAdmin() {
  // Clear previous bid rates and forms in the popup content
  const popupContentAdmin = document.querySelector(".popup-contentAdmin");
  popupContentAdmin.innerHTML = "";
}

//chatgpt
const dbRefAdmin = ref(getDatabase());
const usersRefAdmin = ref(getDatabase(), "usersbro");

function getAllBidsAdmin() {
  try {
    // Set up a listener for changes in "Bid/Pdy"
    onValue(child(dbRefAdmin, "Bid/Pdy"), (snapshot) => {
      if (snapshot.exists()) {
        //make red Dot glow
        redDotForAdmin("on");
        // Clear previous bid rates and forms in the popup content
        clearBidRatesAndFormsAdmin();

        const promises = [];

        snapshot.forEach((childSnapshot) => {
          const childKey = childSnapshot.key;
          const childData = childSnapshot.val();

          const userNamePromise = getUserNameAdmin(childData.uid).then(
            (userName) => {
              console.log(userName);
              displayBidRateAdmin(
                userName,
                childData.bidRate,
                handleFormSubmissionAdmin,
                childData.uid
              );
            }
          );

          promises.push(userNamePromise);
        });

        Promise.all(promises).catch((error) => console.error(error));
      } else {
        //disable Red Dot
        redDotForAdmin("off");
        console.log("No Bids available");
      }
    });
  } catch (error) {
    console.error(error);
  }
}

// No need for setInterval as the listener will handle real-time updates

async function getUserNameAdmin(uid) {
  try {
    const snapshot = await get(child(usersRefAdmin, uid));
    const userData = snapshot.val();
    const userName = userData ? userData.name : null;
    return userName;
  } catch (error) {
    console.error(error);
    return null;
  }
}

getAllBidsAdmin();

function displayBidRateAdmin(name, bidRate, onSubmitCallback, uid) {
  // Create form elements
  const form = document.createElement("form");
  form.setAttribute("style", "display: flex;padding:10px");
  form.setAttribute("action", "#");
  form.setAttribute("id", `bidFormAdmin_${name}`);

  const selectedBin = document.createElement("div");
  selectedBin.setAttribute("style", "font-size: 17px");
  selectedBin.textContent = `${name} : ${bidRate}`;
  selectedBin.id = `selectedBinAdmin_${name}`;

  const label = document.createElement("label");
  label.setAttribute("for", "bidRate");

  const input = document.createElement("input");
  input.setAttribute("type", "submit");
  input.setAttribute("value", "Select");

  // Append form elements to the existing popup-content container
  const popupContentAdmin = document.querySelector(".popup-contentAdmin");
  form.appendChild(selectedBin);
  form.appendChild(label);
  form.appendChild(input);
  popupContentAdmin.appendChild(form);

  // Add event listener to the form
  form.addEventListener("submit", function (event) {
    event.preventDefault();
    // Execute the callback with the name when the form is submitted
    onSubmitCallback(name, uid);
    // Handle form submission if needed
  });
}

// Example usage
function handleFormSubmissionAdmin(name, uid) {
  // Access the name and perform changes to the main HTML
  console.log("Form submitted for:", uid);
  // Add your logic to make changes to the main HTML based on the name
  //generate code for bidder
  var randomNumber = Math.floor(100000 + Math.random() * 900000);
  // setting value at "Bid/PdySelected" to 1
  set(ref(db, "BidSelect/"), {
    Pdy: 1,
    uid: uid,
    code:randomNumber,

  });
  set(ref(db, "Bid/Pdy"), {});
  // Display the Thank You popup
  //const bidPopupAdmin = document.getElementById("bidPopupAdmin");
  bidPopupAdmin.style.display = "none"; // Hide bid popup
  thankYouPopupAdmin.style.display = "block";
  // Close popups after 3 seconds (adjust the time as needed)
  setTimeout(function () {
    thankYouPopupAdmin.style.display = "none";
  }, 3000);
}

const assignedForUser = document.getElementById("selectPdy");
onValue(ref(db, `BidSelect/`), (snapshot) => {
  const data = snapshot.val();
  //console.log("Selected:" + data.uid);
  if (data.Pdy === 1) {
    get(ref(db, `usersbro/${data.uid}`))
      .then((snapshotBro) => {
        const dataForName = snapshotBro.val();
        const nameOfUser = dataForName.name;
        assignedForUser.innerHTML = `Assigned to ${nameOfUser}`;
        selectedSoHideButton(0);
      })
      .catch((error) => {
        console.error("Error fetching user data:", error.message);
      });
  } else {
    assignedForUser.innerHTML = "";
    selectedSoHideButton(1);
  }
});

//toggle buttons
function selectedSoHideButton(Pdy0or1) {
  onAuthStateChanged(auth, (user) => {
    if (user) {
      // User is signed in, see docs for a list of available properties
      const userId = user.uid;
      console.log(userId);
      get(ref(db, `usersbro/${userId}`))
        .then((snapshot) => {
          const userData = snapshot.val();
          const nameOfUser = userData.name;
          const typeOfUser = userData.right;
          if (typeOfUser == "Admin" && Pdy0or1 == 0) {
            const showForAdmin =
              document.getElementsByClassName("forViewButton");
            showForAdmin[0].style.display = "none";
          } else if (typeOfUser == "Admin" && Pdy0or1 == 1) {
            const showForAdmin =
              document.getElementsByClassName("forViewButton");
            showForAdmin[0].style.display = "block";
          } else if (typeOfUser == "Trader" && Pdy0or1 == 0) {
            const showForTrader =
              document.getElementsByClassName("forBidButton");
            showForTrader[0].style.display = "none";
          } else if (typeOfUser == "Trader" && Pdy0or1 == 1) {
            const showForTrader =
              document.getElementsByClassName("forBidButton");
            showForTrader[0].style.display = "block";
          } else {
          }
        })
        .catch((error) => {
          // Handle errors
        });
    } else {
      // User is signed out
      // ...
    }
  });
}
//toggle red dot
function redDotForAdmin(state) {
  onAuthStateChanged(auth, (user) => {
    if (user) {
      // User is signed in, see docs for a list of available properties
      const userId = user.uid;
      console.log(userId);
      get(ref(db, `usersbro/${userId}`))
        .then((snapshot) => {
          const userData = snapshot.val();
          const typeOfUser = userData.right;
          if (typeOfUser == "Admin" && state == "on") {
            const redDot = document.getElementById("redDot");
            redDot.style.display = "inline";
          } else if (typeOfUser == "Admin" && state == "off") {
            const redDot = document.getElementById("redDot");
            redDot.style.display = "none";
          } else {
          }
        })
        .catch((error) => {
          // Handle errors
        });
    } else {
      // User is signed out
      // ...
    }
  });
}
