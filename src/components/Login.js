/* eslint-disable import/no-anonymous-default-export */
import React, { useState } from 'react';
import { Col, Container, Row, Form } from 'react-bootstrap';
import Button from 'react-bootstrap/Button';
import { useHistory } from 'react-router-dom';
import { login } from '../Api.js';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.min.css';
import Loading from './Loading.js'; 

import './Login.css';
import Logo from './Logo';

export default () => {

    const history = useHistory();

    const [state , setState] = useState({
      user : '',
      password : ''
    });
    const [validated, setValidated] = useState(false);
    const [load, setLoad] = useState(false);

    const handleChange = (e) => {
        const {id , value} = e.target   
        setState(prevState => ({
            ...prevState,
            [id] : value
        }))
    };

    const handleSubmitClick = async (e) => {
      setLoad(true);
      const form = e.currentTarget;
      e.preventDefault();
      setValidated(true);

      if (form.checkValidity() === false) {
        setLoad(false);
        e.preventDefault();
        e.stopPropagation();
        toast.error('Todos os campos obrigatórios devem ser preenchidos', {
          autoClose:false,
          hideProgressBar:true
        });
        return;
      }

      let response = await login(state);
      setLoad(false);

      if(response && response.status === 200){
        if(response.data.message){
          toast.error(response.data.message, {
            autoClose:false,
            hideProgressBar:true
          });
        } else {
          history.push("/");
        }
      } else {
        toast.error('Ocorreu um erro ao tentar realizar o login', {
          autoClose:false,
          hideProgressBar:true
        });
      }

    };
    
  return (
    <div>
        <ToastContainer />
        <Container>
            <div className="container">
                <div className="boxHome">
                    <Logo/>
                    <p className="txtHome">A maneira mais fácil e interativa de memorizar a Lei Seca</p>
                    {
                      load &&
                      <Loading type={'bubbles'} color={'#fe7353'} height={'20%'} width={'20%'}/>
                    }
                    {
                      !load &&
                      <Row>
                        <Form noValidate validated={validated} onSubmit={handleSubmitClick}>
                          <Col sm>
                            <Form.Group>
                              <Form.Label>E-mail ou CPF</Form.Label>
                              <Form.Control 
                                className="inputLogin" 
                                type="input"
                                id="user"
                                required 
                                placeholder="E-mail ou CPF" 
                                value={state.user}
                                onChange={handleChange}/>
                                <Form.Control.Feedback type="invalid">
                                Campo Obrigatório
                              </Form.Control.Feedback>
                            </Form.Group>                          
                          </Col>

                          <Col>
                            <Form.Group>
                              <Form.Label>Senha</Form.Label>
                              <Form.Control 
                                className="inputLogin" 
                                type="password" 
                                id="password"
                                required
                                placeholder="Senha"
                                value={state.password}
                                onChange={handleChange} />
                                <Form.Control.Feedback type="invalid">
                                  Campo Obrigatório
                                </Form.Control.Feedback>
                            </Form.Group>                          
                          </Col>
                          
                          <Col xs="12">
                              <Button 
                                  variant="cadastrar" 
                                  size="lg"
                                  block
                                  type="submit">
                                  Entrar
                              </Button>{' '}
                          </Col>

                          <Col sm className="spanCadastrar">
                            <span onClick={()=> history.push("/cadastrar")} style={{fontWeight:'bold', cursor:'pointer'}}>Não tem uma conta? Cadastre-se</span>
                          </Col>
                        </Form>
                      </Row>
                    }
                </div>  
            </div>            
        </Container>
    </div>
  );
}