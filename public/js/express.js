jQuery(document).ready(function($) {
    $( "#express" ).submit(function( event ) {
        var updateQueryStringParameter = function(uri, key, value) {
            var re = new RegExp("([?&])" + key + "=.*?(&|$)", "i");
            var separator = uri.indexOf('?') !== -1 ? "&" : "?";
            if (uri.match(re)) {
                return uri.replace(re, '$1' + key + "=" + value + '$2');
            }
            else {
                return uri + separator + key + "=" + value;
            }
        };

        var url = updateQueryStringParameter('/express', 'q', $('#search-input').val());

        event.preventDefault();
        $.get(url)
        .done(function( data ) {
            var win = window.open(data, '_blank');
            if (win) {
                //Browser has allowed it to be opened
                win.focus();
            } else {
                //Browser has blocked it
                alert('Please allow popups for this site');
            }
        });
    });
});
