// Initialize Firebase
var config = {
    apiKey: "AIzaSyDHq7Nhsdz2v0GjUgNarEnEi_-lnV5QpvQ",
    authDomain: "art-roulette-2ffee.firebaseapp.com",
    databaseURL: "https://art-roulette-2ffee.firebaseio.com",
    projectId: "art-roulette-2ffee",
    storageBucket: "gs://art-roulette-2ffee.appspot.com",
    messagingSenderId: "1037636482050"
};

firebase.initializeApp(config);
//storageService is a reference to firebase storage service (it allows us to use all of the methods firebase makes available for storing data and files)
const storageService = firebase.storage();
// storageRef is a reference to our actual instantiation of that service — it will lead us to your specific database and root file location where things get uploaded.
const storageRef = storageService.ref();

var database = firebase.database();
var auth = firebase.auth();

var uid;


//get the Adjective, we use our nouns list in the database to generate a list of adjectives with Datamuse
function getAdj() {
    database.ref().child("nouns").once("value", function (snapshot) {
        //get a random noun from our database
        var numNouns = snapshot.numChildren();
        var randomNoun = Math.floor(Math.random() * numNouns);
        var nounName = 'noun' + randomNoun;
        var noun = snapshot.child(nounName).val().name;

        //show more like this button
        $('#more-like-adj').css('visibility', 'visible');

        //ajax query URL DataMuse API
        var queryURL = "https://api.datamuse.com//words?rel_jjb=" + noun;

        $.ajax({
            url: queryURL,
            method: "GET"
        }).then(function (response) {
             //get a random word from the Datamuse array
            var randomDataMuse = Math.floor(Math.random() * response.length);
            var dataMuseWord = response[randomDataMuse].word;
            showRandomImage(dataMuseWord, '#adj-pic');
            $('#adjective').text(dataMuseWord);
        });
    })
}

//get the Noun, we use our adjective list in the database to generate a list of nouns with Datamuse
function getNoun1() {
    database.ref().child("adjectives").once("value", function (snapshot) {
        //get a random adjective from our database
        var numAdj = snapshot.numChildren();
        var randomAdj = Math.floor(Math.random() * numAdj);
        var adjName = 'adj' + randomAdj;
        var adj1 = snapshot.child(adjName).val().name;

        //show more like this button
        $('#more-like-noun1').css('visibility', 'visible');

        //ajax query URL Datamuse API
        var queryURL = "https://api.datamuse.com/words?rel_jja=" + adj1;

        $.ajax({
            url: queryURL,
            method: "GET"
        }).then(function (response) {
            //get a random word from the Datamuse array
            var randomDataMuse = Math.floor(Math.random() * response.length);
            var dataMuseWord = response[randomDataMuse].word;
            showRandomImage(dataMuseWord, '#noun1-pic');
            $('#noun1').text(dataMuseWord);
        });
    })
}

//get Noun #2 (same as above)
function getNoun2() {
    database.ref().child("adjectives").once("value", function (snapshot) {
        var numAdj = snapshot.numChildren();
        var randomAdj = Math.floor(Math.random() * numAdj);
        var adjName = 'adj' + randomAdj;
        var adj2 = snapshot.child(adjName).val().name;

        //show more like this button
        $('#more-like-noun2').css('visibility', 'visible');


        //ajax query URL Datamuse API
        var queryURL = "https://api.datamuse.com/words?rel_jja=" + adj2;

        $.ajax({
            url: queryURL,
            method: "GET"
        }).then(function (response) {
            //get a random word from the Datamuse array
            var randomDataMuse = Math.floor(Math.random() * response.length);
            var dataMuseWord = response[randomDataMuse].word;
            showRandomImage(dataMuseWord, "#noun2-pic");
            $('#noun2').text(dataMuseWord);
        });
    })
}

//click listener for More Like This buttons
$(document).on('click', '.more-like-this', function () {
    if (this.id == 'more-like-adj') {

        //hide button, show "Inspirations Improved!"
        $('#more-like-adj').css('visibility', 'hidden');
        $('#ii-adj').css('visibility', 'visible');

        //add the adjective to our database
        database.ref().child("adjectives").once("value", function (snapshot) {
            var numAdjs = snapshot.numChildren();
            database.ref().child('adjectives').child('adj' + numAdjs).update({ name: $('#adjective').text() });
        })
    }
    else if (this.id == 'more-like-noun1') {

        //hide button, show "Inspirations Improved!"
        $('#more-like-noun1').css('visibility', 'hidden');
        $('#ii-noun1').css('visibility', 'visible');

        //add noun1 to our database
        database.ref().child("nouns").once("value", function (snapshot) {
            var numNoun = snapshot.numChildren();
            database.ref().child('nouns').child('noun' + numNoun).update({ name: $('#noun1').text() });
        })
    }
    else if (this.id == 'more-like-noun2') {

        //hide button, show "Inspirations Improved!"
        $('#more-like-noun2').css('visibility', 'hidden');
        $('#ii-noun2').css('visibility', 'visible');

        //add noun2 to our database
        database.ref().child("nouns").once("value", function (snapshot) {
            var numNoun = snapshot.numChildren();
            database.ref().child('nouns').child('noun' + numNoun).update({ name: $('#noun2').text() });
        })
    }
})


