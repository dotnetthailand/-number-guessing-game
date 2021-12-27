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
                    j => j // For Player to User
                        .HasOne(p => p.User)
                        .WithMany(u => u.Players)
                        .HasForeignKey(p => p.UserId),
                    j => j // For Player to Game
                        .HasOne(p => p.Game)
                        .WithMany(g => g.Players)
                        .HasForeignKey(p => p.GameId),
                    j =>
                    {
                        // j.Property(pt => pt.PublicationDate).HasDefaultValueSql("CURRENT_TIMESTAMP");
                        j.HasKey(p => new { p.UserId, p.GameId });
                    });

        }

        protected override void ConfigureConventions(ModelConfigurationBuilder configurationBuilder)
        {
            configurationBuilder.Properties<string>().HaveMaxLength(32);
        }
    }

}