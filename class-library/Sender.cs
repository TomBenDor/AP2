using System;
using FirebaseAdmin;
using FirebaseAdmin.Messaging;
using Google.Apis.Auth.OAuth2;

namespace class_library
{
    public class Sender
    {
        public Sender()
        {
            FirebaseApp.Create(new AppOptions()
            {
                Credential = GoogleCredential.FromFile("tokens/private_key.json")
            });
        }

        public void Send(string token, string title, string body)
        {
            var message = new FirebaseAdmin.Messaging.Message()
            {
                Token = token,
                Notification = new Notification()
                {
                    Title = title,
                    Body = body
                }
            };
            string response = FirebaseMessaging.DefaultInstance.SendAsync(message).Result;
        }
    }
}