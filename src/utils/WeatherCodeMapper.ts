export class WeatherCodeMapper {
    private static codeToDescription: { [key: string]: string } = {
        "0": "Zonnig",
        "1": "Overwegend zonnig",
        "2": "Overwegend bewolkt",
        "3": "Bewolkt",
        "45": "Mistig",
        "48": "Bevriezende mist",
        "51": "Lichte motregen",
        "53": "Matige motregen",
        "55": "Hevige motregen",
        "56": "Lichte ijzel",
        "57": "Hevige ijzel",
        "61": "Lichte regen",
        "63": "Matige regen",
        "65": "Hevige regen",
        "66": "Lichte ijzel",
        "67": "Hevige ijzel",
        "71": "Lichte sneeuwval",
        "73": "Matige sneeuwval",
        "75": "Hevige sneeuwval",
        "77": "Sneeuw korrels",
        "80": "Lichte regenbuien",
        "81": "Matige regenbuien",
        "82": "Hevige regenbuien",
        "85": "Lichte sneeuwbuien",
        "86": "Hevige sneeuwbuien",
        "95": "Onweersbuien",
        "96": "Onweersbuien met lichte hagel",
        "99": "Onweersbuien met zware hagel",
    };

    static getDescription(code: number): string {
        return this.codeToDescription[code] || "Unknown weather condition";
    }
}