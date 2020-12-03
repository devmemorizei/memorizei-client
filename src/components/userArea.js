/* eslint-disable import/no-anonymous-default-export */
import React, { useState, useEffect } from 'react';
import './userArea.css';
import { useHistory } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { Dropdown, Button, ButtonGroup} from 'react-bootstrap';
import ChangePassorwd from './changePassword.js';
import { verifyToken } from '../Api.js';
import UserUpdate from './userUpdate';

export default () => {

  const history = useHistory();
  const userName = localStorage.getItem('userName');
  const userToken = localStorage.getItem('token');
  const [changingPassword, setChangingPassword] = useState(false);
  const [changingUserData, setChangingUserData] = useState(false);

  const logout = () => {
    localStorage.clear();

    history.push("/");
  };

  useEffect(() => {
    if(!userToken){
      history.push("/");
    }

    validToken(userToken);        
  });

  const validToken = async (token) => {

    const tokenVerified = await verifyToken(token);

    if(!tokenVerified.data.auth){
      history.push("/");
    }
  };

  const backUserArea = () => {
    setChangingPassword(false);
    setChangingUserData(false);
  };

  return (
    <div className="appWindow">
        <ToastContainer />
        <div className="headerUser">
            {userName}
            <Dropdown as={ButtonGroup}>
              <Button onClick={backUserArea} variant="success">{userName}</Button>

              <Dropdown.Toggle split variant="success" id="dropdown-split-basic" />

              <Dropdown.Menu>
                <Dropdown.Item as="button" onClick={()=> setChangingPassword(true)}>Alterar senha</Dropdown.Item>
                <Dropdown.Item as="button" onClick={()=> setChangingUserData(true)}>Dados Pessoais</Dropdown.Item>
                <Dropdown.Item as="button" onClick={()=> logout()}>Sair</Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
        </div>
        <div className="contentArea">
          {
            changingPassword &&
            <ChangePassorwd setChangingPassword={setChangingPassword}/>
          }
          {
            changingUserData &&
            <UserUpdate setChangingUserData={setChangingUserData}/>
          }
        </div>
    </div>
    
  );
}