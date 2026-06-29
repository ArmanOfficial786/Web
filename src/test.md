i have Saas Project with Multitenant/company base project in clean architecture and DDD in .net core web api and reference from Json Tylor and my project sturcture is below:-

Solution.sln

│
├── Shared/
│ ├── Shared.Domain/
│ ├── Shared.Infrastructure/
│ └── Shared.Application
├── Products/  
│ ├── Hospital.Api //contain program.cs
│ └── School.Api //contain program.cs
│
└── UserManagement/  
├── UserManagement.Domain/
├── UserManagement.Application/
├── UserManagement.Infrastructure/
└── UserManagement.API/

//shared.Application/Interface
1.ICurrentUserService.cs
namespace Shared.Application.Interfaces;
public interface ICurrentUserService
{
Guid? UserId { get; }
string? UserName { get; }
UserInfo? UserInfo { get; }
int? CompanyId { get; }
Guid? AgentId { get; }
Guid? BranchId { get; }
Guid? CustomerId { get; }
}
2.ITokenClainService.cs
namespace Shared.Application.Interface;

public interface ITokenClaimsService
{
string GetToken(TokenInfo? info);
}
3.IRepository
namespace Shared.Application.Interface
{
public interface IRepository<T> : IDisposable where T : class
{
IQueryable<T> SqlQuery(string sql, params object[] parameters);

        Task<int> ExecuteSqlCommandAsync(string sql, bool doNotEnsureTransaction = false, int? timeout = null, params object[] parameters);
        IQueryable<T> All { get; }

        public Task<T?> GetSingleOrDefaultAsync(
            Expression<Func<T, bool>> predicate,
            bool disableTracking = true,
            CancellationToken cancellationToken = default
        );

        public Task<TResult?> GetSingleOrDefaultAsync<TResult>(
            Expression<Func<T, bool>> predicate,
            bool disableTracking = true,
            CancellationToken cancellationToken = default
        );

        public Task<List<T>> GetListAsync(
            Expression<Func<T, bool>> predicate,
            Func<IQueryable<T>, IOrderedQueryable<T>>? orderBy = null,
            bool disableTracking = true,
            CancellationToken cancellationToken = default
        );

        public Task<List<TResult>> GetListAsync<TResult>(
            Expression<Func<T, bool>> predicate,
            Func<IQueryable<T>, IOrderedQueryable<T>>? orderBy = null,
            bool disableTracking = true,
            CancellationToken cancellationToken = default
        );

        public Task<PaginatedData<T>> GetPaginatedListAsync(
            Filter filter,
            Expression<Func<T, bool>>? predicate = null,
            CancellationToken cancellationToken = default
        );

        public Task<PaginatedData<TResult>> GetPaginatedListAsync<TResult>(
            Filter filter,
            Expression<Func<T, bool>>? predicate = null,
            CancellationToken cancellationToken = default
        );

        IQueryable<T> GetAll(
            Expression<Func<T, bool>>? filter = null,
            Func<IQueryable<T>, IOrderedQueryable<T>>? orderBy = null,
            params Expression<Func<T, object?>>[] includes
        );

        T? GetById(object id);
        Task<T?> GetByIdAsync(object id, CancellationToken cancellationToken = default);
        void Insert(T entity);
        Task<T> InsertAsync(T entity);
        void Update(T entity);
        void Delete(T entity);
        Task<bool> AllAsync(Expression<Func<T, bool>> predicate, CancellationToken cancellationToken = default);
        /// <summary>
        /// Returns true if any entity satisfies the predicate (or if any entity exists at all).
        /// </summary>
        Task<bool> GetAnyAsync(Expression<Func<T, bool>>? predicate = null, CancellationToken cancellationToken = default);
        /// <summary>
        /// Inserts a range of entities in one batch.
        /// </summary>
        Task InsertRangeAsync(IEnumerable<T> entities, CancellationToken cancellationToken = default);
        // Task<List<T>> SqlQueryAsync(string query, List<SqlParameter> parameters);
        // Task<string> SqlQueryScalar(string query, List<SqlParameter> parameters);

    }

}
4.IUnitOfWork
using Shared.Application.Interface;

namespace Shared.Application.Interfaces;

public interface IUnitOfWork : IDisposable
{
public void BeginTransaction();
public int Commit();
public Task<int> CommitAsync();
public IRepository<TEntity> Repository<TEntity>() where TEntity : class;
public void Rollback();
public int SaveChanges();
public Task<int> SaveChangesAsync();
public Task<int> SaveChangesAsync(CancellationToken cancellationToken);
}

etc
//shared/shared.Application/DependecyInjection.cs
using Shared.Application.Configuration;
using Shared.Application.SeedData;

namespace Shared.Application;

/// <summary>
/// Dependency injection extensions for Shared.Application layer
/// </summary>
public static class DependencyInjection
{
/// <summary>
/// Adds Shared.Application services to the dependency injection container
/// </summary>
/// <param name="services">Service collection</param>
/// <param name="configuration">Application configuration</param>
/// <returns>Service collection for chaining</returns>
public static IServiceCollection AddSharedApplication(this IServiceCollection services, IConfiguration configuration)
{
// Register AutoMapper from this assembly - use the Assembly overload
services.AddAutoMapper(cfg => { }, Assembly.GetExecutingAssembly());

        // Register AppConfig options using BindConfiguration
        _ = services.Configure<AppConfig>(
            options => configuration.GetSection("AppConfig").Bind(options));

        // Register MailConfig options using BindConfiguration
        _ = services.Configure<MailConfig>(
            options => configuration.GetSection("SMTPConfig").Bind(options));

        // Register DbInitializer for seeding data
        _ = services.AddScoped<DbInitializer>();

        return services;
    }

}

//shared.Domain/DTOs
1.TokenInfo.cs
namespace Shared.Domain.DTOs;

