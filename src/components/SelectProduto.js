import { useState, useEffect } from "react";
import { useRef } from "react";
import styles from "./SelectProduto.module.css";

//área de seleção dos produtos que podem ser adicionados às vendas 
function ProdutoForm({addItem}) {

    const [produtos, setProdutos] = useState([]);
    const [produto, setProduto] = useState({});
    const [total, setTotal] = useState();
    const qtdRef = useRef();
    const totRef = useRef();
  
    //pegando os produtos da databse
    useEffect(() => {
        fetch('http://localhost:8080/php/api/Produto/getAll', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        })
        .then((resp) => resp.json())
        .then((data) => {
            setProdutos(data);
        })
        .catch((error) => {
            console.error(error);
        });
    }, []);
    //definindo o produto selecionado pelo elemento select
    function handleOnChange(event){
        setProduto(produtos.find(produto => produto.codigo === parseInt(event.target.value)));
        qtdRef.current.value = null;
        setTotal(0.00)
    }
    //definindo o valor total da compra, depois da qtd ser informada
    function handleTotal(event){
        setTotal((event.target.value * produto.valor).toFixed(2))
    }
    //enviando as informações para o componente Venda,
    //onde elas serão adicionadas ao pedido
    function handleSubmit(event){
        event.preventDefault();
        if (produto.codigo) {
            const item = {
                codigo: produto.codigo,
                nome: produto.nome,
                qtd: parseInt(qtdRef.current.value),
                un: produto.valor,
                tot: parseFloat(totRef.current.value),
                imposto: produto.imposto
            }
            addItem(item);
        }
        
    }

    return(
        <div className={styles.form_container}>
            <form onSubmit={handleSubmit}>
                <div className={styles.prod_nome}>
                    <span className={styles.label_nome}>Produto </span>
                    <select
                        name="select"
                        id="select"
                        onChange={handleOnChange}
                        className={styles.nome}
                        required
                        >
                        <option selected disabled value=''>Selecione um produto:</option>
                        {produtos && produtos.map((produto, key) => (
                            <option value={produto.codigo} key={produto.codigo}>
                                {produto.codigo} - {produto.nome}
                            </option>
                            ))}
                    </select>
                </div>
                <div className={styles.detalhes_container}>
                    <div className={styles.detalhes}>
                        <label htmlffor="qtd">Quantidade </label>
                        <input type="number" name="qtd" id="qtd" ref={qtdRef} onChange={handleTotal} min="1" max="99" required className={styles.qtd}></input>
                    </div>
                    <div className={styles.detalhes}>
                        <span className={styles.label_valor}>Valor un </span>
                        <span className={styles.input_real}>R$</span>
                        <span className={styles.valor} name="un" id="un" required>{(produto.valor || 0).toFixed(2)}</span>
                    </div>
                    <div className={styles.detalhes}>
                        <label htmlffor="tot">Total </label>
                        <span className={styles.input_real}>R$</span>
                        <input type="number" name="tot" id="tot" value={total} ref={totRef} readOnly></input>
                    </div>
                </div>
                <button type='submit'>Incluir</button>
            </form>
        </div>
    )
}
export default ProdutoForm