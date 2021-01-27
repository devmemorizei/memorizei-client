/* eslint-disable import/no-anonymous-default-export */
import React, { useState, useEffect } from 'react';
import {Container, Form, Button, Row, Col} from 'react-bootstrap';
import { getUser, updateUser } from '../Api.js';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.min.css'; 
import ValidToken from './validToken.js';
import { useHistory } from 'react-router-dom';

import './SingUp.css';
import { cpfMask, telephoneMask } from '../utils/mask.js';
import Loading from './Loading.js';

export default () => {
  const history = useHistory();

  const [state , setState] = useState({
    name : '',
    birthDate: '',
    email : '',
    cpf: '',
    homePhone: '',
    cellPhone: ''
  });
  const [load, setLoad] = useState(false);
  const [validated, setValidated] = useState(false);

  useEffect(() => {
    if(!state.name){
      loadUserDatas();
    }    
  });

  const loadUserDatas = async () => {
    setLoad(true);
    const { data } = await getUser(localStorage.getItem('userEmail'));

    data.birthDate = data.birthDate ? data.birthDate.split('T')[0] : '';

    setLoad(false);
    setState({
      name : data.name,
      birthDate: data.birthDate,
      email : data.email,
      cpf: data.cpf,
      homePhone: data.homePhone,
      cellPhone: data.cellPhone
    });
  };

  const handleChange = (e) => {
      const {id , value, checked} = e.target;

      switch (id) {
        case 'cpf':
          setState(prevState => ({
            ...prevState,
            [id] : cpfMask(value)
          }));
          break;
        case 'homePhone':
        case 'cellPhone':
          setState(prevState => ({
            ...prevState,
            [id] : telephoneMask(value)
          }));
          break;
        case 'liEAceito':
          setState(prevState => ({
            ...prevState,
            [id] : checked
          }));
          break;
        default:
          setState(prevState => ({
            ...prevState,
            [id] : value
          }));
          break;
      }
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

    let user = preencheUser();

    let response = await updateUser(user);

    setLoad(false);

    if(response && response.status === 201){
      if(response.data.message){
        toast.error(response.data.message, {
          autoClose:false,
          hideProgressBar:true
        });        
      } else {
          toast.success('Dados alterados com sucesso', {
            autoClose:false,
            hideProgressBar:true
          });

          setValidated(false);
      }
    } else {
      toast.error('Ocorreu um erro ao se registrar', {
        autoClose:false,
        hideProgressBar:true
      });
    }
  }

  const preencheUser = user => {
    user = {
      name: state.name,
      birthDate: state.birthDate,
      email: state.email,
      cpf: state.cpf,
      homePhone: state.homePhone,
      cellPhone: state.cellPhone,
      date: Date.now()
    };

    return user;
  }

  return (
    <div>
      <ValidToken/>
      <ToastContainer />
      <Container>
        <h5 className="txtSingUp">Alteração de dados</h5>
        {
          load &&
          <Loading type={'bubbles'} color={'#fe7353'} height={'20%'} width={'20%'}/>
        }
        {
          !load &&
          <div>
            <Form noValidate validated={validated} onSubmit={handleSubmitClick}>
            <Form.Group>
              <Row>
                <Col sm={6}>
                  <Form.Label className="labelSingUp">Nome</Form.Label>
                  <Form.Control
                      id="name"
                      size="md" 
                      type="text"
                      required
                      value={state.name}
                      onChange={handleChange} />
                  <Form.Control.Feedback type="invalid">
                    Campo Obrigatório
                  </Form.Control.Feedback>
                </Col>                    
                <Col sm>
                      <Form.Label className="labelSingUp">Data de nascimento</Form.Label>
                      <Form.Control 
                        id="birthDate" 
                        size="md" 
                        type="Date" 
                        required
                        value={state.birthDate}
                        onChange={handleChange} />
                      <Form.Control.Feedback type="invalid">
                        Campo Obrigatório
                      </Form.Control.Feedback>
                </Col>
              </Row>
                
              <Row>
                  <Col sm>
                      <Form.Label className="labelSingUp">E-mail</Form.Label>
                      <Form.Control 
                        id="email" 
                        size="md" 
                        type="email" 
                        disabled
                        value={state.email}
                        onChange={handleChange} />
                  </Col>
                  <Col sm>
                      <Form.Label className="labelSingUp">CPF</Form.Label>
                      <Form.Control 
                        id="cpf" 
                        size="md" 
                        type="input" 
                        maxLength="14"
                        minLength="14"
                        disabled
                        value={state.cpf}
                        onChange={handleChange} />
                  </Col>
              </Row>

              <Row>
                <Col sm>
                      <Form.Label className="labelSingUp">Telefone Residencial</Form.Label>
                      <Form.Control 
                        id="homePhone" 
                        size="md" 
                        type="input"
                        value={state.homePhone}
                        maxLength="12"
                        onChange={handleChange} />
                  </Col>
                  <Col sm>
                      <Form.Label className="labelSingUp">Telefone Celular</Form.Label>
                      <Form.Control 
                        id="cellPhone" 
                        size="md" 
                        type="input"
                        maxLength="13"
                        value={state.cellPhone}
                        onChange={handleChange} />
                  </Col>
              </Row>
              <br/>
              <Row>
                <Col>
                    <Button 
                        variant="cadastrar" 
                        size="md"
                        block
                        type="submit">
                        Salvar alterações
                    </Button>{' '}
                </Col>
                <Col xs="12">
                    <Button 
                        variant="login" 
                        size="lg" 
                        block 
                        style={{marginTop: 20}} 
                        onClick={()=> history.push("/userArea")}>
                        Voltar
                    </Button>{' '}
                </Col>
              </Row>
            </Form.Group>
          </Form>
          </div> 
        }
      </Container>
    </div>
  );
};
