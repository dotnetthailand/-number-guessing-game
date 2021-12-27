namespace NumberGuessingGame.Models
{
    public class Game
    {
        public string Title { get; set; }
        public string Rule { get; set; }
        public int Id { get; set; }
        public int FinishedUtc { get; set; }

        public IList<Player> Players { get; set; }
        public IList<User> Users { get; set; }
    }
}