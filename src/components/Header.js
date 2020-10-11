import React from 'react';
import logo from '../img/Logo.png';

import { Navbar} from 'react-bootstrap';

export default () => {
  return (
    
    <Navbar expand="lg" variant="light" bg="light">
    <Navbar.Brand href="/">
      <img
        src={logo}
        className="d-inline-block align-top"
        alt="Memorizei logo"
      />
    </Navbar.Brand>
  </Navbar>
  );
}