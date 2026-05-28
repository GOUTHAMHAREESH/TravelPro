namespace TravelPro.Api.Dtos
{
    public class AgencyDto
    {
        public long Id { get; set; }
        public string Name { get; set; }
        public string EmailId { get; set; }
        public string MobileNo { get; set; }
        public string Location { get; set; }
        public string Address { get; set; }

        public long CountryId { get; set; }
        public CountryDto Country { get; set; }

        public string RegistrationDocument { get; set; }
        public bool IsActive { get; set; }

        // Used only for web registration (password for linked user)
        public string Password { get; set; }
    }
}

