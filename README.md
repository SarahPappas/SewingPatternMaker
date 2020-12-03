# [Bobbin Lab](http:\\bobbinlab.com)

Our [web app](http:\\bobbinlab.com) allows users to generate a basic sewing pattern from a photo of an article of clothing.

A user uploads a picture of a garment laying flat on a surface. Then, the user traces the seams, folds and borders of the garment using our integrated drawing tools. Next, they provide a measurement for a single seam of the original garment. Finally, our app automatically generates a printable pdf pattern that will allow the user to sew a copy of the garment in the fabric of their choice!

## Screenshots

<img src="/sewingPatternMakerDemo.jpg">

## Features

- Our simple user interface makes it possible to create a pattern in a few minutes!
- Our intelligent drawing tools automatically match the endpoints of the strokes and smooth curves for a professional looking pattern
- Our algorithm will automatically cut the drawn pattern into different fabric pieces and add 5/8" allowances to all seams and edges of each piece
- Once the drawing is complete and a measurement has been provided, the app provides the user with a ready-to-print pdf pattern spread on multiple 8.5" by 11" pages.

## Techs

- React with Hooks
- Typescript
- HTML's Canvas element
- requestAnimationFrame
- jsPDF library
- Jest

# Installation
<!--## Installation for users
Todo -->

## Installation for developers
Clone the source locally:

```sh
$ git clone https://github.com/SarahPappas/SewingPatternMaker/
$ cd SewingPatternMaker
```

Use your package manager to install `yarn`.

Install project dependencies:

```sh
$ yarn
```

Then, the following scripts are available: 

```sh
$ yarn start
```

Runs the app in the development mode.<br />
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.<br />
You will also see any lint errors in the console.

```sh
$ yarn test
```

Launches the test runner in the interactive watch mode.<br />
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

```sh
$ yarn build
```

Builds the app for production to the `build` folder.<br />
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.<br />
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

```sh
$ yarn eject
```

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.

## Built with

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).