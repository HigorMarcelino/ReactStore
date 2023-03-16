import { useEffect, useState } from "react";
import styles from "./Produtos.module.css";
import Message from '../components/Message';
import { useLocation } from 'react-router-dom';

//pagina de display de todos os produtos cadastrados, com acesso à edição, remoção e adição de novos tipos
function Tipos(){

    const [tipos, setTipos] = useState([]);
    const [tipoMessage, setTipoMessage] = useState('')
    const location = useLocation()
    const[type, setType] = useState()
    let message, tipo = ''
    if (location.state) {
        message = location.state.message
        tipo = location.state.tipo
    }
    const [currentPage, setCurrentPage] = useState(1);
    const displayedTipos = paginate(tipos, currentPage, 12);
    const totalPages = Math.ceil(tipos.length / 12);

    //carregando todos os tipos
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
    //excluindo o tipo selecionado
    const handleDelete = (codigo) => {
    if(window.confirm("Deseja deletar este registro?")){
        setTipoMessage('');
        fetch('http://localhost:8080/php/api/Tipo/delete/?cod='+codigo, {
            method: 'DELETE',
            headers: {
            'Content-Type': 'application/json',
            }})
            .then((resp) => {
                if (!resp.ok) {
                    setTipoMessage('Ocorreu um erro. Verifique se este tipo não está associado a um produto.'); setType('error');
                    throw new Error("HTTP status " + resp.status);
                }
                return resp.json();
            })
            .then((data) => {
                console.log(data)
                setTipos(displayedTipos.filter((tipo) => tipo.codigo !== codigo))
                setTipoMessage('Tipo removido com sucesso!'); setType('success')
            }).catch((err) => {console.log(err);})
    }};
    //secciona os dados para deixar a página mais palatável
    function paginate(items, currentPage, itemsPerPage) {
        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
      
        return items.slice(startIndex, endIndex);
      }

    return(
        <div className={styles.table_container}>
        {message && <Message type={tipo} msg={message} />}
        {tipoMessage && <Message type={type} msg={tipoMessage} />}
        <a href="/tipo/novo" className={styles.novo_prod}>Adicionar Tipo</a>
        {tipos.length > 0 && 
        <div>
            {/*Tabela de disposição dos produtos */}
            <table className={styles.table_prod}>
                <thead>
                <tr>
                    <th>Código</th>
                    <th>Nome</th>
                    <th>Percentual de Imposto</th>
                    <th>Ações</th>
                </tr>
                </thead>
                <tbody>
                {displayedTipos.length > 0 && 
                    displayedTipos.map((tipo) => (
                        <tr key={tipo.codigo} className={styles.content}>
                            <td className={styles.td_cod}>{tipo.codigo}</td>
                            <td className={styles.td_nome}>{tipo.nome}</td>
                            <td>{tipo.percentual_imposto}%</td>
                            <td>
                                <a className={styles.edit} href={"/tipo/editar/"+tipo.codigo}>&#9998;</a>
                                <button onClick={() => handleDelete(tipo.codigo)} className={styles.delete} >&#10006;</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            {/*Menu de paginação */}
            <div className={styles.pagination}>
                {tipos.length > 12 && Array.from({ length: totalPages }).map((_, index) => (
                <button
                    key={index}
                    className={currentPage === index + 1 ? styles.active : ''}
                    onClick={() => setCurrentPage(index + 1)}
                >
                    {index + 1}
                </button>
                ))}
            </div>
        </div>}
        {tipos.length < 1 && <h3>Ainda não há Tipos de Produto cadastrados</h3>}
        </div>
    )
}
export default Tipos