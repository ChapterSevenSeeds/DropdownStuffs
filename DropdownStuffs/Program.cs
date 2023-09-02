
using static System.Net.Mime.MediaTypeNames;

namespace DropdownStuffs
{
    public class Program
    {
        private const string _xClientIdHeader = "x-client-id";
        private const string _xClientId = "this is the client id";

        public static void Main(string[] args)
        {
            var builder = WebApplication.CreateBuilder(args);

            // Add services to the container.

            builder.Services.AddControllersWithViews();

            var app = builder.Build();

            // Configure the HTTP request pipeline.
            if (!app.Environment.IsDevelopment())
            {
                // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
                app.UseHsts();
            }

            app.UseDefaultFiles();
            app.UseHttpsRedirection();
            app.UseStaticFiles();
            app.UseRouting();

            app.Use(async (context, next) =>
            {
                if (context.Request.Headers.TryGetValue(_xClientIdHeader, out var value))
                {
                    if (value != _xClientId) context.Response.StatusCode = 401;
                    else await next();
                }
                else
                {
                    context.Response.StatusCode = 400;
                }
            });

            app.MapControllerRoute(
                name: "default",
                pattern: "{controller}/{action=Index}/{id?}");

            app.MapFallbackToFile("index.html");

            app.Run();
        }
    }
}