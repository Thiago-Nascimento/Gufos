using backend.Domains;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using backend.Repositories;

namespace backend.Controllers
{
    // Define a rota do controller, e diz que é um controller de API
    [Route("api/[controller]")] 
    [ApiController]
    public class CategoriaController : ControllerBase
    {
        // GufosContext _contexto = new GufosContext();
        CategoriaRepository _repositorio = new CategoriaRepository();

        // GET: api/Categoria
        /// <summary>
        /// Retorna todos as categorias cadastradas
        /// </summary>
        /// <returns>Lista com categorias</returns>
        [HttpGet]
        public async Task<ActionResult<List<Categoria>>> Get()
        {
            var categorias = await _repositorio.Listar();
            return categorias;
        }
        
        // GET: api/Categoria/2
        [HttpGet("{id}")]
        public async Task<ActionResult<Categoria>> Get(int id)
        {
            var categoria = await _repositorio.BuscarPorID(id);

            if(categoria == null){
                return NotFound();
            }

            return categoria;
        }

        // POST: api/Categoria
        [HttpPost]
        public async Task<ActionResult<Categoria>> Post(Categoria categoria)
        {
            try
            {
                await _repositorio.Salvar(categoria);
            }
            catch (DbUpdateConcurrencyException)
            {
                throw;
            }
            
            return categoria;
        }

        // PUT
        [HttpPut("{id}")]
        public async Task<ActionResult> Put(int id, Categoria categoria)
        {
            if(id != categoria.CategoriaId){
                return BadRequest();
            }
            
            try {
                await _repositorio.Alterar(categoria);
            } catch (DbUpdateConcurrencyException) {
                // Verfica se o objeto inserido existe no banco
                var categoria_valido = await _repositorio.BuscarPorID(categoria.CategoriaId);

                if(categoria_valido == null) {
                    return NotFound();
                } else {
                    throw;
                }
            }

            return NoContent();
        }

        // DELETE api/categoria/id
        [HttpDelete("{id}")]
        public async Task<ActionResult<Categoria>> Delete(int id){
            var categoria = await _repositorio.BuscarPorID(id);

            if(categoria == null) {
                return NotFound();
            }

            await _repositorio.Excluir(categoria);           
            
            return categoria;
        }
    }
}