// Shorthand for $( document ).ready()
$(function() {
    $("#search-button").click(function() {
        var keywords = $("#search-input").val();
        window.location.replace("http://localhost:9000/amazon/search?keywords=" + keywords);
    });
});
