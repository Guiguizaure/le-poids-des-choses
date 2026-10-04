// Échoue si des données fictives subsistent, uniquement avec STRICT_DATA=1.
import { checkData } from "../src/lib/data/check";
import { getGestures } from "../src/lib/data";

const result = checkData(getGestures(), process.env.STRICT_DATA === "1");
console.log(result.message);
process.exit(result.ok ? 0 : 1);
