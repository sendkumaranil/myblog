(function() {
  function validEmail(email) { // see:
    var re = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;
    return re.test(email);
  }

  function validBlankField(name,email,address,message){
	if(name==""||email==""||address==""||message==""){
		return false;
	}
  }
  
  function validateHuman(honeypot) {
    if (honeypot) {  //if hidden form filled up
      console.log("Robot Detected!");
      return true;
    } else {
      console.log("Welcome Human!");
    }
  }

  // get all data in form and return object
  function getFormData() {
    var form = document.getElementById("gform");
    var elements = form.elements; // all form elements
    var fields = Object.keys(elements).filter(function(k) {
          // the filtering logic is simple, only keep fields that are not the honeypot
          return (elements[k].name !== "honeypot");
    }).map(function(k) {
      if(elements[k].name !== undefined) {
        return elements[k].name;
      // special case for Edge's html collection
      }else if(elements[k].length > 0){
        return elements[k].item(0).name;
      }
    }).filter(function(item, pos, self) {
      return self.indexOf(item) == pos && item;
    });
    var data = {};
    fields.forEach(function(k){
      data[k] = elements[k].value;
      var str = ""; // declare empty string outside of loop to allow
                    // it to be appended to for each item in the loop
      if(elements[k].type === "checkbox"){ // special case for Edge's html collection
        str = str + elements[k].checked + ", "; // take the string and append 
                                                // the current checked value to 
                                                // the end of it, along with 
                                                // a comma and a space
        data[k] = str.slice(0, -2); // remove the last comma and space 
                                    // from the  string to make the output 
                                    // prettier in the spreadsheet
      }else if(elements[k].length){
        for(var i = 0; i < elements[k].length; i++){
          if(elements[k].item(i).checked){
            str = str + elements[k].item(i).value + ", "; // same as above
            data[k] = str.slice(0, -2);
          }
        }
      }
    });

    // add form-specific values into the data
    data.formDataNameOrder = JSON.stringify(fields);
    data.formGoogleSheetName = form.dataset.sheet || "responses"; // default sheet name
    data.formGoogleSendEmail = form.dataset.email || ""; // no email by default

    console.log(data);
    return data;
  }

  function handleFormSubmit(event) {  // handles form submit without any jquery
    event.preventDefault();           // we are submitting via xhr below
    var data = getFormData();         // get the values submitted in the form

    /* OPTION: Remove this comment to enable SPAM prevention, see README.md
    if (validateHuman(data.honeypot)) {  //if form is filled, form will not be submitted
      return false;
    }
    */
	if(!validBlankField(data.name,data.email,data.address,data.message)){
	  var invalidName = document.getElementById("name-invalid");
      if (invalidName && data.name=="") {
        invalidName.style.display = "block";
        return false;
      }
	  var emptyEmail = document.getElementById("email-empty");
      if (emptyEmail && data.email=="") {
        emptyEmail.style.display = "block";
        return false;
      }
	  var emptyAddress = document.getElementById("address-empty");
      if (emptyAddress && data.address=="") {
        emptyAddress.style.display = "block";
        return false;
      }
	  var emptyMessage = document.getElementById("message-empty");
      if (emptyMessage && data.message=="") {
        emptyMessage.style.display = "block";
        return false;
      }
	}
	
    if( data.email && !validEmail(data.email) ) {   // if email is not valid show error
      var invalidEmail = document.getElementById("email-invalid");
      if (invalidEmail) {
        invalidEmail.style.display = "block";
        return false;
      }
    } else {
      //disableAllButtons(event.target);
	  disableSendButtons(event.target);
      var url = event.target.action;  //
      var xhr = new XMLHttpRequest();
      xhr.open('POST', url);
      // xhr.withCredentials = true;
      xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
      xhr.onreadystatechange = function() {
          console.log( xhr.status, xhr.statusText )
          console.log(xhr.responseText);
          //document.getElementById("gform").style.display = "none"; // hide form
		  resetForm();
          var thankYouMessage = document.getElementById("thankyou_message");
          if (thankYouMessage) {
            thankYouMessage.style.display = "block";
          }
          return;
      };
      // url encode form data for sending as post data
      var encoded = Object.keys(data).map(function(k) {
          return encodeURIComponent(k) + "=" + encodeURIComponent(data[k])
      }).join('&')
      xhr.send(encoded);
    }
  }
  function loaded() {
    console.log("Contact form submission handler loaded successfully.");
    // bind to the submit event of our form
    var form = document.getElementById("gform");
    form.addEventListener("submit", handleFormSubmit, false);
  };
  document.addEventListener("DOMContentLoaded", loaded, false);

  function disableAllButtons(form) {
    var buttons = form.querySelectorAll("button");
    for (var i = 0; i < buttons.length; i++) {
      buttons[i].disabled = true;
    }
  }
  function disableSendButtons(form) {
    var sendButton=document.getElementById("sendButtonId");
	sendButton.disabled=true;    
  }
  function resetForm(){
	var nameField=document.getElementById("IdName");
	var emailField=document.getElementById("IdEmail");
	var websiteField=document.getElementById("IdWebsite");
	var addressField=document.getElementById("IdAddress");
	var subjectField=document.getElementById("IdSubject");
	var messageField=document.getElementById("IdMessage");
	nameField.value="";
	emailField.value="";
	websiteField.value="";
	addressField.value="";
	subjectField.value="";
	messageField.value="";
	var sendButtonEnable=document.getElementById("sendButtonId");
	sendButtonEnable.disabled=false; 
  }
	  
})();
