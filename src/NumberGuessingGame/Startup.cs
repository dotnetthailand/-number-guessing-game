using JavaScriptEngineSwitcher.ChakraCore;
using JavaScriptEngineSwitcher.Extensions.MsDependencyInjection;
using React.AspNet;
using Microsoft.EntityFrameworkCore;
using NumberGuessingGame.Models;
using Microsoft.AspNetCore.Diagnostics;

namespace NumberGuessingGame
{
    public class Startup
    {
        // !!! Note that appsettings.json will be registered by default in .NET Core 2.0.
        private readonly IConfiguration configuration;

        public Startup(IConfiguration configuration) => this.configuration = configuration;

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            // https://damienbod.com/2016/07/13/injecting-configurations-in-razor-views-in-asp-net-core/
            services.Configure<ApplicationConfiguration>(configuration.GetSection("ApplicationConfiguration"));

            // Make sure a JS engine is registered, or you will get an error!
            services.AddSingleton<IHttpContextAccessor, HttpContextAccessor>();
            services.AddReact();
            services.AddJsEngineSwitcher(options => options.DefaultEngineName = ChakraCoreJsEngine.EngineName).AddChakraCore();

            services
                .AddControllersWithViews();

            // EF context objects should be scoped for a per-request lifetime.
            var connectionString = configuration.GetConnectionString("DefaultConnection");

            services.AddDbContext<GameDbContext>(option =>
            {
                option
                    .UseSqlServer(connectionString)
                    // dotnet add package EFCore.NamingConventions
                    .UseSnakeCaseNamingConvention();
            });
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
            app.UseExceptionHandler(a => a.Run(async context =>
            {
                var exceptionHandlerPathFeature = context.Features.Get<IExceptionHandlerPathFeature>();
                var exception = exceptionHandlerPathFeature.Error;
                await context.Response.WriteAsJsonAsync(
                    new
                    {
                        errorMessage = exception.Message,
                        errorType = exception.GetType().Name
                    }
                );
            }));

            // Initialize ReactJS.NET. Must be before static files.
            app.UseReact(config =>
            {
                config
                    // We have already transformed React code from Webpack
                    .SetLoadBabel(false)
                    // The path is relative to the main wwwroot folder of the main project 
                    .AddScriptWithoutTransform("scripts/site.js");
            });

            app.UseStaticFiles();
            app.UseRouting();
            app.UseEndpoints(endpoints =>
            {
                // Default to Home/index
                endpoints.MapControllerRoute(
                    name: "default",
                    pattern: "{controller=Game}/{action=Index}/{id?}"
                );

                // Catch all for single page app
                // endpoints.MapControllerRoute(
                //     name: "default",
                //     pattern: "{path?}", // wildcard route in ASP.NET's route
                //     defaults: new { controller = "Game", action = "Index" }
                // );
            });
        }
    }
}