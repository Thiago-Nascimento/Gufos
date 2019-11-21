import React, {Component} from 'react';
import Footer from '../../componentes/Footer/Footer';
import { MDBContainer, MDBBtn, MDBModal, MDBModalBody, MDBModalHeader, MDBModalFooter, MDBInput } from 'mdbreact';
import Cabecalho from '../../componentes/Cabecalho/Cabecalho';

class Categorias extends Component {
    
    constructor() {
        super();
        this.state = {
            lista : [],
            nome : "",  // Pegar input do form de cadastro, senão o input fica travado
            modal: false,
            editarModal : {
                categoriaId : "",
                titulo : ""
            },
            loading: false,  // State que indica carregamento da página
            erroMsg: ""
        }

        this.cadastrarCategoria = this.cadastrarCategoria.bind(this);
        this.deletarCategoria = this.deletarCategoria.bind(this);
    }

    toggle = () => {
        this.setState({
            modal: !this.state.modal
        });
    }
    
    UNSAFE_componentWillMount(){
        document.title = this.props.titulo_pagina;
        console.log("Carregando...");
    }

    componentDidMount(){
        console.log("Carregado");
        this.listaAtualizada();
    }

    componentDidUpdate(){
        console.log("Atualizando");
    }

    componentWillUnmount(){
        console.log("Saindo");
    }

    // GET - Listar 
    listaAtualizada = () => {
        this.setState({loading: true});
        
        fetch("http://localhost:5000/api/Categoria")
        .then(response => response.json())
        .then(data => {
            console.log("Mostrando a lista: ",data);
            this.setState({lista : data})
        });

        setTimeout(() => {
            this.setState({loading: false});
        }, 2000);
    }

    // POST
    cadastrarCategoria(event) {
        event.preventDefault();
        console.log("Cadastrando");
        console.log(this.state.nome);
        fetch("http://localhost:5000/api/Categoria", {
            method : "POST",
            headers : {
                "Content-Type" : "application/json"
            },
            body : JSON.stringify({ titulo : this.state.nome})
        })
        .then(response => response.json())
        .then(response => {
            console.log(response);
            this.listaAtualizada();
        })
        .catch(error => console.log(error))
    }

    deletarCategoria(id) {
        console.log("Excluindo...");
        this.setState({erroMsg: ""});
        fetch("http://localhost:5000/api/Categoria/"+id, {
            method : "DELETE",
            headers : {
                "Content-Type" : "application/json"
            }    
        })
        .then(response => response.json())
        .then(response => {
            console.log(response);
            this.listaAtualizada();
            this.setState( () => ({ lista : this.state.lista }))
        })
        .catch(error => {
            console.log(error)
            this.setState({erroMsg: "Não foi possível excluir esta categoria, verifique se não há eventos que a utilize."})
        })
    }

    alterarCategoria = (categoria) => {
        console.log(categoria);
        this.setState({ editarModal : {
                categoriaId : categoria.categoriaId,
                titulo : categoria.titulo
            }
        });

        this.toggle();
    }

    atualizaNome(input) {
        this.setState({nome: input.target.value});  // Utilizado para alterar o input
    }

    // Utilizado para atualizar os states dos inputs
    atualizaEditarModalTitulo(input){
        this.setState({
            editarModal : {
                categoriaId : this.state.editarModal.categoriaId,
                titulo : input.target.value
            }
        })
    }

    salvarAlteracoes = (event) => {
        event.preventDefault();
        
        fetch("http://localhost:5000/api/Categoria/" + this.state.editarModal.categoriaId, {
            method : "PUT",
            headers : {
                "Content-Type" : "application/json"
            },
            body : JSON.stringify(this.state.editarModal) 
        })
        .then(response => response.json())
        .catch(error => console.log(error))
        
        setTimeout(() => {
            this.listaAtualizada();
        }, 500)

        this.toggle();
    }
    
    render(){
        return (
            <div>
                <Cabecalho/> 
                <main className="conteudoPrincipal">
                    <section className="conteudoPrincipal-cadastro">
                    <h1 className="conteudoPrincipal-cadastro-titulo">Categorias</h1>
                    <div className="container" id="conteudoPrincipal-lista">
                        <table id="tabela-lista">
                        <thead>
                            <tr>
                            <th>#</th>
                            <th>Título</th>
                            <th>Excluir</th>
                            </tr>
                        </thead>

                        <tbody id="tabela-lista-corpo">
                            {
                                // Percorre a lista de categorias
                                this.state.lista.map( function(categoria) {
                                    return (
                                        // Atribui uma chave unica "id" para cada linha
                                        <tr key={categoria.categoriaId}>
                                            <td>{categoria.categoriaId}</td>
                                            <td>{categoria.titulo}</td>
                                            <td>
                                                <button onClick= { e => this.alterarCategoria(categoria) }>Alterar</button>
                                                <button onClick= { e => this.deletarCategoria(categoria.categoriaId) }>Excluir</button>
                                            </td>
                                        </tr>
                                    )
                                }.bind(this))  // Usado para vincular todo o contexto do map
                            }
                        </tbody>
                        </table>

                        { this.state.erroMsg && <div className="text-danger">{this.state.erroMsg}</div> }
                        { this.state.loading && <i className="fas fa-spinner fa-spin fa-2x blue-text"></i>}

                    </div>

                    {/* container fa-spin */}
                    <div className="container" id="conteudoPrincipal-cadastro">  
                        <h2 className="conteudoPrincipal-cadastro-titulo">
                        Cadastrar Tipo de Evento
                        </h2>
                        <form onSubmit={this.cadastrarCategoria}>
                        <div className="container">
                            <input
                            type="text"
                            id="nome-tipo-evento"
                            placeholder="tipo do evento"
                            value={this.state.nome}
                            onChange={this.atualizaNome.bind(this)}
                            />
                            <button
                            className="conteudoPrincipal-btn conteudoPrincipal-btn-cadastro"
                            >
                            Cadastrar
                            </button>
                        </div>
                        </form>

                        <MDBContainer>
                            <form onSubmit={this.salvarAlteracoes}>
                                <MDBModal isOpen={this.state.modal} toggle={this.toggle}>
                                    <MDBModalHeader toggle={this.toggle}>Editar {this.state.editarModal.titulo}</MDBModalHeader>
                                    <MDBModalBody>
                                        <MDBInput label="Categoria" value={this.state.editarModal.titulo} size="lg" onChange={this.atualizaEditarModalTitulo.bind(this)}/>
                                    </MDBModalBody>
                                    <MDBModalFooter>
                                        <MDBBtn color="secondary" onClick={this.toggle}>Fechar</MDBBtn>
                                        <MDBBtn color="primary" type="submit">Salvar</MDBBtn>
                                    </MDBModalFooter>
                                </MDBModal>
                            </form>
                        </MDBContainer>

                    </div>
                    </section>
                </main>
                <Footer escola = "ETEC"/>
            </div>
        );
    }
}

export default Categorias;