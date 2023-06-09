import { useEffect, useState } from "react";
import { useNavigate, useParams } from 'react-router-dom';
import styles from "./ProdutoForm.module.css";
import Message from '../components/Message';

//formuário de edição/cadastro de tipo
function TipoForm(){
    const [tipo, setTipo] = useState({})
    const navigate = useNavigate();
    const {codigo} = useParams();
    const [tipoMessage, setTipoMessage] = useState('')
    const[type, setType] = useState()

    useEffect(() => {
        //caso o tipo já tenha um id, seus dados serão carregados para possibilitar a edição,
        //caso não, o formulário aparecerá em branco para que um novo tipo seja cadastrado
        if(codigo){
            fetch('http://localhost:8080/php/api/Tipo/getById/?cod='+codigo, {
            method: 'GET',
            headers: {
            'Content-Type': 'application/json',
            },
            })
            .then((resp) => resp.json())
                .then((data) => {
                    if(!data){
                        navigate('/tipos', {state: { message: 'Registro não encontrado.', tipo: 'error'}})
                    }
                    setTipo(data)
                })
            .catch((error) => {
                console.error(error);
                })
        }
    }, [])
    //alterando os dados do tipo conforme hajam mudanças nos inputs
    function handleChange(e) {
        setTipo({ ...tipo, [e.target.name]: e.target.value })
    }
    //enviando os dados para seus respctivos endpoints nos casos de update e create
    const addtipo = (e) => {
        e.preventDefault()
        if(tipo.codigo){

            fetch('http://localhost:8080/php/api/Tipo/update', {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(tipo),
          }).then((resp) => {
            if (!resp.ok) {
                setTipoMessage('O cadastro não pôde ser atualizado. Verifique se já não há um registro com este nome.'); setType('error');
                throw new Error("HTTP status " + resp.status);
            }
            navigate('/tipos', {state: { message: 'Tipo atualizado com sucesso!', tipo: 'success'}})
        }).catch((error) => {
            console.error(error);
            })
        } else{
            fetch('http://localhost:8080/php/api/Tipo/create', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(tipo),
          })
          .then((resp) => {
            if (!resp.ok) {
                setTipoMessage('O cadastro não pôde ser realizado. Verifique se já não há um registro com este nome.'); setType('error');
                throw new Error("HTTP status " + resp.status);
            }
            navigate('/tipos', {state: { message: 'Tipo cadastrado com sucesso!', tipo: 'success'}})
        }).catch((error) => {
            console.error(error);
            })
        }
        
    }

    return(
        <div className={styles.novo_prod_container}>
            {tipoMessage && <Message type={type} msg={tipoMessage} />}
            <a href="/tipos">Voltar</a>
            <h1>Tipo de Produto</h1>
            <form onSubmit={addtipo}>
                <div className={styles.input_container}>
                    <label htmlFor="nome">Nome</label>
                    <input name="nome" type="text" onChange={handleChange} required value={tipo.nome} pattern="^[a-zA-Z0-9][a-zA-Z0-9].*[a-zA-Z0-9]$"
                    title="Este campo dever ser preenchido com pelo menos 3 caracteres alfanúmericos."></input>
                </div>
                <div className={styles.input_container}>
                    <label htmlFor="imposto">Percentual de Imposto</label>
                    <input name="imposto" type="number" step="0.01" min={0.01} max={9999} onChange={handleChange} required value={tipo.imposto}></input>
                </div>
                <button type="submit">Enviar</button>
            </form>
        </div>
    )
}
export default TipoForm