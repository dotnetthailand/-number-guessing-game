namespace NumberGuessingGame.Models
{
    public class Game
    {
        public int Id { get; set; }
        public int FinishedUtc { get; set; }

        public IList<Player> Players { get; set; }
        public IList<User> Users { get; set; }
    }
}