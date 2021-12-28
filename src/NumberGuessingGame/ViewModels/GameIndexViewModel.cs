using NumberGuessingGame.Models;

namespace NumberGuessingGame.ViewModels
{
    public class GameIndexViewModel
    {
        public Game Game { get; set; }
        public IReadOnlyList<Player> Players { get; set; }
    }
}
