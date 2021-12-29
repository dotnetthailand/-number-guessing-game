using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace NumberGuessingGame.Models
{
    public class UserConfiguration : IEntityTypeConfiguration<User>
    {
        public void Configure(EntityTypeBuilder<User> builder)
        {
            builder.ToTable("user");

            // Remove index
            // Alter null able
            //builder.HasIndex(u => u.Email).IsUnique();

            builder.Property(u => u.FacebookAppScopedUserId).IsRequired();
            builder.HasIndex(u => u.FacebookAppScopedUserId).IsUnique();
            builder.Property(u => u.ProfilePictureUrl).HasMaxLength(512);
        }
    }
}