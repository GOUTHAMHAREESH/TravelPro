using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Net;
using System.Runtime.Serialization;
using System.Security.Cryptography;
using System.Text;
using System.Threading.Tasks;

namespace TravelPro.Model
{

    public class AuthenticationBL
    {
        public static UserSession IsTokenValid(string token)
        {
            using (TravelProDB context = new TravelProDB())
            {
                var session = context.UserSessions.FirstOrDefault(x => x.Token == token);

                if (session != null)
                {
                    //if (session.SessionTimeStamp + TimeSpan.FromMinutes(session.ExpiresInMinutes) >= DateTime.Now)
                    //{
                    //  //}
                    return session;
                }
                return null;
            }
        }

        public static UserSession LoginWithUserName(string userName, string password, out bool? isVerified)
        {
            isVerified = null;
            UserSession userSession = null;
            using (TravelProDB context = new TravelProDB())
            {
                var user = context.Users.FirstOrDefault(x => x.UserName == userName);

                if (user != null)
                {
                    // Customer, Driver, Hotel, Agency must be verified to login
                    if ((user.Role == "Customer" || user.Role == "Driver" || user.Role == "Hotel" || user.Role == "Agency") && !user.IsVerified)
                    {
                        isVerified = false;
                        return null;
                    }
                    isVerified = true;

                    var storedPassword = Convert.FromBase64String(user.Password);
                    if (ComparePasswords(storedPassword, Encoding.ASCII.GetBytes(password)))
                    {
                        string token = Convert.ToBase64String(Guid.NewGuid().ToByteArray());
                        userSession = new UserSession();
                        userSession.ExpiresInMinutes = 480;
                        userSession.SessionTimeStamp = DateTime.Now;
                        userSession.Token = token;
                        userSession.UserId = user.Id;

                        context.UserSessions.Add(userSession);
                        context.SaveChanges();
                        userSession.User = context.Users
                        .FirstOrDefault(x => x.Id == userSession.UserId);
                        return userSession;
                    }
                    else
                    {
                        throw new WebFaultException(HttpStatusCode.Forbidden);
                    }
                }
                return null;

            }


        }
        public static bool LogOutWithToken(string token)
        {
            using (TravelProDB context = new TravelProDB())
            {
                UserSession userSession = context.UserSessions.FirstOrDefault(x => x.Token == token);
                if (null != userSession)
                {
                    userSession.UserSessionStatus = UserSessionStatus.LoggedOut;
                    userSession.SessionTimeStamp = DateTime.Now;
                    context.Entry(userSession).State = EntityState.Modified;
                    context.SaveChanges();
                }
                return true;
            }
        }
        // Create salted password to save in database.
        public static byte[] CreatePasswordSalt(byte[] unsaltedPassword)
        {
            //Create a salt value.
            byte[] saltValue = new byte[64];
            RNGCryptoServiceProvider rng = new RNGCryptoServiceProvider();
            rng.GetBytes(saltValue);

            return saltValue;
        }

        // Create a salted password given the salt value.
        public static byte[] CreateSaltedPassword(byte[] saltValue, byte[] unsaltedPassword)
        {
            // Add the salt to the hash.
            byte[] rawSalted = new byte[unsaltedPassword.Length + saltValue.Length];
            unsaltedPassword.CopyTo(rawSalted, 0);
            saltValue.CopyTo(rawSalted, unsaltedPassword.Length);

            //Create the salted hash.         
            SHA1 sha1 = SHA1.Create();
            byte[] saltedPassword = sha1.ComputeHash(rawSalted);

            // Add the salt value to the salted hash.
            byte[] dbPassword = new byte[saltedPassword.Length + saltValue.Length];
            saltedPassword.CopyTo(dbPassword, 0);
            saltValue.CopyTo(dbPassword, saltedPassword.Length);

            return dbPassword;
        }

        // Compare the hashed password against the stored password.
        private static bool ComparePasswords(byte[] storedPassword, byte[] hashedPassword)
        {
            if (storedPassword == null || hashedPassword == null)
                return false;

            // Get the saved saltValue.
            byte[] saltValue = new byte[64];
            int saltOffset = storedPassword.Length - 64;
            for (int i = 0; i < 64; i++)
                saltValue[i] = storedPassword[saltOffset + i];

            byte[] saltedPassword = CreateSaltedPassword(saltValue, hashedPassword);

            // Compare the values.
            return CompareByteArray(storedPassword, saltedPassword);
        }

        // Compare the contents of two byte arrays.
        private static bool CompareByteArray(byte[] array1, byte[] array2)
        {
            if (array1.Length != array2.Length)
                return false;
            for (int i = 0; i < array1.Length; i++)
            {
                if (array1[i] != array2[i])
                    return false;
            }
            return true;
        }


        [Serializable]
        internal class WebFaultException : Exception
        {
            private HttpStatusCode forbidden;

            public WebFaultException()
            {
            }

            public WebFaultException(string message) : base(message)
            {
            }

            public WebFaultException(HttpStatusCode forbidden)
            {
                this.forbidden = forbidden;
            }

            public WebFaultException(string message, Exception innerException) : base(message, innerException)
            {
            }

            protected WebFaultException(SerializationInfo info, StreamingContext context) : base(info, context)
            {
            }
        }
    }
}
