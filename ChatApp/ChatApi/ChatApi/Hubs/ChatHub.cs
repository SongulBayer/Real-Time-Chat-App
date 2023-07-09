using ChatApi.NewFolder;
using Microsoft.AspNetCore.SignalR;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

public class ChatHub : Hub
{
    private static readonly List<string> Users = new List<string>();
    private static readonly List<Message> Messages = new List<Message>();

    public override async Task OnConnectedAsync()
    {
        await Clients.Caller.SendAsync("UserConnected", Context.ConnectionId);
        await base.OnConnectedAsync();
    }

    public override async Task OnDisconnectedAsync(Exception exception)
    {
        await Clients.All.SendAsync("UserDisconnected", Context.ConnectionId);
        await base.OnDisconnectedAsync(exception);
    }

    public async Task JoinChatRoom(string userName)
    {
       Users.Add(userName);

        await Clients.AllExcept(Context.ConnectionId).SendAsync("NewUserJoined", userName);
    }

    public List<string> GetAllUsers()
    {
        return Users;
    }

    public async Task SendMessage(string userName, string content)
    {
        var message = new Message()
        {
            UserName = userName,
            Content = content,
            CreatedOn = DateTime.Now,
        };

        Messages.Add(message);

        await Clients.All.SendAsync("MessageAdded", message);
    }

    public async Task LeaveRoom(string userName)
    {
        Users.Remove(userName);
        await Clients.All.SendAsync("UserRemoved", userName);
    }
}
