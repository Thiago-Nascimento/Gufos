using backend.Models;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

// Adiciona a arvore de objetos 
// dotnet add package Microsoft.AspNetCore.Mvc.NewtonsoftJson


namespace backend.Controllers
{
    // Define a rota do controller, e diz que é um controller de API
    [Route("api/[controller]")] 
    [ApiController]
    public class PresencaController : ControllerBase
    {
        gufosContext _contexto = new gufosContext();

        // GET: api/Presenca
        [HttpGet]
        public async Task<ActionResult<List<Presenca>>> Get()
        {
            var presencas = await _contexto.Presenca.ToListAsync();

            if(presencas == null) {
                return NotFound();
            }

            return presencas;
        }
        
        // GET: api/Presenca/2
        [HttpGet("{id}")]
        public async Task<ActionResult<Presenca>> Get(int id)
        {
            var presenca = await _contexto.Presenca.FirstOrDefaultAsync(e => e.PresencaId == id);

            if(presenca == null) {
                return NotFound();
            }

            return presenca;
        }

        // POST: api/Presenca
        [HttpPost]
        public async Task<ActionResult<Presenca>> Post(Presenca presenca)
        {
            try
            {
                // Tratamento contra SQL Injection
                await _contexto.AddAsync(presenca);
                await _contexto.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                throw;
            }
            
            return presenca;
        }

        // PUT
        [HttpPut("{id}")]
        public async Task<ActionResult> Put(int id, Presenca presenca)
        {
            if(id != presenca.PresencaId){
                return BadRequest();
            }

            // Comparamos os atributos que foram modificados através do EF
            _contexto.Entry(presenca).State = EntityState.Modified;
            
            try {
                await _contexto.SaveChangesAsync(); 
            } catch (DbUpdateConcurrencyException) {
                // Verfica se o objeto inserido existe no banco
                var presenca_valido = await _contexto.Presenca.FindAsync(id);

                if(presenca_valido == null) {
                    return NotFound();
                } else {
                    throw;
                }
            }

            return NoContent();
        }

        // DELETE api/presenca/id
        [HttpDelete("{id}")]
        public async Task<ActionResult<Presenca>> Delete(int id){
            var presenca = await _contexto.Presenca.FindAsync(id);

            if(presenca == null) {
                return NotFound();
            }

            _contexto.Presenca.Remove(presenca);
            await _contexto.SaveChangesAsync();
            
            return presenca;
        }
    }
}