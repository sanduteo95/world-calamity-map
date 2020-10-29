# World Calamity Map

This is a map that colour codes all countries in the world according to how bad the news about them have been in the past 24h. It gets the latest news about the country and runs sentiment anlysis on them, computing a total score of "world calamities" in that specific country. The countries are then colour coded from red (most affected by a distaster) to green (least affected), and will be expanded to include links to petitions for those interested in helping. This project came about from realising that a lot of things are going on around the world and that it's very hard to keep up-to-date with everything that is going on.

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app) and [Heroku](https://devcenter.heroku.com/articles/getting-started-with-nodejs).

## Available Scripts

In the project directory, you can run:

### `npm run start:dev`

Runs the Node.js Express server **and** the React front-end through `react-scripts`, hosting the website at `http://localhost:3000` and the backend at `http://localhost:80`.

### `npm start`

Runs the Node.js Express server, which also serves the built front-end code inside the `build/` folder at ### `http://localhost:80`

### `npm run build`

Builds the production front-end components and places them in the `build/` foldet. Only used for production environments.
