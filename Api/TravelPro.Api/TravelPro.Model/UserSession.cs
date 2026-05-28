using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TravelPro.Model
{
    public class UserSession
    {
        public long Id { get; set; }
        [StringLength(256)]
        public string Token { get; set; }
        public DateTime SessionTimeStamp { get; set; }
        public long ExpiresInMinutes { get; set; }
        public long UserId { get; set; }
        public virtual User User { get; set; }
        public long? FinancialYearId { get; set; }
        public UserSessionStatus UserSessionStatus { get; set; }
    }
    public enum UserSessionStatus
    {
        LoggedIn,
        LoggedOut
    }
}
