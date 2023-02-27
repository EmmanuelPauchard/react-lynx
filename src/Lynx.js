/**
 * React Lynx game
 * In this game, a minimum of 2 players compete to be the first to locate a particular image from a set of other images.
 *
 * This implementation is serverless.
 *
 * It needs a Flickr API key to get the images.
 */
import React, { useEffect, useReducer } from 'react';

import './Lynx.css';
import 'bootstrap/dist/css/bootstrap.min.css';

import Container from 'react-bootstrap/Container';

import LynxMenu from './Menu';
import ImageList from './ImageGrid';
import fetchImages from './ImageQuery.mjs';
import ApiInput from './ApiInput.js'

/**
 * The game difficulty depends on the number of images displayed
 */
const lynxDifficulty = [
  {
    "str": "easy",
    "tiles_nb": 4
  },
  {
    "str": "medium",
    "tiles_nb": 12
  },
  {
    "str": "hard",
    "tiles_nb": 24
  }
];

/** Return a random element from a list */
function pickRandomImage(l) {
  return l.at(Math.floor(Math.random() * l.length));
}

function Lynx() {

  const initialState = {
    urls: [],
    difficulty: lynxDifficulty[1],
    targetPic: null,
    selectedPic: null,
    status: "Loading...",
    game: 0,
    api: ""
  };

  function reducer(state, action) {
    let {[action.target]: current} = state;
    // if (current === undefined) {
    //   console.log("Error: can't handle state update: ", action);
    //   return state;
    // }

    switch(action.target) {
      case "game":
        // "Game" is our only state variable whose associated action is stateful
        current += 1;
        break;
      default:
        // All other states: just set the new payload
        current = action.payload;
        break;
    }

    return {...state, [action.target]: current};
  }

  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    // const getImages = async () => {
    //   return await fetchImages(state.difficulty.tiles_nb, state.api);
    // }
    fetchImages(state.difficulty.tiles_nb, state.api).then((updated_urls) => {
      // const updated_urls = getImages();
      dispatch({target: "urls", payload: updated_urls});
      next();
    })
  }, [state.game, state.api, state.difficulty]);

  /**
   * Check if selected image corresponds to target picture.
   * @param img: an image Id from the urls map
   * @return: true on match, false otherwise
   */
  function validatePick(img) {
    const success = (img === state.targetPic);
    dispatch({target: "status", payload: success ? "Great Job!" : "Try Again"});
    dispatch({target: "selectedPic", payload: img});
  };

  /**
   * Update some phony state used as the effect dependancy to force re-render
   */
  function reset() {
    dispatch({target: "game"});
  }

  /**
   * Select another target picture from the set and reset game status
   */
  function next() {
    dispatch({target: "selectedPic", payload: ""});
    dispatch({target: "status", payload: "Fight!"});
    dispatch({target: "targetPic", payload: pickRandomImage(state.urls)});
  }

  console.log("Current state: ", state);

  return (
    <Container>
      <LynxMenu next={next} reset={reset} setDifficulty={(v) => dispatch({target: "difficulty", payload: v})} difficulties={lynxDifficulty} currentDifficulty={state.difficulty} image={state.targetPic ? state.targetPic.url : ""} status={state.status}/>
      {
        state.urls.length >0 ?
          <ImageList urls={state.urls} target={state.targetPic} selected={state.selectedPic} handleClick={validatePick} />
        : <div className="alert alert-danger">No images. Please check your API key.</div>
      }
      <hr/>
      <div>
        <div>{state.api === "" ? "Using predefined Flickr Images; Add your API key to get new random images from Flickr" : `Using Flickr Api Key ${state.api}`}</div>
        <ApiInput handler={(v) => dispatch({target: "api", payload: v})} value={state.api}/>
      </div>
    </Container>
  );
}

export default Lynx;
