//console.log("hello world");

// link submit audio clip to javascript
const segaAudio = new Audio("audio/sega-hd.mp3");

// get our form
const form = document.getElementById("form");

// get our myServer div display from the index.html
const myDatabaseDisplay = document.getElementById("databaseDisplay");

// fetch my table from the supabase database, convert back into js
async function fetchTable() {
  const jsTable = await fetch("http://localhost:4242/reviews");
  const readableTable = await jsTable.json();

  //console.log(readableTable); // check it has found the table array and translated it back into js
  return readableTable; // this array of data will now be able to be passed into another function below (to display the table array on our website)
}

// now we want to display the readableTable on or webpage
async function myTableDisplay() {
  const readableTableClone = await fetchTable();
  console.log(readableTableClone); // check it has passed the array correctly
  readableTableClone.forEach((message) => {
    const myDiv = document.createElement("div");
    const gameName = document.createElement("p");
    const reviewContent = document.createElement("p");

    gameName.textContent = message.game;
    reviewContent.textContent = message.review;

    myDiv.append(gameName, reviewContent);
    myDatabaseDisplay.appendChild(myDiv);
  });
}

myTableDisplay(); // invoker

async function handleSubmit(e) {
  // stop defualt behaviour - which is the form resubmited after pressing submit. This was a built in feature of how forms were made  to perform back in the day. It had reasons which we will cover, and is still kept in for backwards compatability of old websites, but for now just disable it. If you dont, the console.log will momentarily display the result and then it disables/disappears again after an auto re-submit.
  //e.preventDefault(); //take this out again to allow the database to refresh
  alert("Review Submitted! Thanks!");
  segaAudio.play();

  // horrible line of code - to make an instance of the user's FormData submitted and make it readable to js. First save any new submitted form data as a named insance. I will call it rawFormData. If you console log rawFormData at this stage you will see it is retuned as simply FormData (unless you are using Firefox browser, in which case it apparently does translate it).
  const rawFormData = new FormData(form);
  // turn that data into a regular JS object. And run a console log now of readableFormData. You will see it can now read the newForm Data. The names it displays for each is from the input id's you gave them on index.html
  const jsFormData = Object.fromEntries(rawFormData);
  //console.log(jsFormData);

  // prepare to send this form data across the internet
  // so we'll turn it into JSON
  const jsonFormData = JSON.stringify(jsFormData);
  //console.log(jsFormData, jsonFormData); // you will see the js format of the form data and the json version.

  // now we need to make a template for the sending of this data. think of this step as opening up the road between client and server (so the postman can now travel freely to/from the address), writing out the address on the envelope, like you would when sending a letter. and putting all the information inside the letter. a fetch command directed at the server (at this end) by default makes a get request (at the server end) triggering the get response from the server, but we also give a second argument with the fetch/get request (the data we now want to send in json format - jsonFormatData) this then tells our server to understand this is a get/post request.
  const serverPostResp = await fetch("http://localhost:4242/reviews", {
    headers: {
      "Content-Type": "application/json",
    },
    method: "POST",
    body: jsonFormData,
  });
  // window.location.reload() not sure what this is for ????
  const res = await serverPostResp.json();
  console.log(res); // remember we asked the server, when it receives a get/post request, to send the client back a console.log response displaying the BODY content of the data it just received. res.json({ message: req.body }); So it shows us the actual users inputted text (which we made the body in json format above)
}

// add an event listener to the form, so when the user submits the form, run the handleSubmit function
// addEventListenr passes in the arguments - that not our job. So *it* passes in the 'Event Object'
form.addEventListener("submit", handleSubmit);
