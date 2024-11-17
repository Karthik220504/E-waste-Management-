import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import {
  getDatabase,
  set,
  ref,
  get,
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
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
//login sign
const wrapper = document.querySelector(".wrapper"),
  signupHeader = document.querySelector(".signup header"),
  loginHeader = document.querySelector(".login header");

loginHeader.addEventListener("click", () => {
  wrapper.classList.add("active");
});
signupHeader.addEventListener("click", () => {
  wrapper.classList.remove("active");
});
// Initialize Firebase
export const app = initializeApp(firebaseConfig);

const auth = getAuth(app);
const db = getDatabase();
console.log(db);
const signup = document.getElementById("signupForm");
const login = document.getElementById("loginForm");

let newName = document.getElementById("newName");
let newMail = document.getElementById("newMail");
let newPass = document.getElementById("newPass");
let typeOfUser = document.getElementById("userType");
let checkBx = document.getElementById("signupCheck");

signup.addEventListener("click", (evt) => {
  evt.preventDefault();
  createUserWithEmailAndPassword(auth, newMail.value, newPass.value)
    .then((userCredential) => {
      // Sign-up successful
      const user = userCredential.user;
      /*const userData={
        name:newName.value,
        points:0,
        right:"Consumer"
    }*/
      let infinite = 1;
      let randNum;
      while (infinite) {
        randNum = Math.floor(Math.random() * 90000) + 10000;
        infinite = unique(randNum);
      }

      set(ref(db, `usersbro/${userCredential.user.uid}`), {
        name: newName.value,
        unique: randNum,
        mail: newMail.value,
        points: 0,
        waste: 0,
        right: typeOfUser.value,
      });
      set(ref(db, `user/${randNum}`), {
        name: newName.value,
        uid: user.uid,
        mail: newMail.value,
        points: 0,
        waste: 0,
        right: typeOfUser.value,
      });

      setTimeout(function () {
        window.location.href = "./main.html";
      }, 4000);

      // Handle successful registration (e.g., redirect to a different page)
    })
    .catch((error) => {
      // Sign-up failed
      alert("Error creating user");
      console.log("Error creating user:", error);
      // Handle errors (e.g., display error messages to the user)
    });
});
var mail = document.getElementById("mail");
var pass = document.getElementById("pass");

login.addEventListener("click", (event) => {
  event.preventDefault();
  signInWithEmailAndPassword(auth, mail.value, pass.value)
    .then((userCredential) => {
      // login-in done
      console.log(userCredential);
      const userId = userCredential.uid;
      window.location.href = "./main.html";
      get(ref(db, `usersbro/${userId}`))
        .then((snapshot) => {
          const userData = snapshot.val();
          const userName = userData.name; // Extract the name
          const points = userData.points;
          //mail put

          setTimeout(function () {
            window.location.href = "/main.html";
          }, 4000);
        })
        .catch((error) => {
          // Handle errors
        });
    })
    .catch((error) => {
      // Sign-up failed
      alert("Email and Password Wrong");
      console.log("Error Login:", error);
      // Handle errors (e.g., display error messages to the user)
    });
});

function unique(randNum) {
  get(ref(db, `user/`))
    .then((snapshotBro) => {
      const data = snapshotBro.val();

      // Check if data exists and is an object
      if (data && typeof data === "object") {
        // Loop through each property (child) in the data object
        for (const childKey in data) {
          if (childKey === randNum) {
            return 1;
          }

          //getting its data
          /*if (data.hasOwnProperty(childKey)) {
          const childData = data[childKey];
          console.log(childData);
        }*/
        }
        return 0;
      } else {
      }
    })
    .catch((error) => {
      console.error("Error fetching user data:", error.message);
    });
}
