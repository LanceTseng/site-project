using MobileProject.API.Repositories;
using MobileProject.API.Repositories.Interfaces;

namespace MobileProject.API
{
    public class Program
    {
        public static void Main(string[] args)
        {
            var builder = WebApplication.CreateBuilder(args);

            //  Enable MVC and Views
            builder.Services.AddControllersWithViews();

            //  Swagger Configuration
            builder.Services.AddEndpointsApiExplorer();
            builder.Services.AddSwaggerGen();

            //  CORS Policy
            builder.Services.AddCors(options =>
            {
                options.AddPolicy("AllowAll", builder =>
                {
                    builder.AllowAnyOrigin()
                           .AllowAnyMethod()
                           .AllowAnyHeader();
                });
            });

            // Enable session storage
            builder.Services.AddSession(options =>
            {
                options.IdleTimeout = TimeSpan.FromMinutes(30); // Session timeout
                options.Cookie.HttpOnly = true;
                options.Cookie.IsEssential = true;
            });

            //  Dependency Injection
            builder.Services.AddScoped<IUsersRepository, UsersRepository>();
            builder.Services.AddScoped<IProductsRepository, ProductsRepository>();
            builder.Services.AddScoped<ICartRecordRepository, CartRecordRepository>();
            builder.Services.AddScoped<IOrdersRepository, OrdersRepository>();
            builder.Services.AddScoped<IOverviewReportRepository, OverviewReportRepository>();

            //  Configure Kestrel to listen on port 5180
            builder.WebHost.ConfigureKestrel(serverOptions =>
            {
                serverOptions.ListenAnyIP(5180);
            });

            var app = builder.Build();

            //  Enable Static Files (Required for JS & CSS in Views)
            app.UseStaticFiles();

            //  Enable CORS
            app.UseCors("AllowAll");

            //  Enable Routing
            app.UseRouting();

            //  Enable Authorization
            app.UseAuthorization();

            //  Enable Swagger (Only in Development)
            if (app.Environment.IsDevelopment())
            {
                app.UseSwagger();
                app.UseSwaggerUI();
            }

            //  Map Controllers and Razor Views
            app.MapControllers();
            app.MapDefaultControllerRoute(); // Enables MVC views

            app.Run();
        }
    }
}