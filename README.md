# WHAT IS THIS?

This is a project that makes use of PostgreSQL and the express framework to create a database and an API to retrieve information from that database.

PostgreSQL is the database management system used in this project to create the database and store the data

Express is the framework that has been used to create the server to which clients send requests to in order to retrieve information from the PostgreSQL database

This project makes use of node postgres which is what allows the server to query the database and retrieve the relevant data to send back to the client

This project has been thoroughly tested using jest and supertest in order to ensure that the API works correctly and efficiently and most importantly is free from vulnerabilities

--------------------------------------------------------------------------------------------------------------------------------------------


# INSTRUCTIONS FOR INTERACTING WITH THE API

- To view the hosted version of this api, head to the following link: https://nc-games-ki7a.onrender.com/

- here, you can make use of the endpoints listed in the endpoints.json file to make requests to the database
  e.g, to retrieve all of the categories, append '/api/categories' to the url

- To make queries, the format is as follows: 'url/endpoint?query=queryOption'
  e.g, to retrieve all of the reviews for strategy games, append '/api/reviews?category=strategy' to the url
  
- To make multiple queries, simply include '&' between each query,
  e.g, to retrieve all of the reviews for strategy games in order of review_id ascending, 
  append '/api/reviews?category=strategy&sort_by=review_id&order=asc' to the url


--------------------------------------------------------------------------------------------------------------------------------------------

# TO MAKE YOUR OWN VERSION

### CLONING THE REPOSITORY:

- To start you will need to fork this repository by pressing the fork button on the main page of the repository.

- then you need to clone it to your local machine, to do this start by clicking the green 'code' button (on your 
   forked version) and copying the url under 'https'

- then head to your terminal and cd into the directory where you would like to store this repository

- type 'git clone' followed by the url you copied in step 3

That's it! You now have your own version installed on your local machine that you can edit in your favourite code editor

--------------------------------------------------------------------------------------------------------------------------------------------


### INSTALLING DEPENDENCIES:


All of the dependencies are included in the package.json file, so all you need to do to install them on your local version is:
- type 'npm install' into the terminal (make sure you do this inside the directory where you just installed your local repo)

--------------------------------------------------------------------------------------------------------------------------------------------

### SEEDING THE DATABASE:

There are two sets of data, test and development, you can see these in /db/data

There are two scripts configured in the package.json:
- The first script is 'npm run seed' and this will seed and connect to the development database using the development data
- The second script is 'npm run test' which will run jest and seed and connect to the test database using the test data

To make use of these scripts you will first need to set up the files for the environment variables,
to do this you need to:

- create a file in the root directory with the name:   .env.test
- inside .env.test you need to write:   PGDATABASE=nc_snacks_test

- create a file in the root directory with the name:   .env.development
- inside .env.development you need to write:   PGDATABASE=nc_snacks

Once you have setup the files for the environment variables you can now run either one of the scripts which will setup and connect to the appropriate database and then seed the database with either the development or test data.

If you decide to run the test script, this will also run jest which will allow you to view the tests that have already been done and then you can also add your own tests.

--------------------------------------------------------------------------------------------------------------------------------------------


### MINIMUM REQUIREMENTS:
- node: v19.4.0
- Postgres: v15