//console.log our nouns and adjectives database lists for error checking
database.ref().once("value", function (snapshot) {

    console.log(snapshot.val().nouns);
    console.log(snapshot.val().adjectives);

}, function (errorObject) {
    // Create Error Handling
    console.log("The read failed: " + errorObject.code);
});

function submitEmailForAuth(userEmail, userPass, saveLoginChecked) {
    auth.createUserWithEmailAndPassword(userEmail, userPass).catch(function (error) {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        console.log(error);
        console.log(error.message);
        // ...
    });

    window.localStorage.setItem("art-Roulette-Email", userEmail);
    window.localStorage.setItem("art-Roulette-Pass", userPass);
    window.localStorage.setItem("art-Roulette-SaveLogin", saveLoginChecked);
    window.localStorage.setItem("art-Roulette-Submitted-Email", true)

    if (saveLoginChecked) {
        LoginToServer();
    }
}

function LoginToServer() {
    console.log("logging in!");
    auth.signInWithEmailAndPassword(localStorage.getItem("art-Roulette-Submitted-Email"), localStorage.getItem("art-Roulette-Pass")).catch(function (error) {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        // ...
    });
}


$("#loginButton").on("click",function()
{
    //LoginToServer();
    var userEmail = $("#e-mail-Sub").val();
    var userPass = $("#pass-Sub").val();
    auth.signInWithEmailAndPassword(userEmail, userPass);
    console.log("Signed In!");
});

// Authentication status listener - Jonathan
firebase.auth().onAuthStateChanged(firebaseUser => {
  if(firebaseUser) {
    console.log(firebaseUser);
    console.log("User logged in!");
    uid = firebaseUser.uid;
    $("#userProfileNavbar").removeClass("hide");
    $("#userLogOutButton").removeClass("hide");
    
  }
  else {
    console.log("User not logged in!");
    uid = "";
    $("#userProfileNavbar").addClass("hide");
    $("#userLogOutButton").addClass("hide");
    
  }
});

//Logout button event listener - Jonathan
$("#userLogOutButton").on("click", function() {
  firebase.auth().signOut().then(function() {
    console.log("User signed out!");
    // Sign-out successful.
  }).catch(function(error) {
    // An error happened.
  });
});

$(window).on('load', function () {
    console.log("login: " + localStorage.getItem("art-Roulette-Submitted-Email"));
    console.log("automatic login: " + localStorage.getItem("art-Roulette-SaveLogin"));
    if (!localStorage.getItem("art-Roulette-Submitted-Email")) {
        $("#userLoginModal").show();
    }

    if (localStorage.getItem("art-Roulette-SaveLogin")) {
        $("#user-Login-Modal-Submit").hide();
        LoginToServer();
    }

    $('body').removeClass('fade-out');

});

auth.signOut().then(function () {
    // Sign-out successful.
}).catch(function (error) {
    // An error happened.
    var errorCode = error.code;
    var errorMessage = error.message;
    console.log(error);
    console.log(error.message);
});

$("#user-Error-Modal-Submit").on("click", function () {
    $("#userLoginErrorModal").hide();
    $("#userLoginModal").show();
});


//our modal dialog's submit button clicked - user-Login-Modal-Submit
$("#userSignUpButton").on("click",function() {



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
    if (userEmail === "" || userPass === "") {
        //fill the error title and text
        $("#user-Error-Modal-Title").text("User Error");
        $("#user-Error-Modal-Body").text("please provide both a User Name and a Password");
        $("#userLoginErrorModal").show();

        return;
    }

    auth.signOut().then(function () {
        // Sign-out successful.
    }).catch(function (error) {
        // An error happened.
    });

    submitEmailForAuth(userEmail, userPass, saveLoginChecked);
});



function showRandomImage(searchWord, divID) {
    var queryURL = "https://www.googleapis.com/customsearch/v1?q=" + searchWord + "&cx=008015619189080859829%3Agapxkuki8im&key=AIzaSyAeMljdzFgnEoUvlMjprLYTS5Efr0d-4Sw";
    $(divID).empty();
    $.ajax({
        url: queryURL,
        method: "GET",
        dataType: 'jsonp'
    }).then(function (response) {
        var results = response.items;
        //for (var i = 0; i < 1; i++) { *DO ONLY ONCE FOR TESTING PURPOSES
            var randomImage = $("<img>");
            var sourceArr = results[0].pagemap.cse_image;
            var sourceUrl = sourceArr[0].src;
            randomImage.attr("src", sourceUrl);
            randomImage.attr('width', 200).attr('height', 200).css('border', 'solid 1px black');
            $(divID).append(randomImage)
            $(divID).append("<br>");
        //}
    });
}

// Materialize JavaScript components


