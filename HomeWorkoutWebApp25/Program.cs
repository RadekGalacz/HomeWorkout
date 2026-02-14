using HomeWorkoutWebApp25;
using HomeWorkoutWebApp25.Models;
using HomeWorkoutWebApp25.Services;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();

//builder.Services.AddDbContext<ApplicationDbContext>(options =>
//  options.UseSqlServer(builder.Configuration.GetConnectionString("HomeWorkoutDbConntection")));

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

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

//builder.Services.AddCors(options => {
//    options.AddPolicy(name: MyAllowSpecificOrigins,
//                      policy => {
//                          policy.WithOrigins("http://localhost:5173")
//                                .AllowAnyHeader()
//                                .AllowAnyMethod();
//                      });
//});

builder.Services.AddIdentity<AppUser, IdentityRole>().AddEntityFrameworkStores<ApplicationDbContext>().AddDefaultTokenProviders();
builder.Services.AddScoped<ExerciseService>();
builder.Services.AddScoped<BodyPartsService>();
builder.Services.AddScoped<WorkoutPlanService>();
builder.Services.AddScoped<WorkoutExerciseService>();

builder.Services.ConfigureApplicationCookie(options => {
    options.Cookie.Name = ".AspNetCore.Identity.Application";
    options.Cookie.SameSite = SameSiteMode.None;
    options.Cookie.SecurePolicy = CookieSecurePolicy.Always;
    options.ExpireTimeSpan = TimeSpan.FromMinutes(20);
    options.SlidingExpiration = true;
});

var app = builder.Build();

if (app.Environment.IsDevelopment()) {
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseCors(MyAllowSpecificOrigins);
app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.Run();