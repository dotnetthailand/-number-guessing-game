using NumberGuessingGame.Models;

namespace NumberGuessingGame.ViewModels
{
    public class GameIndexViewModel
    {
        public Game Game { get; set; }
        public IReadOnlyCollection<Player> Players { get; set; }
    }
}
