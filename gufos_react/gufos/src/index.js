import React, { Component } from 'react';
import ReactDOM from 'react-dom';

import './index.css';
import './assets/css/flexbox.css';
import './assets/css/reset.css';
import './assets/css/style.css';

import '@fortawesome/fontawesome-free/css/all.min.css';
import 'bootstrap-css-only/css/bootstrap.min.css';
import 'mdbreact/dist/css/mdb.css';

import App from './assets/pages/Home/App';
import Categorias from './assets/pages/Categorias/Categorias';
import Eventos from './assets/pages/Eventos/Eventos';
import Login from './assets/pages/Login/Login';
import NotFound from './assets/pages/NotFound/NotFound';

import * as serviceWorker from './serviceWorker';
import {Route, BrowserRouter as Router, Switch, Redirect} from 'react-router-dom';
import { usuarioAutenticado, parseJwt } from './services/auth';

const PermissãoAdmin = ({component: Component}) => (
    <Route
        render={props => 
            usuarioAutenticado() && parseJwt().Role === "Administrador" ? (
                <Component {...props}/>
            ) : (
                <Redirect to={{pathname: "/login"}}/>
            )
        }
    />
)

const PermissãoAluno = ({component: Component}) => (
    <Route
        render={props => 
            usuarioAutenticado() && parseJwt().Role === "Aluno" ? (
                <Component {...props}/>
            ) : (
                <Redirect to={{pathname: "/login"}}/>
            )
        }
    />
)

const Rotas = (
    <Router>
        <div>
            <Switch>
                <Route exact path = "/" component={App}/>
                {/* <Route path = "/categorias" component={() => <Categorias titulo_pagina = "Categorias - Gufos"/>}/> */}
                <PermissãoAdmin path = "/categorias" component={Categorias}/>
                <PermissãoAluno path = "/eventos" component={Eventos}/>
                {/* <Route path = "/login" component={() => <Login titulo_pagina = "Login - Gufos"/>}/> */}
                <Route path = "/login" component={Login}/>
                <Route component={NotFound}/>
            </Switch>
        </div>
    </Router>
)

ReactDOM.render(Rotas, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
