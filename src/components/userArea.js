/* eslint-disable import/no-anonymous-default-export */
import React, { useEffect, useState } from 'react';
import './userArea.css';
import { useHistory } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { Dropdown, Button, ButtonGroup, Container, Card, Badge } from 'react-bootstrap';
import ValidToken from './validToken.js';
import Logo from './Logo';
import Loading from './Loading.js';
import { getBooks } from '../Api';

export default () => {

  const history = useHistory();
  const [titles, setTitles] = useState(undefined);
  const [bookDescription, setBookDescription] = useState(null);
  const [load, setLoad] = useState(false);

  useEffect(() => {
    if(!titles){
      loadBook();
    }       
  });

  const loadBook = async () => {
    setLoad(true);
    let {data} = await getBooks();
    
    if(!data.books) return;

    data.books[0].title.forEach(title => {
      if(title.chapter.length > 0){
        title.chapter.forEach(chapter => {
          delete chapter.questions;
        });        
      } else {
          delete title.questions;
      }
    });

    setTitles(data.books[0].title);
    setBookDescription(
      {
        id: data.books[0]._id,
        descripton: data.books[0].bookDescription,
      }
    );
    
    setLoad(false);

  };

  const logout = () => {
    localStorage.clear();

    history.push("/");
  };

  const getNameUser = () => {
    const userName = localStorage.getItem('userName');

    let splitName = userName ? userName.split(' ') : '';

    return splitName[0];
  }

  const backUserArea = () => {
    history.push("/userArea");
  };

  return (
    <div className="appWindow">
        <ToastContainer />
        <div className="headerUser">
            {localStorage.getItem('userName')}
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
          <Container>
            <Logo/>
            <br/>
            {
              load &&
              <Loading type={'bubbles'} color={'#fe7353'} height={'20%'} width={'20%'}/>
            }
            {
              !load && titles &&
              <div>
                <h4>{bookDescription.descripton}</h4>
                <div>
                  {
                    titles.map( title => {
                      return <Card style={{marginBottom:'10px'}}>
                              <Card.Header>
                                {title.descriptionTitle}
                                {
                                  title.free &&
                                  <span>
                                    <Badge variant="success">Free</Badge>{' '}
                                  </span>
                                }
                                {
                                  !title.free &&
                                  <span>
                                    <Badge variant="danger">Premium</Badge>{' '}
                                  </span>
                                }
                              </Card.Header>                              
                              <Card.Body>
                                {
                                  title.chapter.length === 0 &&
                                  <div>
                                    <Button 
                                      disabled={!title.free} 
                                      variant="primary"
                                      onClick={()=> history.push("/questions", {bookId: bookDescription.id, titleId: title.idTitle})}>
                                      Responder
                                    </Button>
                                  </div>
                                }
                                {
                                  title.chapter.length > 0 &&

                                  title.chapter.map(chapter => {
                                    return <div>
                                            <Card.Title>
                                              {chapter.descriptionChapter}
                                            </Card.Title>
                                            <Button 
                                              disabled={!title.free} 
                                              style={{marginBottom:'10px'}} 
                                              variant="primary"
                                              onClick={()=> history.push("/questions", {bookId: bookDescription.id, titleId: title.idTitle, chapterId: chapter.idChapter})}>
                                              Responder
                                            </Button>
                                          </div>                                          
                                  })
                                }
                              </Card.Body>
                            </Card>
                    })
                  }
                  <br/>
                </div>
              </div>
            }          
          </Container>
        </div>
        <ValidToken/>
    </div>    
  );
}