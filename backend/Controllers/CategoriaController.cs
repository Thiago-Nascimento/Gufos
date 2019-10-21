using backend.Models;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace backend.Controllers
{
    // Define a rota do controller, e diz que é um controller de API
    [Route("api/[controller]")] 
    [ApiController]
    public class CategoriaController : ControllerBase
    {
        gufosContext _contexto = new gufosContext();

        // GET: api/Categoria
        /// <summary>
        /// Retorna todos as categorias cadastradas
        /// </summary>
        /// <returns>Lista com categorias</returns>
        [HttpGet]
        public async Task<ActionResult<List<Categoria>>> Get()
        {
            var categorias = await _contexto.Categoria.ToListAsync();

            if(categorias == null) {
                return NotFound();
            }

            return categorias;
        }
        
        // GET: api/Categoria/2
        [HttpGet("{id}")]
        public async Task<ActionResult<Categoria>> Get(int id)
        {
            var categoria = await _contexto.Categoria.FindAsync(id);

            if(categoria == null) {
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
                // Tratamento contra SQL Injection
                await _contexto.AddAsync(categoria);
                await _contexto.SaveChangesAsync();
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

            // Comparamos os atributos que foram modificados através do EF
            _contexto.Entry(categoria).State = EntityState.Modified;
            
            try {
                await _contexto.SaveChangesAsync(); 
            } catch (DbUpdateConcurrencyException) {
                // Verfica se o objeto inserido existe no banco
                var categoria_valido = await _contexto.Categoria.FindAsync(id);

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
            var categoria = await _contexto.Categoria.FindAsync(id);

            if(categoria == null) {
                return NotFound();
            }

            _contexto.Categoria.Remove(categoria);
            await _contexto.SaveChangesAsync();
            
            return categoria;
        }
    }
}