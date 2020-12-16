/* eslint-disable import/no-anonymous-default-export */
import React, { useEffect } from 'react';
import './userArea.css';
import { useHistory } from 'react-router-dom';
import { verifyToken } from '../Api.js';
import Loading from 'react-loading';

export default () => {

  const history = useHistory();
  const userToken = localStorage.getItem('token');

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

  return (
    <Loading></Loading>
  );
}