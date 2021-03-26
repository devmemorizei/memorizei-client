/* eslint-disable import/no-anonymous-default-export */
import React, {useState, useEffect} from 'react';
import { Card, Container, Col, Form, Button, Alert } from 'react-bootstrap';
import Logo from './Logo';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.min.css';
import { getBooks, getUserAnswers, saveAnswerUser } from '../Api';
import { useLocation, useHistory } from "react-router-dom";
import Loading from './Loading.js';
import ValidToken from './validToken.js';

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
    const [gradeCalculated, setGradeCalculated] = useState(0);
    const [quantityCorrectAnswers, setQuantityCorrectAnswers] = useState(0);
    const [finalized, setFinalized] = useState(false);

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
        if(!data.books) return;

        let answers = await getUserAnswers(location.state.bookId, location.state.titleId, location.state.chapterId);
        
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
        var questionsAnswereds = [];
        
        if(answers.data.answersUser.length !== questionsTest.length){
          answers.data.answersUser.forEach((questaoRespondida, indexRespondida) => {
            questionsTest.forEach((questao, indexQuestao) => {
                if(questaoRespondida.questionId === questao.questionID){
                  questionsAnswereds.push(indexQuestao);
                }
            });
          }); 

          questionsAnswereds.forEach(questionForDeleted => {
            questionsTest.splice(questionForDeleted, 1);
          });
        } else if (answers.data.answersUser.length > 0) {
          let firstDate = new Date(answers.data.answersUser[0].repeatAt);
          
          if(firstDate >= Date.now()){
            toast.error(`Você já respondeu todas as questões até o momento, você poderá repeti-las no dia ${firstDate.toLocaleString()}`, {
              autoClose:true,
              hideProgressBar:true
            });
  
            history.push("/userArea");
            return;
          }
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
        sendAnswerUser();
        setTextInput([]);
        limpaInputsRepostas();
        setQuestaoCerta(undefined);
        if(currentIndexQuestions + 1 === questions.length){
          setFinalized(true);
        } else {
          setCurrentIndexQuestions(currentIndexQuestions + 1);
        }
      }

      const sendAnswerUser = async () => {
        
        var objDataAnswer = {
          bookId: location.state.bookId,
          titleId: location.state.titleId, 
          chapterId: location.state.chapterId,
          questionId: currentQuestion.questionID,
          correctAnswer: questaoCerta,
          grade: gradeCalculated
        }
        
        saveAnswerUser(objDataAnswer);
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
        
        var objQuestionsCorrects = {
          questoesCertas: 0,
          questoesIncorretas: 0
        };
        let correctQuestion = false;

        for (let i = 0; i < currentQuestion.correctAnswers.length; i++) {

          const element = currentQuestion.correctAnswers[i];
          let answerExpectededNormal = removerAcentosString(element.answerExpecteded);
          let answerUser = removerAcentosString(textInput[i]);
          if(answerExpectededNormal === answerUser){
            setQuestaoCerta(true);
            correctQuestion = true;
            objQuestionsCorrects.questoesCertas++;
          }
          else{
            objQuestionsCorrects.questoesIncorretas++;
            correctQuestion = false;
            setQuestaoCerta(false);
          }
        }

        var percentageError = ((currentQuestion.correctAnswers.length - objQuestionsCorrects.questoesCertas) / currentQuestion.correctAnswers.length) * 100;
        
        if(percentageError === 100){
          setGradeCalculated(0);
        } else if(percentageError >= 60){
          setGradeCalculated(1);
        } else if (percentageError > 0){
          setGradeCalculated(2);
        } else {
          setGradeCalculated(5);
        }

        if(correctQuestion){
          var numCorrectQuestion = quantityCorrectAnswers + 1;
          setQuantityCorrectAnswers(numCorrectQuestion);
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
              finalized &&
              <>
                <br></br>
                <Alert show={true} variant="success">
                  <Alert.Heading>Artigos concluídos!</Alert.Heading>
                  <p>
                    Você acertou {quantityCorrectAnswers} de {questions.length}.
                  </p>
                  <p>
                    Clique no botão Home, para voltar e continuar seus estudos.
                  </p>
                  <hr />
                  <div className="d-flex justify-content-end">
                    <Button onClick={() => history.push("/userArea")} variant="cadastrar">
                      Home
                    </Button>
                  </div>
                </Alert>
              </>
            }
            {
              !load && currentQuestion && !finalized &&
              <div>
                <br></br>
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
        <ValidToken/>
    </div>
  );
}