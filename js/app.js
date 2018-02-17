(function() {
  // The variables
  const $overlay = $('<div id="overlay"></div>');
  const form = document.querySelector('form');
  let box = [];
  let employeeClicked;
  let modal = `
    <div class="card">
      <span class="close">&times</span>
      <img src="" class="overlay-image">
      <div class="container">
        <h4 id="name"></h4>
        <p id="user-name">................</p>
        <p id="user-mail"></p>
        <p id="cell-number">..............</p>
        <p id="address">......................................</p>
        <p id="birthdate">.....................</p>      
        <span class="slide left">&#x2190</span>
        <span class="slide right">&#x2192</span>      
      </div>
    </div>
  `;

  // Constructing overlay and attaching it to page
  $overlay.html(modal);
  $overlay.appendTo(document.body);

  // function for capitalizing first letter first- and last-name
  function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  // Formatting data for modal window depending on which employee was clicked on
  function formattingData( clickedOn ) {
    const photo = clickedOn.firstElementChild;
    const name = photo.nextElementSibling.firstElementChild;
    const username = name.nextElementSibling.nextElementSibling.nextElementSibling; 
    const userEmail = name.nextElementSibling;
    const phone = username.nextElementSibling;
    const address = phone.nextElementSibling;
    const dob = address.nextElementSibling;
    
    $('.overlay-image').attr('src', photo.getAttribute('src'));
    $('#name').text(name.textContent);
    $('#user-name').text(username.textContent);
    $('#user-mail').text(userEmail.textContent);
    $('#cell-number').text(phone.textContent);
    $('#address').text(address.textContent);
    $('#birthdate').text(dob.textContent);
  }

  // Requesting data and constructing html for each employee
  $.ajax({
    url: 'https://randomuser.me/api/?results=12&nat=us,gb,ca',
    dataType: 'json',
    success: function(data) {    
      $.each(data.results, function(i, employee) {
        let fName = employee.name.first;
        let lName = employee.name.last;
        fName = capitalizeFirstLetter(fName);
        lName = capitalizeFirstLetter(lName);
        box += `
          <div class="box">
            <img src="${employee.picture.large}" class="picture" alt="employee">
            <div class="details">
              <h4 class="employee">${fName} ${lName}</h4>
              <p class="info">${employee.email}</p>
              <p class="info">${employee.location.city}</p>
              <p class="info hidden">${employee.login.username}</p>
              <p class="info hidden">${employee.phone}</p>
              <p class="info hidden">${employee.location.street}, ${employee.location.city}, ${employee.location.state}, ${employee.location.postcode}</p>
              <p class="info hidden">Birthday: ${employee.dob}</p>            
            </div>   
          </div>
        `;      
      });
      $('.wrapper').html(box);
    }
  });

  // -------------------------- Click Handlers ----------------------------------
  // shows overlay and modal with data when click on any employee
  $('.wrapper').click(function(e) {
    if (e.target.className === 'picture' || e.target.className === 'details') {
      employeeClicked = e.target.parentNode;
      formattingData(employeeClicked);
    } else if (e.target.className === 'employee' || e.target.className === 'info') {
      employeeClicked = e.target.parentNode.parentNode;
      formattingData(employeeClicked);
    } else if (e.target.className === 'box') {
      employeeClicked = e.target;
      formattingData(employeeClicked);
    } else {
      return;  
    }
    $overlay.show();
  });

  // Closes overlay and modal
  $('.close').click(function() {
    $overlay.hide();
  });

  // Moves back through the list of employees on modal window
  $('.left').click(function() {
    if (employeeClicked.previousElementSibling) {
      formattingData(employeeClicked.previousElementSibling);    
      employeeClicked = employeeClicked.previousElementSibling;
    }
  });

  // Moves forth through the list of employees on modal window  
  $('.right').click(function() {
    if (employeeClicked.nextElementSibling) {
      formattingData(employeeClicked.nextElementSibling);
      employeeClicked = employeeClicked.nextElementSibling;
    }
  });

  // When hit 'Enter' shows the employee searched by name or username
  form.addEventListener('submit', function(e) {
    e.preventDefault();
    const searchTerm = form.firstElementChild.value.toLowerCase();
    const employees = document.querySelectorAll('.box');
    for (let i = 0; i < employees.length; i++) {
      let searchParameter = '';
      let employeeName = employees[i].lastElementChild.firstElementChild;
      let username = employeeName.nextElementSibling.nextElementSibling.nextElementSibling;
      searchParameter += employeeName.textContent.toLowerCase() + username.textContent;
      if (!searchParameter.includes(searchTerm)) {
        employees[i].style.display = 'none';
      } 
    }
  });

  // Refreshes list when backspace key is pressed
  form.addEventListener('keydown', function(e) {
    const employees = document.querySelectorAll('.box');  
    if (e.keyCode === 8) {
      for (let i = 0; i < employees.length; i++) {
        employees[i].style.display = '';
      }
    }
  });

})();






















