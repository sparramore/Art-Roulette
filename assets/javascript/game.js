// Initialize Firebase
var config = {
    apiKey: "AIzaSyDHq7Nhsdz2v0GjUgNarEnEi_-lnV5QpvQ",
    authDomain: "art-roulette-2ffee.firebaseapp.com",
    databaseURL: "https://art-roulette-2ffee.firebaseio.com",
    projectId: "art-roulette-2ffee",
    storageBucket: "",
    messagingSenderId: "1037636482050"
};

firebase.initializeApp(config);
var database = firebase.database();

database.ref().on("value", function (snapshot) {

    console.log(snapshot.val().nouns);
    console.log(snapshot.val().adjectives);

}, function (errorObject) {
    // Create Error Handling
    console.log("The read failed: " + errorObject.code);
});






