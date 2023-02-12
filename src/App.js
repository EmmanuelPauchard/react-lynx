import React, { useState, useEffect } from 'react';

import './App.css';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import Dropdown from 'react-bootstrap/Dropdown';

import 'bootstrap/dist/css/bootstrap.min.css';

import Container from 'react-bootstrap/Container';

import Image from 'react-bootstrap/Image'

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

/** Return a random element from the list l */
function pickRandomImage(l) {
  return l.at(Math.floor(Math.random() * l.length));
}

/**
 * The Menu bar:
 * - display and change difficulty
 * - restart TODO
 * - player names/scores TODO
 */
function LynxMenu({ currentDifficulty, setDifficulty, image }) {

  return (

    // <div class="menu d-flex flex-row justify-content-between bg-primary">
    //   <div class="p-2">Lynx</div>
    //   <Dropdown>
    //     <Dropdown.Toggle variant="success" id="dropdown-basic">
    //       {"Difficulty: " + currentDifficulty.str}
    //     </Dropdown.Toggle>

    //     <Dropdown.Menu>
    //       <Dropdown.Item>Easy</Dropdown.Item>
    //       <Dropdown.Item>Medium</Dropdown.Item>
    //       <Dropdown.Item>Hard</Dropdown.Item>
    //     </Dropdown.Menu>
    //   </Dropdown>

    //   <Image src={image} />
    // </div>

    <Navbar className="p-2 align-content-center" bg="primary" variant="dark" expand="lg">
      <Nav className="flex-column col-6 pt-0 justify-content-start">
        <Navbar.Brand>Lynx</Navbar.Brand>
        <NavDropdown title={"Difficulty: " + currentDifficulty.str} id="basic-nav-dropdown">
          {lynxDifficulty.map((x) =>
            <NavDropdown.Item key={x.str} className={currentDifficulty === x ? "active" : ""} onClick={() => setDifficulty(x)}>{x.str}
            </NavDropdown.Item>
          )}
        </NavDropdown>
      </Nav>

      <Nav className="flex-row col-6 justify-content-end">
        <Image className="target" src={image} />
      </Nav>
    </Navbar>
  );
}

/**
 * The Image Grid container
 */
function ImageList({ urls, target, selected, handleClick }) {
  return (
    <div className="image-grid">
      {urls.map(x =>
        <Image className={"fluid images col-2-lg " + (selected === x ? (target === selected ? "hit" : "miss") : "")} key={x.key} src={x.url} onClick={() => handleClick(x)} />)}
    </div>);
}


function App() {

  const [urls, setUrls] = useState([]);
  const [difficulty, setDifficulty] = useState(lynxDifficulty[1]);
  const [targetPic, setTargetPic] = useState();
  const [selectedPic, setSelectedPic] = useState();
  const [status, setStatus] = useState("Loading");

  useEffect(() => {
    const page = Math.round(Math.random() * 10);
    const perpage = 50;
    const FLICKR_API = process.env.LYNX_FLICKR_API_KEY;

    const url = `https://www.flickr.com/services/rest/?method=flickr.photos.search&api_key=${FLICKR_API}&group_id=1422009%40N23&per_page=${perpage}&page=${page}&format=json&nojsoncallback=1`;

    fetch(url)
      .then(res => res.json())
      .then(
        (data) => {
          if (!("photos" in data)) {
            console.log("Error: no photos: ", data);
          }
          //const photo_array = data.photos.photo;
          const photo_array = data.photos.photo.sort((a, b) => 0.5 - Math.random()).slice(0, difficulty.tiles_nb);
          const updated_urls = photo_array.map(el => {
            return {
              "url": `https://live.staticflickr.com/${el.server}/${el.id}_${el.secret}_q.jpg`,
              "key": el.id
            };
          });
          setUrls(updated_urls);
          setTargetPic(pickRandomImage(updated_urls));
        },
        (error) => {
          console.log("Exception while fetching resources: ", error);
        }
      )
  }, [difficulty])

  /**
   * Check if selected image corresponds to target picture.
   * @param img: an image Id from the urls map
   * @return: true on match, false otherwise
   */
  function validatePick(img) {
    return (img === targetPic.key);
  };

  return (
    <Container>
      <LynxMenu setDifficulty={setDifficulty} currentDifficulty={difficulty} image={targetPic ? targetPic.url : ""}/>
      <ImageList urls={urls} target={targetPic} selected={selectedPic} handleClick={setSelectedPic} />
    </Container>
  );
}

export default App;
