using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.IdentityModel.Tokens;

const string JwtKey = "clave-super-secreta-solo-para-el-curso-1234567890";
const string CorsPolicy = "angular";

var builder = WebApplication.CreateBuilder(args);
builder.WebHost.UseUrls("http://localhost:5000");

builder.Services.AddCors(o => o.AddPolicy(CorsPolicy, p => p
    .WithOrigins("http://localhost:4200")
    .AllowAnyHeader()
    .AllowAnyMethod()));

builder.Services
    .AddAuthentication("Bearer")
    .AddJwtBearer(o => o.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuer = false,
        ValidateAudience = false,
        ValidateIssuerSigningKey = true,
        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(JwtKey)),
        ClockSkew = TimeSpan.Zero
    });
builder.Services.AddAuthorizationBuilder()
    .AddPolicy("Admin", p => p.RequireRole("Admin"));

var app = builder.Build();
app.UseCors(CorsPolicy);
app.UseAuthentication();
app.UseAuthorization();

// Datos en memoria
var categories = new List<Category>
{
    new(1, "Electrónica"), new(2, "Hogar"), new(3, "Libros")
};
var products = new List<Product>
{
    new(1, "Teclado mecánico", 59.90m, 25, 1),
    new(2, "Lámpara LED", 19.50m, 40, 2),
    new(3, "Clean Code", 34.00m, 12, 3),
};
var nextId = 4;
var users = new[]
{
    new User("admin", "admin123", "Admin"),
    new User("user", "user123", "User"),
};

app.MapPost("/api/auth/login", (LoginRequest req) =>
{
    var user = users.FirstOrDefault(u => u.Username == req.Username && u.Password == req.Password);
    if (user is null) return Results.Unauthorized();

    var claims = new[]
    {
        new Claim(JwtRegisteredClaimNames.Sub, user.Username),
        new Claim(ClaimTypes.Role, user.Role),
    };
    var creds = new SigningCredentials(
        new SymmetricSecurityKey(Encoding.UTF8.GetBytes(JwtKey)), SecurityAlgorithms.HmacSha256);
    var token = new JwtSecurityToken(claims: claims, expires: DateTime.UtcNow.AddHours(1), signingCredentials: creds);

    return Results.Ok(new LoginResponse(new JwtSecurityTokenHandler().WriteToken(token), user.Username, user.Role));
});

app.MapGet("/api/categories", () => categories);

var api = app.MapGroup("/api/products");

api.MapGet("/", async (string? search) =>
{
    await Task.Delay(400); // simula latencia para ver estados de carga
    return products.Where(p => string.IsNullOrWhiteSpace(search) ||
        p.Name.Contains(search, StringComparison.OrdinalIgnoreCase));
});

api.MapGet("/{id:int}", (int id) =>
    products.FirstOrDefault(p => p.Id == id) is { } p ? Results.Ok(p) : Results.NotFound());

api.MapPost("/", (ProductDto dto) =>
{
    var p = new Product(nextId++, dto.Name, dto.Price, dto.Stock, dto.CategoryId);
    products.Add(p);
    return Results.Created($"/api/products/{p.Id}", p);
}).RequireAuthorization();

api.MapPut("/{id:int}", (int id, ProductDto dto) =>
{
    var i = products.FindIndex(p => p.Id == id);
    if (i < 0) return Results.NotFound();
    products[i] = new Product(id, dto.Name, dto.Price, dto.Stock, dto.CategoryId);
    return Results.Ok(products[i]);
}).RequireAuthorization();

api.MapDelete("/{id:int}", (int id) =>
    products.RemoveAll(p => p.Id == id) > 0 ? Results.NoContent() : Results.NotFound())
    .RequireAuthorization("Admin");

app.Run();

record Category(int Id, string Name);
record Product(int Id, string Name, decimal Price, int Stock, int CategoryId);
record ProductDto(string Name, decimal Price, int Stock, int CategoryId);
record User(string Username, string Password, string Role);
record LoginRequest(string Username, string Password);
record LoginResponse(string Token, string Username, string Role);