public class TokenInfo
{
public int UserId { get; }
public string? UserName { get; }
public string? FullName { get; }
public string? Email { get; }
public int TenantId { get; }
public string? AgentId { get; }
public string? ProductCode { get; }
public string? ProductName { get; }
public string? ProfilePhoto { get; }
public IList<string> Roles { get; set; }

    public TokenInfo(int userId, string? userName, string? fullName, string? email, int tenantId, string? productCode, string? productName, string? profilePhoto, IList<string> roles)
    {
        UserId = userId;
        UserName = userName;
        FullName = fullName;
        Email = email;
        TenantId = tenantId;
        ProductCode = productCode;
        ProductName = productName;
        ProfilePhoto = profilePhoto;
        Roles = roles ?? [];
    }

}
2.userInfo.cs
namespace Shared.Domain.DTOs;

public class UserInfo(Guid id, string userName, string name)
{
public Guid Id { get; set; } = id;
public string UserName { get; set; } = userName;
public string Name { get; set; } = name;
}
//shared/Shared.Infrastructure

1. configurations/UserManagement/
   i.UserConfiguration.cs
   namespace Shared.Infrastructure.Data.Configurations.UserManagement;

public class UserConfiguration : IEntityTypeConfiguration<User>
{
public void Configure(EntityTypeBuilder<User> builder)
{
builder.ToTable("Users", Schemas.UserManagement);
builder.HasKey(u => u.UserId);
builder.Property(u => u.Email).IsRequired().HasMaxLength(250);
builder.Property(u => u.UserName).IsRequired().HasMaxLength(100);
builder.Property(u => u.FullName).HasMaxLength(200);
builder.Property(u => u.Password).IsRequired();

        builder.HasIndex(u => new { u.TenantId, u.Email }).IsUnique().HasDatabaseName("IX_Users_TenantId_Email");
        builder.HasIndex(u => new { u.TenantId, u.UserName }).IsUnique().HasDatabaseName("IX_Users_TenantId_UserName");

        // Configure relationship as optional to avoid issues with global query filters
        builder.HasMany(u => u.UserRoles)
            .WithOne(ur => ur.User)
            .HasForeignKey(ur => ur.UserId)
            .IsRequired(false)
            .OnDelete(DeleteBehavior.Cascade);
    }

}
ii.RoleConfiguration.cs
namespace Shared.Infrastructure.Data.Configurations.UserManagement;

public class RoleConfiguration : IEntityTypeConfiguration<Role>
{
public void Configure(EntityTypeBuilder<Role> builder)
{
builder.ToTable("Roles", Schemas.UserManagement);
builder.HasKey(r => r.RoleId);
builder.Property(r => r.Name).IsRequired().HasMaxLength(100);
builder.Property(r => r.Description).HasMaxLength(500);
builder.HasIndex(r => new { r.TenantId, r.Name }).IsUnique().HasDatabaseName("IX_Roles_TenantId_Name");

        // Configure relationships as optional to avoid issues with global query filters
        builder.HasMany(r => r.UserRoles)
            .WithOne(ur => ur.Role)
            .HasForeignKey(ur => ur.RoleId)
            .IsRequired(false);

        builder.HasMany(r => r.RolePermissions)
            .WithOne(rp => rp.Role)
            .HasForeignKey(rp => rp.RoleId)
            .IsRequired(false);
    }

}
etc according to entity
2.Dbcontext
i.HrmDbContext/HrmDbContext.cs
ii.SchoolDbContext/schoolDbContext.cs
3.Interceptor/DispatchDomainEventInterceptor.cs
using MediatR;
using Microsoft.EntityFrameworkCore.Diagnostics;
using Shared.Domain.Abstraction;
using EfDbContext = Microsoft.EntityFrameworkCore.DbContext;

namespace Shared.Infrastructure.Data.Interceptors;

public class DispatchDomainEventsInterceptor : SaveChangesInterceptor
{
private readonly IMediator \_mediator;

    public DispatchDomainEventsInterceptor(IMediator mediator)
    {
        _mediator = mediator;
    }

    public override InterceptionResult<int> SavingChanges(DbContextEventData eventData, InterceptionResult<int> result)
    {
        DispatchDomainEvents(eventData.Context).GetAwaiter().GetResult();

        return base.SavingChanges(eventData, result);
    }

    public override async ValueTask<InterceptionResult<int>> SavingChangesAsync(DbContextEventData eventData, InterceptionResult<int> result, CancellationToken cancellationToken = default)
    {
        await DispatchDomainEvents(eventData.Context);

        return await base.SavingChangesAsync(eventData, result, cancellationToken);
    }

    public async Task DispatchDomainEvents(EfDbContext? context)
    {
        if (context is null) return;

        var entities = context.ChangeTracker
            .Entries<BaseEntity>()
            .Where(e => e.Entity.DomainEvents.Any())
            .Select(e => e.Entity)
            .ToList();

        var domainEvents = entities
            .SelectMany(e => e.DomainEvents)
            .ToList();

        entities.ForEach(e => e.ClearDomainEvents());

        foreach (var domainEvent in domainEvents)
            await _mediator.Publish(domainEvent);
    }

} 4. Repositories
i.GenericRepositry.cs
namespace Shared.Infrastructure.Repositories;

public class GenericRepository<T> : IRepository<T> where T : class
{
protected IDbContext context;
protected DbSet<T> dbSet;
protected bool \_disposed;
protected readonly AutoMapper.IConfigurationProvider \_mapperConfig;

    public GenericRepository(IDbContext context, AutoMapper.IConfigurationProvider mapperConfig)
    {
        this.context = context;
        dbSet = context.Set<T>();
        _mapperConfig = mapperConfig;
    }

    public IQueryable<T> All => dbSet.AsQueryable();

    public async Task<bool> AllAsync(
        Expression<Func<T, bool>> predicate,
        CancellationToken cancellationToken = default
    )
        => await dbSet.AllAsync(predicate, cancellationToken);

