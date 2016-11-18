## Christmas Lights Game

### Background

The Christmas Lights Game is a logic game where the player has to connect all of the bulbs to the electricity connecting the wires properly. Each square of the triangular grid has either a bulb or a piece of wire that can be rotated to connect it to different pieces. Once a bulb is connected to the electricity it is lit up, and once all of the bulbs are lit, the game is won.

The basic features of this game are outlined in the **Functionality & MVP** and **Bonus Features** sections.  


### Functionality & MVP  

With this Christmas Lights Game users will be able to:

- [ ] Reset the game board, choose whether to start another game when they win
- [ ] Click on wires and bulbs to rotate them
- [ ] See which wires and bulbs are connected to the electricity by the color/effects
- [ ] Listen to Christmas music while playing, or turn it off if they choose

In addition, this project will include:

- [ ] An About modal describing the background and rules of the game
- [ ] A production Readme


### Wireframes

This app will consist of a single screen with game board, game controls, and nav links to the Github, my LinkedIn, and the About modal. Game controls will include Start and Reset buttons. On the right, the speaker icon will be clickable and used to toggle play on the music.

[wireframe](docs/wireframe.png)


### Architecture and Technologies

This project will be implemented with the following technologies:

- Vanilla JavaScript and `jquery` for overall structure and game logic,
- `HTML5 Canvas` for DOM manipulation and rendering,
- Webpack to bundle and serve up the various scripts.

In addition to the webpack entry file, there will be five scripts involved in this project:

`board.js`: this script will handle the logic for creating and updating the necessary elements and rendering them to the DOM.

`game.js`: this script will handle the logic behind the scenes.  A Game object will hold a 2D array of `Wire`s and `Bulb`s.  It will be responsible for doing neighbor checks for each `Light` upon rotation and updating the piece in the array appropriately. It will be able to randomly select a completed puzzle and rotate the pieces randomly for the starting state of the game.

`light.js`: this lightweight script will house the constructor and update functions for the `Light` objects.  Each `Light` will contain an`orientation` (a number 1-4 corresponding to the rotated state of the object) and a `litState` (`true` or `false`).

`wire.js`: this script will house the constructor and update functions for the `Wire` objects. It will inherit from the `Light` object and have a `shape` (straight, angle, three-pronged, four-pronged).

`bulb.js`: this script will house the constructor and update functions for the `Bulb` objects.  It will inherit from the `Light` object and have a `color` (red, yellow, green, blue, purple).


### Implementation Timeline

**Day 1**: Setup all necessary Node modules, including getting webpack up and running and `Easel.js` installed.  Create `webpack.config.js` as well as `package.json`.  Write a basic entry file and the bare bones of all 5 scripts outlined above.  Learn the basics of `Easel.js`.  Goals for the day:

- Get a green bundle with `webpack`
- Learn enough `Easel.js` to render an object to the `Canvas` element
- Get About modal working

**Day 2**: Dedicate this day to learning the `Easel.js` API.  First, build out the `Wire` and `Bulb` objects to connect to the `Board` object.  Then, use `board.js` to create and render at least the Christmas Tree image and grid of pieces.  Build in the ability to rotates the pieces on click for each cell.  Goals for the day:

- Complete the `Wire.js` and `Bulb.js` modules (constructor, update functions)
- Render a square grid to the `Canvas` using `Easel.js`
- Make each cell in the grid clickable, rotating the piece

**Day 3**: Create the game logic backend.  Build out modular functions for handling the neighbor checks and rule sets.  Incorporate the game logic into the `Board.js` rendering.  Goals for the day:

- Export a `Game` object with correct handling logic
- Have a functional grid on the `Canvas` frontend that correctly handles clicks and changes the state as a result

**Day 4**: Install the controls for the user to interact with the game.  Style the frontend, making it polished and professional.  Goals for the day:

- Create controls for game start, reset, and music toggle
- Have a styled `Canvas`, nice looking controls and title


### Bonus features

Some anticipated updates are:

- [ ] Add options for different size trees
- [ ] Add multiple choices for solved puzzles
- [ ] Add timer and the ability to record different scores based on time-to-complete
