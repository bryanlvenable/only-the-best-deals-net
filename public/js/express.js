jQuery(document).ready(function($) {
    $( "#express" ).submit(function( event ) {
        event.preventDefault();
        $.get("/express?q=hammock")
        .done(function( data ) {
            console.log( "Data Loaded: " + data );
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