    public void Delete(T entity)
    {
        dbSet.Remove(entity);
    }

    public void Dispose()
    {
        Dispose(true);
        GC.SuppressFinalize(this);
    }

    public virtual void Dispose(bool disposing)
    {
        if (!_disposed && disposing)
            context.Dispose();
        _disposed = true;
    }

    public async Task<int> ExecuteSqlCommandAsync(string sql, bool doNotEnsureTransaction = false, int? timeout = null, params object[] parameters)
    {
        await Task.Delay(0);
        throw new NotImplementedException();
    }

    public async Task<TResult?> GetSingleOrDefaultAsync<TResult>(
        Expression<Func<T, bool>> predicate,
        bool disableTracking = true,
        CancellationToken cancellationToken = default
    )
    {
        IQueryable<T> query = dbSet;
        if (disableTracking)
        {
            query = query.AsNoTracking();
        }

        if (predicate != null)
        {
            query = query.Where(predicate);
        }

        return await query.ProjectTo<TResult>(_mapperConfig).SingleOrDefaultAsync(cancellationToken);
    }

    public async Task<T?> GetSingleOrDefaultAsync(
        Expression<Func<T, bool>> predicate,
        bool disableTracking = true,
        CancellationToken cancellationToken = default
    )
    {
        IQueryable<T> query = dbSet;
        if (disableTracking)
        {
            query = query.AsNoTracking();
        }

        if (predicate != null)
        {
            query = query.Where(predicate);
        }

        return await query.FirstOrDefaultAsync(cancellationToken);
    }

    public virtual async Task<List<TResult>> GetListAsync<TResult>(
        Expression<Func<T, bool>> predicate,
        Func<IQueryable<T>, IOrderedQueryable<T>>? orderBy = null,
        bool disableTracking = true,
        CancellationToken cancellationToken = default
    )
    {
        IQueryable<T> query = dbSet;
        if (disableTracking)
        {
            query = query.AsNoTracking();
        }

        if (predicate != null)
        {
            query = query.Where(predicate);
        }

        if (orderBy != null)
        {
            return await orderBy(query).ProjectTo<TResult>(_mapperConfig).ToListAsync(cancellationToken);
        }
        else
        {
            return await query.ProjectTo<TResult>(_mapperConfig).ToListAsync(cancellationToken);
        }
    }

    public async Task<List<T>> GetListAsync(
        Expression<Func<T, bool>> predicate,
        Func<IQueryable<T>, IOrderedQueryable<T>>? orderBy = null,
        bool disableTracking = true,
        CancellationToken cancellationToken = default
    )
    {
        IQueryable<T> query = dbSet;
        if (disableTracking)
        {
            query = query.AsNoTracking();
        }

        if (predicate != null)
        {
            query = query.Where(predicate);
        }

        if (orderBy != null)
        {
            return await orderBy(query).ToListAsync(cancellationToken);
        }
        else
        {
            return await query.ToListAsync(cancellationToken);
        }
    }

    private async Task<PaginatedData<TResult>> BaseGetPaginatedListAsync<TResult>(
        Filter filter,
        Expression<Func<T, bool>>? predicate,
        Func<IQueryable<T>, Task<List<TResult>>> fetcher,
        CancellationToken cancellationToken
    )
    {
        IQueryable<T> query = dbSet;
        query = query.AsNoTracking();

        foreach (var param in filter.Params)
        {
            if (!string.IsNullOrWhiteSpace(param.Value))
            {
                switch (param.Option)
                {
                    case FilterOption.StartsWith:
                        query = query.Where(x => EF.Property<string>(x, param.Key).StartsWith(param.Value));
                        break;
                    case FilterOption.EndsWith:
                        query = query.Where(x => EF.Property<string>(x, param.Key).EndsWith(param.Value));
                        break;
                    case FilterOption.Contains:
                        query = query.Where(x => EF.Property<string>(x, param.Key).Contains(param.Value));
                        break;
                    case FilterOption.DoesNotContain:
                        query = query.Where(x => !EF.Property<string>(x, param.Key).Contains(param.Value));
                        break;
                    case FilterOption.IsEmpty:
                        query = query.Where(x => string.IsNullOrEmpty(x.GetType().GetProperty(param.Key)!.GetValue(x, null)!.ToString()));
                        break;
                    case FilterOption.IsNotEmpty:
                        query = query.Where(x => !string.IsNullOrEmpty(x.GetType().GetProperty(param.Key)!.GetValue(x, null)!.ToString()));
                        break;
                    case FilterOption.IsGreaterThan:
                        query = query.Where(x => ApplyComparisonFilter(x, param, (x, value) => ConvertToComparable(x, value) > 0));
                        break;
                    case FilterOption.IsGreaterThanOrEqualTo:
                        query = query.Where(x => ApplyComparisonFilter(x, param, (x, value) => ConvertToComparable(x, value) >= 0));
                        break;
                    case FilterOption.IsLessThan:
                        query = query.Where(x => ApplyComparisonFilter(x, param, (x, value) => ConvertToComparable(x, value) < 0));
                        break;
                    case FilterOption.IsLessThanOrEqualTo:
                        query = query.Where(x => ApplyComparisonFilter(x, param, (x, value) => ConvertToComparable(x, value) <= 0));
                        break;
                    case FilterOption.IsEqualTo:
                        query = query.Where(x => ApplyComparisonFilter(x, param, (x, value) => x == value));
                        break;
                    case FilterOption.IsNotEqualTo:
                        query = query.Where(x => ApplyComparisonFilter(x, param, (x, value) => ConvertToComparable(x, value) != 0));
                        break;
                    default:
                        break;
                }
            }
        }

        if (predicate != null)
        {
            query = query.Where(predicate);
        }

        var count = (uint)await query.CountAsync(cancellationToken);

        if (filter.PageSize == 0 || count < (filter.PageNumber - 1) * filter.PageSize)
        {
            filter.PageNumber = 1;
            filter.PageSize = count;
        }

        foreach (var sortParam in filter.Sort)
        {
            if (!string.IsNullOrWhiteSpace(sortParam.Field))
            {
                query = sortParam.SortOrder == SortOrder.Asc
                    ? query.OrderBy(x => EF.Property<object>(x, sortParam.Field))
                    : query.OrderByDescending(x => EF.Property<object>(x, sortParam.Field));
            }
        }

        var rows = await fetcher(query
             .Skip((int)((filter.PageNumber - 1) * filter.PageSize))
             .Take((int)filter.PageSize));

        return new PaginatedData<TResult>(rows, count, filter.PageNumber, filter.PageSize);
    }

