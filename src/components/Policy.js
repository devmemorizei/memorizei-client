/* eslint-disable import/no-anonymous-default-export */
import React from 'react';
import { FcPrevious } from "react-icons/fc";
import { Tooltip, OverlayTrigger, Row, Container } from 'react-bootstrap';

export default ({ setExibePolitica }) => {

    const renderTooltip = (props) => (
        <Tooltip id="button-tooltip" {...props}>
            Voltar
        </Tooltip>
    );
    
  return (
    <div>
        <Container>
            <Row>
                <OverlayTrigger
                        placement="right"
                        delay={{ show: 250, hide: 100 }}
                        overlay={renderTooltip}
                    >
                        <span style={{cursor: 'pointer'}} onClick={()=>setExibePolitica(false)}> <FcPrevious size="2em"/> </span>
                    </OverlayTrigger>
                    <h3 style={{float:'left'}}>Política de Privacidade</h3>
            </Row>
            <br></br>
            <br></br>
            <h5>Dados Pessoais</h5>
            Em tudo que a gente faz, buscamos proteger nossos dados e informações. A gente sabe que pra você 
            também é assim. Seus dados pessoais("Dados pessoais: informação relacionada a pessoa natural identificada ou identificável pela Memorizei") são bens valiosos que devem ser preservados. 
            Por isso você precisa saber exatamente como eles podem ser utilizados. Foi justamente para isso que 
            criamos essa Política de Privacidade.
            <br></br>
            Coletamos alguns Dados sobre você quando você cria o seu registro no Memorizei, para que você crie 
            um login e senha. Durante o processo de cadastro, nós solicitamos Dados como 
            seu nome completo, endereço de e-mail, data de nascimento, CPF, telefone fixo e/ou celular e, no 
            caso de assinatura de Serviços, dados de cobrança (conforme aplicável ao Serviço).
            <br></br>
            <br></br>
            <h5>Utilização de cookies</h5>
            <strong>O que são cookies e qual sua utilidade</strong>
            <br></br>
            Cookies são pequenos arquivos de texto enviados e armazenados no seu computador. 
            Estes pequenos arquivos servem para reconhecer, acompanhar e armazenar a sua navegação como usuário 
            na Internet.
            <br></br>
            <br></br>
            <strong>Qual a utilidade dos cookies</strong>
            <br></br>
            O uso de cookies para acompanhar e armazenar informações possibilitará à Memorizei 
            oferecer um serviço mais personalizado, de acordo com as características e interesses de seus 
            usuários, possibilitando, inclusive, ao usuário permanecer logado em um computador.
            <br></br>
            <br></br>
            <strong>Categorias de cookies</strong>
            <br></br>
            <u>Estritamente necessária</u>
            <br></br>
            Necessários para o funcionamento do site. Eles permitem que você navegue em nossos sites e 
            use os serviços e recursos (por exemplo, cookies de segurança para autenticar usuários, evitar a 
            utilização fraudulenta de credenciais de login e proteger os dados do usuário de terceiros não autorizados).
            <br></br>
            <br></br>
            <br></br>            
        </Container>
    </div>
  );
}