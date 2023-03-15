import styles from './Navbar.module.css';
import {Link} from 'react-router-dom';
function Navbar(){
    return(
        <nav className={styles.navbar}>
            {/* <Link to="/"><img src={logo} alt='logo icon' className={styles.logo}/></Link> */}
            <ul className={styles.list}>
                <li className={styles.item}>
                    <h1>ᛋᛏᛟᚱᛖ</h1>
                </li>
                <li className={styles.item}>
                    <Link to="/">Venda</Link>
                </li>
                <li className={styles.item}>
                    <Link to="/produtos">Produtos</Link>
                </li>
                <li className={styles.item}>
                    <Link to="/tipos">Tipos de produto</Link>
                </li>
                <li className={styles.item}>
                    <Link to="/relatorio">Relatório</Link>
                </li>
            </ul>
        </nav>
    )
}
export default Navbar