import React, {Component} from 'react';
import Footer from '../../componentes/Footer/Footer';
import '../../css/login.css'
import Cabecalho from '../../componentes/Cabecalho/Cabecalho';
import Img from '../../img/icon-login.png'
import Axios from 'axios';
import {parseJwt} from '../../../services/auth'
import 'react-router'

class Login extends Component {
    constructor()
    {
        super();

        this.state = {
            email: "",
            senha: "",
            erroMensagem: "",
            isLoading: false     // Flag que verifica se a requisição está em andamento
        }

        this.props = {

        }
    }

    atualizaEstado = (event) => {
        this.setState({[event.target.name] : event.target.value});
    }

    realizarLogin = (event) => {
        event.preventDefault();
        
        this.setState({ erroMensagem: "" });
        this.setState({ isLoading: true });
        
        let config = {
            headers: {
                "Content-Type":"application/json",
                "Acess-Control-Allow-Origin":"*"  //Cors
            }
        }

        Axios.post("http://localhost:5000/api/Login", {
            email: this.state.email,
            senha: this.state.senha
        }, config)
        .then(response => {
            // console.log("Retorno do login: ", response)
            // console.log("Retorno do login: ", response.status)
            
            // Caso o retorno da requisição seja 200, salva o token na chave "usuario-gufos", em local storage
            if(response.status === 200){
                localStorage.setItem("usuario-gufos", response.data.token);
                this.setState({ isLoading: false })
                console.log("O token é: ", response.data.token);

                console.log(parseJwt().Role);

                if(parseJwt().Role === "Administrador"){
                    this.props.history.push('/categorias')
                } else if (parseJwt().Role === "Aluno"){
                    this.props.history.push('/eventos')
                }
            }
        })
        .catch(erro => {
            console.log("Erro: ", erro);
            this.setState({ erroMensagem: "Email ou senha inválido" });
            this.setState({ isLoading: false })
        })
    }

    render(){
        return (
            <div>
                <Cabecalho/>
                <section className="container flex">
                    <div className="img__login"><div className="img__overlay"></div></div>

                    <div className="item__login">
                        <div className="row">
                        <div className="item">
                            <img src={Img} className="icone__login" />
                        </div>
                        <div className="item" id="item__title">
                            <p className="text__login" id="item__description">
                            Bem-vindo! Faça login para acessar sua conta.
                            </p>
                        </div>
                        <form onSubmit={this.realizarLogin}>
                            <div className="item">
                            <input
                                className="input__login"
                                placeholder="username"
                                type="email"
                                id="login__email"
                                name="email"
                                value={this.state.email}
                                onChange={this.atualizaEstado}
                            />
                            </div>
                            <div className="item">
                            <input
                                className="input__login"
                                placeholder="password"
                                type="password"
                                id="login__password"
                                name="senha"
                                value={this.state.senha}
                                onChange={this.atualizaEstado}
                            />
                            </div>
                            <p style={{color : "red"}}>{this.state.erroMensagem}</p>
                            {
                                this.state.isLoading === true &&
                                <div className="item">
                                <button className="btn btn__login" id="btn__login" type="submit" disabled>
                                    Loading...
                                </button>
                                </div>
                            }
                            {
                                this.state.isLoading === false &&
                                <div className="item">
                                <button className="btn btn__login" id="btn__login" type="submit">
                                    Login
                                </button>
                                </div>
                            }
                        </form>
                        </div>
                    </div>
                </section>
                {/* <script>
                    // console.log(document);
                    // id
                    // console.log(document.getElementById("login__email"));
                    // classe
                    // console.log(document.getElementsByClassName("input__login"));

                    // var a = 10;
                    // var b = "Texto";

                    // // buscar a referencia do botao
                    // var btnLogin = document.querySelector("#btn__login");

                    // btnLogin.addEventListener("click", function(event) {
                    //   event.preventDefault();
                    //   // console.log("Hello World!");
                    //   console.log(document.querySelector("#login__email").value);
                    // });

                    var inputSenha = document.querySelector("#login__password");

                    inputSenha.addEventListener("keyup", function() {
                        // caso a senha tenha menos do que 6 caracteres, fica vermelho, querido
                        if (inputSenha.value.length < 6) {
                        inputSenha.style.borderBottomColor = "red";
                        } else {
                        inputSenha.style.borderBottomColor = "green";
                        }
                    });
                </script> */}
                <Footer/>
            </div>
        );
    }
}

export default Login;