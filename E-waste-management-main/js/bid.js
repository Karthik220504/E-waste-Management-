import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import {
  getDatabase,
  set,
  onValue,
  ref,
  get,
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";
import {
  getAuth,
  onAuthStateChanged,
  sendEmailVerification,
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
const firebaseConfig = {
  apiKey: "AIzaSyBPVrGnxf7TWm2JNgUOupL79Vk1VKzMp7w",
  authDomain: "reverse-vm.firebaseapp.com",
  databaseURL: "https://reverse-vm-default-rtdb.firebaseio.com",
  projectId: "reverse-vm",
  storageBucket: "reverse-vm.appspot.com",
  messagingSenderId: "926987134897",
  appId: "1:926987134897:web:cb990e4fa1cfc0a596ff90",
  measurementId: "G-L5EPGGP58B",
};
export const app = initializeApp(firebaseConfig);
export const auth = getAuth();
export const db = getDatabase();
const showButton = document.getElementsByClassName("showButton");
const showForAdmin = document.getElementsByClassName("forViewButton");
const showForTrader = document.getElementsByClassName("forBidButton");

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
        if (typeOfUser == "Admin") {
          for (let i = 0; i < showButton.length; i++) {
            showButton[i].style.display = "block";
            if (i == 0) {
              showButton[i].setAttribute(
                "style",
                "padding: 15px;text-align: center;border-bottom: 1px solid #ddd;margin: 5px;background: linear-gradient(#adcdba, #5a8473);color: white;"
              );
            } else {
              //showForAdmin[i - 1].style.display = "block";
              showButton[i].setAttribute(
                "style",
                "padding:  15px;text-align: center;border-bottom: 1px solid #ddd;margin: 5px;"
              );
            }
          }
        } else if (typeOfUser == "Trader") {
          for (let j = 0; j < showForAdmin.length; j++) {
            showForAdmin[j].style.display = "none";
            showForTrader[j].style.display = "block";
          }
          for (let i = 0; i < showButton.length; i++) {
            showButton[i].style.display = "block";
            if (i == 0) {
              showButton[i].setAttribute(
                "style",
                "padding: 15px;text-align: center;border-bottom: 1px solid #ddd;margin: 5px;background: linear-gradient(#adcdba, #5a8473);color: white;"
              );
            } else {
              showButton[i].setAttribute(
                "style",
                "padding: 15px;text-align: center;border-bottom: 1px solid #ddd;margin: 5px;"
              );
            }
          }
          // to accept or cancel
          const tickShow = document.getElementById("tickImage");
          const crossShow = document.getElementById("crossImage");
          // for hiding code
          var newDiv;
          onValue(ref(db, `BidSelect/`), (snapshotFor) => {
            const data = snapshotFor.val();
            const uid = data.uid;
            const bidderCode = data.code;
            
            if (uid === userId) {
              tickShow.style.display = "block";
              crossShow.style.display = "block";
              //to add code
              newDiv = document.createElement("div");

              
              // Set its attributes
              newDiv.setAttribute("style", "display: flex; justify-content: center; margin-top: 10px; font-size: 20px;");
              newDiv.textContent = `Code : ${bidderCode}`;

              // Append the new div to an existing element in the document
              var existingElement = document.getElementById("idForCode"); // Replace "existingElementId" with the actual ID of the element you want to append to
              existingElement.appendChild(newDiv);
              console.log("Right Person");
            }
            else{
            tickShow.style.display = "none";
            crossShow.style.display = "none";
            newDiv.style.display='none';
            }
          });
          tickShow.addEventListener("click", function () {
            set(ref(db, `BidSelect/`), {
              Pdy: 0,
              uid: 0,
            });
            tickShow.style.display = "none";
            crossShow.style.display = "none";
            newDiv.style.display='none';
          });
          crossShow.addEventListener("click", function () {
            set(ref(db, `BidSelect/`), {
              Pdy: 0,
              uid: 0,
            });
            // Get the parent node of the dynamically added <div> element
            var parentElement = newDiv.parentNode;

// Remove the dynamically added <div> element from its parent node
            parentElement.removeChild(newDiv);
            tickShow.style.display = "none";
            crossShow.style.display = "none";
            codeShow.style.display='none';
          });
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
