using Microsoft.EntityFrameworkCore;

namespace NumberGuessingGame.Models
{
    public class GameDbContext : DbContext
    {
        public GameDbContext(DbContextOptions<GameDbContext> options) : base(options) { }

        public virtual DbSet<User> Users => Set<User>();
        public virtual DbSet<Game> Games => Set<Game>();
        public virtual DbSet<Player> Players => Set<Player>();

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Game>()
                .HasMany(g => g.Users)
                .WithMany(u => u.Games)
                .UsingEntity<Player>(
                    p => p // For Player to User
                        .HasOne(p => p.User)
                        .WithMany(u => u.Players)
                        .HasForeignKey(p => p.UserId),
                    p => p // For Player to Game
                        .HasOne(p => p.Game)
                        .WithMany(g => g.Players)
                        .HasForeignKey(p => p.GameId),
                    p =>
                    {
                        p.ToTable("player");
                        p.HasKey(p => new { p.GameId, p.UserId });
                        p.Property(p => p.GuessedNumber).HasMaxLength(2);
                        p.HasIndex(u => new { u.GameId, u.GuessedNumber }).IsUnique();
                    });

            modelBuilder.ApplyConfiguration(new UserConfiguration());
            modelBuilder.Entity<Game>().ToTable("game");
        }

        protected override void ConfigureConventions(ModelConfigurationBuilder configurationBuilder)
        {
            configurationBuilder.Properties<string>().HaveMaxLength(128);
        }
    }

}