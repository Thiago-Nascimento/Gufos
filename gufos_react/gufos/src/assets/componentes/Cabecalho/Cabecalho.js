import React, {Component} from 'react';
import Logo from '../../img/icon-login.png'
import '../../css/cabecalho.css';
import {Link, withRouter} from 'react-router-dom';
import { usuarioAutenticado, parseJwt } from '../../../services/auth';

class Cabecalho extends Component {
    logout = () => {
        localStorage.removeItem("usuario-gufos")
        this.props.history.push("/")
    }
    
    render() {
        return (
            <header className="cabecalhoPrincipal">
                <div className="container">
                <img src={Logo} />
        
                <nav className="cabecalhoPrincipal-nav">
                    <Link to="/">Home</Link>
                    {
                        usuarioAutenticado() && parseJwt().Role === "Administrador" ? (
                            // Usuario adm
                            <>                            
                                <Link to="/categorias">Categorias</Link>
                                <a onClick={this.logout}>Sair</a>
                            </>
                        ) : (
                            usuarioAutenticado() && parseJwt().Role === "Aluno" ? (
                                // Usuario aluno
                                <>                            
                                    <Link to="/eventos">Eventos</Link>
                                    <a onClick={this.logout}>Sair</a>
                                </>
                            ) : (
                                // Usuario não logado
                                <>
                                    <Link className="cabecalhoPrincipal-nav-login" to='/login'>Login</Link>
                                </>
                            )
                        )
                    }    
                                        
                </nav>
                </div>
            </header>

        )
    }
}
export default withRouter(Cabecalho);