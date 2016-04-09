function tplawesome(e, t) { res = e; for (var n = 0; n < t.length; n++) { res = res.replace(/\{\{(.*?)\}\}/g, function (e, r) { return t[n][r] }) } return res }

//Client-ID: 589676684899-p08f2re4409ea4tib8lttrfnphuf9gqm.apps.googleusercontent.com
//Client Secret: bGuBms5ugtVAan9P7PzuxE3x

$(function () {
    $("form").on("submit", function (e) {
        e.preventDefault();
        $("#favoritesList").css("display", "none");
        $("#searchResults").css("display", "block");
        //encodeURIComponent().replace(/%20/g, "+")
        var query = $("#tbSearch").val()

        //set up request
        var request = gapi.client.youtube.search.list({
            part: "snippet",
            type: "video",
            q: query,
            maxResults: 5,
            order: "rating",
            publishedAfter: "2015-01-01T00:00:00Z",
            location: "42.321742, -92.607174",
            locationRadius: "500mi"
        });

        //execute request
        request.execute(function (response) {
        //console.log(response);
        var results = response.result;
            $.each(results.items, function (index, item) {
                $.get("item.html", function (data) {
                    $("#searchResults").append(tplawesome(data,
                        [{
                            "title": item.snippet.title,
                            "videoid": item.id.videoId,
                            "channelid": item.snippet.channelId,
                            "channeltitle": item.snippet.channelTitle
                        }]));
                    //console.log(item.id.videoId);
                });
            });
        });

    });
});

function getDetails(videoid) {
    //show/hide
    $("#favoritesList").css("display", "none");
    $("#searchResults").css("display", "block");
    var request = gapi.client.youtube.commentThreads.list({
        part: "snippet",
        videoId: videoid
    });

    request.execute(function (response) {
        //console.log(response);
        var results = response.result;
        $.each(results.items, function (index, item) {
            console.log(item);
            $.get("details.html", function (data) {
                $("#searchResults").append(tplawesome(data,
                    [{
                        "comments": item.snippet.topLevelComment.snippet.textDisplay,
                        "author": item.snippet.topLevelComment.snippet.authorDisplayName,
                        "likes": item.snippet.topLevelComment.snippet.likeCount
                    }]));
            });
        });
    });
}

function getFavorites() {
    //show/hide divs
    $("#searchResults").css("display", "none");
    $("#favoritesList").css("display", "block");

    //get favorites for my account? using Google for testing
    $.get("https://www.googleapis.com/youtube/v3/channels", {
       part: 'contentDetails',
       forUsername: 'jrose90404',
       key: 'AIzaSyA_xeqjFDYAkPB7owFvAwxaVjJRaXBPenA'
   },
   function (data) {
       $.each(data.items, function (i, item) {
           pid = item.contentDetails.relatedPlaylists.likes;
           getVids(pid);
       });
   });

    //Get Videos
   function getVids(pid) {
       console.log(pid);
        $.get("https://www.googleapis.com/youtube/v3/playlistItems", {
            part: 'snippet',
            maxResults: 20,
            playlistId: pid,
            key: 'AIzaSyA_xeqjFDYAkPB7owFvAwxaVjJRaXBPenA'
        },
        function (data) {
            var results;
            $.each(data.items, function (i, item) {
                results = '<li>' + item.snippet.title + '</li>';
                $('#favoritesList').append(results);
            });
        });
}

//INITIAL ATTEMPT == FAIL => DO NOT PROVIDE A RESPONSE BODY
//    var request = gapi.client.youtube.channels.list({
//        part: "contentDetails",
//        forUsername: "Google"
//    });

//    request.execute(function (response) {
//        var results = response.result;
//        $.each(results.items, function (index, item) {
//            console.log(item);
//            $.get("favorites.htm", function (data) {
//                $("#favoritesList").append(tplawesome(data,
//                    [{
//                        "favorites": item.contentDetails.relatedPlaylists.favorites
//                    }]));
//            });
//        });
//    });
}

function addToFavorites(videoid) {
    var request = gapi.client.youtube.videos.rate({
       id: videoid,
       rating: "like"
   });}

function removeFromFavorites(videoid) {
    var request = gapi.client.youtube.videos.rate({
        id: videoid,
        rating: "dislike"
    });
}

function init() {
    gapi.client.setApiKey("AIzaSyA_xeqjFDYAkPB7owFvAwxaVjJRaXBPenA");
    gapi.client.load("youtube", "v3", function () {
        //api loaded
    });
}

function authorize() {
    // The client ID is obtained from the Google Developers Console
    // at https://console.developers.google.com/.
    // If you run this code from a server other than http://localhost,
    // you need to register your own client ID.
    var OAUTH2_CLIENT_ID = '589676684899-p08f2re4409ea4tib8lttrfnphuf9gqm.apps.googleusercontent.com';
    var OAUTH2_SCOPES = ['https://www.googleapis.com/auth/youtube'];

    // Upon loading, the Google APIs JS client automatically invokes this callback.
    googleApiClientReady = function () {
        gapi.auth.init(function () {
            window.setTimeout(checkAuth, 1);
        });
    }

    // Attempt the immediate OAuth 2.0 client flow as soon as the page loads.
    // If the currently logged-in Google Account has previously authorized
    // the client specified as the OAUTH2_CLIENT_ID, then the authorization
    // succeeds with no user intervention. Otherwise, it fails and the
    // user interface that prompts for authorization needs to display.
    function checkAuth() {
        gapi.auth.authorize({
            client_id: OAUTH2_CLIENT_ID,
            scope: OAUTH2_SCOPES,
            immediate: true
        }, handleAuthResult);
    }

    // Handle the result of a gapi.auth.authorize() call.
    function handleAuthResult(authResult) {
        if (authResult && !authResult.error) {
            // Authorization was successful. Hide authorization prompts and show
            // content that should be visible after authorization succeeds.
            $('.pre-auth').hide();
            $('.post-auth').show();
            loadAPIClientInterfaces();
        } else {
            // Make the #login-link clickable. Attempt a non-immediate OAuth 2.0
            // client flow. The current function is called when that flow completes.
            $('#login-link').click(function () {
                gapi.auth.authorize({
                    client_id: OAUTH2_CLIENT_ID,
                    scope: OAUTH2_SCOPES,
                    immediate: false
                }, handleAuthResult);
            });
        }
    }

    // Load the client interfaces for the YouTube Analytics and Data APIs, which
    // are required to use the Google APIs JS client. More info is available at
    // http://code.google.com/p/google-api-javascript-client/wiki/GettingStarted#Loading_the_Client
    function loadAPIClientInterfaces() {
        gapi.client.load('youtube', 'v3', function () {
            handleAPILoaded();
        });
    }
}