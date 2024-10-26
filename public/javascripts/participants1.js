//participants client side js

$(document).ready(function() {

    $('#update-button').addClass('disabled');

    populateEmail();
    $('#register-operation').on('click', function() {
        var $formGroup = $('#database-entry-form-group');
        $formGroup.slideToggle('slow', function() {
            if ($formGroup.is(':visible')) {
                $('#register-operation').text('HIDE REGISTER FORM FORM');
            } else {
                $('#register-operation').text('ADD DELETE UPDATE ENTRY');
            }
        });
    }); //end slide toggle

    //add a new entry 
    $('#add-button').on('click', function(e) {
        e.preventDefault();
        console.log('add button clicked');

        let bodyData = {
            email: $('#email').val(),  // Correctly reference the email value
            personalInfo: {
                firstname: $('#firstname').val(),
                lastname: $('#lastname').val(),
                dob: $('#dob').val().replace(/-/g, '/')  // Convert YYYY-MM-DD to YYYY/MM/DD
            },
            work: {
                companyname: $('#companyname').val(),
                salary: parseInt($('#salary').val(), 10),  // Ensure salary is an integer
                currency: $('#currency').val()
            },
            home: {
                country: $('#country').val(),
                city: $('#city').val()
            }
        };

        console.log("Sending data", bodyData);

        fetch('/participants', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(bodyData)
        })
        .then(response => {
            if (!response.ok) {
                return response.json().then(error => {
                    throw new Error(error.message || 'Unknown server error');
                });
            }
            return response.json();
            
        })
        .then(data => {
            console.log('Data:', data);
            $('#display-area').text(JSON.stringify(data));
            alert(data.message);
            populateEmail();
        })
        .catch(error => {
            console.error('Error:', error);
            $('#display-area').text('Error: ' + error.message);
        });
    }); //end of add new entry



    //Get all data 
    $('#list-of-all').on('click', function() {

        fetch('/participants/', {
            method:"GET",
            headers:{'Content-Type': 'application/json'}
        })
        .then(response=>{
            if (!response.ok) {
                throw Error(response.statusText);
            }
            return response.json();
        })
        .then(data=> {
            console.log(data.data);
            $('#display-area').text(JSON.stringify(data.data));
            //create a dynamic table 
            //first let me find array lenght 
            let arrayLength = data.data.length;
            console.log(arrayLength);
            //delete the table
            $('#user-table tbody').empty();
            $('#user-table thead').empty();
            //create the table 
            $('#user-table thead').append(`<tr><th>Full Name</th><th>Dob</th><th>Company Name</th><th>Salary</th><th>Currency</th><th>Location</th><th>Email</th></tr>`);
            for (let i = 0; i < arrayLength; i++) {
                
                const fullName=data.data[i].personalInfo.firstname+" "+data.data[i].personalInfo.lastname;
                const dob=data.data[i].personalInfo.dob;
                const company=data.data[i].work.companyname;
                const salary=data.data[i].work.salary;
                const currency=data.data[i].work.currency;
                const location=data.data[i].home.city+", "+data.data[i].home.country;
                const email=data.data[i].email;
                
                $('#user-table tbody').append(`<tr><td>${fullName}</td><td>${dob}</td><td>${company}</td><td>${salary}</td><td>${currency}</td><td>${location}</td><td>${email}</td></tr>`);
            }
            
        })
        .catch(error=> {
            console.error('Error:', error);
        });


    }); //end of get all data

    $('#personal-details-of-all').on('click', function() {
        fetch('/participants/details', {
            method:"GET",
            headers:{'Content-Type': 'application/json'}

        })
        .then(response=>{
            if (!response.ok) {
                throw Error(response.statusText);
            }
            return response.json();
        })
        .then(data=> {
            console.log(data);
            $('#display-area').text(JSON.stringify(data));
            let arrayLength = data.length;
            console.log(arrayLength);
            //delete the table
            $('#user-table tbody').empty();
            $('#user-table thead').empty();
            //create the table 
            $('#user-table thead').append(`<tr><th>Full Name</th><th>Dob</th></tr>`);
            for (let i = 0; i < arrayLength; i++) {
                
                const fullName=data[i].firstname+" "+data[i].lastname;
                const dob=data[i].dob;
                
                
                $('#user-table tbody').append(`<tr><td>${fullName}</td><td>${dob}</td></tr>`);
            }
        })
        .catch(error=> {
            console.error('Error:', error);
        });
    }); //end of personal details of all

    // work details of a participants  by email

    $('#a-person-work-details').on('click',function(e) {
        e.preventDefault();
        let email=$('#email-input').val();
        console.log(email);

        fetch(`/participants/work/${email}`, {
            method:"GET",
            headers:{'Content-Type': 'application/json'}
        } )
        .then(response=> {
            if (!response.ok) {
                throw Error(response.statusText);
            }
            return response.json();
        })
        .then(data=> {
            console.log(data);
            $('#display-area').text(JSON.stringify(data));
            //delete the table
            $('#user-table tbody').empty();
            $('#user-table thead').empty();
            //create the table 
            $('#user-table thead').append(`<tr><th>Company Name</th><th>Salary</th><th>Currency</th></tr>`);
            
                
            const companyname=data.companyname;
            const salary=data.salary;
            const currency=data.currency;
            $('#user-table tbody').append(`<tr><td>${companyname}</td><td>${salary}</td><td>${currency}</td></tr>`);

            
            
            
        })
        .catch(error=> {
            console.error('Error:', error);
        });
    })//end of work details

    $('#a-person-home-details').on('click',function(e) {
        e.preventDefault();
        let email=document.querySelector('#email-input').value;
        console.log(email);
        fetch(`/participants/home/${email}`, {
            method:"GET",
            headers:{'Content-Type': 'application/json'}
        } )
        .then(response=> {
            if (!response.ok) {
                throw Error(response.statusText);
            }
            return response.json();
        })
        .then(data=> {
            console.log(data);
            $('#display-area').text(JSON.stringify(data));
            //create table 
            let arrayLength = data.length;
            console.log(arrayLength);
            //delete the table
            $('#user-table tbody').empty();
            $('#user-table thead').empty();
            //create the table 
            $('#user-table thead').append(`<tr><th>City</th><th>Country</th></tr>`);
            
                
            const city=data.city;
            const country=data.country;
            
            
            $('#user-table tbody').append(`<tr><td>${city}</td><td>${country}</td></tr>`);
            
        })
        .catch(error=> {
            console.error('Error:', error);
        });

    })//end of home details

    //get a participants details by email

    $('#a-person-details').on('click',function(e) {
        e.preventDefault();
        let email=document.querySelector('#email-input').value;
        console.log(email);
        fetch(`/participants/details/${email}`, {
            method:"GET",
            headers:{'Content-Type': 'application/json'}
        } )
        .then(response=> {
            if (!response.ok) {
                throw Error(response.statusText);
            }
            return response.json();
        })
        .then(data=> {
            console.log(data);
            $('#display-area').text(JSON.stringify(data));
            //delete the table
            $('#user-table tbody').empty();
            $('#user-table thead').empty();
            //create the table 
            $('#user-table thead').append(`<tr><th>Email</th><th>fullName</th><th>DOB</th></tr>`);
            
              
            const fullName=data.data.firstname+" "+data.data.lastname;
            const dob=data.data.dob;
            $('#user-table tbody').append(`<tr><td>${email}</td><td>${fullName}</td><td>${dob}</td></tr>`);
        })
        .catch(error=> {
            console.error('Error:', error);
        });
    }) //end of get a participants details by email

   //delete a participants by email
   $('#delete-button').on('click',function(e) {
    e.preventDefault();
    let email=document.querySelector('#email-input').value;
    console.log(email);
    let confirmed=confirm(`Are you sure you want to delete  participant with email: ${email}?`);

    if (!confirmed) {
        return;
    }else {
        console.log(`Deleting participant with email: ${email}`);
        fetch(`/participants/${email}`, {
            method:'DELETE',
            headers:{'Content-Type': 'application/json'}
        })
        .then(response=> {
            if (!response.ok) {
                throw Error(response.statusText);
            }
            return response.json();
        })
        .then(data=> {
            console.log("response from server",data);
            populateEmail();
            alert("Participant deleted successfully");
        })
        .catch(error=> {
            console.error('Error:', error);
            alert("An error occurred while deleting the participant. Please try again later.");
        });      

    }   
    
}) //end of delete a participants by email

//send to form a participants by email 
$('#send-to-form').on('click',function(e) {
    e.preventDefault();
    let emailToForm=document.querySelector('#email-input').value;
    fetch(`/participants/details/${emailToForm}`, {
        method:"GET",
        headers:{'Content-Type': 'application/json'}
    } )
    .then(response=> {
        if (!response.ok) {
            throw Error(response.statusText);
        }
        return response.json();
    })
    .then(data=> {
        console.log(data);
        const personToUpdate=data.data;
        console.log(personToUpdate);
        //send to form
        $("#firstname").val(personToUpdate.firstname);
        $("#lastname").val(personToUpdate.lastname);
        $("#dob").val(personToUpdate.dob ? formatDOB(personToUpdate.dob) : '');
        $("#email").val(personToUpdate.email);
        $("#salary").val(personToUpdate.work.salary);
        $("#currency").val(personToUpdate.work.currency);
        $("#city").val(personToUpdate.home.city);
        $("#country").val(personToUpdate.home.country);
        $("#companyname").val(personToUpdate.work.companyname);

        //enable updatebutton
        $("#update-button").removeClass("disabled");
        

        
    })
    .catch(error=> {
        console.error('Error:', error);
    }); //end of send to form   

    
})

$(document).ready(function() {
    // Initially disable the update button
    $('#update-button').addClass('disabled');

    // Event listener to fetch and populate form
    $('#send-to-form').on('click', function(e) {
        e.preventDefault();
        let emailToForm = $('#email-input').val();
        fetch(`/participants/details/${emailToForm}`, {
            method: "GET",
            headers: {'Content-Type': 'application/json'}
        })
        .then(response => {
            if (!response.ok) {
                throw Error(response.statusText);
            }
            return response.json();
        })
        .then(data => {
            const personToUpdate = data.data;
            $("#firstname").val(personToUpdate.firstname);
            $("#lastname").val(personToUpdate.lastname);
            //$("#dob").val(personToUpdate.dob ? formatDOB(personToUpdate.dob) : '');
            $("#dob").val(formatDateForDisplay(personToUpdate.dob));  // Format for display

            $("#email").val(personToUpdate.email);
            $("#salary").val(personToUpdate.work.salary);
            $("#currency").val(personToUpdate.work.currency);
            $("#city").val(personToUpdate.home.city);
            $("#country").val(personToUpdate.home.country);
            $("#companyname").val(personToUpdate.work.companyname);

            // Enable the update button
            $("#update-button").removeClass('disabled');
        })
        .catch(error => {
            console.error('Error:', error);
        });
    });

    // Setup update event listener once
    $('#update-button').on('click', function(e) {
        e.preventDefault();

        if ($(this).hasClass('disabled')) {
            alert('Update is disabled.');
            return; // Stop here if button is disabled
        }

        let confirmed = confirm(`Are you sure you want to update the participant with this data?`);
        if (!confirmed) {
            console.log('Update cancelled by user.');
            return;
        }

        let email = $('#email').val();
        let updatedData = {
            email: email,
            personalInfo: {
                firstname: $('#firstname').val(),
                lastname: $('#lastname').val(),
                //dob: $('#dob').val()
                dob: prepareDateForServer($('#dob').val())  // Prepare for server
            },
            work: {
                companyname: $('#companyname').val(),
                salary: parseInt($('#salary').val(), 10),
                currency: $('#currency').val()
            },
            home: {
                country: $('#country').val(),
                city: $('#city').val()
            }
        };

        fetch(`/participants/${email}`, {
            method: "PUT",
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(updatedData)
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to update participant');
            }
            return response.json();
        })
        .then(data => {
            console.log('Participant updated successfully:', data);
            alert('Participant updated successfully!');
            $('#update-button').addClass('disabled');
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Error updating participant: ' + error.message);
        });
    });
});




    

});