$(document).ready(function() {
  // Materialize elements initialization
  $(".fixed-action-btn").floatingActionButton({
    direction: "right"
  });
  $('.collapsible').collapsible();
  $('.modal').modal();
  $('.trigger-modal').modal();
  $('.tooltipped').tooltip();
  $('.tabs').tabs();
  $('textarea#userInterests').characterCounter();

  // Listener for "word generator" button.
  $("#wordButton").on("click", function() {
    getAdj();
    getNoun1();
    getNoun2();
    $('.inspirations-improved').css('visibility', 'hidden');
  });

  // Listener for checkbox on "Settings" modal, shows/hides the user profile bar.
  $("input:checkbox").change(function() {
    if($("#userProfileShowToggle").is(":checked")) {
      $("#userProfileNavbar").removeClass("hide");
    }
    else {
      $("#userProfileNavbar").addClass("hide");
    }
  });

  selectRandomColorSchemeAndApply();
});

// Upload functionatity
document.querySelector('.file-select').addEventListener('change', handleFileUploadChange);
document.querySelector('.file-submit').addEventListener('click', handleFileUploadSubmit);

let selectedFile;
// handleFileUploadChange function gets triggered any time someone selects a new file via the upload via the Choose File upload button
function handleFileUploadChange(e) {
    // selectedFile that will keep track of whatever file a user has input via the Choose File button
  selectedFile = e.target.files[0];
}

function handleFileUploadSubmit(e) {
     
    const uploadTask = storageRef.child(`/images/${selectedFile.name}`).put(selectedFile); //create a child directory called images, and place the file inside this directory
    
    var imagesource = `/images/${selectedFile.name}`;
    uploadTask.on('state_changed', (snapshot) => {
    // Observe state change events such as progress, pause, and resume
    }, (error) => {
    // Handle unsuccessful uploads
        console.log(error);
    }, () => {
    // Do something once upload is complete
        uploadTask.snapshot.ref.getDownloadURL().then(function(downloadURL) {
            console.log('File available at', downloadURL);
            sourceImgUrl = downloadURL;
          });
        console.log('success');
    });

    var storage = firebase.storage();
    var pathReference = storage.ref('images/stars.jpg');
    
    storageRef.child('images/stars.jpg').getDownloadURL().then(function(url) {
        // `url` is the download URL for 'images/stars.jpg'
      
        // This can be downloaded directly:
        var xhr = new XMLHttpRequest();
        xhr.responseType = 'blob';
        xhr.onload = function(event) {
          var blob = xhr.response;
        };
        xhr.open('GET', url);
        xhr.send();
      
        // Or inserted into an <img> element:
        var img = $(".carousel-item").eq(i);
        img.src = url;
        i++;
      }).catch(function(error) {
        // Handle any errors
      });

    
  }


function selectRandomColorSchemeAndApply()
{
    console.log("selectRandom");
    var randoScheme = Math.floor(Math.random() * ColorSchemeArray.length); 
    $("#headerColor").addClass(ColorSchemeArray[randoScheme][0][0]);
    $("#headerColor").addClass(ColorSchemeArray[randoScheme][0][1]);

    //console.log();
    $(".card-panel").each(function() {
        $(this).addClass(ColorSchemeArray[randoScheme][1][0]);
        $(this).addClass(ColorSchemeArray[randoScheme][1][1]);
    });

    $(".collapsible-header").each(function() {
        $(this).addClass(ColorSchemeArray[randoScheme][2][0]);
        $(this).addClass(ColorSchemeArray[randoScheme][2][1]);
    });

    console.log(ColorSchemeArray[randoScheme][2][0]);
    console.log(ColorSchemeArray[randoScheme][2][1]);

    $(".collapsible-body").each(function() {
        $(this).addClass(ColorSchemeArray[randoScheme][3][0]);
        $(this).addClass(ColorSchemeArray[randoScheme][3][1]);
    });
    

}

//section for the random color generation
var currentBackgroundIndex;
var ColorSchemeArray;

ColorSchemeArray = [
    [
        ["teal","darken-4"],
        ["teal","darken-3"],
        ["teal","darken-1"],
        ["teal","lighten-3"],
    ],
    [
        ["cyan","darken-4"],
        ["green","lighten-1"],
        ["blue","darken-4"],
        ["blue","accent-1"],
    ],
    [
        ["orange","accent-1"],
        ["orange","darken-1"],
        ["blue","darken-2"],
        ["light-blue","accent-4"],
    ],
    [
        ["red","accent-4"],
        ["indigo","darken-1"],
        ["blue","darken-2"],
        ["light-blue","accent-4"],
    ],
    [
        ["grey","lighten-1"],
        ["grey","darken-4"],
        ["deep-orange","lighten-2"],
        ["yellow","lighten-1"],
    ],
    [
        ["blue-grey","darken-4"],
        ["blue-grey","darken-1"],
        ["orange","darken-1"],
        ["yellow","lighten-1"],
    ],

]


selectRandomColorSchemeAndApply();

