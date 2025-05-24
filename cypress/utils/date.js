export function castDateStringCadunicoToAcolhe(date){
    const parts = date.split("/");

    const inversedDate = `${parts[1]}/${parts[0]}/${parts[2]}`;

    return inversedDate
}