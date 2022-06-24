namespace web_api.Hubs;

using Microsoft.AspNetCore.SignalR;

public class MessageHub : Hub
{
    public async Task MessageSent()
    {
    }
}