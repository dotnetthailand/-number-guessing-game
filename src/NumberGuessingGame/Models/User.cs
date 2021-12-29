namespace NumberGuessingGame.Models
{
    public class User
    {
        public int Id { get; set; }
        public long FacebookAppScopedUserId { get; set; }

        // Required after checking existing data
        public string FirstName { get; set; }
        public string LastName { get; set; }

        public string ProfilePictureUrl { get; set; }
        public string Name { get; set; }
        public string Email { get; set; }

        public IList<Player> Players { get; set; }
        public IList<Game> Games { get; set; }
    }
}