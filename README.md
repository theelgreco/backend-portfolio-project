# <i><a href="https://nc-games-ki7a.onrender.com/">__VIEW THE APP:__ </br> __https://nc-games-ki7a.onrender.com/__</i></a>
<i>created by Stelios Kakoliris</i>
</br>
</br>

# <b>WHAT IS THIS?</b>

This is a project that makes use of PostgreSQL and the express framework to create a database and an API to retrieve information from that database.

PostgreSQL is the database management system used in this project to create the database and store the data

Express is the framework that has been used to create the server to which clients send requests to in order to retrieve information from the PostgreSQL database

This project makes use of node postgres which is what allows the server to query the database and retrieve the relevant data to send back to the client

This project has been thoroughly tested using jest and supertest in order to ensure that the API works correctly and efficiently and most importantly is free from vulnerabilities

--------------------------------------------------------------------------------------------------------------------------------------------


# <b>INSTRUCTIONS FOR INTERACTING WITH THE API</b>

- To view the hosted version of this api, head to the following link: __https://nc-games-ki7a.onrender.com/__

- here, you can make use of the endpoints listed in the endpoints.json file to make requests to the database
  e.g, to retrieve all of the categories, append <b><i>'/api/categories'</i></b> to the url

- To make queries, the format is as follows: 'url/endpoint?query=queryOption'
  e.g, to retrieve all of the reviews for strategy games, append <b><i>'/api/reviews?category=strategy'</i></b> to the url
  
- To make multiple queries, simply include '&' between each query,
  e.g, to retrieve all of the reviews for strategy games in order of review_id ascending, 
  append <b><i>'/api/reviews?category=strategy&sort_by=review_id&order=asc'</i></b> to the url


--------------------------------------------------------------------------------------------------------------------------------------------

# <b>TO MAKE YOUR OWN VERSION</b>

### <b>CLONING THE REPOSITORY:</b>

</br>

- To start you will need to fork this repository by pressing the <b><i>'fork'</i></b> button on the main page of the repository.

- then you need to clone it to your local machine, to do this start by clicking the green <b><i>'code'</i></b> button (on your 
   forked version) and copying the url under <b><i>'https'</i></b>

- then head to your terminal and cd into the directory where you would like to store this repository

- type <b><i>'git clone'</i></b> followed by the url you copied in step 3

That's it! You now have your own version installed on your local machine that you can edit in your favourite code editor

--------------------------------------------------------------------------------------------------------------------------------------------


### <b>INSTALLING DEPENDENCIES:</b>

</br>

All of the dependencies are included in the package.json file, so all you need to do to install them on your local version is:
- type <b><i>'npm install'</i></b> into the terminal (make sure you do this inside the directory where you just installed your local repo)

--------------------------------------------------------------------------------------------------------------------------------------------

### <b>SEEDING THE DATABASE:</b>

</br>

There are two sets of data, test and development, you can see these in __/db/data__

There are two scripts configured in the package.json:
- The first script is <b><i>'npm run seed'</i></b> and this will seed and connect to the development database using the development data
- The second script is <b><i>'npm run test'</i></b>  which will run jest and seed and connect to the test database using the test data

To make use of these scripts you will first need to set up the files for the environment variables,
to do this you need to:

- create a file in the root directory with the name: </br> <b><i> .env.test </b></i>
- inside .env.test you need to write:   </br> <b><i> PGDATABASE=nc_snacks_test </b></i>

- create a file in the root directory with the name:  </br> <b><i> .env.development </b></i>
- inside .env.development you need to write:   </br> <b><i> PGDATABASE=nc_snacks </b></i>

Once you have setup the files for the environment variables you can now run either one of the scripts which will setup and connect to the appropriate database and then seed the database with either the development or test data.

If you decide to run the test script, this will also run jest which will allow you to view the tests that have already been done and then you can also add your own tests, these are found in <b><i>'_\__tests__\_/app.test.js'</i></b>

--------------------------------------------------------------------------------------------------------------------------------------------

### <b>NAVIGATING THE FOLDERS</b>

</br>

<b>app.js</b> - This is where the express server is configured and where requests from the client are received and where the controllers are invoked
</br>
</br>
<b>controllers:</b> This is the folder where the controllers files are located
</br>
- <b>/controllers.js</b> - This is where the controllers process the requests from the server, invoke the models and send responses back to the client. Errors are also caught here and passed down the chain to the error-handling middleware
</br>
- <b>/error-handling-controllers.js</b> - This is where the error handling controllers are stored and process the errors that have been passed down the chain, to send back the appropriate error code and message to the client
</br>
</br>

<b>models:</b> This is the folder where the models are located
</br>
- <b>/models.js</b> - The models query the database and send back the appropriate data to the controllers
</br>
</br>

<b>_\__tests__\_/</b> This is the folder where the models are located
</br>
- <b>/app.test.js</b> - This is the file for testing requests to the server, when you run the script <b><i>npm run test</b></i> this the file that is run and it has been configured to connect to the test database and seed the database with the test data
</br>
</br>

<b>db:</b> This is where the datasets are stored along with the files to setup, connect to and seed the database

--------------------------------------------------------------------------------------------------------------------------------------------


### <b>MINIMUM REQUIREMENTS:</b>
- node: v19.4.0
- Postgres: v15