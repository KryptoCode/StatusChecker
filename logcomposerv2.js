

window.onload = function() {
	// To Make localStorage work on local file instead of http. Doesn't work with "strict mode" ~ Stack Overflow.
		// !localStorage && (l = location, p = l.pathname.replace(/(^..)(:)/, "$1$$"), (l.href = l.protocol + "//127.0.0.1" + p));

	// Hidden elements
	var hiddenElem = document.getElementsByClassName("hidden");
	var addContactForm = document.querySelector('.addFormDiv');

	// Initialize Buttons
	var subBtn = document.getElementById("subBtn").addEventListener("click", buildLog);
	var refreshBtn = document.getElementById("refreshBtn").addEventListener("click", refreshPage);
	var saveBtn = document.getElementById("saveBtn").addEventListener("click", saveStatus);
	var addBtn = document.getElementById("addBtn").addEventListener("click", addContact);
	var cancelBtn = document.getElementById("cancelBtn").addEventListener("click", refreshPage);
	var contactFormBtn = document.getElementById("contactsBtn").addEventListener("click", function() {
		if (addContactForm.style.display != "block") {
			addContactForm.style.display = "block";
		} else {
			addContactForm.style.display = "none";
		}
	})

	// Get textarea field information
	var reqArea = document.getElementById("logInput");
	var	name = document.getElementById("name");
	var	email = document.getElementById("email");
	var loads = [];

	// Initializing the date object to be displayed in the subject field of the e-mail
	var dateObj = new Date();
	var month = dateObj.getUTCMonth() + 1; // Will allow to display months 1 - 12
	var day = dateObj.getUTCDate();
	var year = dateObj.getUTCFullYear();
	var todayDate = month + "/" + day + "/" + year; // the display variable for todays date

	// Create storage arrays
	var contactArr = [];
	var comments;
	var reqResults = document.getElementById("reqResults").innerHTML;

		if(typeof(Storage) !== "undefined") {
			comments = JSON.parse(localStorage.getItem("currentStatus"));

		} else {
			return console.log("Storage not defined!");
		}

	retrieveContacts();

	function contactStruct(name, email, loads) {
		//contact JSON constructure function
		this.name = name;
		this.email = email;
		this.loads = loads;
	}
	// Add contact function
	function addContact() {
		var isNull = name.value!= '' && email.value!= '';
		if(isNull){
			// add Contact Fields to storage
			var contactObj = new contactStruct(name.value,email.value,loads);
			
				contactArr.push(contactObj);

			localStorage.setItem("contacts", JSON.stringify(contactArr));
			// Hide div after adding contact
			addContactForm.style.display = "none";
			retrieveContacts();
			refreshPage();
			}
	}



	// clicking save button stores status value. 
	function saveStatus(load, status) {
		// Load and Status take the input fields and split into a seperate array of values
		load = document.getElementById("loadInput").value.split('\n');
		status = document.getElementById("statusInput").value.split('\n');
		
		console.log(load);
		console.log(status);
		// create the object container
		var statusUpdate = {};

		// calling the function to store load as key and the status as value
		load.forEach(storeLoad);

		// callback function for the forEach loop
		function storeLoad(element, index, array) {
			return statusUpdate[element] = status[index].toLowerCase();

		}
		// takes the object created with load number as key and status as value and saves it in localStorage under currentStatus as a string.
		localStorage.setItem("currentStatus", JSON.stringify(statusUpdate));
		console.log(statusUpdate);

		// letting user know they saved something.
		alert("Status Saved");
	}

	function refreshPage(log) {

		var loadSaveField = document.getElementById("loadInput");
		var statusSaveField = document.getElementById("statusInput");

		loadSaveField.value = '';
		statusSaveField.value = '';
		reqArea.value = '';
		name.value = '';
		email.value = '';

		location.reload();
	}

	function retrieveContacts() {
		if(localStorage["contacts"] === undefined){
			localStorage["contacts"] = "[]";
		} else {
			contactArr = JSON.parse(localStorage.getItem("contacts"));
		}
	}

	// Get textarea input and create objects from the information
	function buildLog(log) {
		var log = reqArea.value;
		console.log(log);
		//reveal hidden elements
		for(var h = 0; h < hiddenElem.length; h++) {
			hiddenElem[h].style.visibility = "visible";
		}
		if(log !== '') {
			var logLines  = log.split('\n');
			
			logLines.forEach(function(item, index, array) {
				// Split string into load number and carrier name variables
				var carrierName = item.slice(7);
				var loadNum = parseInt(item.slice(0));


				for(var i = 0; i < contactArr.length; i++) {
					//console.log(loadNum);
					//console.log(carrierName);

					// if carrier name is equal to carrier name of object
					if(carrierName === contactArr[i].name) {
						// add load number to carrier load list property
						contactArr[i].loads.push(loadNum);
					} 


				}

			});
			
			contactArr = contactArr.filter(function(obj) {
				if(obj.loads != '') {
					return true;
				} else {
					return false;
				}
			})
			//This Function formats the load list for the email Body
			contactArr.forEach(function(item, index, array) {

				var listLoads = item.loads;
				var list = listLoads.map(function(element) {
					//Each Element is mapped with nextline symbol for email to understand.
					if(comments != null) {
						
						if(element in comments && comments[element] === "delivered" || element in comments && comments[element] === "empty") {
							element = element + ' : ' + comments[element] + '. Please update Load Link';
						}
					} 
				var formattedList = element + '%0D';
					return formattedList;
				}).join('');

				var emailLink = '<tr><td><a href="mailto:' + item.email + '?Subject=Status%20Request%20' + todayDate + '&body=Please%20send%20Status%20on%20the%20following%20loads%0D' + list + '">' + item.name + '</a></td></tr>';
			return document.getElementById("reqResults").innerHTML += emailLink;

	});
			console.log(contactArr);
		} else {
			alert("Request was empty!")
			console.log("is empty");
		}

	}


};