    public async Task<PaginatedData<T>> GetPaginatedListAsync(
        Filter filter,
        Expression<Func<T, bool>>? predicate = null,
        CancellationToken cancellationToken = default
    )
    {
        return await BaseGetPaginatedListAsync<T>(filter, predicate, (query) => query.ToListAsync(cancellationToken), cancellationToken);
    }

    public async Task<PaginatedData<TResult>> GetPaginatedListAsync<TResult>(
        Filter filter,
        Expression<Func<T, bool>>? predicate = null,
        CancellationToken cancellationToken = default
    )
    {
        return await BaseGetPaginatedListAsync<TResult>(
            filter,
            predicate,
            (query) => query.ProjectTo<TResult>(_mapperConfig).ToListAsync(cancellationToken),
            cancellationToken
        );
    }

    private bool ApplyComparisonFilter<TModel>(TModel? model, FilterParam param, Func<object?, object?, bool> comparison)
    {
        if (model == null) return false;
        var propertyValue = model.GetType().GetProperty(param.Key)!.GetValue(model, null);
        if (propertyValue == null) return false;
        var convertedValue = Convert.ChangeType(param.Value, propertyValue.GetType());
        return comparison(model, convertedValue);
    }

    private int ConvertToComparable(object? obj1, object? obj2)
    {
        if (obj1 is IComparable && obj2 is IComparable)
        {
            return ((IComparable)obj1).CompareTo(obj2);
        }
        else
        {
            throw new ArgumentException("Objects must implement IComparable interface.");
        }
    }

    public IQueryable<T> GetAll(
        Expression<Func<T, bool>>? filter = null,
        Func<IQueryable<T>, IOrderedQueryable<T>>? orderBy = null,
        params Expression<Func<T, object?>>[] includes
    )
    {
        IQueryable<T> query = dbSet;

        if (filter != null)
            query = query.Where(filter);

        if (orderBy != null)
            query = orderBy(query);

        if (includes != null)
            foreach (var include in includes)
                query = query.Include(include);

        return query;
    }

    public T? GetById(object id) => dbSet.Find(id);

    public virtual async Task<T?> GetByIdAsync(object id, CancellationToken cancellationToken = default)
        => await dbSet.FindAsync(new object[] { id }, cancellationToken: cancellationToken);

    public void Insert(T entity) => dbSet.Add(entity);

    public async Task<T> InsertAsync(T entity)
    {
        _ = await dbSet.AddAsync(entity);
        return entity;
    }

    public IQueryable<T> SqlQuery(string sql, params object[] parameters) => dbSet.FromSqlRaw(sql, parameters);

    public void Update(T entity) => dbSet.Update(entity);

    public async Task<bool> GetAnyAsync(Expression<Func<T, bool>>? predicate = null, CancellationToken cancellationToken = default)
    {
        var query = dbSet.AsQueryable();
        if (predicate != null)
            query = query.Where(predicate);
        return await query.AnyAsync(cancellationToken);
    }

    public async Task InsertRangeAsync(IEnumerable<T> entities, CancellationToken cancellationToken = default)
    {
        await dbSet.AddRangeAsync(entities, cancellationToken);
    }

}
ii.UnitOfWork.cs
using AutoMapper;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Shared.Application.Interface;
using Shared.Application.Interfaces;
using System.Collections;

namespace Shared.Infrastructure.Repositories;

public class UnitOfWork : IUnitOfWork
{
private readonly IDbContext \_context;
private bool \_disposed;
private readonly Hashtable \_repositories = [];
private readonly AutoMapper.IConfigurationProvider \_mapperConfig;
private readonly IServiceProvider \_serviceProvider;
public UnitOfWork(IDbContext context, IMapper mapper, IServiceProvider serviceProvider)
{
\_context = context;
\_mapperConfig = mapper.ConfigurationProvider;
\_serviceProvider = serviceProvider;
}

    public void BeginTransaction()
    {
        _context.BeginTransaction();
    }

    public int Commit()
    {
        return _context.Commit();
    }

    public Task<int> CommitAsync()
    {
        return _context.CommitAsync();
    }

    public void Dispose()
    {
        Dispose(true);
        GC.SuppressFinalize(this);
    }

    public virtual void Dispose(bool disposing)
    {
        if (!_disposed && disposing)
        {
            _context.Dispose();

            if (_repositories != null && _repositories.Values != null && _repositories.Values.OfType<IDisposable>().Any())
            {
                foreach (IDisposable repository in _repositories.Values)
                {
                    repository.Dispose();
                }
            }
        }
        _disposed = true;
        GC.SuppressFinalize(this);
    }

    public IRepository<TEntity> Repository<TEntity>() where TEntity : class
    {
        var type = typeof(TEntity).Name;
        var repo = _repositories[type];
        if (_repositories.ContainsKey(type) && repo != null)
            return (IRepository<TEntity>)repo;
        else
        {
            var repositoryType = typeof(GenericRepository<>);
            IRepository<TEntity>? newRepo;
            try
            {
                newRepo = _serviceProvider.GetService<IRepository<TEntity>>();
            }
            catch (InvalidOperationException)
            {
                newRepo = null;
            }

            if (newRepo != null)
                _repositories.Add(type, newRepo);
            else
                _repositories.Add(type, Activator.CreateInstance(repositoryType.MakeGenericType(typeof(TEntity)), _context, _mapperConfig));
            repo = _repositories[type];
            if (repo != null)
                return (IRepository<TEntity>)repo;
            else
                throw new Exception("Repository could not be added");
        }
    }