//fill email input dynamically

async function populateEmail() {
    

    fetch('/participants/', {
        method:"GET",
        headers:{'Content-Type': 'application/json'}
    })
    .then(response=>{
        if (!response.ok) {
            throw Error(response.statusText);
        }
        return response.json();
    })
    .then(data=> {
        console.log(data.data);
        $('#display-area').text(JSON.stringify(data.data));
        //create a dynamic table 
        //first let me find array lenght 
        let arrayLength = data.data.length;
        console.log(arrayLength);
        //delete selection 
        $('#email-input').empty();
        //refill selection  
       
        for (let i = 0; i < arrayLength; i++) {            
            
            const email=data.data[i].email;
            
            $('#email-input').append(`<option value="${email}"> ${email}</option> `);
        }
        
    })
    .catch(error=> {
        console.error('Error:', error);
    });

    }
    

// Helper function to format DOB
function formatDOB_orj(dob) {
    var dateParts = dob.split("/");
    return `${dateParts[0]}-${dateParts[1].padStart(2, '0')}-${dateParts[2].padStart(2, '0')}`;
}


function formatDOB_1(dob) {
    if (!dob) {
        console.error("Invalid or missing DOB");
        return "";  // Return an empty string or any other default value as needed
    }

    var dateParts = dob.split("/");
    if (dateParts.length < 3) {
        console.error("DOB format is incorrect", dob);
        return dob;  // Return the original dob or handle accordingly
    }

    try {
        return `${dateParts[0]}-${dateParts[1].padStart(2, '0')}-${dateParts[2].padStart(2, '0')}`;
    } catch (error) {
        console.error("Error formatting DOB: ", dob, error);
        return dob;  // Return the original dob if formatting fails
    }
}


function formatDateForDisplay(dateStr) {
    if (!dateStr) return '';
    return dateStr.replace(/\//g, '-');  // Replace slashes with dashes
}


function prepareDateForServer(dateStr) {
    if (!dateStr) return '';
    return dateStr.replace(/-/g, '/');  // Replace dashes with slashes
}



function formatDOB(dob) {
    if (!dob) {
        console.error("Invalid or missing DOB");
        return "";  // Return an empty string or handle accordingly
    }

    // Replace all dashes with slashes if present to maintain consistency
    dob = dob.replace(/-/g, '/');

    var dateParts = dob.split("/");
    if (dateParts.length < 3) {
        console.error("DOB format is incorrect", dob);
        return dob;  // Return the original dob or handle accordingly
    }

    try {
        return `${dateParts[0]}-${dateParts[1].padStart(2, '0')}-${dateParts[2].padStart(2, '0')}`;
    } catch (error) {
        console.error("Error formatting DOB: ", dob, error);
        return dob;  // Return the original dob if formatting fails
    }
}

