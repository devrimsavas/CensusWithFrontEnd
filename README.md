# Census Application Installation and Usage Instructions

## Overview

This is a census application that allows an administrator to manually create, modify, and view user details. The application does not use a database or file system; therefore, all recorded information will be deleted after the server is reset. The application does not have a frontend, so users will need to use Postman to test it."

## Render Link

The application is also deployed on Render at the following link

```bash
https://devrimcensus.onrender.com/
```

Users should be aware that the application uses the free version of Render, so the loading time may be a bit longer initially. However, the app has been tested and works fine."
Alternatively, users can try a different version of the application that includes a user interface. This version utilizes a handler file for managing user data. The link is:

```bash
https://census-crud-disk.onrender.com/

```

## Initial Setup and Enviroment

A sample .env file is provided. However, if you intend to deploy the source code on Render, you must specify the environment parameters before deploying. These credentials are essential for a proper deployment. Please create your own .env file with these parameters to run the application locally, and ensure you provide the same parameters when deploying.

```bash
LOGIN= admin
PASSWORD= P4ssword
```

## Running the Application

The application includes the following endpoints:

- `base_url/participants/add` - POST endpoint for adding a participant's data to the Global Object Variable.
- `base_url/participants` - GET endpoint for retrieving a list of all participants as a JSON object from the Global Object Variable.
- `base_url/participants/details` - GET endpoint for returning the personal details of all active participants (including first name and last name).
- `base_url/participants/details/email` - GET endpoint for returning the personal details of a specific participant (including first name, last name, and active status).
- `base_url/participants/work/email` - GET endpoint for returning work details of a specific participant that are not deleted (including their company name and salary with currency).
- `base_url/participants/home/email` - GET endpoint for returning home details of a specific participant that are not deleted (including their country and city).
- `base_url/participants/email` - DELETE endpoint for deleting a participant by their provided email from the Global Object Variable.
- `base_url/participants/email` - PUT endpoint for updating a participant by their provided email in the Global Object Variable. The request format should be identical to that of the participants/add POST request."

## Additional Libraries

- The application relies on several libraries to function correctly. To maintain admin credentials throughout the session, express-session is utilized. Ensure you have it installed:

```bash
npm install express-session
```

- Users also need to install dotenv to manage environment variables:

```bash
npm install dotenv
```
