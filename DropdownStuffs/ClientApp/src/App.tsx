import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import _ from "lodash";
import HashLoader from "react-spinners/HashLoader";
import DropdownSelect from "./DropdownSelect";
import { parseISO, getYear, differenceInYears } from "date-fns";

axios.interceptors.request.use(context => {
    context.headers["x-client-id"] = "this is the client id"
    return context;
});

type Person = {
    "familyTreeId": string;
    "id": string;
    "givenName": string;
    "surname": string;
    "gender": number;
    "birthDate": string;
    "birthLocation": string;
    "deathDate": string;
    "deathLocation": string;
}

function wrapInParenthesis(target: (...args: any[]) => string) {
    return (...args: any[]) => `(${target(...args)})`;
}

// RIP function decorators.
const getLifespan = wrapInParenthesis((birth: Date | null, death: Date | null) => {
    if (birth && death) return `${getYear(birth)}-${getYear(death)}`;
    if (death) return `-${getYear(death)}`;
    if (!birth && !death) return "Living";
    if (!death && birth && differenceInYears(birth, new Date()) < 120) return "Living";

    return "Dead";
});

export default function App() {
    const [loading, setLoading] = useState(false);
    const [people, setPeople] = useState<Person[]>([]);
    const selectOptions = useMemo<{ label: string, value: string }[]>(() => {
        return people.map(person => {
            const birthDate = person.birthDate ? parseISO(person.birthDate) : null;
            const deathDate = person.deathDate ? parseISO(person.deathDate) : null;
            let label = `${person.givenName} ${person.surname} ${getLifespan(birthDate, deathDate)}`;
            return { label, value: person.id };
        })
    }, [people]);

    useEffect(() => {
        async function getData() {
            setLoading(true);
            const ids = await axios.get<string[]>("/api/family-tree-ids")
            const treeId = _.sample(ids.data);
            const people = await axios.get<Person[]>(`/api/family-tree/${treeId}`);
            setPeople(people.data);
            setLoading(false);
        }

        getData();
    }, []);

    if (loading) return <HashLoader />;
    return (
        <DropdownSelect label="Test" onChange={console.log} options={selectOptions} />
    );
}