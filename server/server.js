import express from "express";
import pg from "pg";
import cors from "cors";
import dotenv from "dotenv";

const myServer = express();

// now we customise our server to use certain express tools as per how we want our server to function. Express assumes nothing for default settings. Without these lines, the server doesnt have any pre-sets to operate.

// express cannot parse JSON. But it does have a translator function, if we want our server to be able to read json and text then we config it here.
myServer.use(express.json());
myServer.use(express.text());
myServer.use(cors());
dotenv.config();

// my db password is kp8l1G2hmtvyU9I1
// the new pg.Pool is a funky new function that returns an object just like our const app=express line. So now our bd variable has a bunch of methods in it

// connect my server to my database (supabase)
const db = new pg.Pool({
  connectionString: process.env.DB_KEY,
});

// console.log(process.env.DB_KEY); // checking the dotenv package is seeing the database file in our .env folder

// Set up a route handler between my server and database.
myServer.get("/reviews", async (request, response) => {
  const dbPull = await db.query(`SELECT * FROM reviews`);
  response.json(dbPull.rows);
});

// set up the ears of the server
myServer.listen(4242, () => {
  console.log(`Started listening for requests made to http://localhost:4242`);
});

// the website itself will display a "cannot get" message at this stage. This isn't anything to worry about, it's just because even though we have told it to listen to port 4242, which it is, we havent told it what to actually do when it hears something come through. In this case by typing localhost:4242 into the web browser, we are the client, making a get request to port 4242. Our server has heard that request, but cannot process it with a responce until we tell it how. So you could say, a server by default, is blind, deaf and mute. Unless taught to be more. If you look in the browsers network tab, you will notice it shows a 404 status error. This means unless programmed to do/respond differently, it will send a cannot get 404 message as default.

// Set up a route handler -> tell the server what to actually do when it hears a GET request comes through port 4242 (from the client) /
myServer.get(`/`, (request, response) => {
  response.send(`Get Request Received. This is myServer's Root Get Response`);
});

// you will now see the get responce message display.

// The reason (request, response) are both defined in param text (regardless of whether we are dealing with a get or post request) is to do with the get function. Get functions are explicitly wired to pass in 2 objects (request and response). That cant be changed. The get function provides 2 object arguments to the callback function. When we type respond.send – it then knows to make the argument sent back the 2nd argument value. If we deleted one of the callback’s parameter texts - 2 arguments would still be sent to that callback function param , but now we only had one parameter defined, only the first argument will be taken (of the 2 sent) (regardless of what the param text actually says – it is only placeholder text), the 2nd argument is ignored. So you can see that we must keep 2 spaces available at all times, otherwise the callback function will be supplied with a request value argument (even though we wanted it to be the response value). it’s like the structured skeletal layout of how the get function finds what it’s looking for. We keep both the placeholder texts there so their spots are kept reserved for their intended values. Remove it, confuse it!!!!

// now we need to teach the server what to do if it hears a POST request come through it's port channel. Post requests could be somebody entering their details into a register form for example. We can't create this environment just yet (not without making a form), but to test our code, we use a program called Postman. This is an extension we can add to VSCode, or you can download it as a seperate program on your pc. It simulates a built in environment where we can run test both our GET and POST coding.

// set up a route handler -> for when a POST request comes into our root /
// POST exsits for client to send over information with the request

myServer.post("/reviews", (request, response) => {
  const clientGame = request.body.game;
  const clientReview = request.body.review;

  const data = db.query(`INSERT INTO reviews (game, review) VALUES ($1, $2)`, [
    clientGame,
    clientReview,
  ]);

  // Sending JSON in the body of the post request. It was decided as a standard a long time ago that when sending any information to/from a server, all data should be sent on the "body" of the code. So whether you're sending client code - you send it on the body, or if you're writing server code - you receive it on the body.
  // console.log(req.body); // displays the data body (that was post requested to and received by) our server. View the results on our VSCode console terminal below. This post request was sent using Postman. (a great way to test the sending of post requests without needing a physical website form). Just add some json text to the body tab in Postman tab and select json, and send it. The console log should display this json text in the console once received. You can send text the same way, Postman, body, text, and sent it.
});
