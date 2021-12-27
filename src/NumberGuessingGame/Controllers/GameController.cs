using System.Diagnostics;
using Microsoft.AspNetCore.Mvc;
using NumberGuessingGame.Models;

namespace NumberGuessingGame.Controllers;

public class GameController : Controller
{
    private readonly GameDbContext dbContext;

    public GameController(GameDbContext dbContext)
    {
        this.dbContext = dbContext;
    }

    public IActionResult Index()
    {
        var players = dbContext.Players;
        return View(players);
    }

    public IActionResult Privacy()
    {
        return View();
    }
}
