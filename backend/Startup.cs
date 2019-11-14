using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;
using System.IO;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.HttpsPolicy;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using Microsoft.OpenApi.Models;
using Newtonsoft.Json;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;

namespace backend
{
    public class Startup
    {
        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        readonly string PermissaoEntreOrigens = "_PermissaoEntreOrigens";
        
        public IConfiguration Configuration { get; }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            services.AddControllersWithViews().AddNewtonsoftJson(
                opt => opt.SerializerSettings.ReferenceLoopHandling = ReferenceLoopHandling.Ignore
            );

            // Configuramos o SWAGGER 
            services.AddSwaggerGen(c => {
                c.SwaggerDoc("v1", new OpenApiInfo{ Title = "API", Version = "v1"});

                // Definimos o caminho e arquivo temporario de documentação
                var xmlFile = $"{Assembly.GetExecutingAssembly().GetName().Name}.xml"; 
                var xmlPath = Path.Combine(AppContext.BaseDirectory, xmlFile);
                c.IncludeXmlComments(xmlPath);
            });

            // Configuramos o JWT
            services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme).AddJwtBearer(options => {
                options.TokenValidationParameters = new TokenValidationParameters {
                    ValidateIssuer = true,
                    ValidateAudience = true,
                    ValidateLifetime = true,
                    ValidateIssuerSigningKey = true,
                    ValidIssuer = Configuration["Jwt:Issuer"],
                    ValidAudience = Configuration["Jwt:Issuer"],
                    IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(Configuration["Jwt:key"]))
                };
            });

            //habilitação do cors
            services.AddCors (options => {
                options.AddPolicy (PermissaoEntreOrigens,
                    builder => builder.AllowAnyOrigin().AllowAnyMethod().AllowAnyHeader());
            });
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }

            // Usamos efetivamente o SWAGGER
            app.UseSwagger();
            // Especificamos o endpoint na aplicação
            app.UseSwaggerUI(c => {
                c.SwaggerEndpoint("/swagger/v1/swagger.json", "API v1");
            });

            app.UseAuthentication();    

            // app.UseHttpsRedirection();
            app.UseCors (builder => builder.AllowAnyOrigin().AllowAnyMethod().AllowAnyHeader());            

            app.UseRouting();

            app.UseAuthorization();

            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllers();
            });

        }

        // Instalamos o Entity Framework
        // dotnet tool install --global dotnet-ef

        // Baixamos o pacote SQL Server do Entity Framework
        // dotnet add package Microsoft.EntityFrameworkCore.SqlServer

        // Baixamos o pacote que ira escrever nossos códigos
        //  

        // Testamos se os pacotes foram instalados
        // dotnet restore

        // Testamos a instalação do EF (Entity Framework)
        // dotnet ef

        // Código que criará o nosso Contexto da Base de Dados e nossos Models
        // String de conexão
        // dotnet ef dbcontext scaffold "Server=N-1S-DEV-09\SQLEXPRESS; Database=gufos; User Id=sa; Password=132" Microsoft.EntityFrameworkCore.SqlServer -o Models -d\

        // SWAGGER
        // Instalação
        // dotnet add backend.csproj package SwashBuckle.AspNetCore -v 5.0.0-rc4

        // JSON WEB TOKEN

        // Adicionamos o pacote JWT
        // dotnet add package Microsoft.AspNetCore.Authentication.JwtBearer --version 3.0.0       
        
    }
}
