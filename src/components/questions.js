/* eslint-disable import/no-anonymous-default-export */
import React, {useState, useEffect} from 'react';
import { Card, Container, Col, Form, Button, Alert } from 'react-bootstrap';
import Logo from './Logo';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.min.css';
import { getBooks } from '../Api';
import { useLocation, useHistory } from "react-router-dom";
import Loading from './Loading.js';

export default () => {

    const history = useHistory();
    const location = useLocation();

    const [currentIndexQuestions, setCurrentIndexQuestions] = useState(0);
    const [questions, setQuestions] = useState(undefined);
    const [currentQuestion, setCurrentQuestions] = useState(undefined);
    const [descricaoQuestaoAlterada, setDescricaoQuestaoAlterada] = useState('');
    const [textInput, setTextInput] = useState([]);
    const [questaoCerta, setQuestaoCerta] = useState(undefined);
    const [load, setLoad] = useState(false);      

      useEffect(() => {
        if(!questions){
          loadQuestions();
        }
      });

      useEffect(() => {
        if(questions){
          setCurrentQuestions(questions[currentIndexQuestions]);
        }        
      }, [currentIndexQuestions])
      
      useEffect(() => {
        if(questions){
          setDescricaoQuestaoAlterada(atualizaDescricao);
        }        
      }, [currentQuestion]);

      const loadQuestions = async () => {
        setLoad(true);
        let {data} = await getBooks();
        let book = {};
        let title = {};
        let chapter = {};
        let questionsTest = [];

        book = data.books.find(book => book._id === location.state.bookId);
        title = book.title.find(title => title.idTitle === location.state.titleId);

        if(!location.state.chapterId){
          questionsTest = title.questions;
        } else {
          chapter = title.chapter.find(chapter => chapter.idChapter === location.state.chapterId);
          questionsTest = chapter.questions;
        }

        if(questionsTest.length === 0){
          toast.error('Não existem questões cadastradas', {
            autoClose:true,
            hideProgressBar:true
          });

          history.push("/userArea");
          return;
        }

        setQuestions(questionsTest);
        setCurrentQuestions(questionsTest[currentIndexQuestions]);
        setTextInput(Array.from(Array(Number(questionsTest[0].correctAnswers.length))));
        setLoad(false);
      };
    
      const handleClickVerify = () => {
        if(!verificaTodasRespondidas()){
          toast.error('Todas as respostas precisam ser preenchidas', {
            autoClose:true,
            hideProgressBar:true
          });

          return;
        }
          
        verificaRepostasCorreta();
      };
    
      const handleClickContinue = () => {
        setTextInput([]);
        limpaInputsRepostas();
        setQuestaoCerta(undefined);
        if(currentIndexQuestions + 1 === questions.length){
          alert('Acabou as questões');
        } else {
          setCurrentIndexQuestions(currentIndexQuestions + 1);
        }
      }
    
      const handleOnChangeInput = (e) => {
        let resposta = textInput;
        resposta[e.target.tabIndex] = e.target.value;
    
        setTextInput(resposta);
    
        setDescricaoQuestaoAlterada(atualizaDescricao);
      }

      const limpaInputsRepostas = () => {
        let inputs = Array.from(document.querySelectorAll('input'));
    
        inputs.forEach(input => {
          input.value = '';
        });
      }
    
      const verificaRepostasCorreta = () => {
        for (let i = 0; i < currentQuestion.correctAnswers.length; i++) {
          const element = currentQuestion.correctAnswers[i];
          let answerExpectededNormal = removerAcentosString(element.answerExpecteded);
          let answerUser = removerAcentosString(textInput[i]);
          if(answerExpectededNormal === answerUser){
            setQuestaoCerta(true);
          }
          else{
            setQuestaoCerta(false);
          }
        }

        setTimeout(() => {window.scrollTo(0,document.body.scrollHeight);}, 300);
      }
    
      const removerAcentosString = (str) => {
        return str.normalize("NFD").replace(/[^a-zA-Zs]/g, "").toLowerCase();
      }
    
      const verificaTodasRespondidas = () => {
        let todasRespondidas = false;
        let countRespondidas = 0;
        textInput.forEach(element => {
            if(element !== '' && element !== undefined)
              countRespondidas += 1;
        });
    
        todasRespondidas = countRespondidas === currentQuestion.correctAnswers.length ? true : false;
    
        return todasRespondidas;
      }
    
      const atualizaDescricao = () => {
        let description = ' ';
        let descriptionAlter = currentQuestion.questionDescription;
    
        for (let i = 0; i < currentQuestion.correctAnswers.length; i++) {
          if(textInput[i] && textInput[i] !== ''){
            description += String(textInput[i]).toUpperCase();
          } else{
            for (let j = 0; j < currentQuestion.correctAnswers[i].answerExpecteded.length; j++) {
              description += '_';
            }
          }      
          descriptionAlter = descriptionAlter.replace('[RESPOSTA_USUARIO]', description);
          description = ' ';
        }
    
        return descriptionAlter;
      }
    
      function createMarkup(html) { return {__html: html}; };
    
  return (
    <div>
        <ToastContainer />
        <Container>
            <Logo/>
            {
              load &&
              <Loading type={'bubbles'} color={'#fe7353'} height={'20%'} width={'20%'}/>
            }
            {
              !load && currentQuestion &&
              <div>
                <Card bg='light' text='dark' className="mb-2">                    
                    <Card.Body>
                    <Card.Text id="CardText1">
                        <div dangerouslySetInnerHTML={createMarkup(descricaoQuestaoAlterada)}></div>
                        {currentQuestion.correctAnswers.map((_, index) => {
                                return  <div key={index} id={index}>
                                            <Col sm>
                                                <Form.Label className="labelSingUp">{"Digite aqui a " + (index + 1) + "ª lacuna"}</Form.Label>
                                                <Form.Control 
                                                onChange={handleOnChangeInput}
                                                tabIndex={index}                                                
                                                type="text"
                                                disabled = {questaoCerta === true || questaoCerta === false} />
                                            </Col>
                                        </div>
                        })}
                        {
                            questaoCerta === undefined &&
                            <div className="d-flex justify-content-end" style={{padding: '10px'}}>
                                <Button 
                                    variant="success"
                                    size="lg"
                                    onClick={handleClickVerify}>
                                    Verificar
                                </Button>{' '}
                            </div>
                        }
                    </Card.Text>
                    </Card.Body>
                </Card>
                {textInput}
                <Alert show={questaoCerta === true} variant="success">
                        <Alert.Heading>Correto</Alert.Heading>
                        <hr />
                        <div className="d-flex justify-content-end">
                        <Button onClick={handleClickContinue} variant="outline-success">
                            Continuar
                        </Button>
                        </div>
                </Alert>
                <Alert show={questaoCerta === false} variant="danger">
                        <Alert.Heading>Repostas corretas:</Alert.Heading>
                        <ul>
                            {currentQuestion.correctAnswers.map((answer, index) => {
                            return <li key={index}>{(index + 1) + 'ª lacuna: '}<strong>{answer.answerExpecteded}</strong></li>
                            })}
                        </ul>
                        <hr />
                        <div className="d-flex justify-content-end">
                        <Button onClick={handleClickContinue} variant="outline-danger">
                            Continuar
                        </Button>
                        </div>
                </Alert>
              </div>
            }
        </Container>
    </div>
  );
}