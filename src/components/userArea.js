/* eslint-disable import/no-anonymous-default-export */
import React from 'react';
import './userArea.css';
import { useHistory } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { Dropdown, Button, ButtonGroup} from 'react-bootstrap';
import ValidToken from './validToken.js';

export default () => {

  const history = useHistory();  

  const logout = () => {
    localStorage.clear();

    history.push("/");
  };

  const getNameUser = () => {
    const userName = localStorage.getItem('userName');

    let splitName = userName.split(' ');

    return splitName[0];
  }

  const backUserArea = () => {
    history.push("/userArea");
  };

  return (
    <div className="appWindow">
        <ToastContainer />
        <div className="headerUser">
            {getNameUser()}
            <Dropdown as={ButtonGroup}>
              <Button onClick={backUserArea} variant="success">{getNameUser()}</Button>

              <Dropdown.Toggle split variant="success" id="dropdown-split-basic" />

              <Dropdown.Menu>
                <Dropdown.Item as="button" onClick={()=> history.push("/changePassword")}>Alterar senha</Dropdown.Item>
                <Dropdown.Item as="button" onClick={()=> history.push("/userUpdate")}>Dados Pessoais</Dropdown.Item>
                <Dropdown.Item as="button" onClick={()=> logout()}>Sair</Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
        </div>
        <div className="contentArea">
          
        </div>
        <ValidToken/>
    </div>
    
  );
}