using DropdownStuffs.Models;
using Microsoft.AspNetCore.Mvc;
using RandomDataGenerator.FieldOptions;
using RandomDataGenerator.Randomizers;

namespace DropdownStuffs.Controllers
{
    [ApiController]
    [Route("/api")]
    public class ApiController : ControllerBase
    {
        private readonly ILogger<ApiController> _logger;
        private static Dictionary<Guid, IList<Person>> _peopleByFamilyTreeId;

        public ApiController(ILogger<ApiController> logger)
        {
            _logger = logger;

            if (_peopleByFamilyTreeId != null) return;

            _peopleByFamilyTreeId = new Dictionary<Guid, IList<Person>>();
            var rand = new RandomData();

            foreach (var familyTreeId in Enumerable.Range(0, rand.RandomInt(5, 20)).Select(treeIndex => rand.RandomGuid()))
            {
                _peopleByFamilyTreeId.Add(familyTreeId, new List<Person>());
                foreach (var personId in Enumerable.Range(0, rand.RandomInt(1, 100)).Select(personIndex => rand.RandomGuid()))
                {
                    var person = new Person(familyTreeId)
                    {
                        Id = personId,
                        GivenName = rand.RandomFirstName(),
                        Surname = rand.RandomLastName(),
                        BirthLocation = rand.RandomLocation(),
                        BirthDate = rand.RandomBirthDate(),
                        DeathDate = rand.RandomDeathDate(),
                        Gender = rand.RandomGender(),
                    };

                    if (person.DeathDate.HasValue) person.DeathLocation = rand.RandomLocation();

                    _peopleByFamilyTreeId[familyTreeId].Add(person);
                }
            }
        }

        [HttpGet("family-tree-ids")]
        public IEnumerable<Guid> FamilyTreeGuids()
        {
            return _peopleByFamilyTreeId.Keys;
        }

        [HttpGet("family-tree/{id}")]
        public IEnumerable<Person> PeopleByFamilyTreeId(Guid id)
        {
            return _peopleByFamilyTreeId.TryGetValue(id, out var result) ? result : Enumerable.Empty<Person>();
        }
    }
}