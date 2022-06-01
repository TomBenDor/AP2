namespace web_api.Hubs;

using Microsoft.AspNetCore.SignalR;

public class MessageHub : Hub
{
    public async Task MessageSent(string value)
    {
        await Clients.All.SendAsync("MessageReceived", value);
        Console.WriteLine(value);
    }
}