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
var auth = firebase.auth();
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

function submitEmailForAuth(userEmail,userPass,saveLoginChecked)
{
    auth.createUserWithEmailAndPassword(userEmail, userPass).catch(function(error) {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        console.log(error);
        console.log(error.message);
        // ...
      });

      window.localStorage.setItem("art-Roulette-Email",userEmail);
      window.localStorage.setItem("art-Roulette-Pass",userPass);
      window.localStorage.setItem("art-Roulette-SaveLogin",saveLoginChecked);
      window.localStorage.setItem("art-Roulette-Submitted-Email",true)

      if(saveLoginChecked)
      {
          LoginToServer();
      }
}

function LoginToServer()
{
    console.log("logging in!");
    auth.signInWithEmailAndPassword(localStorage.getItem("art-Roulette-Submitted-Email"), localStorage.getItem("art-Roulette-Pass")).catch(function(error) {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        // ...
      });
}

$("#loginButton").on("click",function()
{
    LoginToServer();
});

$(window).on('load', function()
{ 
    console.log("login: " + localStorage.getItem("art-Roulette-Submitted-Email"));
    console.log("automatic login: " + localStorage.getItem("art-Roulette-SaveLogin"));
    if(!localStorage.getItem("art-Roulette-Submitted-Email"))
    {
        $("#userLoginModal").show();
    }

    if(localStorage.getItem("art-Roulette-SaveLogin"))
    {
        $("#user-Login-Modal-Submit").hide();
        LoginToServer();
    }

});

auth.signOut().then(function() {
    // Sign-out successful.
  }).catch(function(error) {
    // An error happened.
    var errorCode = error.code;
    var errorMessage = error.message;
    console.log(error);
    console.log(error.message);
  });

$("#user-Error-Modal-Submit").on("click",function()
{
    $("#userLoginErrorModal").hide();
    $("#userLoginModal").show();

});

//our modal dialog's submit button clicked
$("#user-Login-Modal-Submit").on("click",function()
{

//get the users email and password.
var userEmail = $("#e-mail-Sub").val();
var userPass = $("#pass-Sub").val();
var saveLoginChecked = false;
saveLoginChecked = $('input[type=checkbox]').prop("checked");

console.log("userEmail: " + userEmail);
console.log("userPass: " + userPass);
console.log("login checked: " + saveLoginChecked);

//we are going to hide our login modal just because if we are having issues we are going to need to display another modal.
$("#userLoginModal").hide();

//if they failed to enter text for the email or password throw up an error modal
if(userEmail === "" || userPass === "")
{
    //fill the error title and text
    $("#user-Error-Modal-Title").text("User Error");
    $("#user-Error-Modal-Body").text("please provide both a User Name and a Password");
    $("#userLoginErrorModal").show();
    return;
}

auth.signOut().then(function() {
    // Sign-out successful.
  }).catch(function(error) {
    // An error happened.
  });

submitEmailForAuth(userEmail,userPass,saveLoginChecked);
});

