using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json;
using NumberGuessingGame.Models;
using NumberGuessingGame.ViewModels;

namespace NumberGuessingGame.Controllers;

public class GameController : Controller
{
    private readonly GameDbContext dbContext;

    public GameController(GameDbContext dbContext)
    {
        this.dbContext = dbContext;
    }

    public async Task<IActionResult> Index()
    {
        var game = dbContext.Games.SingleOrDefault(g => g.Id == 1);
        if (game == null)
        {
            game = new Game()
            {
                Title = "The number guessing game from 2 digits of letter",
                Rule = "A user can play only one time",
                FinishedUtc = new DateTime(2021, 12, 30, 8, 0, 0, DateTimeKind.Utc)
            };

            await dbContext.Games.AddAsync(game);
            await dbContext.SaveChangesAsync();
        }

        var players = dbContext.Players
            .Where(p => p.GameId == game.Id)
            .Include(p => p.User).Include(p => p.Game).ToList()
            .OrderBy(p => p.GuessedNumber)
            .ToList();

        return View(new GameIndexViewModel() { Game = game, Players = players });
    }

    [HttpPost]
    public async Task<IActionResult> Play(PlayRequest playRequest)
    {
        if (playRequest.GuessedNumber?.Length != 2)
        {
            throw new InvalidOperationException("Guessed number must be 2 digits");
        }

        var guessedNumber = int.Parse(playRequest.GuessedNumber);
        var existingGuessedNumber = dbContext.Players.SingleOrDefault(p => p.GameId == playRequest.GameId && p.GuessedNumber == guessedNumber);
        if (existingGuessedNumber != null)
        {
            throw new InvalidOperationException($"The number '{playRequest.GuessedNumber}' has been guessed");
        }

        var player = dbContext.Players.SingleOrDefault(p => p.GameId == playRequest.GameId && p.UserId == playRequest.UserId);
        if (player != null)
        {
            throw new InvalidOperationException("You has already played the game.");
        }

        player = new Player
        {
            UserId = playRequest.UserId,
            GameId = playRequest.GameId,
            GuessedNumber = guessedNumber,
            PlayedAtUtc = DateTime.UtcNow,
        };

        await dbContext.Players.AddAsync(player);
        await dbContext.SaveChangesAsync();
        return NoContent();
    }

    [HttpPost]
    public async Task<UserResponse> Connect([FromForm] string facebookAccessToken)
    {
        // TODO better error response to client to show why we have error
        // ValidateFacebookAccessToken(request);
        using (var client = new HttpClient())
        {
            client.BaseAddress = new Uri("https://graph.facebook.com");
            var response = await client.GetAsync($"me?fields=name,email,first_name,last_name,picture.height(200).width(200)&access_token={facebookAccessToken}");
            response.EnsureSuccessStatusCode();

            var jsonResponse = await response.Content.ReadAsStringAsync();
            var result = JsonConvert.DeserializeObject<dynamic>(jsonResponse);

            string email = result.email.ToString();
            long facebookAppScopedUserId = Convert.ToInt64(result.id);
            string name = result.name.ToString();
            string firstName = result.first_name.ToString();
            string lastName = result.last_name.ToString();
            string profilePictureUrl = result.picture.data.url.ToString();

            var user = GetUser(email);
            if (user != null)
            {
                return new UserResponse { Id = user.Id };
            }

            user = new User()
            {
                Email = email,
                FacebookAppScopedUserId = facebookAppScopedUserId,
                FirstName = firstName,
                LastName = lastName,
                Name = name,
                ProfilePictureUrl = profilePictureUrl
            };

            await dbContext.Users.AddAsync(user);
            await dbContext.SaveChangesAsync();
            return new UserResponse { Id = user.Id };
        }
    }

    private User GetUser(string email)
    {
        var user = dbContext.Users.SingleOrDefault(u => u.Email == email);
        return user;
    }
}