    public void Rollback()
    {
        _context.Rollback();
    }

    public int SaveChanges()
    {
        return _context.SaveChanges();
    }

    public Task<int> SaveChangesAsync()
    {
        return _context.SaveChangesAsync();
    }

    public Task<int> SaveChangesAsync(CancellationToken cancellationToken)
    {
        return _context.SaveChangesAsync(cancellationToken);
    }

}
5.Service
i.CurrentUserService.cs
using Microsoft.AspNetCore.Http;

namespace Shared.Infrastructure.Service;

public class CurrentUserService : ICurrentUserService
{
private readonly IHttpContextAccessor \_httpContextAccessor;

    public CurrentUserService(IHttpContextAccessor httpContextAccessor)
    {
        _httpContextAccessor = httpContextAccessor;
    }
    public Guid? UserId
    {
        get
        {
            var userId = GetClaimValue("UserId");
            return string.IsNullOrEmpty(userId) ? null : Guid.Parse(userId);
        }
    }
    public string? UserName
    {
        get
        {
            var userName = GetClaimValue("UserName");
            return string.IsNullOrEmpty(userName) ? null : userName;
        }
    }
    public int? CompanyId
    {
        get
        {
            var companyId = GetClaimValue("CompanyId");
            try
            {
                return string.IsNullOrEmpty(companyId) ? null : int.Parse(companyId);
            }
            catch
            {
                return null;
            }
        }
    }
    public Guid? AgentId => null;
    public Guid? BranchId => null;
    public Guid? CustomerId
    {
        get
        {
            var customerId = GetClaimValue("CustomerId");
            try
            {
                return string.IsNullOrEmpty(customerId) ? null : Guid.Parse(customerId);
            }
            catch
            {
                return null;
            }
        }
    }

    public UserInfo? UserInfo
    {
        get
        {
            if (UserId.HasValue && !string.IsNullOrEmpty(UserName))
                return new(UserId ?? Guid.Empty, UserName, GetClaimValue("Name")!);
            else
                return null;
        }
    }

    private string? GetClaimValue(string claimType)
    {
        try
        {
            return (_httpContextAccessor.HttpContext?.User?.Identity?.IsAuthenticated ?? false)
                ? _httpContextAccessor.HttpContext?.User?.Claims.Single(c => c.Type == claimType).Value ?? null
                : null;
        }
        catch
        {
            return null;
        }
    }

}
ii.IdentityTokenClaimService.cs
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using Shared.Application.Configuration;

namespace Shared.Infrastructure.Service;

public class IdentityTokenClaimService : ITokenClaimsService
{

    private readonly UserManager<User> _userManager;
    private readonly AppConfig _config;

    public IdentityTokenClaimService(UserManager<User> userManager, IOptions<AppConfig> config)
    {
        _userManager = userManager;
        _config = config.Value;
    }


    public string GetToken(TokenInfo? info)
    {
        ArgumentNullException.ThrowIfNull(info);
        ArgumentNullException.ThrowIfNull(info.Email);
        var tokenHandler = new JwtSecurityTokenHandler();
        var key = Encoding.ASCII.GetBytes(_config.ApiKey);
        var claims = new List<Claim>
        {
            new Claim(ClaimTypes.Email, info.Email ?? string.Empty),
            new Claim("UserId", info.UserId.ToString()?? string.Empty),
            new Claim("UserName", info.UserName ?? string.Empty),
            new Claim("Name", info.FullName ?? string.Empty),
            new Claim("CompanyId", info.CompanyId.ToString()?? string.Empty),
            new Claim("BranchId", info.BranchId?? string.Empty),
            new Claim("AgentId", info.AgentId?? string.Empty),
            new Claim("CustomerId", info.CustomerId.ToString()?? string.Empty),
        };

        if (info.CustomerId == null)
        {
            var roles = info.Roles;
            foreach (var role in roles)
            {
                claims.Add(new Claim(ClaimTypes.Role, role));
            }
        }

        var tokenDescriptor = new SecurityTokenDescriptor
        {
            Issuer = _config.ApiURL,
            Audience = _config.WebURL,
            Subject = new ClaimsIdentity(claims.ToArray()),
            Expires = DateTime.UtcNow.AddDays(7),
            SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)
        };
        var token = tokenHandler.CreateToken(tokenDescriptor);
        return tokenHandler.WriteToken(token);
    }

}
//Shared/Shared.Infrastructure/DependencyInjection.cs

using Shared.Application.SeedData;
using Shared.Domain.Abstraction.Interface;

namespace Shared.Infrastructure;

public static class DependencyInjection
{
public static IServiceCollection AddSharedInfrastructure(this IServiceCollection services)
{
services.AddScoped<IUnitOfWork, UnitOfWork>();
services.AddScoped<DbInitializer>();

        // Register ITenantContext with a default implementation
        services.AddScoped<ITenantContext>(provider => new TenantContext());
        // Register the domain events interceptor (shared across all DbContexts)
        services.AddScoped<DispatchDomainEventsInterceptor>();

        // Register AutoMapper - scan all assemblies for profiles
        services.AddAutoMapper(cfg => { }, AppDomain.CurrentDomain.GetAssemblies());

        return services;
    }

