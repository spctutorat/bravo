// List all roles

export type Niveau = "6" | "5" | "4" | "3" | "2" | "1" | "T";

export const rolesNiveau: Record<Niveau, string> = {
	"6": "Sixième",
	"5": "Cinquième",
	"4": "Quatrième",
	"3": "Troisième",
	"2": "Seconde",
	"1": "Première",
	T: "Terminale",
};
