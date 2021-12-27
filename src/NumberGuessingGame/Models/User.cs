namespace NumberGuessingGame.Models
{
    public class User
    {
        public int Id { get; set; }
        public string Email { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string Username { get; set; }
        public string FacebookUrl { get; set; }

        public IList<Player> Players { get; set; }
        public IList<Game> Games { get; set; }
    }
}