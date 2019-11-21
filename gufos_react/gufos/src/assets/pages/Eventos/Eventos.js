import React, { Component } from 'react';
import Footer from '../../componentes/Footer/Footer';
import Cabecalho from '../../componentes/Cabecalho/Cabecalho';

class Eventos extends Component {
    constructor() {
        super();
        this.state = {
            listaEventos: [],
            listaCategorias: [],
            campo: "",
            erroMsg: "",
            eventoCadastrando: {
                titulo: "",
                categoriaId: "",
                acessoLivre: "",
                dataEvento: "",

            }
        }

        this.cadastrarEvento = this.cadastrarEvento.bind(this);
        this.deletarEvento = this.deletarEvento.bind(this);
    }

    UNSAFE_componentWillMount() {
        document.title = this.props.titulo_pagina;
        console.log("Carregando...");
    }

    componentDidMount() {
        console.log("Carregado");
        this.listarEventos();
        this.listarCategorias();
    }

    componentDidUpdate() {
        console.log("Atualizando");
    }

    componentWillUnmount() {
        console.log("Saindo");
    }

    listarEventos = () => {
        fetch("http://localhost:5000/api/Evento")
            .then(response => response.json())
            .then(data => {
                console.log("Lista de Eventos: ", data);
                this.setState({ listaEventos: data })
            })
    }

    listarCategorias = () => {
        fetch("http://localhost:5000/api/Categoria")
            .then(response => response.json())
            .then(data => {
                console.log("Mostrando a lista: ", data);
                this.setState({ listaCategorias: data })
            });
    }

    cadastrarEvento(event) {
        event.preventDefault();
        // let evento = this.state.eventoCadastrando;

        console.log("Cadastrandoeve tno: ", this.state.eventoCadastrando);

        fetch("http://localhost:5000/api/Evento", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                titulo: this.state.eventoCadastrando.titulo,
                categoriaId: this.state.eventoCadastrando.categoriaId,
                acessoLivre: this.state.eventoCadastrando.acessoLivre === "1" ? "true" : "false",
                dataEvento: this.state.eventoCadastrando.dataEvento,
            })
        })
            .then(response => response.json())
            .then(response => {
                console.log(response);
                this.listarEventos();
            })
            .catch(error => console.log(error))

    }

    atualizaEstado = (input) => {
        let nomePropriedade = input.target.name;

        this.setState({
            eventoCadastrando: {
                ...this.state.eventoCadastrando,
                [input.target.name]: input.target.value
            }
        }, () => console.log(this.state.eventoCadastrando[nomePropriedade]));
    }

    deletarEvento(id) {
        console.log("Excluindo Evento...");
        this.setState({erroMsg: ""});
        fetch("http://localhost:5000/api/Eventos/" + id, {
            method: "DELETE",
            headers: {
                "Content-Type" : "application/json"
            }
        })
        .then(response => response.json())
        .then(response => {
            console.log(response);
            this.listarEventos();
            this.setState(() => ({listaEventos: this.state.listaEventos}))
        })
        .catch(error => {
            console.log(error);
            this.setState({erroMsg: "Não foi possível excluir este evento"})
        })
    }

    render() {
        return (
            <div>
                <Cabecalho/>
                <main className="conteudoPrincipal">
                    <section className="conteudoPrincipal-cadastro">
                        <h1 className="conteudoPrincipal-cadastro-titulo">Eventos</h1>
                        <div className="container" id="conteudoPrincipal-lista">
                            <table id="tabela-lista">
                                <thead>
                                    <tr>
                                        <th>#</th>
                                        <th>Evento</th>
                                        <th>Data</th>
                                        <th>Acesso Livre</th>
                                        <th>Tipo do Evento</th>
                                        <th>Ações</th>
                                    </tr>
                                </thead>
                                <tbody id="tabela-lista-corpo">
                                    {
                                        this.state.listaEventos.map(function (evento) {
                                            return (
                                                <tr key={evento.eventoId}>
                                                    <td>{evento.eventoId}</td>
                                                    <td>{evento.titulo}</td>
                                                    <td>{evento.dataEvento}</td>
                                                    <td>{evento.acessoLivre}</td>
                                                    {/* <td>{evento.categoria.titulo}</td> */}
                                                    <td><button onClick={() => this.deletarEvento(evento.eventoId)}>Excluir</button></td>
                                                </tr>
                                            )
                                        }.bind(this))
                                    }
                                </tbody>
                            </table>
                        </div>

                        <form onSubmit={this.cadastrarEvento}>
                            <div className="container" id="conteudoPrincipal-cadastro">
                                <h2 className="conteudoPrincipal-cadastro-titulo">Cadastrar Evento</h2>
                                <div className="container">
                                    <input
                                        type="text"
                                        id="evento__titulo"
                                        placeholder="título do evento"
                                        value={this.state.eventoCadastrando.titulo}
                                        onChange={this.atualizaEstado}
                                        name="titulo"
                                    />
                                    <input type="text"
                                        id="evento__data"
                                        placeholder="dd/MM/yyyy"
                                        value={this.state.eventoCadastrando.dataEvento}
                                        onChange={this.atualizaEstado}
                                        name="dataEvento"
                                    />
                                    <select id="option__acessolivre" name="acessoLivre" onChange={this.atualizaEstado}>
                                        <option value="1">Livre</option>
                                        <option value="0">Restrito</option>
                                    </select>
                                    <select id="option__tipoevento" name="categoriaId" onChange={this.atualizaEstado}>
                                        <option value="0" disabled>Tipo do Evento</option>
                                        {
                                            this.state.listaCategorias.map(function (categoria) {
                                                return (
                                                    <option value={categoria.categoriaId}>{categoria.titulo}</option>
                                                )
                                            })
                                        }
                                    </select>
                                </div>
                                <button
                                    className="conteudoPrincipal-btn conteudoPrincipal-btn-cadastro"
                                    type="submit"
                                >
                                    Cadastrar
                        </button>
                            </div>
                        </form>
                    </section>
                </main>
                <Footer />
            </div>
        );
    }
}

export default Eventos;