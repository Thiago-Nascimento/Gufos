import React, { Component } from 'react';
import Footer from '../../componentes/Footer/Footer';
import Cabecalho from '../../componentes/Cabecalho/Cabecalho';
import api from '../../../services/api';
import { MDBContainer, MDBModal, MDBModalBody, MDBModalFooter, MDBModalHeader, MDBInput, MDBBtn } from 'mdbreact';

class Eventos extends Component {
    constructor() {
        super();
        this.state = {
            listaEventos: [],
            listaCategorias: [],
            listaLocalizacoes: [],
            campo: "",
            erroMsg: "",
            modal: false,
            eventoCadastrando: {
                titulo: "",
                categoriaId: "",
                acessoLivre: "",
                dataEvento: "",
            },
            eventoAlterando: {
                eventoId : "",
                titulo : "",
                categoriaId : "",
                acessoLivre : "",
                dataEvento : "",
                localizacao : ""    
            }
        }

        this.cadastrarEvento = this.cadastrarEvento.bind(this);
        this.deletarEvento = this.deletarEvento.bind(this);
        this.alterarEvento = this.alterarEvento.bind(this);
    }

    UNSAFE_componentWillMount() {
        document.title = this.props.titulo_pagina;
        console.log("Carregando...");
    }

    componentDidMount() {
        console.log("Carregado");
        this.listarEventos();
        this.listarCategorias();
        this.listarLocalizacoes();
    }

    componentDidUpdate() {
        console.log("Atualizando");
    }

    componentWillUnmount() {
        console.log("Saindo");
    }

    listarLocalizacoes = () => {
        fetch("http://localhost:5000/api/localizacao")
            .then(response => response.json())
            .then(data => {
                console.log("Lista de Eventos: ", data);
                this.setState({ listaLocalizacoes: data })
            })
    }

    listarEventos = () => {
        fetch("http://localhost:5000/api/evento")
            .then(response => response.json())
            .then(data => {
                console.log("Lista de Eventos: ", data);
                this.setState({ listaEventos: data })
            })
    }

    // listarCategorias = () => {
    //     api.get("/categoria")
    //         .then(response => response.json())
    //         .then(data => {
    //             console.log("Mostrando a lista: ", data);
    //             this.setState({ listaCategorias: data })
    //         });
    // }

    listarCategorias = () => {
        fetch("http://localhost:5000/api/categoria")
            .then(response => response.json())
            .then(data => {
                console.log("Lista de Categorias: ", data);
                this.setState({listaCategorias : data})
            })
    }

    cadastrarEvento(event) {
        event.preventDefault();

        console.log("Cadastrando evento: ", this.state.eventoCadastrando);

        fetch("http://localhost:5000/api/evento", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                titulo: this.state.eventoCadastrando.titulo,
                categoriaId: this.state.eventoCadastrando.categoriaId,
                acessoLivre: this.state.eventoCadastrando.acessoLivre === "1" ? true : false,
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

    atualizaEstadoModal = (input) => {
        let nomePropriedade = input.target.name;

        this.setState({
            eventoAlterando: {
                ...this.state.eventoAlterando,
                [input.target.name]: input.target.value
            }
        }, () => console.log(this.state.eventoAlterando[nomePropriedade]))
    }

    deletarEvento(id) {
        console.log("Excluindo Evento...");
        this.setState({erroMsg: ""});
        fetch("http://localhost:5000/api/evento/" + id, {
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

    toggle = () => {
        this.setState({
            modal: !this.state.modal
        });
    }
    
    alterarEvento = (evento) => {
        console.log(evento);
        this.setState({ eventoAlterando : {
                eventoId : evento.eventoId,
                titulo : evento.titulo,
                categoriaId : evento.categoriaId,
                acessoLivre : evento.acessoLivre,
                dataEvento : evento.dataEvento,
                localizacao : evento.localizacao
            } 
        })
        this.toggle();
    }

    salvarAlteracoes(event) {
        event.preventDefault();

        fetch("http://localhost:5000/api/evento/" + this.state.eventoAlterando.eventoId, {
            method: "PUT",
            headers: {
                "Content-Type":"application/json"
            },
            body: JSON.stringify(this.state.eventoAlterando)
        })
        .then(response => response.json())
        .catch(error => console.log(error))

        setTimeout(() => {
            this.listarEventos();
        }, 500)

        this.toggle();
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
                                                    <td>
                                                        {evento.acessoLivre && "Sim"}
                                                        {!evento.acessoLivre && "Não"}
                                                    </td>
                                                    <td>{evento.categoria.titulo}</td>
                                                    <td>
                                                        <button onClick={() => this.alterarEvento(evento)}>Alterar</button>
                                                        <button onClick={() => this.deletarEvento(evento.eventoId)}>Excluir</button>
                                                    </td>
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
                                                    <option key={categoria.categoriaId} value={categoria.categoriaId}>{categoria.titulo}</option>
                                                )
                                            })
                                        }
                                    </select>
                                    <select id="option__tipoevento" name="categoriaId" onChange={this.atualizaEstado}>
                                        <option value="0" disabled>Localização</option>
                                        {
                                            this.state.listaLocalizacoes.map(function (localizacao) {
                                                return (
                                                    <option key={localizacao.localizacaoId} value={localizacao.localizacaoId}>{localizacao.razaoSocial}</option>
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

                        <MDBContainer>
                            <form onSubmit={this.salvarAlteracoes}>
                                <MDBModal isOpen={this.state.modal} toggle={this.toggle}>
                                    <MDBModalHeader toggle={this.toggle}>Editar {this.state.eventoAlterando.titulo}</MDBModalHeader>
                                    <MDBModalBody>
                                        <MDBInput name="titulo" label="Evento" value={this.state.eventoAlterando.titulo} size="lg" onChange={this.atualizaEstadoModal}/>
                                        <MDBInput name="categoriaId" label="Categoria" value={this.state.eventoAlterando.categoriaId} size="lg" onChange={this.atualizaEstadoModal}/>
                                        <select name="categoriaId" className="custom-select custom-select-sm" label="Categoria">
                                            <option selected>{this.state.eventoAlterando.categoriaId}</option>
                                            {
                                                this.state.listaCategorias.map(function (categoria) {
                                                    return (
                                                        <option key={categoria.categoriaId} value={categoria.categoriaId}>{categoria.titulo}</option>
                                                    )
                                                })
                                            }
                                        </select>
                                        <MDBInput name="acessoLivre" label="Acesso" value={this.state.eventoAlterando.acessoLivre} size="lg" onChange={this.atualizaEstadoModal}/>
                                        <MDBInput name="dataEvento" label="Data" value={this.state.eventoAlterando.dataEvento} size="lg" onChange={this.atualizaEstadoModal}/>
                                        <MDBInput name="localizacao" label="Local" value={this.state.eventoAlterando.localizacao} size="lg" onChange={this.atualizaEstadoModal}/>
                                    </MDBModalBody>
                                    <MDBModalFooter>
                                        <MDBBtn color="secondary" onClick={this.toggle}>Fechar</MDBBtn>
                                        <MDBBtn color="primary" type="submit">Salvar</MDBBtn>
                                    </MDBModalFooter>
                                </MDBModal>
                            </form>
                        </MDBContainer>

                    </section>
                </main>
                <Footer />
            </div>
        );
    }
}

export default Eventos;