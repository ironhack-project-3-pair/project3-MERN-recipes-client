# Tit Tit Kitchen (Frontend Client)

## Description

Tit Tit Kitchen is a full-stack web application (based on the MERN stack).

## Deployed live version: https://tit-tit-kitchen.netlify.app/

### Frontend client (React app) repo: https://github.com/hymced/project-management-client

## Story

Tit Tit Kitchen is named after a combination of the French expression "bon apétit" and the Vietnamese sweet and neat way of saying it, just like this app! 😃

## How does it work

This repository contains the backend code for the server of this application. It is a RESTful API built with ExpressJS, MongoDB and Mongoose.

It allows logged in users to manage all the recipes and all the ingredients in the database (public except for anonymous users). The main feature is that they can also track the ingredients they have in their kitchen and plan their meals in a week plan view. On a daily basis for a week, user can then consume the ingredients of the planned recipes that he/she actually cooked and ate. Stay tuned for more functionalities to come!

## Backend Resources

### Backend server repo: https://github.com/hymced/project-management-server
### Backend server API: https://project3-mern-recipes-server.adaptable.app/api/

## Instructions

To run in your computer, follow these steps:
- clone 
- install dependencies: `npm install`
- create a `.env` file with the following environment variables
  - ORIGIN, with the location of your frontend app (example, `ORIGIN=https://mycoolapp.netlify.com`)
  - TOKEN_SECRET: used to sign auth tokens (example, `TOKEN_SECRET=ilovepizza`)
- run the application: `npm start`

# Environment variables

## Case 1: hosted on localhost

Add the following environment variables in .env files:

### Server

```
PORT=<YOUR_PORT> (default is 5000)
ORIGIN=http://localhost:3000
TOKEN_SECRET=<YOUR_CHOSEN_TOKEN_SECRET>
MONGODB_URI=mongodb://127.0.0.1:27017/<YOUR_LOCAL_MONGODB_DB_NAME>

# CLOUDINARY CREDENTIALS FOR IMAGE UPLOAD
CLOUDINARY_NAME=<CHECK_YOUR_CLOUDINARY_CONSOLE>
CLOUDINARY_KEY=<CHECK_YOUR_CLOUDINARY_CONSOLE>
CLOUDINARY_SECRET=<CHECK_YOUR_CLOUDINARY_CONSOLE>
```

### Client

```
PORT=<YOUR_PORT> (default is 3000)
REACT_APP_SERVER_URL=http://localhost:5000
REACT_APP_DEBUG_COMPONENT_LIFECYCLE=true (default is false)
```

## Case 2: creating your own deployment

### Server --> adaptable.io

```
TOKEN_SECRET=<YOUR_CHOSEN_TOKEN_SECRET>
MONGODB_URI=mongodb+srv://<YOUR_MONGODB_ATLAS_DB_URI>
ORIGIN=<YOUR_NETLIFY_SITE_DOMAIN>

# CLOUDINARY CREDENTIALS FOR IMAGE UPLOAD
CLOUDINARY_NAME=<CHECK_YOUR_CLOUDINARY_CONSOLE>
CLOUDINARY_KEY=<CHECK_YOUR_CLOUDINARY_CONSOLE>
CLOUDINARY_SECRET=<CHECK_YOUR_CLOUDINARY_CONSOLE>
```

### Client --> netlify.app

```
CI=false (required for SPA applications deployed on this service to redirect requests to index.html)
REACT_APP_SERVER_URL=<YOUR_ADAPTABLE_APP_DOMAINE>
REACT_APP_DEBUG_COMPONENT_LIFECYCLE=true (dafault is false)
```

# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can't go back!**

If you aren't satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you're on your own.

You don't have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn't feel obligated to use this feature. However we understand that this tool wouldn't be useful if you couldn't customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: [https://facebook.github.io/create-react-app/docs/code-splitting](https://facebook.github.io/create-react-app/docs/code-splitting)

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `npm run build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)