function tplawesome(e, t) { res = e; for (var n = 0; n < t.length; n++) { res = res.replace(/\{\{(.*?)\}\}/g, function (e, r) { return t[n][r] }) } return res }

//Client-ID: 589676684899-p08f2re4409ea4tib8lttrfnphuf9gqm.apps.googleusercontent.com
//Client Secret: bGuBms5ugtVAan9P7PzuxE3x

$(function () {
    $("form").on("submit", function (e) {
        e.preventDefault();
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

    $.get("https://www.googleapis.com/youtube/v3/channels", {
       part: 'contentDetails',
       forUsername: 'Google',
       key: 'AIzaSyA_xeqjFDYAkPB7owFvAwxaVjJRaXBPenA'
   },
   function (data) {
       $.each(data.items, function (i, item) {
           pid = item.contentDetails.relatedPlaylists.favorites;
           getVids(pid);
       });
   });

    //Get Videos
    function getVids(pid) {
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
        //youtube api loaded
    });
}