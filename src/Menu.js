/**
 * The Menu bar:
 * - display and change difficulty
 * - game controls: next image, reset images, status
 * - target image
 * - player names/scores TODO
 */
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import { Button } from 'react-bootstrap';
import Image from 'react-bootstrap/Image';

import './Menu.css';

/**
 * Renders the game Menu component.
 *
 * Difficulty parameters hold the game difficulty configuration data. The menu
 * will use this data to present an interface to the user to update the
 * difficulty. Type: [Difficulty]: [{"str": string, ...}]. The "str" field is
 * the human readable difficulty representation. The menu component stores
 * creates a menu entry for each element of difficulties. On selection, the
 * whole element is stored in the state variable difficulty;
 *
 * @param currentDifficulty {Difficulty} the current difficulty state
 * @param setDifficulty a setter for currentDifficulty
 * @param difficulties {[Difficulty]} The list of difficulty levels for the game
 *
 * @param image {str} An URL to the target image
 *
 * @param status {str} The game status to display
 * @param next {callable} Event handler to move to the next target image
 * @param reset {callable} Event handler to reset the game image gallery
 *
 * @return the menu, a Bootstrap Navbar component
 */
const LynxMenu = ({ currentDifficulty, setDifficulty, difficulties, image, status, next, reset }) => {

  return (
    <Navbar id="nav-menu" className="p-2 flex-row justify-content-between" bg="primary" variant="dark" expand="lg">

      <Nav className="flex-column pt-0 justify-content-start col-6 col-sm-2">
        <Navbar.Brand id="nav-brand" onClick={reset}>Lynx</Navbar.Brand>
        <NavDropdown title={"Difficulty: " + currentDifficulty.str} id="basic-nav-dropdown">
          {difficulties.map((x) =>
            <NavDropdown.Item key={x.str} className={currentDifficulty === x ? "active" : ""} onClick={() => setDifficulty(x)}>{x.str}
            </NavDropdown.Item>
          )}
        </NavDropdown>
        <div id="nav-status">{status}</div>
      </Nav>

      <Image id="nav-target" className="col-sm-3 col-6" src={image} />

      <Nav id="nav-controls" className="flex-row flex-sm-column col-12 col-sm-2">
        <Button variant="success" onClick={next}>Next</Button>
        <Button variant="danger" onClick={reset}>Reset</Button>
      </Nav>

    </Navbar>
  );
}

export default LynxMenu;
