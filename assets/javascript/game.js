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
var adj = '';
var noun = '';


function getNoun1() {
    database.ref().child("nouns").on("value", function (snapshot) {
        var numNouns = snapshot.numChildren();
        var randomNoun = Math.floor(Math.random() * numNouns);
        var nounName = 'noun' + randomNoun;
        console.log("There are " + snapshot.numChildren() + " nouns");
        console.log(randomNoun);
        console.log(snapshot.child(nounName).val().name);

        noun = snapshot.child(nounName).val().name;
        $('#noun1').text(noun);

    })

}

function getNoun2() {
    database.ref().child("nouns").on("value", function (snapshot) {
        var numNouns = snapshot.numChildren();
        var randomNoun = Math.floor(Math.random() * numNouns);
        var nounName = 'noun' + randomNoun;
        console.log("There are " + snapshot.numChildren() + " nouns");
        console.log(randomNoun);
        console.log(snapshot.child(nounName).val().name);

        noun = snapshot.child(nounName).val().name;
        $('#noun2').text(noun);

    })

}


function getAdj() {
    database.ref().child("adjectives").on("value", function (snapshot) {
        var numAdj = snapshot.numChildren();
        var randomAdj = Math.floor(Math.random() * numAdj);
        var adjName = 'adj' + randomAdj;
        console.log("There are " + snapshot.numChildren() + " adjectives");
        console.log(randomAdj);
        console.log(snapshot.child(adjName).val().name);

        adj = snapshot.child(adjName).val().name;
        $('#adjective').text(adj);
    })

}

getAdj();
getNoun1();
getNoun2();

database.ref().on("value", function (snapshot) {

    console.log(snapshot.val().nouns);
    console.log(snapshot.val().adjectives);

}, function (errorObject) {
    // Create Error Handling
    console.log("The read failed: " + errorObject.code);
});






