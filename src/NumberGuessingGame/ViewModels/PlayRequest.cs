namespace NumberGuessingGame.ViewModels
{
    public class PlayRequest
    {
        public int UserId {get;set;}
        public int GameId {get;set;}
        public string GuessedNumber { get; set; }
    }
}