$(document).ready(function(){
        
    const $inputsConFondo = $('#name, #msg, #mail, #password');
    $inputsConFondo.addClass('focusDisabled'); // There is no focus in any field until you click on it
    
    const $submit = $('input[type="submit"]');
    $submit.attr('disabled','disabled').addClass("disabled");
    
    const $fetch = $('#fetch');
  
    


    $submit.click(function(e){
        e.preventDefault(); 
      /* When pressing the submit button we will decide what to do so we use the function
      preventDefault to do nothing that comes done by default */
      
        const inputData = { // Save all the info introduced through the inputs in an object: inputData(Key-value)
            name: $('#name').val(),
            email: $('#email').val(),
            password: $('#password').val(),
            cars: { // This is an object inside the main object
                company: $('#company').val(),
                quantity: parseInt($('input[name=cantidad]:checked').val())
            },
            message: $('#msg').val()
        }
// AJAX POST, explicit version, in other examples this is done using a shrothand ($get for example)
        $.ajax({
/* POST - Manda a - URL - lo que te digo en - DATA */
            url: 'https://proyecto-clasenico-29-01-19.firebaseio.com/.json', // firebase API - non relational database
            type: "POST", 
/* Due to inputData is an objet with no methods, only contains the relevant information we want to send, then
is like a jSon object --> stringify to send it to the server */
            data: JSON.stringify(inputData),
// In case the data was sent successfully we show an alert (data is just the message the server send saying OK)
            success: function (data) {
                console.log(data);
                alert('Su formulario ha sido enviado');
            },
            error: function(error) {
                console.log(error);
            }
        });
    });






/* When we click this button we want to show the results so we need to get data from the database and hide
all the content to show only the new information we are looking for */
    $fetch.click(function() {
        $('#fetch').hide();  // Hide the button
        $.ajax({
            url: 'https://proyecto-clasenico-29-01-19.firebaseio.com/.json', // .json is the way the API works 
            type: "GET",
            success: function (data) { // data is the json with the invo the server returns
                $('#formulario').hide(); // Hide the form
                $('.mainTitle').hide(); // Hide the form
                console.log(data);
        // Show in the HTML all the new info we want
                $('#responsesContainer').append('<h1>Responses from all car owners:</h1>');
                Object.values(data).map(function(response) {
        /* Take the json (data) and transform it into an array of object (Object.values), then iterate the object's 
        array (map) and save it each time into "response" */
                    $('#responsesContainer')
                    .append(`<h3>${response.name}</h3>`)
                    .append(`<li>Compañía: ${response.cars.company}</li>`)
                    .append(`<li>Cantidad: ${response.cars.quantity}</li>`);
                });
        /* Similar than before but now we are going to save only those objects that contains some specific information
        in one of the fields - So, we are saving the complete objects that contains the company fiat in one constant  */
                const fiatUsers = Object.values(data).filter(function(response) {
                    return response.cars.company == 'fiat';
                });
                console.log("fiatUsers contains: " + fiatUsers);
                if (fiatUsers.length > 0) {
                    $('#fiatUsers').append('<h1>Los siguientes usuarios poseen Fiat:</h1>')
                    fiatUsers.map(function(user) { // Iterate the array fiatUsers
                        $('#fiatUsers')
                        .append(`<h3>${user.name}</h3>`)
                        .append(`<li>Cantidad: ${user.cars.quantity}<h2>`);
                    });

        /* We create a function to calculate the total of fiats
            We are goin to use reduce method that have 2 parameters, the callback function and the initial value,
            getSumOfCards and 0 in our case.
            As getSumOfCards goes inside the reduce method, there is no need to call it as:
            getSumOfCards(something, something) 
            This is due to reduce methods knows that the callback function always has to be like the following:
            function(total, currentValue, currentIndex, arr) - The 2 first are required, others 2 are optional
            */
                    function getSumOfCars(total, response) { 
                        return total + response.cars.quantity;
                    }
                    const amountOfFiatUsers = fiatUsers.reduce(getSumOfCars, 0);
                    $('#fiatUsers').append(`<p>Total amount of Fiat Cars: ${amountOfFiatUsers}</p>`);
                                
                }
            },

            // Case the AJAX call fails show an error
            error: function(error) {
                console.log(error);
            }
        });
    })





    const $reset = $('input[type="reset"]');
    $reset.click(function(){
        /* When the reset button is pressed, the submit button has to be disabled and the css propierties 
        must be changed */
        $submit.attr('disabled','disabled').addClass("disabled");
        // $inputsConFondo contains elements with ids #name, #email, #password and #msg. We remove the focus
        // of all of them until someone clicks again on them.
        $inputsConFondo.removeClass('focusValidado').addClass('focusDisabled');
    });

    
    // When writing in name:
    $('#name').keyup(function() {
    // trim: Remove whitespace from both sides of a string.
    // The "$" before trim is because trim is a function of jQuery. It is the same that happens with AJAX
        if ($.trim($('#name').val()) !=='') { 
            // If the name has something different than spaces then change the css properties
            $('#name').removeClass('focusDisabled').addClass('focusValidado');
        } 
        else {
            if ($('#name').hasClass('focusValidado')) {
                $('#name').removeClass('focusValidado').addClass('focusDisabled');
            }
        }
    })


    $('#msg').keyup(function() {
        if ($.trim($('#msg').val()) !=='') {
            $('#msg').removeClass('focusDisabled').addClass('focusValidado');
        } 
        else {
            if ($('#msg').hasClass('focusValidado')) {
                $('#msg').removeClass('focusValidado').addClass('focusDisabled');
            }
        }
    })


    $('#password').keyup(function() {
        if ($.trim($('#password').val().length) > 7) {
            $('#password').removeClass('focusDisabled').addClass('focusValidado');
        } 
        else {
            if ($('#password').hasClass('focusValidado')) {
                $('#password').removeClass('focusValidado').addClass('focusDisabled');
            }
        }
    })



    // Needed for the email
    const regexFilterForEmail = /^([\w-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([\w-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$/;

    $('#mail').keyup(function() {
        if (regexFilterForEmail.test($.trim($('#mail').val()))) {
            $('#mail').removeClass('focusDisabled').addClass('focusValidado');
        } 
        else {
            if ($('#mail').hasClass('focusValidado')) {
                $('#mail').removeClass('focusValidado').addClass('focusDisabled');
            }
        }
    })


    $('form').keyup(function() {
        let $name =  $.trim($('#name').val());
        let $message = $.trim($('#msg').val());
        let $email = $.trim($('#mail').val());
        let $password = $.trim($('#password').val());
        if ($name != '' && $message != "" && $password.length > 7 && regexFilterForEmail.test($email) ) {
            $submit.removeAttr("disabled").removeClass("disabled");
        } 
        else {
            if (!$submit.hasClass('disabled')) {
                $submit.addClass("disabled").attr('disabled','disabled');
            }
        }
    })





    });