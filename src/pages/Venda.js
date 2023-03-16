
import { useState} from "react";
import SelectProduto from "../components/SelectProduto";
import styles from "./Venda.module.css";
import Message from '../components/Message';
import { useLocation } from 'react-router-dom';
function Venda() {
    const [cupom, setCupom] = useState([]);

    var [imposto, setImposto] = useState(0);
    var [saldo, setSaldo] = useState(0);
    const [cupomMessage, setCupomMessage] = useState('')
    const[type, setType] = useState()
    const location = useLocation()
    let message = ''
    if (location.state) {
        message = location.state.message
    }
    const [currentPage, setCurrentPage] = useState(1);
    const displayedCupom = paginate(cupom, currentPage, 12);
    const totalPages = Math.ceil(cupom.length / 12);

    //recebe o item do componente SelectProduto e adiciona ao cupom
    function addItem(item){
        setCupom([...cupom, item]);
        const impostoItem = item.tot * item.imposto/100;

        const novoImposto = Math.trunc((parseFloat(imposto) + impostoItem)*100)/100;
        setImposto(novoImposto);
    
        const novoSaldo = Math.trunc((parseFloat(saldo) + item.tot + impostoItem)*100)/100;
        setSaldo(novoSaldo);

    }
    //envia os dados para a database
    const enviarCupom = () => {
    
        const pedido = {
            itens : cupom,
            saldo : saldo,
            imposto : imposto
        }
        fetch("http://localhost:8080/php/api/Venda/create", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(pedido),
            })
            .then((response) =>response.json())
            .then((data) => {setCupomMessage('Venda realizada com sucesso!'); setType('success')})
            .catch(error => {console.error(error); setCupomMessage('Ocorreu um erro.'); setType('error')})
        
        setCupom([]);
        setSaldo(0);
        setImposto(0);
    }
    //secciona os dados do cupom para deixar a página mais palatável
    function paginate(items, currentPage, itemsPerPage) {
        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        
        return items.slice(startIndex, endIndex);
    }

    return(
        <>
        <div className={styles.message}>
            {message && <Message type={type} msg={message} />}
            {cupomMessage && <Message type={type} msg={cupomMessage} />}
        </div>
        <div className={styles.venda_container}>
            <div className={styles.produto_container}>
                <SelectProduto addItem={addItem}/>
            </div>
            <div className={styles.cupom_container}>
                {//cupom
                cupom.length > 0 &&
                <table className={styles.cupom}>
                    <thead>
                        <tr>
                            <th>Produto</th>
                            <th>Quantidade</th>
                            <th>Valor un.</th>
                            <th className={styles.total}>Total</th>
                        </tr>
                    </thead>
                    <tbody >
                        {displayedCupom.map((item, key) => (
                            //rand int para caso dois itens iguais sejam passados na mesma compra
                            <tr key={item.codigo + Math.random(1000) } className={styles.content}>
                                <td>{item.codigo} - {item.nome}</td>
                                <td>{item.qtd}</td>
                                <td>R$ {item.un.toFixed(2)}</td>
                                <td className={styles.total}>R$ {item.tot.toFixed(2)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                }
                {cupom.length === 0 && 
                    <h3>Selecione itens no painel ao lado para visualizar o cupom da compra</h3>
                }
                {cupom.length > 0 && 
                <div>
                    <div className={styles.info}>
                        <span>Imposto estimado</span><span>R${imposto.toFixed(2)}</span>
                    </div>
                    <div className={styles.info}>
                        <span>Saldo total</span><span>R${saldo.toFixed(2)}</span>
                    </div>
                </div>
                }
                {//menu de paginação
                cupom.length > 15 &&
                <div className={styles.pagination}>
                    {Array.from({ length: totalPages }).map((_, index) => (
                    <button
                        key={index}
                        className={currentPage === index + 1 ? styles.active : ''}
                        onClick={() => setCurrentPage(index + 1)}
                    >
                        {index + 1}
                    </button>
                    ))}
                </div>
                }
            <button onClick={enviarCupom} className={styles.concluir_venda}>Concluir venda</button>      
            </div>
        </div>
        </>
    )
}
export default Venda