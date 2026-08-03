/**
 * Real C# excerpts, one per case study.
 *
 * A portfolio talks about code without ever showing any — this is the only
 * direct evidence a reader gets that the author writes cleanly. Each
 * snippet is short on purpose: the point is to show judgement, not volume.
 *
 * Highlighting is done at build time by a tiny tokeniser (see CodeBlock),
 * so no syntax-highlighting library ships to the browser.
 */

export interface Snippet {
  /** Filename shown in the block header. */
  file: string;
  code: string;
}

export const SNIPPETS: Record<string, Snippet> = {
  auth: {
    file: 'RefreshTokenService.cs',
    code: `// A refresh token is single-use. Presenting one that was already
// consumed is not a mistake — it means someone is replaying a token they
// should no longer hold, so the correct answer is to burn the whole family.
var presentedHash = RefreshTokenHasher.Hash(presentedToken);

var userId = await userRepository.FindUserIdByAuthenticationTokenAsync(
    LoginProvider, RefreshTokenName, presentedToken, cancellationToken);

if (userId is null)
{
    // Unknown token: either forged, or a replay of one already rotated.
    await HandlePossibleRefreshTokenReuseAsync(presentedHash, cancellationToken);
    throw new UnauthorizedAccessException("Invalid or expired refresh token");
}

// Remember what was consumed, before rotating — otherwise a later replay
// of this exact token is indistinguishable from a forgery.
await authenticationService.SetAuthenticationTokenAsync(
    user, LoginProvider, PreviousRefreshTokenHashName, presentedHash, cancellationToken);

// Compare-and-swap, not a plain update. Two refreshes racing on the same
// token must not both succeed: the database decides the winner, and the
// loser is rejected rather than silently issued a second valid session.
var rotated = await userRepository.TryReplaceAuthenticationTokenValueAsync(
    user.Id,
    LoginProvider,
    RefreshTokenName,
    expectedValue: presentedToken,
    newValue: newRefreshToken,
    cancellationToken);

if (!rotated)
{
    // Lost the race, or already rotated elsewhere. Fail closed.
    throw new UnauthorizedAccessException("Refresh token already rotated");
}`,
  },

  saas: {
    file: 'auth/magicLink.ts',
    code: `// Passwordless by design: the client base for this platform is small
// business owners, and every password reset was a support call. A magic
// link removes the credential entirely — there is nothing to leak, forget
// or reuse across sites.
export const requestMagicLink = async (email: string) => {
  // Single-use, short-lived, and stored hashed: a leaked database row
  // cannot be replayed as a login.
  const token = crypto.randomUUID();
  const hash = await sha256(token);

  await payload.create({
    collection: 'login-tokens',
    data: {
      email,
      hash,
      expiresAt: new Date(Date.now() + 10 * 60_000),
      consumedAt: null,
    },
  });

  await sendEmail(email, buildLoginUrl(token));

  // Always the same response, whether or not the address exists.
  // Returning "unknown email" would turn this endpoint into a way to
  // enumerate the customer list.
  return { ok: true };
};

export const consumeMagicLink = async (token: string) => {
  const hash = await sha256(token);
  const record = await findValidToken(hash);
  if (!record) return null;

  // Consume before issuing the session, so a replayed link fails even if
  // two requests arrive at the same moment.
  await payload.update({
    collection: 'login-tokens',
    id: record.id,
    data: { consumedAt: new Date() },
  });

  return createSession(record.email);
};`,
  },

  isolation: {
    file: 'ApplicationDbContext.cs',
    code: `// Tenant isolation is enforced once, in the model — not in every query.
// A developer who forgets a WHERE clause cannot leak another tenant's rows,
// because the filter is compiled into every LINQ query EF Core generates.
protected override void OnModelCreating(ModelBuilder builder)
{
    foreach (var entity in builder.Model.GetEntityTypes()
                 .Where(e => typeof(ITenantScoped).IsAssignableFrom(e.ClrType)))
    {
        builder.Entity(entity.ClrType)
               .HasQueryFilter(BuildTenantFilter(entity.ClrType));

        // Composite index: every filtered query starts with TenantId,
        // so it must lead the index or the filter costs a scan.
        builder.Entity(entity.ClrType)
               .HasIndex(nameof(ITenantScoped.TenantId), "Id");
    }
}

// TenantId comes from the validated JWT, never from the request body.
private LambdaExpression BuildTenantFilter(Type clrType)
{
    var parameter = Expression.Parameter(clrType, "e");
    var property = Expression.Property(parameter, nameof(ITenantScoped.TenantId));
    var current = Expression.Property(
        Expression.Constant(_tenantContext), nameof(ITenantContext.TenantId));

    return Expression.Lambda(Expression.Equal(property, current), parameter);
}`,
  },

  concurrency: {
    file: 'TimesheetConfiguration.cs',
    code: `// PostgreSQL already versions every row through the system column xmin.
// Using it as the concurrency token means no extra column to add, migrate
// or keep in sync — the database does the bookkeeping we would otherwise
// have to write and test ourselves.
public void Configure(EntityTypeBuilder<Timesheet> builder)
{
    builder.Property<uint>("xmin")
           .HasColumnType("xid")
           .ValueGeneratedOnAddOrUpdate()
           .IsConcurrencyToken();
}

// The API layer turns the EF exception into a contract the client can act on:
// the caller learns the row moved, and gets both values to show a real diff.
[HttpPut("{id:guid}")]
public async Task<IActionResult> Update(Guid id, UpdateTimesheetRequest request)
{
    try
    {
        await _timesheets.UpdateAsync(id, request, request.RowVersion);
        return Ok(ApiResponse.Success());
    }
    catch (DbUpdateConcurrencyException ex)
    {
        var current = ex.Entries.Single().GetDatabaseValues();

        return Conflict(ApiResponse.Conflict(
            expected: request.RowVersion,
            actual: current?["xmin"]));
    }
}`,
  },

  licensing: {
    file: 'ServiceCollectionExtensions.cs',
    code: `// MediatR moved to a dual licence in 2025. Rather than accept the risk or
// pay for 100+ handlers we already owned, the dispatch surface was replaced
// with the smallest thing that satisfied our actual usage: send, and nothing
// else. No pipelines, no notifications, no reflection at runtime.
public interface IRequestHandler<in TRequest, TResponse>
    where TRequest : IRequest<TResponse>
{
    Task<TResponse> HandleAsync(TRequest request, CancellationToken ct);
}

public sealed class Dispatcher(IServiceProvider provider) : IDispatcher
{
    public Task<TResponse> SendAsync<TResponse>(
        IRequest<TResponse> request, CancellationToken ct = default)
    {
        // Handlers are resolved by closed generic type, so a missing
        // registration fails at startup rather than at first request.
        var handlerType = typeof(IRequestHandler<,>)
            .MakeGenericType(request.GetType(), typeof(TResponse));

        dynamic handler = provider.GetRequiredService(handlerType);
        return handler.HandleAsync((dynamic)request, ct);
    }
}`,
  },
};
