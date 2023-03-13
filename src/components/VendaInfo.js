import { useEffect, useState } from "react";

import styles from "./VendaInfo.module.css";
function VendaInfo({id}){
    
    const [produtos, setProdutos] = useState([]);

    //retorna todos os produtos associados a esse pedido
    useEffect(() => {
        fetch('http://localhost:8080/php/api/Venda/getAllProdutos/?cod='+id, {
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
    }, []);
    
    return (
        <div>
            <div className={styles.cupom_container}>
                {produtos.length > 0 &&
                <div>
                    <table className={styles.cupom}>
                        <thead>
                            <tr>
                                <th>Produto</th>
                                <th>Qtd</th>
                                <th>Valor un.</th>
                                <th className={styles.total}>Total</th>
                            </tr>
                        </thead>
                        <tbody >
                            {produtos.map((item, key) => (
                                //rand int para caso dois itens iguais sejam passados na mesma compra
                                <tr key={item.produto_codigo + Math.random(1000) } className={styles.content}>
                                    <td>{item.produto} - {item.nome}</td>
                                    <td>{item.quantidade}</td>
                                    <td className={styles.end}>R$ {item.preco.toFixed(2)}</td>
                                    <td className={styles.end}>R$ {item.item_total.toFixed(2)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <div>
                        <div className={styles.info}>
                            <span>Imposto</span><span>R${produtos[0].pedido_imposto.toFixed(2)}</span>
                        </div>
                        <div className={styles.info}>
                            <span>Saldo total</span><span>R${produtos[0].pedido_total.toFixed(2)}</span>
                        </div>
                    </div>
                </div>
                }

            </div>
        </div>
    )
}
export default VendaInfo