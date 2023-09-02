using RandomDataGenerator.FieldOptions;
using RandomDataGenerator.Randomizers;

namespace DropdownStuffs.Models
{
    public class RandomData
    {
        private readonly IRandomizerDateTime _randDate = RandomizerFactory.GetRandomizer(GetDateTimeFieldOptions(new DateTime(1850, 1, 1), DateTime.Today));
        private readonly IRandomizerNumber<bool> _randBool = RandomizerFactory.GetRandomizer(new FieldOptionsBoolean
        {
            UseNullValues = false
        });
        private readonly IRandomizerString _randFirstName = RandomizerFactory.GetRandomizer(new FieldOptionsFirstName());
        private readonly IRandomizerString _randLastName = RandomizerFactory.GetRandomizer(new FieldOptionsLastName());
        private readonly IRandomizerString _randCity = RandomizerFactory.GetRandomizer(new FieldOptionsCity());
        private readonly IRandomizerString _randCountry = RandomizerFactory.GetRandomizer(new FieldOptionsCountry());
        private readonly IRandomizerNumber<int> _randPercent = RandomizerFactory.GetRandomizer(new FieldOptionsInteger
        {
            Min = 0,
            Max = 100
        });

        private static FieldOptionsDateTime GetDateTimeFieldOptions(DateTime from, DateTime to)
        {
            return new FieldOptionsDateTime
            {
                IncludeTime = false,
                UseNullValues = false,
                From = from,
                To = to
            };
        }

        public int RandomInt(int min, int max)
        {
            var rand = RandomizerFactory.GetRandomizer(new FieldOptionsInteger
            {
                Min = min,
                Max = max
            });
            return rand.Generate().Value;
        }
        public DateTime? RandomBirthDate()
        {
            if (!ShouldHaveBirthDate()) return null;

            return _randDate.Generate();
        }
        public Guid RandomGuid() => Guid.NewGuid();
        public string RandomFirstName() => _randFirstName.Generate();
        public string RandomLastName() => _randLastName.Generate();
        public string RandomLocation() => $"{_randCity.Generate()}, {_randCountry.Generate()}";
        public bool ShouldHaveDeathDate() => _randPercent.Generate() > 60;
        public bool ShouldHaveBirthDate() => _randPercent.Generate() > 80;
        public DateTime? RandomDeathDate(DateTime? birthDate = null)
        {
            if (!ShouldHaveDeathDate()) return null;
            if (!birthDate.HasValue) return _randDate.Generate();

            return RandomizerFactory.GetRandomizer(GetDateTimeFieldOptions(birthDate.Value, new DateTime())).Generate();
        }
        public Gender RandomGender()
        {
            return _randBool.Generate().Value ? Gender.Male : Gender.Female;
        }
    }
}
