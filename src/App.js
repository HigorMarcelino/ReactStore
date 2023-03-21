import './App.css';
import {BrowserRouter as Router, Routes, Route, Navigate} from 'react-router-dom'
import Venda from './pages/Venda';
import Produtos from './pages/Produtos';
import Tipos from './pages/Tipos';
import Relatorio from './pages/Relatorio';
import Navbar from './layout/Navbar';
import ProdutoForm from './pages/ProdutoForm';
import TipoForm from './pages/TipoForm';

function App() {

  return (
    <Router>
      <Navbar/>

        <Routes>
            <Route exact path="/" element={<Venda/>}/>
            <Route exact path="/produtos" element={<Produtos/>}/>
            <Route exact path="/tipos" element={<Tipos/>}/>
            <Route exact path="/relatorio" element={<Relatorio/>}/>
            <Route exact path="/produto/novo" element={<ProdutoForm/>}/>
            <Route exact path="/produto/editar/:codigo" element={<ProdutoForm/>}/>
            <Route exact path="/tipo/novo" element={<TipoForm/>}/>
            <Route exact path="/tipo/editar/:codigo" element={<TipoForm/>}/>

            <Route path="*" element={<Navigate to="/" state={{message: 'Erro 404: Não encontrado.', tipo: 'error'}} /> } />
        </Routes>

    </Router>
  )
}

export default App;