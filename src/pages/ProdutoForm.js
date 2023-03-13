import { useEffect, useState } from "react";
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import Message from '../components/Message';
import styles from "./ProdutoForm.module.css";

function ProdutoForm(){

    const [produto, setProduto] = useState({})
    const [tipos, setTipos] = useState([]);
    const navigate = useNavigate();
    const {codigo} = useParams();
    const[type, setType] = useState()
    const location = useLocation()
    let message = ''
    if (location.state) {
        message = location.state.message
    }

    useEffect(() => {
        if(codigo){
            fetch('http://localhost:8080/php/api/Produto/getById/?cod='+codigo, {
            method: 'GET',
            headers: {
            'Content-Type': 'application/json',
            },
            })
            .then((resp) => resp.json())
                .then((data) => {
                    setProduto(data)
                })
            .catch((error) => {
                console.error(error);
                })
        }
    }, [])

    useEffect(() => {
        fetch('http://localhost:8080/php/api/Tipo/getAll', {
        method: 'GET',
        headers: {
        'Content-Type': 'application/json',
        },
        })
        .then((resp) => resp.json())
            .then((data) => {
                setTipos(data)
            })
        .catch((error) => {
            console.error(error);
            })
    }, [])

    function handleChange(e) {
        setProduto({ ...produto, [e.target.name]: e.target.value })
    }

    const addProduto = (e) => {
        e.preventDefault()
        if(produto.codigo){
            fetch('http://localhost:8080/php/api/Produto/update', {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(produto),
          }).then((resp) => resp.json())
            .then((data) =>
                navigate('/produtos', {state: { message: 'Produto atualizado com sucesso!', type: 'success'}})
        ).catch((error) => {console.error(error); message = 'Ocorreu um erro.'; setType('error')})
        } else{
            fetch('http://localhost:8080/php/api/Produto/create', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(produto),
          })
            .then(
              navigate('/produtos', {state: { message: 'Produto cadastrado com sucesso!'}})
        ).catch((error) => {console.error(error); message = 'Ocorreu um erro.'; setType('error')})
        }
        
    }

    return(
        <div className={styles.novo_prod_container}>
            {message && <Message type={type} msg={message} />}
            <a href="/produtos">Voltar</a>
            <h1>Produto</h1>
            <form onSubmit={addProduto}>
                <div className={styles.input_container}>
                    <label htmlFor="nome">Nome</label>
                    <input name="nome" type="text" onChange={handleChange} required value={produto.nome} pattern="^[a-zA-Z0-9].*[a-zA-Z0-9]$"></input>
                </div>
                <div className={styles.input_container}>
                    <label htmlFor="valor">Valor Unitário (R$)</label>
                    <input name="valor" type="number" min={0.01} max={9999} step="0.01" onChange={handleChange} required value={produto.valor}></input>
                </div>
                <div className={styles.input_container}>
                    <label htmlFor="tipo">Tipo</label>
                    <select name="tipo" onChange={handleChange} required>
                        <option selected disabled value=''>Selecione um tipo</option>
                        {tipos.length > 0 && 
                        tipos.map((tipo, key) => (
                            <option key={key} value={tipo.codigo} selected={produto.tipo === tipo.codigo && "selected"}>{tipo.nome}</option>
                        ))}
                    </select>
                </div>
                <button type="submit">Enviar</button>
            </form>
        </div>
    )
}
export default ProdutoForm