import React from 'react';
import { Col, Container, Row } from 'react-bootstrap';
import Button from 'react-bootstrap/Button';
import { useHistory } from 'react-router-dom';

import logo from '../img/Logo.png';
import './Home.css';

export default () => {

    const history = useHistory();
    
  return (
    <div>
        <Container>
            <div className="container">
                <div className="boxHome">
                    <img
                        src={logo}
                        className="d-inline-block align-top"
                        alt="Memorizei logo"
                    />
                    <p>A maneira mais fácil e interativa de memorizar a Lei Seca</p>
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