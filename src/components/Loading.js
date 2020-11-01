/* eslint-disable import/no-anonymous-default-export */
import React from 'react';
import ReactLoading from 'react-loading';

export default ({ type, color, height, width }) => {
  return (
    <ReactLoading type={type} color={color} height={height} width={width} />
  );
}