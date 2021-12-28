namespace NumberGuessingGame.Models
{
    public class Player
    {
        public int UserId { get; set; }
        public User User { get; set; }

        public int GameId { get; set; }
        public Game Game { get; set; }

        public string GuessedNumber { get; set; }
        public DateTime PlayedAtUtc { get; set; }
    }
}