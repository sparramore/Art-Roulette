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

//get the Adjective, we use our nouns list in the database to generate a list of adjectives with Datamuse
function getAdj() {
    database.ref().child("nouns").on("value", function (snapshot) {
        //get a random noun from our database
        var numNouns = snapshot.numChildren();
        var randomNoun = Math.floor(Math.random() * numNouns);
        var nounName = 'noun' + randomNoun;
        noun = snapshot.child(nounName).val().name;
        // console.log("There are " + snapshot.numChildren() + " nouns");
        // console.log(randomNoun);
        // console.log(snapshot.child(nounName).val().name);

        //ajax query URL DataMuse API
        var queryURL = "https://api.datamuse.com//words?rel_jjb=" + noun;

        $.ajax({
            url: queryURL,
            method: "GET"
        }).then(function (response) {

            console.log(response);

            //get a random word from the Datamuse array
            var randomDataMuse = Math.floor(Math.random() * response.length);

            //console.log('randomDataMuse:' + randomDataMuse);

            var dataMuseWord = response[randomDataMuse].word;
            $('#adjective').text(dataMuseWord);
        });
    })
}

//get the Noun, we use our adjective list in the database to generate a list of nouns with Datamuse
function getNoun1() {
    database.ref().child("adjectives").on("value", function (snapshot) {
        //get a random adjective from our database
        var numAdj = snapshot.numChildren();
        var randomAdj = Math.floor(Math.random() * numAdj);
        var adjName = 'adj' + randomAdj;
        adj = snapshot.child(adjName).val().name;
        console.log(adj);

        // console.log("There are " + snapshot.numChildren() + " adjectives");
        // console.log(randomAdj);
        // console.log(snapshot.child(adjName).val().name);

        //ajax query URL Datamuse API
        var queryURL = "https://api.datamuse.com/words?rel_jja=" + adj;

        $.ajax({
            url: queryURL,
            method: "GET"
        }).then(function (response) {

            console.log(response);

            //get a random word from the Datamuse array
            var randomDataMuse = Math.floor(Math.random() * response.length);

            //console.log('randomDataMuse:' + randomDataMuse);
            var dataMuseWord = response[randomDataMuse].word;
            $('#noun1').text(dataMuseWord);
        });
    })
}

//get Noun #2 (same as above)
function getNoun2() {
    database.ref().child("adjectives").on("value", function (snapshot) {
        var numAdj = snapshot.numChildren();
        var randomAdj = Math.floor(Math.random() * numAdj);
        var adjName = 'adj' + randomAdj;

        // console.log("There are " + snapshot.numChildren() + " adjectives");
        // console.log(randomAdj);
        // console.log(snapshot.child(adjName).val().name);

        adj = snapshot.child(adjName).val().name;
        // $('#adjective').text(adj);

        var queryURL = "https://api.datamuse.com/words?rel_jja=" + adj;

        $.ajax({
            url: queryURL,
            method: "GET"
        }).then(function (response) {
            console.log(response);
            
            var randomDataMuse = Math.floor(Math.random() * response.length);
            var dataMuseWord = response[randomDataMuse].word;
            $('#noun2').text(dataMuseWord);
        });
    })
}

//call word functions
getAdj();
getNoun1();
getNoun2();

//console.log our nouns and adjectives database lists for error checking
database.ref().on("value", function (snapshot) {

    console.log(snapshot.val().nouns);
    console.log(snapshot.val().adjectives);

}, function (errorObject) {
    // Create Error Handling
    console.log("The read failed: " + errorObject.code);
});

function UserLogin(userEmail, userPass) {

}


$(window).on('load', function () {
    $("#userLoginModal").show();
});

$("#user-Error-Modal-Submit").on("click", function () {
    $("#userLoginErrorModal").hide();
});

//our modal dialog's submit button clicked
$("#user-Login-Modal-Submit").on("click", function () {

    //get the users email and password.
    var userEmail = $("#e-mail-Sub").val();
    var userPass = $("#pass-Sub").val();

    console.log("userEmail: " + userEmail);
    console.log("userPass: " + userPass);

    //we are going to hide our login modal just because if we are having issues we are going to need to display another modal.
    $("#userLoginModal").hide();

    //if they failed to enter text for the email or password throw up an error modal
    if (userEmail === "" || userPass === "") {
        //fill the error title and text
        $("#user-Error-Modal-Title").text("User Error");
        $("#user-Error-Modal-Body").text("please provide both a User Name and a Password");
        $("#userLoginErrorModal").show();
    }

    UserLogin(userEmail, userPass);
});