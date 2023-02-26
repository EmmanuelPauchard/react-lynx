/**
 * React Lynx game
 * In this game, a minimum of 2 players compete to be the first to locate a particular image from a set of other images.
 *
 * This implementation is serverless.
 *
 * It needs a Flickr API key to get the images.
 */
import React, { useState, useEffect } from 'react';

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

  const [urls, setUrls] = useState([]);
  const [difficulty, setDifficulty] = useState(lynxDifficulty[1]);
  const [targetPic, setTargetPic] = useState();
  const [selectedPic, setSelectedPic] = useState();
  const [status, setStatus] = useState("Loading...");
  const [game, setGame] = useState(0);
  const [api, setApi] = useState("");

  useEffect(() => {
    fetchImages(difficulty.tiles_nb, api).then((updated_urls) => {
      setSelectedPic("");
      setUrls(updated_urls);
      setTargetPic(pickRandomImage(updated_urls));
      setStatus("Fight!");
    })
  }, [difficulty, game, api])

  /**
   * Check if selected image corresponds to target picture.
   * @param img: an image Id from the urls map
   * @return: true on match, false otherwise
   */
  function validatePick(img) {
    const success = (img === targetPic);
    setStatus(success ? "Great Job!" : "Try Again");
    setSelectedPic(img);
  };

  /**
   * Update some phony state used as the effect dependancy to force re-render
   */
  function reset() {
    setGame(game + 1);
  }

  /**
   * Select another target picture from the set and reset game status
   */
  function next() {
    setSelectedPic("");
    setStatus("Fight!")
    setTargetPic(pickRandomImage(urls));
  }

  return (
    <Container>
      <LynxMenu setDifficulty={setDifficulty} currentDifficulty={difficulty} difficulties={lynxDifficulty} image={targetPic ? targetPic.url : ""} status={status} next={next} reset={api === "" ? null : reset}/>
      {
        urls.length >0 ?
          <ImageList urls={urls} target={targetPic} selected={selectedPic} handleClick={validatePick} />
        : <div className="alert alert-danger">No images. Please check your API key.</div>
      }
      <hr/>
      <div>
        <div>{api === "" ? "Using predefined Flickr Images; Add your API key to get new random images from Flickr" : `Using Flickr Api Key ${api}`}</div>
        <ApiInput handler={setApi} value={api}/>
      </div>
    </Container>
  );
}

export default Lynx;