    public static IServiceCollection AddHrmDbContext(this IServiceCollection services, string connectionString)
    {
        services.AddDbContext<HrmDbContext>((sp, options) =>
        {
            options.UseSqlServer(connectionString)
                   .AddInterceptors(sp.GetRequiredService<DispatchDomainEventsInterceptor>());
        });

        services.AddScoped<IDbContext>(provider => provider.GetRequiredService<HrmDbContext>());

        //services.AddDbContext<HrmDbContext>(options =>
        //    options.UseSqlServer(connectionString));

        //services.AddScoped<IDbContext>(provider => provider.GetRequiredService<HrmDbContext>());
        return services;
    }

    public static IServiceCollection AddSchoolDbContext(this IServiceCollection services, string connectionString)
    {
        services.AddDbContext<SchoolDbContext>((sp, options) =>
        {
            options.UseSqlServer(connectionString)
                   .AddInterceptors(sp.GetRequiredService<DispatchDomainEventsInterceptor>());
        });

        services.AddScoped<IDbContext>(provider => provider.GetRequiredService<SchoolDbContext>());

        //services.AddDbContext<SchoolDbContext>(options =>
        //    options.UseSqlServer(connectionString));

        //services.AddScoped<IDbContext>(provider => provider.GetRequiredService<SchoolDbContext>());
        return services;
    }

}

//UserManagement
1.UserManagement.API
2.User.Management.Application
3.User.Management.Domain
i.Entity
a.BaseEntity
i.BaseEntity.cs
using System.ComponentModel.DataAnnotations.Schema;

namespace UserManagement.Domain.Entities.BaseEntities;

public abstract class BaseEntity
{

    private readonly List<BaseEvent> _domainEvents = [];

    [NotMapped]
    public IReadOnlyCollection<BaseEvent> DomainEvents => _domainEvents.AsReadOnly();

    public void AddDomainEvent(BaseEvent domainEvent)
    {
        _domainEvents.Add(domainEvent);
    }

    public void RemoveDomainEvent(BaseEvent domainEvent)
    {
        _ = _domainEvents.Remove(domainEvent);
    }

    public void ClearDomainEvents()
    {
        _domainEvents.Clear();
    }

}
ii.BaseDatedEntity.cs
namespace UserManagement.Domain.Entities.BaseEntities;

public abstract class BaseDatedEntity() : BaseEntity
{
public DateTime FromDate { get; set; } = DateTime.UtcNow;

    public DateOnly? ToDate { get; private set; }

    public void Terminate()
    {
        ToDate = DateOnly.FromDateTime(DateTime.UtcNow);
    }

}
iii.AuditableEntity.cs

using Shared.Domain.Abstraction.Enum;

namespace UserManagement.Domain.Entities.BaseEntities;

public abstract class AuditableEntity : BaseDatedEntity
{
public User? EntryBy { get; private set; }
public User? UpdatedBy { get; private set; }
public DateTime EntryDate { get; private set; } = DateTime.UtcNow;
public DateTime? UpdatedDate { get; private set; } = DateTime.UtcNow;
public VerificationStatus VerificationStatus { get; private set; } = VerificationStatus.Saved;

    public void SetEntry(User? entryBy)
    {
        EntryBy = entryBy;
        UpdatedDate = DateTime.UtcNow;
    }

    public void SetUpdate(User? updatedBy)
    {
        UpdatedBy = updatedBy;
        UpdatedDate = DateTime.UtcNow;
    }

    public void Submit()
    {
        VerificationStatus = VerificationStatus.Submitted;
    }

    public void Approve()
    {
        VerificationStatus = VerificationStatus.Approved;
    }
    public void Reject()
    {
        VerificationStatus = VerificationStatus.Rejected;
    }

    public bool IsTerminated => ToDate != null;
    public bool IsVerified => VerificationStatus == VerificationStatus.Approved;
    public bool IsRejected => VerificationStatus == VerificationStatus.Rejected;
    public bool IsUnapproved => VerificationStatus == VerificationStatus.Submitted;

    public bool ValidOnDate(DateTime date)
    {
        return ValidOnDate(DateOnly.FromDateTime(date));
    }

    public bool ValidOnDate(DateOnly date)
    {
        if (!IsVerified)
            return false;
        return date >= DateOnly.FromDateTime(EntryDate) && (ToDate == null || date <= ToDate);
    }

}
iv.BaseEvent.cs
using MediatR;

namespace UserManagement.Domain.Entities.BaseEntities;

public abstract class BaseEvent : INotification
{
}
b.Agent.cs

////| Agent | Allowed Roles |
//| ---------------- | ----------------------- |
//| Kathmandu Branch | Manager, Teller |
//| Pokhara Branch | Teller |
//| Head Office | Admin, Manager, Auditor |

using UserManagement.Domain.Entities.BaseEntities;

namespace UserManagement.Domain.Entities;

public class Agent : AuditableEntity
{
[MaxLength(250)]
public string? Name { get; private set; }
[MinLength(9)]
[MaxLength(9)]
public string? Pan { get; private set; }
public string? RegNo { get; private set; }
public bool IsParent { get; private set; }
[MaxLength(50)]
public string? ReferralCode { get; private set; }

    private readonly List<AgentUser> _agentUsers = [];
    public IReadOnlyCollection<AgentUser> AgentUsers => _agentUsers.AsReadOnly();
    private readonly List<AgentRole> _rolesForUser = [];
    public IReadOnlyCollection<AgentRole> RolesForUser => _rolesForUser.AsReadOnly();

}
c.AgentRole.cs
using UserManagement.Domain.Entities.BaseEntities;

namespace UserManagement.Domain.Entities;

public class AgentRole : AuditableEntity
{
public Role Role { get; private set; }

    public AgentRole(Role role)
    {
        Role = role;
    }

#pragma warning disable CS8618
private AgentRole() { }
}
d.AgentUser.cs

//which user belong to which agent

