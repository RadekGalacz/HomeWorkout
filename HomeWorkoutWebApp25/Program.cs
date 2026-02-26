using HomeWorkoutWebApp25;
using HomeWorkoutWebApp25.Models;
using HomeWorkoutWebApp25.Services;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

// Registrace MVC controllerů
builder.Services.AddControllers();

// Připojení k databázi přes connection string z appsettings.json
builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("HomeWorkoutDbConnection")));

// Swagger – dokumentace API (pouze pro vývoj)
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// CORS – povolené zdroje pro frontend
var MyAllowSpecificOrigins = "_myAllowSpecificOrigins";

builder.Services.AddCors(options => {
    options.AddPolicy(name: MyAllowSpecificOrigins,
        policy => {
            policy.WithOrigins("https://radek-gala.cz", "http://localhost:5173")
                 .AllowAnyHeader()
                 .AllowAnyMethod()
                .AllowCredentials();
        });
});

// Identity – autentizace a autorizace uživatelů
builder.Services.AddIdentity<AppUser, IdentityRole>().AddEntityFrameworkStores<ApplicationDbContext>().AddDefaultTokenProviders();

// Registrace aplikačních služeb přes rozhraní
builder.Services.AddScoped<IExerciseService, ExerciseService>();
builder.Services.AddScoped<IBodyPartsService, BodyPartsService>();
builder.Services.AddScoped<IWorkoutPlanService, WorkoutPlanService>();
builder.Services.AddScoped<IWorkoutExerciseService, WorkoutExerciseService>();

// Konfigurace autentizačního cookie
builder.Services.ConfigureApplicationCookie(options => {
    options.Cookie.Name = ".AspNetCore.Identity.Application";
    options.Cookie.SameSite = SameSiteMode.None;
    options.Cookie.SecurePolicy = CookieSecurePolicy.Always;
    options.ExpireTimeSpan = TimeSpan.FromMinutes(20);
    options.SlidingExpiration = true;
});

var app = builder.Build();

// Swagger UI dostupné jen ve vývojovém prostředí
if (app.Environment.IsDevelopment()) {
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

// Statické soubory (SPA fallback na index.html)
app.UseDefaultFiles();
app.UseStaticFiles();

app.UseCors(MyAllowSpecificOrigins);
app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();
app.MapFallbackToFile("index.html");

app.Run();