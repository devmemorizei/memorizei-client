/* eslint-disable import/no-anonymous-default-export */
import React, { useState } from 'react';
import './userArea.css';
import { useHistory } from 'react-router-dom';
import { Form, Col, Button, Container } from 'react-bootstrap';
import { toast, ToastContainer } from 'react-toastify';
import Loading from './Loading.js';
import { changePassword } from '../Api.js';
import ValidToken from './validToken.js';

export default () => {
    const history = useHistory();
    
    const [load, setLoad] = useState(false);
    const [validated, setValidated] = useState(false);
    const [state , setState] = useState({
        oldPassword: '',
        newPassword : '',
        confirmPassword : ''
    });

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

        if(state.newPassword !== state.confirmPassword){
        setLoad(false);
        toast.error('A confirmação de senha deve ser igual ao campo de senha', {
            autoClose:false,
            hideProgressBar:true
        });
        return;
        }

        let userEmail = localStorage.getItem('userEmail');

        let response = await changePassword(userEmail, state.oldPassword, state.newPassword);
        setLoad(false);

        if(response && response.status === 200){
            if(response.data.message){
                toast.error(response.data.message, {
                autoClose:false,
                hideProgressBar:true
                });
            } else {
                toast.success('Senha alterada com sucesso', {
                autoClose:false,
                hideProgressBar:true
                });

                setState({
                    oldPassword: '',
                    newPassword : '',
                    confirmPassword : ''
                });
                setValidated(false);
            }
        } else if (response.status === 500){
            toast.error(response.data.message, {
                autoClose:false,
                hideProgressBar:true
            });
            } else {
                toast.error('Ocorreu um erro ao tentar salvar sua nova senha', {
                    autoClose:false,
                    hideProgressBar:true
                });
        }
    };

    return (
        <div className="appWindow">
            <ValidToken/>
            <ToastContainer />
            <div className="contentArea">
            {
                load &&
                <Container>
                <Loading type={'bubbles'} color={'#fe7353'} height={'20%'} width={'20%'}/>
                </Container>            
            }
            {
                !load &&
                <Container>
                <Form noValidate validated={validated} onSubmit={handleSubmitClick}>
                    <Col sm>
                        <Form.Group>
                        <Form.Label>Senha Atual</Form.Label>
                        <Form.Control 
                            className="inputOldPassword" 
                            type="password"
                            id="oldPassword"
                            required 
                            placeholder="Senha atual"
                            minLength="6" 
                            value={state.oldPassword}
                            onChange={handleChange}/>
                            <Form.Control.Feedback type="invalid">
                            Campo Obrigatório
                        </Form.Control.Feedback>
                        </Form.Group>                          
                    </Col>

                    <Col>
                        <Form.Group>
                        <Form.Label>Nova Senha</Form.Label>
                        <Form.Control 
                            className="inputNewPassword" 
                            type="password" 
                            id="newPassword"
                            required
                            minLength="6"
                            placeholder="Nova senha"
                            value={state.newPassword}
                            onChange={handleChange} />
                            <Form.Control.Feedback type="invalid">
                            Campo Obrigatório
                            </Form.Control.Feedback>
                        </Form.Group>                          
                    </Col>

                    <Col>
                        <Form.Group>
                        <Form.Label>Nova Senha</Form.Label>
                        <Form.Control 
                            className="inputConfirmPassword" 
                            type="password" 
                            id="confirmPassword"
                            required
                            minLength="6"
                            placeholder="Confirme sua nova senha"
                            value={state.confirmPassword}
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
                            Salvar Alteração
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
                </Form>
                </Container>
                
            }
            </div>
        </div>
        
    );
}