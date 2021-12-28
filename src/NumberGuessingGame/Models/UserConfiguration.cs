using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace NumberGuessingGame.Models
{
    public class UserConfiguration : IEntityTypeConfiguration<User>
    {
        public void Configure(EntityTypeBuilder<User> builder)
        {
            builder.ToTable("user");
            builder.HasIndex(u => u.Email).IsUnique();
            builder.Property(u=>u.ProfilePictureUrl).HasMaxLength(512);
        }
    }
}