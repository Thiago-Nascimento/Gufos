using System;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Text;
using backend.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;

namespace backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    
    public class LoginController : ControllerBase
    {
        // Chamamos nosso contexto da base de dados
        gufosContext _context = new gufosContext();

        // Definimos uma variavel para percorre nossos métodos com as configurações obtidas no appSettings.json
        private IConfiguration _config;

        // Definimos um método contrutor para poder acessar estas configs
        public LoginController(IConfiguration config) {
            _config = config;
        }

        // Chamamos nosso método para validar o usuario 
        private Usuario ValidaUsuario(Usuario login) {
            var usuario = _context.Usuario.FirstOrDefault(
                u => u.Email == login.Email && u.Senha == login.Senha
            );

            if(usuario != null) {
                usuario = login;
            }

            return usuario;
        }

        // Gera Token
        private string GerarToken(Usuario userInfo) {

            // Definem a criptografia do token
            var securityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_config["Jwt : Key"]));
            var credentials = new SigningCredentials(securityKey, SecurityAlgorithms.Sha256);

            // Definem as Claims (dados da sessão)
            var claims = new[] {
                new Claim(JwtRegisteredClaimNames.NameId, userInfo.Nome),
                new Claim(JwtRegisteredClaimNames.NameId, userInfo.Email),
                new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString())
            };

            // Confirma o token e seu tempo de vida
            var token = new JwtSecurityToken(
                _config["Jwt : Issuer"],
                _config["Jwt : Issuer"],
                claims,
                expires: DateTime.Now.AddMinutes(120),
                signingCredentials : credentials
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }

        // Usamos essa anotação para ignorar a autenticação nesse método
        [AllowAnonymous]
        [HttpPost]
        public IActionResult Login([FromBody]Usuario login){
            IActionResult response = Unauthorized();
            var user = ValidaUsuario(login);

            if(user != null) {
                var tokenString = GerarToken(user);
                response = Ok(new {token = tokenString});
            }

            return response;
        }

    }
}