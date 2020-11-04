/* eslint-disable import/no-anonymous-default-export */
import React, {useState} from 'react';
import {Container, Form, Button, Row, Col, Alert} from 'react-bootstrap';
import { useHistory } from 'react-router-dom';
import { createUser } from '../Api.js';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.min.css'; 

import Logo from './Logo';
import './SingUp.css';
import Policy from './Policy.js';
import { cpfMask, telephoneMask } from '../utils/mask.js';
import Loading from './Loading.js';

export default () => {

  const history = useHistory();

  const [state , setState] = useState({
    name : '',
    birthDate: '',
    email : '',
    cpf: '',
    password : '',
    confirmPassword : '',
    homePhone: '',
    cellPhone: '',
    typeUser: 0,
    liEAceito: false
  });
  const [exibePolitica, setExibePolitica] = useState(false);
  const [load, setLoad] = useState(false);
  const [registerCompleted, setRegisterCompleted] = useState(false);
  const [validated, setValidated] = useState(false);

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

    if(!state.liEAceito){
      setLoad(false);
      toast.error('A opção Li e aceito a política de privacidade e cookies deve ser marcada ', {
        autoClose:false,
        hideProgressBar:true
      });
      return;
    }

    if(state.password !== state.confirmPassword){
      setLoad(false);
      toast.error('A confirmação de senha deve ser igual ao campo de senha', {
        autoClose:false,
        hideProgressBar:true
      });
      return;
    }

    let user = preencheUser();

    let response = await createUser(user);

    setLoad(false);

    if(response && response.status === 201){
      if(response.data.message){
        toast.error(response.data.message, {
          autoClose:false,
          hideProgressBar:true
        });
        
      } else {
        setRegisterCompleted(true);
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
      password: state.password,
      homePhone: state.homePhone,
      cellPhone: state.cellPhone,
      typeUser: state.typeUser,
      date: Date.now()
    };

    return user;
  }

  return (
    <div>
      <ToastContainer />
      <Container>
        <Logo/>
        <h5 className="txtSingUp">Cadastre-Se</h5>
        {
          load &&
          <Loading type={'bubbles'} color={'#fe7353'} height={'20%'} width={'20%'}/>
        }
        {
          !exibePolitica && !load && !registerCompleted &&
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
                        required
                        value={state.email}
                        onChange={handleChange} />
                      <Form.Control.Feedback type="invalid">
                        Campo Obrigatório
                      </Form.Control.Feedback>
                  </Col>
                  <Col sm>
                      <Form.Label className="labelSingUp">CPF</Form.Label>
                      <Form.Control 
                        id="cpf" 
                        size="md" 
                        type="input" 
                        maxLength="14"
                        minLength="14"
                        required
                        value={state.cpf}
                        onChange={handleChange} />
                      <Form.Control.Feedback type="invalid">
                        Campo Obrigatório
                      </Form.Control.Feedback>
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

              <Row>
                <Col sm>
                  <Form.Label className="labelSingUp">Senha</Form.Label>
                  <Form.Control 
                    id="password" 
                    size="md" 
                    type="password"
                    required
                    minLength="8"
                    value={state.password}
                    onChange={handleChange} />
                    <Form.Control.Feedback type="invalid">
                      Sua senha deve possuir no mínimo 8 caracteres.
                    </Form.Control.Feedback>
                </Col>

                <Col sm>
                  <Form.Label className="labelSingUp">Confirme sua senha</Form.Label>
                  <Form.Control 
                    id="confirmPassword" 
                    size="md"
                    type="password"
                    required
                    minLength="8"
                    value={state.confirmPassword}
                    onChange={handleChange} />
                    <Form.Control.Feedback type="invalid">
                      Campo Obrigatório
                    </Form.Control.Feedback>
                </Col>
              </Row>

              <Row>
                <Col sm>
                  <Form.Label className="labelSingUp">Para que deseja estudar?</Form.Label>
                  <Form.Control as="select" id="typeUser" required value={state.typeUser} onChange={handleChange}>
                    <option value={0}>Concurso</option>
                    <option value={1}>Faculdade</option>
                  </Form.Control>
                </Col>
              </Row>

              <Row>
                <Col sm>
                  {['checkbox'].map((type) => (
                    <div key={`inline-${type}`} className="mb-3">
                      <Form.Check 
                        inline  
                        type={type} 
                        checked={state.liEAceito}
                        onChange={handleChange}
                        className="labelSingUp" 
                        id='liEAceito' />
                      <span> Li e aceito a <span onClick={()=>setExibePolitica(true)} style={{fontWeight:'bold', cursor:'pointer'}}>política de privacidade e cookies.</span></span>
                    </div>
                  ))}
                </Col>
              </Row>
              <Col>
                <Button 
                    variant="cadastrar" 
                    size="md"
                    block
                    type="submit">
                    Registrar
                </Button>{' '}
            </Col>
            </Form.Group>
          </Form>
          <Row>
            <Col>
              <Button 
                  variant="login" 
                  size="sm"
                  block 
                  onClick={()=> history.push("/")}>
                  Cancelar
              </Button>{' '}
            </Col>             
          </Row>
          </div> 
        }
        {
          registerCompleted &&
          <>
            <Alert show={true} variant="success">
              <Alert.Heading>Registro realizado com sucesso!</Alert.Heading>
              <p>
                Seu cadastro no Memorizei foi realizado com sucesso, favor realizar o seu login para
                aproveitar os recursos do nosso aplicativo.
              </p>
              <hr />
              <div className="d-flex justify-content-end">
                <Button onClick={() => history.push("/login")} variant="cadastrar">
                  Fazer login
                </Button>
              </div>
            </Alert>
          </>
        }
        {
          exibePolitica &&
          <Policy setExibePolitica={setExibePolitica}/>
        }
      </Container>
    </div>
  );
};
