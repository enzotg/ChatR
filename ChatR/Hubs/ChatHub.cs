using Microsoft.AspNetCore.SignalR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ChatR.Hubs
{
    public class ChatHub:Hub
    {
        public async Task EnviarMensaje(string User, string Mensaje)
        {
            await Clients.All.SendAsync("RecibirMensaje", User, Mensaje);
        }
    }
}
