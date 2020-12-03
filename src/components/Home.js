/* eslint-disable import/no-anonymous-default-export */
import React, { useEffect } from 'react';
import { Col, Container, Row } from 'react-bootstrap';
import Button from 'react-bootstrap/Button';
import { useHistory } from 'react-router-dom';
import { verifyToken } from '../Api.js';

import './Home.css';
import Logo from './Logo';

export default () => {

    const userToken = localStorage.getItem('token');
    const history = useHistory();

    useEffect(() => {
        if(!userToken) return;

        validToken(userToken);        
    });

    const validToken = async (token) => {

        const tokenVerified = await verifyToken(token);

        if(tokenVerified.data.auth){
            history.push("/userArea");
        }
    }
    
    return (
        <div>
            <Container>
                <div className="container">
                    <div className="boxHome">
                        <Logo/>
                        <p className="txtHome">A maneira mais fácil e interativa de memorizar a Lei Seca</p>
                        <Row>
                            <Col xs="12">
                                <Button 
                                    variant="cadastrar" 
                                    size="lg" 
                                    block 
                                    onClick={()=> history.push("/cadastrar")}>
                                    Cadastrar
                                </Button>{' '}
                            </Col>
                            <Col xs="12">
                                <Button 
                                    variant="login" 
                                    size="lg" 
                                    block 
                                    style={{marginTop: 20}} 
                                    onClick={()=> history.push("/login")}>
                                    Já tenho uma conta
                                </Button>{' '}
                            </Col>
                        </Row>
                    </div>  
                </div>            
            </Container>
        </div>
    );
}