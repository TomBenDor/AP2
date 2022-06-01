namespace web_api.hubs;

using Microsoft.AspNetCore.SignalR;

public class MessageHub : Hub
{
    public async Task Changed(string value)
    {
        await Clients.All.SendAsync("changeReceived", value);
    }
}