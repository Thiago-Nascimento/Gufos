import React, {Component} from 'react';
import Footer from '../../componentes/Footer/Footer';

class Login extends Component {
    render(){
        return (
            <div>
                <section className="container flex">
                    <div className="img__login"><div className="img__overlay"></div></div>

                    <div className="item__login">
                        <div className="row">
                        <div className="item">
                            <img src="./assets/img/icon-login.png" className="icone__login" />
                        </div>
                        <div className="item" id="item__title">
                            <p className="text__login" id="item__description">
                            Bem-vindo! Faça login para acessar sua conta.
                            </p>
                        </div>
                        <form>
                            <div className="item">
                            <input
                                className="input__login"
                                placeholder="username"
                                type="text"
                                name="username"
                                id="login__email"
                            />
                            </div>
                            <div className="item">
                            <input
                                className="input__login"
                                placeholder="password"
                                type="password"
                                name="password"
                                id="login__password"
                            />
                            </div>
                            <div className="item">
                            <button className="btn btn__login" id="btn__login">
                                Login
                            </button>
                            </div>
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