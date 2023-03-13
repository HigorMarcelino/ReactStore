import { useEffect, useState} from "react";
import styles from "./Relatorio.module.css";
import VendaInfo from "../components/VendaInfo";
import Message from '../components/Message';
import { useLocation } from 'react-router-dom';

function Relatorio(){

    const [vendas, setVendas] = useState([]);
    const [expandedRows, setExpandedRows] = useState([]);
    const [vendaMessage, setVendaMessage] = useState('')
    const[type, setType] = useState()
    const location = useLocation()
    let message = ''
    if (location.state) {
        message = location.state.message
    }
    const [currentPage, setCurrentPage] = useState(1);
    const displayedVendas = paginate(vendas, currentPage, 6);
    const totalPages = Math.ceil(vendas.length / 6);

    useEffect(() => {
        fetch('http://localhost:8080/php/api/Venda/getAll', {
        method: 'GET',
        headers: {
        'Content-Type': 'application/json',
        },
        })
        .then((resp) => resp.json())
            .then((data) => {
                setVendas(data)
            })
        .catch((error) => {
            console.error(error);
            })
    }, [])

    const handleToggleCollapse = (index) => {
        const expandedRowIndex = expandedRows.indexOf(index);
        const newExpandedRows = [...expandedRows];
        if (expandedRowIndex === -1) {
            newExpandedRows.push(index);
        } else {
            newExpandedRows.splice(expandedRowIndex, 1);
        }
        setExpandedRows(newExpandedRows);
      };
    const handleDelete = (codigo) => {
        if(window.confirm("Desaje deletar este registro?")){
            fetch('http://localhost:8080/php/api/Venda/delete/?cod='+codigo, {
                method: 'DELETE',
                headers: {
                'Content-Type': 'application/json',
                }})
                .then((resp) => resp.json)
                .then((data) => {
                    setVendas(vendas.filter((venda) => venda.codigo !== codigo))
                    setVendaMessage('Venda removida com sucesso!'); setType('success')
                }).catch((err) => {console.log(err); setVendaMessage('Ocorreu um erro.'); setType('error')})
        }
    };
    function paginate(items, currentPage, itemsPerPage) {
        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
      
        return items.slice(startIndex, endIndex);
    }
    return(
        <div className={styles.table_container}>
            {message && <Message type={type} msg={message} />}
            {vendaMessage && <Message type={type} msg={vendaMessage} />}
            <table className={styles.table_vendas}>
                <thead>
                <tr>
                    <th>Código</th>
                    <th>Data</th>
                    <th>Total</th>
                    <th>Ações</th>
                </tr>
                </thead>
                <tbody>
                {displayedVendas.length > 0 && 
                    displayedVendas.map((venda, index) => (
                        <>
                            <tr key={index} className={styles.content}>
                                <td className={styles.td_cod}>{venda.codigo}</td>
                                <td className={styles.td_data}>{venda.data}</td>
                                <td><span className={styles.real}>R$</span><span>{(venda.total || 0).toFixed(2)}</span></td>
                                <td>
                                    <button onClick={() => handleToggleCollapse(index)} className={styles.info}>&#9432;</button>
                                    <button onClick={() => handleDelete(venda.codigo)} className={styles.delete} >&#10006;</button>
                                </td>
                            </tr>
                            {expandedRows.includes(index) && (
                                <tr className={styles.collapsible.show}>
                                    <td colSpan="4" className={styles.show}>
                                        <VendaInfo id={venda.codigo}/>
                                    </td>
                                </tr>
                            )}
                        </>
                    ))}
                </tbody>
            </table>
            <div className={styles.pagination}>
                {vendas.length > 6 && Array.from({ length: totalPages }).map((_, index) => (
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
    )
}
export default Relatorio