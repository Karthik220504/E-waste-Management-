import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import {
  getDatabase,
  set,
  ref,
  get,
  onValue,
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";
import {
  getAuth,
  onAuthStateChanged,
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

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth();
const db = getDatabase();
//console.log(auth);
const test1 = document.getElementById("namebro");
const test2 = document.getElementById("uniquebro");
const test3 = document.getElementById("mailbro");
const test4 = document.getElementById("textContainer");
const test5 = document.getElementById("wasteBy");

onAuthStateChanged(auth, (user) => {
  if (user) {
    // User is signed in, see docs for a list of available properties
    const userId = user.uid;

    get(ref(db, `usersbro/${userId}`))
      .then((snapshot) => {
        const userData = snapshot.val();
        const nameOfUser = userData.name;
        const uniqueOfUser = userData.unique;
        const pointsOfUser = userData.points;
        const mailOfUser = userData.mail;

        test1.textContent = `Name : ${nameOfUser}`;
        test2.textContent = `Unique ID : ${uniqueOfUser}`;
        test3.textContent = `Email : ${mailOfUser}`;
        //for points its from unique id db
        onValue(ref(db, `user/${uniqueOfUser}`), (snapshot) => {
          const dataOfUser = snapshot.val();
          //console.log(dataOfUser);
          test4.textContent = `Credit Points : ${dataOfUser.points}`;
          test5.textContent = `Waste Collected from You:${dataOfUser.waste}`;
        });
      })
      .catch((error) => {
        // Handle errors
      });
  } else {
    // User is signed out
    // ...
  }
});

//for leaderBoard
onValue(ref(db, `user/`), (snapshot) => {
  const data = snapshot.val();
  if (data && typeof data === "object") {
    // Loop through each property (child) in the data object
    let pointsArray = [];
    let namesArray = [];
    let i = 0;
    for (const childKey in data) {
      //getting its data

      if (data.hasOwnProperty(childKey)) {
        const childData = data[childKey];
        pointsArray.push(childData.points);
        namesArray.push(childData.name);
        console.log(i);
        i++;
      }
    }

    // Create an array of objects with points and names
    let combinedArray = pointsArray.map((points, index) => ({
      points,
      name: namesArray[index],
    }));

    // Sort the combined array based on points
    combinedArray.sort((a, b) => b.points - a.points);

    // Extract the sorted names array
    let sortedNamesArray = combinedArray.map((item) => item.name);
    //sorting over
    // Display the result
    /*console.log(
      "Sorted Points Array:",
      combinedArray.map((item) => item.points)
    );
    console.log("Sorted Names Array:", sortedNamesArray);*/

    //to set the leaderBoard values
    for (let k = 1; k <= 5; k++) {
      console.log("bro");
      setValue(`leadName${k}`, `point${k}`, k - 1);
    }
    //function to repeat leaderBoard process
    function setValue(leadNameID, leadPointID, k) {
      const leadName = document.getElementById(leadNameID);
      const leadPoint = document.getElementById(leadPointID);
      leadName.innerHTML = `${k + 1}. ${sortedNamesArray[k]}`;
      leadPoint.innerHTML = `${combinedArray[k].points} points`;
    }
  }
});
