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
        showRandomImage(noun);

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
        showRandomImage(noun);

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
        showRandomImage(adj);
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

function UserLogin(userEmail,userPass)
{

}


$(window).on('load', function(){ 
    $("#userLoginModal").show();
  });

  $("#user-Error-Modal-Submit").on("click",function()
{
    $("#userLoginErrorModal").hide();
});

//our modal dialog's submit button clicked
$("#user-Login-Modal-Submit").on("click",function()
{

//get the users email and password.
var userEmail = $("#e-mail-Sub").val();
var userPass = $("#pass-Sub").val();

console.log("userEmail: " + userEmail);
console.log("userPass: " + userPass);

//we are going to hide our login modal just because if we are having issues we are going to need to display another modal.
$("#userLoginModal").hide();

//if they failed to enter text for the email or password throw up an error modal
if(userEmail === "" || userPass === "")
{
    //fill the error title and text
    $("#user-Error-Modal-Title").text("User Error");
    $("#user-Error-Modal-Body").text("please provide both a User Name and a Password");
    $("#userLoginErrorModal").show();
}

UserLogin(userEmail,userPass);
});



function showRandomImage (searchWord) {
    var queryURL = "https://www.googleapis.com/customsearch/v1?q=" + searchWord + "&cx=008015619189080859829%3Agapxkuki8im&key=AIzaSyC0OrvTZD_SB6qRfqRPu7L_F2ugZTzA8pE";

    $.ajax({
        url: queryURL,
        method: "GET",
        dataType: 'jsonp'
    }).then(function(response) {
        console.log(response);
        var results = response.items;
        for (var i = 0; i < 3; i++) {
            var randomImage = $("<img>");
            var sourceArr = results[i].pagemap.cse_image;
            var sourceUrl = sourceArr[0].src;
            randomImage.attr("src", sourceUrl);
            randomImage.attr('width', 200).attr('height', 200)
            $("#google-images").append(randomImage); 
        }
        $("#google-images").append("<br>")
    });
     
}