//| Id | UserId | AgentId | FromDate | ToDate |
//| -- | ------ | ------- | ---------- | ---------- |
//| 1 | 1 | 10 | 2026 - 01 - 01 | 2026 - 03 - 31 |
//| 2 | 1 | 20 | 2026 - 04 - 01 | NULL |
//| 3 | 2 | 10 | 2026 - 06 - 01 | NULL |

namespace UserManagement.Domain.Entities;

public class AgentUser
{
public int Id { get; private set; }
public User User { get; private set; }
public Agent Agent { get; private set; }
public DateTime FromDate { get; private set; } = DateTime.UtcNow;
public DateTime? ToDate { get; private set; }
public void Terminate()
{
this.ToDate = DateTime.UtcNow;
}

    public AgentUser(User user, Agent agent)
    {
        User = user;
        Agent = agent;
    }

#pragma warning disable CS8618
private AgentUser() { }
}

e.Appliation.s
using System.Reflection;
using UserManagement.Domain.Enum;

namespace Security.Domain.Entities;

public class Application
{
public Guid Id { get; private set; }
public ApplicationEnum Code { get; private set; }
[MaxLength(100)]
public string Name { get; private set; }
[MaxLength(500)]
public string Desc { get; private set; }

    private readonly List<Module> _modules = [];
    public IReadOnlyCollection<Module> Modules => _modules.AsReadOnly();

    public Application(Guid id, string name, string desc, ApplicationEnum code)
    {
        Id = id;
        Name = name;
        Desc = desc;
        Code = code;
    }

}
f.loginlog.cs
namespace UserManagement.Domain.Entities;

public class LoginLog
{
public int Id { get; private set; }
public User User { get; private set; }
[MaxLength(45)]
public string IpAddress { get; private set; }
[MaxLength(50)]
public string? MacAddress { get; private set; }
[MaxLength(100)]
public string ClientAgent { get; private set; }
[MaxLength(100)]
public string? OS { get; private set; }
public DateTime LoginDate { get; private set; } = DateTime.UtcNow;

    public LoginLog(User user, string ipAddress, string macAddress, string clientAgent)
    {
        User = user;
        IpAddress = ipAddress;
        MacAddress = macAddress;
        ClientAgent = clientAgent;
    }

#pragma warning disable CS8618
public LoginLog() { }
}
g.Menu.cs
namespace UserManagement.Domain.Entities;

public class Menu
{
public Guid Id { get; private set; } = Guid.NewGuid();
[MaxLength(100)]
public string MenuText { get; private set; }
[MaxLength(250)]
public string ToolTip { get; private set; }
public int OrderNo { get; private set; }
[MaxLength(256)]
public string? Url { get; private set; }
public Guid? ParentId { get; private set; }
public Menu? Parent { get; private set; }
[MaxLength(100)]
public string? Icon { get; private set; }
[MaxLength(20)]
public string? Color { get; private set; }
public bool Active { get; private set; }
public List<Menu>? Children { get; private set; }

    public Menu(
        Guid id,
        string menuText,
        string toolTip,
        int orderNo,
        string? url,
        Guid? parentId,
        string? icon,
        string? color,
        bool active = true

)
{
Id = id;
MenuText = menuText;
ToolTip = toolTip;
OrderNo = orderNo;
Url = url;
ParentId = parentId;
Icon = icon;
Color = color;
Active = active;
}

#pragma warning disable CS8618
private Menu() { }

}
h.Module.cs
using System.ComponentModel.DataAnnotations.Schema;
using UserManagement.Domain.Enum;

namespace UserManagement.Domain.Entities;

public class Module
{
public Guid Id { get; private set; }
public ModuleEnum Code { get; private set; }
public Guid ApplicationId { get; private set; }
[MaxLength(100)]
public string Name { get; private set; }
[MaxLength(500)]
public string Description { get; private set; }
public DateTime FromDate { get; private set; }
public DateTime? ToDate { get; private set; }
public Guid? MenuId { get; private set; }
public Menu? Menu { get; private set; }

    private readonly List<Role> _roles = [];
    [NotMapped]
    public IReadOnlyCollection<Role> Roles => _roles.AsReadOnly();

    private readonly List<ModulePermission> _ModulePermissions = [];
    public IReadOnlyCollection<ModulePermission> ModulePermissions => _ModulePermissions.AsReadOnly();

    public Module(Guid id, Guid applicationId, string name, string description, ModuleEnum code, DateTime fromDate, Guid? menuId = null)
    {
        Id = id;
        ApplicationId = applicationId;
        Name = name;
        Description = description;
        FromDate = fromDate;
        Code = code;
        MenuId = menuId;
    }

#pragma warning disable CS8618
private Module() { }
}
i.ModulePermission.cs
using System.ComponentModel.DataAnnotations.Schema;

namespace UserManagement.Domain.Entities;

public class ModulePermission
{
public Guid Id { get; private set; }
public Guid ModuleId { get; private set; }
public Module Module { get; private set; } = null!;
public Permission Permission { get; private set; }

    private readonly List<Role> _roles = [];
    [NotMapped]
    public IReadOnlyCollection<Role> Roles => _roles.AsReadOnly();

    public ModulePermission(Guid id, Guid moduleId, Permission permission)
    {
        Id = id;
        ModuleId = moduleId;
        Permission = permission;
    }

#pragma warning disable CS8618
private ModulePermission() { }
}

j.permission.cs
namespace UserManagement.Domain.Entities;

public class Permission : BaseEntity
{
[Key]
public int PermissionId { get; set; }
public string Code { get; set; } = string.Empty; // e.g., "hrm.employee.view"
public string Module { get; set; } = string.Empty; // "HRM", "Accounting"
public string? Description { get; set; }
}
k.Role.cs

namespace UserManagement.Domain.Entities;

public class Role : IdentityRole<Guid>
{
[MaxLength(500)]
public string Desc { get; private set; }

