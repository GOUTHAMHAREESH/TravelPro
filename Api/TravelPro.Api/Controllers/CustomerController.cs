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
    public class CustomerController : ApiController
    {
        [HttpPost]
        [Route("AddCustomer")]
        public IHttpActionResult AddCustomer(CustomerDto dataDto)
        {
            if (dataDto == null) return BadRequest("Invalid data");

            using (TravelProDB context = new TravelProDB())
            {
                var emailTrimmed = (dataDto.EmailId ?? "").Trim().ToLowerInvariant();
                if (string.IsNullOrEmpty(emailTrimmed)) return BadRequest("Email is required");

                if (dataDto.Id > 0)
                {
                    var data = context.Customers.FirstOrDefault(x => x.Id == dataDto.Id);
                    if (data == null) return NotFound();

                    // On edit: check duplicate email (excluding current record) - materialize to avoid EF translation issues
                    var existingEmails = context.Customers
                        .Where(x => x.Id != dataDto.Id && x.IsActive && x.EmailId != null)
                        .Select(x => x.EmailId).ToList();
                    var duplicateEmail = existingEmails.Any(e => (e ?? "").Trim().ToLowerInvariant() == emailTrimmed);
                    if (duplicateEmail) return BadRequest("A customer with this email already exists.");

                    data.Name = dataDto.Name;
                    data.MobileNo = dataDto.MobileNo;
                    data.EmailId = dataDto.EmailId;
                    data.Location = dataDto.Location;
                    data.Address = dataDto.Address;
                    data.CountryId = dataDto.CountryId;

                    context.Entry(data).State = EntityState.Modified;
                    context.SaveChanges();
                    return Ok(true);
                }
                else
                {
                    // Duplicate check by email - materialize to avoid EF translation of Trim/ToLowerInvariant
                    var custEmails = context.Customers.Where(x => x.IsActive && x.EmailId != null).Select(x => x.EmailId).ToList();
                    var userNames = context.Users.Where(u => u.UserName != null).Select(u => u.UserName).ToList();
                    var duplicateEmail = custEmails.Any(e => (e ?? "").Trim().ToLowerInvariant() == emailTrimmed) ||
                                        userNames.Any(u => (u ?? "").Trim().ToLowerInvariant() == emailTrimmed);
                    if (duplicateEmail) return BadRequest("A customer with this email already exists.");

                    Customer obj = new Customer();
                    obj.Name = dataDto.Name;
                    obj.MobileNo = dataDto.MobileNo;
                    obj.EmailId = dataDto.EmailId;
                    obj.Location = dataDto.Location;
                    obj.Address = dataDto.Address;
                    obj.CountryId = dataDto.CountryId;
                    obj.IsActive = true;

                    context.Customers.Add(obj);
                    context.SaveChanges();

                    User user = new User();
                    user.UserName = obj.EmailId;
                    var passwordSalt = AuthenticationBL.CreatePasswordSalt(Encoding.ASCII.GetBytes(dataDto.Password));
                    user.PasswordSalt = Convert.ToBase64String(passwordSalt);
                    var password = AuthenticationBL.CreateSaltedPassword(passwordSalt, Encoding.ASCII.GetBytes(dataDto.Password));
                    user.Password = Convert.ToBase64String(password);
                    user.CustomerId = obj.Id;
                    user.Role = "Customer";
                    user.IsVerified = false; // Requires admin approval for web registrations

                    context.Users.Add(user);
                    context.SaveChanges();

                    return Ok(true);
                }
            }
        }

        [HttpGet]
        [Route("DeleteCustomer/{id}")]
        public bool DeleteCustomer(long id)
        {
            using (TravelProDB context = new TravelProDB())
            {
                var data = context.Customers.FirstOrDefault(x => x.Id == id);
                if (data != null)
                {
                    data.IsActive = false;
                    context.Entry(data).Property(x => x.IsActive).IsModified = true;
                    context.SaveChanges();
                    return true;
                }
            }
            return false;
        }

        [HttpGet]
        [Route("CustomerList")]
        public List<CustomerDto> CustomerList()
        {
            using (TravelProDB context = new TravelProDB())
            {
                return context.Customers
                    .Where(x => x.IsActive)
                    .Select(x => new CustomerDto
                    {
                        Id = x.Id,
                        Name = x.Name,
                        MobileNo = x.MobileNo,
                        EmailId = x.EmailId,
                        Location = x.Location,
                        Address = x.Address,
                        CountryId = x.CountryId,
                        IsActive = x.IsActive,
                        Country = new CountryDto
                        {
                            Id = x.Country.Id,
                            Name = x.Country.Name
                        }
                    }).ToList();

            }
        }

        [HttpGet]
        [Route("CustomerById/{id}")]
        public CustomerDto CustomerById(long id)
        {
            using (TravelProDB context = new TravelProDB())
            {
                return context.Customers
                    .Where(x => x.IsActive && x.Id == id)
                    .Select(x => new CustomerDto
                    {
                        Id = x.Id,
                        Name = x.Name,
                        MobileNo = x.MobileNo,
                        EmailId = x.EmailId,
                        Location = x.Location,
                        Address = x.Address,
                        CountryId = x.CountryId,
                        IsActive = x.IsActive,
                        Country = new CountryDto
                        {
                            Id = x.Country.Id,
                            Name = x.Country.Name
                        }
                    }).ToList().FirstOrDefault();

            }
        }

    }
}
