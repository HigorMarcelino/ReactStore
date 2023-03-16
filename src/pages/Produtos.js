import { useEffect, useState } from "react";
import styles from "./Produtos.module.css";
import { useLocation } from 'react-router-dom';
import Message from '../components/Message';

//pagina de display de todos os produtos cadastrados, com acesso à edição, remoção e adição de novos produtos
function Produtos(){

    const [produtos, setProdutos] = useState([]);
    const [produtoMessage, setProdutoMessage] = useState('')
    const location = useLocation()
    const[type, setType] = useState()
    let message, tipo = ''
    if (location.state) {
        message = location.state.message
        tipo = location.state.tipo
    }
    const [currentPage, setCurrentPage] = useState(1);
    const displayedProdutos = paginate(produtos, currentPage, 12);
    const totalPages = Math.ceil(produtos.length / 12);
    
    //carregando todos os produtos
    useEffect(() => {
        fetch('http://localhost:8080/php/api/Produto/getAll', {
        method: 'GET',
        headers: {
        'Content-Type': 'application/json',
        },
        })
        .then((resp) => resp.json())
            .then((data) => {
                setProdutos(data)
            })
        .catch((error) => {
            console.error(error);
            })
    }, [])
    //excluindo o produto selecionado
    const handleDelete = (codigo) => {
        if(window.confirm("Deseja deletar este registro?")){
            fetch('http://localhost:8080/php/api/Produto/delete/?cod='+codigo, {
                method: 'DELETE',
                headers: {
                'Content-Type': 'application/json',
                }})
                .then((resp) => resp.json)
                .then((data) => {
                    setProdutos(produtos.filter((produto) => produto.codigo !== codigo))
                    setProdutoMessage('Produto removido com sucesso!');
                    setType('success');
                }).catch((err) => {console.error(err); setProdutoMessage('Ocorreu um erro.'); setType('error')})
        }
    };
    //secciona os dados para deixar a página mais palatável
    function paginate(items, currentPage, itemsPerPage) {
        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
      
        return items.slice(startIndex, endIndex);
      }

    return(
        <div className={styles.table_container}>
            {message && <Message type={tipo} msg={message} />}
            {produtoMessage && <Message type={type} msg={produtoMessage} />}
            <a href="/produto/novo" className={styles.novo_prod}>Adicionar Produto</a>
            {produtos.length > 0 && 
            <div>
                {/*Tabela de disposição dos produtos */}
                <table className={styles.table_prod}>
                <thead>
                <tr>
                    <th>Código</th>
                    <th>Nome</th>
                    <th>Valor Unitário</th>
                    <th>Tipo</th>
                    <th>Ações</th>
                </tr>
                </thead>
                <tbody>
                {displayedProdutos.length > 0 && 
                    displayedProdutos.map((produto) => (
                        <tr key={produto.codigo} className={styles.content}>
                            <td className={styles.td_cod}>{produto.codigo}</td>
                            <td className={styles.td_nome}>{produto.nome}</td>
                            <td className={styles.td_valor}>R$ {produto.valor.toFixed(2)}</td>
                            <td>{produto.tipo_produto}</td>
                            <td>
                                <a className={styles.edit} href={"/produto/editar/"+produto.codigo}>&#9998;</a>
                                <button onClick={() => handleDelete(produto.codigo)} className={styles.delete} >&#10006;</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
                </table>
                {/*Menu de paginação */}
                <div className={styles.pagination}>
                    {produtos.length > 12 && Array.from({ length: totalPages }).map((_, index) => (
                    <button
                        key={index}
                        className={currentPage === index + 1 ? styles.active : ''}
                        onClick={() => setCurrentPage(index + 1)}
                    >
                        {index + 1}
                    </button>
                    ))}
                </div>
            </div>
            }
            {produtos.length < 1 && <h3>Ainda não há Produtos cadastrados</h3>}
        </div>
    )
}
export default Produtos