    public User? EntryBy { get; private set; }
    public DateTime EntryDate { get; private set; } = DateTime.UtcNow;
    public DateTime FromDate { get; private set; } = DateTime.UtcNow;
    public DateTime? ToDate { get; private set; }
    public ICollection<UserRole> UserRoles { get; private set; } = [];

    public void Terminate()
    {
        ToDate = DateTime.UtcNow;
    }

    private readonly List<RoleModulePermission> _roleModulePermissions = [];
    public IReadOnlyCollection<RoleModulePermission> RoleModulePermissions =>
        _roleModulePermissions.AsReadOnly();

    public Role(string name, string desc)
    {
        Name = name;
        Desc = desc;
    }

    public void AddRoleModulePermission(ModulePermission permission)
    {
        _roleModulePermissions.Add(new RoleModulePermission(this, permission));
    }

    public void RemoveRoleModulePermission(Guid modelPermissionId)
    {
        _ = _roleModulePermissions.Remove(_roleModulePermissions.Single(rmp => rmp.ModulePermissionId == modelPermissionId));
    }

    public void Update(string name, string desc)
    {
        Name = name;
        Desc = desc;
    }

}
l.RoleModulePermission.cs
namespace UserManagement.Domain.Entities;

public class RoleModulePermission
{
public Guid RoleId { get; private set; }
public Role Role { get; private set; }
public Guid ModulePermissionId { get; private set; }
public ModulePermission ModulePermission { get; private set; }

    public RoleModulePermission(Role role, ModulePermission modulePermission)
    {
        Role = role;
        ModulePermission = modulePermission;
    }

#pragma warning disable CS8618
private RoleModulePermission() { }
}

m.Tenant.cs
//it's a company

namespace UserManagement.Domain.Entities;

public class Tenant
{
[Key]
public int Id { get; private set; }
public string? Name { get; private set; }
public string? Email { get; private set; }
public string? Address { get; private set; }
public string PhoneNo { get; private set; }
public string Pan { get; private set; }
public string RegNo { get; private set; }
public string Url { get; private set; }

    //Navigation
    private readonly List<User> _users = [];
    public IReadOnlyCollection<User> Users => _users.AsReadOnly();

    private readonly List<TenantRole> _rolesForUser = [];
    public IReadOnlyCollection<TenantRole> RolesForUser => _rolesForUser.AsReadOnly();

    public Tenant(string name, string email, string address, string phoneNo, string pan, string regNo, string url)
    {
        Name = name;
        Email = email;
        Address = address;
        PhoneNo = phoneNo;
        Pan = pan;
        RegNo = regNo;
        Url = url;
    }

    public void AddTenantRole(TenantRole role)
    {
        _rolesForUser.Add(role);
    }

    public void RemoveTenantRole(TenantRole role)
    {
        _rolesForUser.Remove(role);
    }

    public void AddAgent(Agent agent)
    {
        _users.Add(agent);
    }
    private Tenant() { } // For EF Core

}
n.TenantRole.cs
using UserManagement.Domain.Entities.BaseEntities;

namespace UserManagement.Domain.Entities;

public class TenantRole : AuditableEntity
{
public Role Role { get; private set; }

    public TenantRole(Role role)
    {
        Role = role;
    }

    private TenantRole() { }

}
o.User.cs

namespace UserManagement.Domain.Entities;

public class User : IdentityUser<Guid>

{
[Key]
[MaxLength(100)]
public int UserId { get; private set; }
[MaxLength(256)]
public string? Email { get; private set; }
[MaxLength(100)]
public string? FullName { get; private set; }
[MaxLength(256)]
public string? Contact { get; private set; }
[MaxLength(256)]
public string? PasswordHash { get; private set; }
public bool IsEmailConfirmed { get; private set; }
public int FailedLoginAttempts { get; private set; }
public User? EntryBy { get; private set; }
public DateTime EntryDate { get; private set; }
public DateTime? LockedUntil { get; private set; }

    private readonly List<UserRole> _userRoles = [];
    public IReadOnlyCollection<UserRole> UserRoles => _userRoles.AsReadOnly();

    private readonly List<Permission> _userPermissions = [];
    public IReadOnlyCollection<Permission> UserPermissions => _userPermissions.AsReadOnly();

    private readonly List<UserStatus> _userStatuses = [];
    public IReadOnlyCollection<UserStatus> UserStatuses => _userStatuses.AsReadOnly();

    public User(string? email, string? fullName, string? contact, string? passwordHash, User? entryBy, DateTime entryDate)
    {
        Email = email;
        FullName = fullName;
        Contact = contact;
        PasswordHash = passwordHash;
        IsEmailConfirmed = false;
        FailedLoginAttempts = 0;
        EntryBy = entryBy;
        EntryDate = entryDate;
        AddStatus(new UserStatus());
    }

    private User() { } // For EF Core

    private void AddStatus(UserStatus status)
    {
        _userStatuses.Add(status);
    }

    public void AddRole(Role role)
    {
        _userRoles.Add(new UserRole(role));
    }

}
p.UserRole.cs
using UserManagement.Domain.Entities.BaseEntities;

namespace UserManagement.Domain.Entities;

public class UserRole : AuditableEntity
{
public Role Role { get; private set; }

    public UserRole(Role role)
    {
        Role = role;
    }

#pragma warning disable CS8618
private UserRole() { }
}
q.UserStatus.cs
namespace UserManagement.Domain.Entities;

public class UserStatus
{
public int Id { get; private set; }
public DateTime FromDate { get; private set; }
public DateTime? ToDate { get; private set; }

    public bool IsActive => !ToDate.HasValue || ToDate.Value > DateTime.UtcNow;

    public string? Remarks { get; private set; }

    public UserStatus(string? remarks = null)
    {
        Remarks = remarks ?? "User created";
    }

    public void Terminate(string? remarks = null)
    {
        ToDate = DateTime.UtcNow;
        Remarks = remarks ?? "User terminated";
    }

    private UserStatus() { } // For EF Core

}
