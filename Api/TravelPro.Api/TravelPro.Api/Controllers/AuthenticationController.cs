using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Text;
using System.Web.Http;
using System.Web.Http.Cors;
using TravelPro.Api.Dtos;
using TravelPro.Model;

namespace TravelPro.Api.Controllers
{
    [EnableCors(origins: "*", headers: "*", methods: "*")]
    public class AuthenticationController : ApiController
    {

        [HttpPost]
        [Route("Login")]
        public IHttpActionResult LoginWithUserName(UserDto loginInfo)
        {
            if (loginInfo?.UserName == null || loginInfo.Password == null)
                return BadRequest("Invalid credentials");

            bool? isVerified;
            var userSession = AuthenticationBL.LoginWithUserName(loginInfo.UserName, loginInfo.Password, out isVerified);

            if (isVerified == false)
                return Content(System.Net.HttpStatusCode.Forbidden, new { Message = "Your account is pending admin verification. Please wait for approval before logging in." });

            if (userSession != null)
            {
                UserDto sessionDto = new UserDto();
                using (TravelProDB context = new TravelProDB())
                    {
                        sessionDto.Role = userSession.User.Role;
                        sessionDto.Id = userSession.User.Id;
                        sessionDto.UserName = userSession.User.UserName;
                        sessionDto.HotelId = userSession.User.HotelId;
                        sessionDto.CustomerId = userSession.User.CustomerId;
                        sessionDto.DriverId = userSession.User.DriverId;
                        sessionDto.AgencyId = userSession.User.AgencyId;
                        sessionDto.Token = userSession.Token;

                        if (sessionDto.HotelId > 0)
                        {
                            var hotel = context.Hotels.FirstOrDefault(x => x.Id == sessionDto.HotelId);
                            sessionDto.Name = hotel.Name;
                            sessionDto.Email = hotel.Email;
                            sessionDto.MobileNo = hotel.MobileNo;
                        }

                        if (sessionDto.CustomerId > 0)
                        {
                            var cus = context.Customers.FirstOrDefault(x => x.Id == sessionDto.CustomerId);

                            sessionDto.Name = cus.Name;
                            sessionDto.Email = cus.EmailId;
                            sessionDto.MobileNo = cus.MobileNo;
                        }

                        if (sessionDto.DriverId > 0)
                        {
                            var driver = context.Drivers.FirstOrDefault(x => x.Id == sessionDto.DriverId);

                            sessionDto.Name = driver.Name;
                            sessionDto.Email = driver.EmailId;
                            sessionDto.MobileNo = driver.MobileNo;
                        }

                        if (sessionDto.AgencyId > 0)
                        {
                            var agency = context.Agencies.FirstOrDefault(x => x.Id == sessionDto.AgencyId);
                            if (agency != null)
                            {
                                sessionDto.Name = agency.Name;
                                sessionDto.Email = agency.EmailId;
                                sessionDto.MobileNo = agency.MobileNo;
                            }
                        }

                        return Ok(sessionDto);
                    }
                }
            return BadRequest("Invalid credentials. Please try again.");
        }

        [HttpPost]
        [Route("LogOut")]
        public bool LogOutWithToken(UserDto tokenInfo)
        {
            if (tokenInfo != null)
            {
                return AuthenticationBL.LogOutWithToken(tokenInfo.Token);
            }
            return false;
        }

        [HttpPost]
        [Route("ChangePassword")]
        public bool ChangePassword(UserDto userDto)
        {
            if (userDto != null)
            {
                using (TravelProDB context = new TravelProDB())
                {
                    var token = Request.Headers.Authorization.Parameter;
                    UserSession userSession = AuthenticationBL.IsTokenValid(token);
                    var user = context.Users.FirstOrDefault(X => X.Id == userSession.UserId);
                    var passwordSalt = AuthenticationBL.CreatePasswordSalt(Encoding.ASCII.GetBytes(userDto.Password));
                    user.PasswordSalt = Convert.ToBase64String(passwordSalt);
                    var password = AuthenticationBL.CreateSaltedPassword(passwordSalt, Encoding.ASCII.GetBytes(userDto.Password));
                    user.Password = Convert.ToBase64String(password);
                    context.Entry(user).State = EntityState.Modified;
                    context.SaveChanges();
                    return true;

                }

            }
            return false;
        }

        [HttpGet]
        [Route("CreateAdmin")]
        public bool CreateAdmin()
        {
            using (TravelProDB context = new TravelProDB())
            {
                User user = new User();

                user.UserName = "admin";
                user.Role = "Admin";
                user.IsVerified = true; // Admin does not require verification
                var passwordSalt = AuthenticationBL.CreatePasswordSalt(Encoding.ASCII.GetBytes("admin"));
                user.PasswordSalt = Convert.ToBase64String(passwordSalt);
                var password = AuthenticationBL.CreateSaltedPassword(passwordSalt, Encoding.ASCII.GetBytes("admin"));
                user.Password = Convert.ToBase64String(password);

                context.Users.Add(user);
                context.SaveChanges();
                return true;
            }
        }

    }
}
