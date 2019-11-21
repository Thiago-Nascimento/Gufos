import React, {Component} from 'react';
import Logo from '../../img/icon-login.png'
import '../../css/cabecalho.css';
import {Link} from 'react-router-dom';

export default class Cabecalho extends Component {
    render() {
        return (
            <header className="cabecalhoPrincipal">
                <div className="container">
                <img src={Logo} />
        
                <nav className="cabecalhoPrincipal-nav">
                    <Link to= '/'>Home</Link>
                    <Link to= '/eventos'>Eventos</Link>
                    <Link to= '/categorias'>Categorias</Link>
                    <Link to= '/login' className="cabecalhoPrincipal-nav-login">Login</Link>
                </nav>
                </div>
            </header>

        )
    }
}
