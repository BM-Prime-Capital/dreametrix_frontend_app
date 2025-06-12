import { CharacterObservationEntry } from "@/types";

// Helper function to create new character observation entry
export function createCharacterObservationEntry(
  trait: string,
  comment?: string
): string {
  return trait;
}

// Helper function to convert legacy string arrays to CharacterObservationEntry arrays
export function convertToObservationEntries(
  characters: string[] | CharacterObservationEntry[]
): CharacterObservationEntry[] {
  if (!Array.isArray(characters)) return [];

  return characters.map((item) => {
    if (typeof item === "string") {
      // Create a proper CharacterObservationEntry object from the string
      return {
        id: `obs_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        trait: item,
        timestamp: new Date().toISOString(),
      };
    }
    return item;
  });
}

// Helper function to extract traits for UI display
export function extractTraitsFromEntries(
  entries: string[] | CharacterObservationEntry[]
): string[] {
  if (!Array.isArray(entries)) return [];

  return entries.map((entry) => {
    if (typeof entry === "string") {
      return entry;
    }
    return entry.trait;
  });
}

// Helper function to get unique traits from entries
export function getUniqueTraits(
  entries: string[] | CharacterObservationEntry[]
): string[] {
  const traits = extractTraitsFromEntries(entries);
  return Array.from(new Set(traits));
}

// Helper function to count entries by trait
export function countEntriesByTrait(
  entries: string[] | CharacterObservationEntry[]
): Record<string, number> {
  const traits = extractTraitsFromEntries(entries);
  const counts: Record<string, number> = {};

  traits.forEach((trait) => {
    counts[trait] = (counts[trait] || 0) + 1;
  });

  return counts;
}

// Helper function to filter entries by date
export function filterEntriesByDate(
  entries: CharacterObservationEntry[],
  date: string
): CharacterObservationEntry[] {
  const targetDate = new Date(date).toDateString();

  return entries.filter((entry) => {
    const entryDate = new Date(entry.timestamp).toDateString();
    return entryDate === targetDate;
  });
}

// Helper function to parse domain data for display (handles strings, objects, and stringified JSON)
export function parseDomainForDisplay(domain: any): {
  displayText: string;
  parsedDomain: any;
} {
  let parsedDomain = domain;
  let displayText = "Unknown Domain";

  //   console.log("parseDomainForDisplay input:", { domain, type: typeof domain });

  // Handle null or undefined
  if (!domain) {
    console.log("Domain is null/undefined");
    return { displayText: "Unknown Domain", parsedDomain: null };
  }

  if (typeof domain === "string") {
    const trimmed = domain.trim();
    // console.log("String domain:", {
    //   original: domain,
    //   trimmed,
    //   length: trimmed.length,
    // });

    // Try to detect if it's a JSON string (more flexible detection)
    if (
      (trimmed.startsWith("{") && trimmed.endsWith("}")) ||
      (trimmed.startsWith("[") && trimmed.endsWith("]"))
    ) {
      //   console.log("Detected JSON-like string, attempting to parse...");
      try {
        // Handle Python dictionary format by converting single quotes to double quotes
        let jsonString = trimmed;
        if (trimmed.includes("'")) {
          //   console.log("Converting Python dict format to JSON format...");
          // Replace single quotes with double quotes for keys and string values
          // This regex handles: 'key': 'value' -> "key": "value"
          jsonString = trimmed
            .replace(/'([^']+)':/g, '"$1":')
            .replace(/:\s*'([^']*)'/g, ': "$1"');
          //   console.log("Converted to JSON format:", jsonString);
        }

        parsedDomain = JSON.parse(jsonString);
        // console.log("Successfully parsed JSON:", parsedDomain);

        // Handle case where it's an array with one object
        if (Array.isArray(parsedDomain) && parsedDomain.length > 0) {
          //   console.log("Parsed array, taking first element:", parsedDomain[0]);
          parsedDomain = parsedDomain[0];
        }

        displayText =
          parsedDomain?.trait ||
          parsedDomain?.name ||
          parsedDomain?.domain ||
          "Unknown Domain";
        // console.log("Extracted displayText from parsed object:", displayText);
      } catch (e) {
        // If parsing fails, treat as regular string
        // console.error("Failed to parse JSON domain:", {
        //   domain,
        //   trimmed,
        //   error: e,
        // });
        displayText = domain;
      }
    } else {
      // Regular string - check if it might be a trait name directly
      //   console.log("Regular string domain");
      displayText = domain;
    }
  } else if (domain && typeof domain === "object") {
    // console.log("Object domain:", domain);
    // Already an object
    if (Array.isArray(domain) && domain.length > 0) {
      // Handle array case
      //   console.log("Array domain, taking first element:", domain[0]);
      parsedDomain = domain[0];
      displayText =
        parsedDomain?.trait ||
        parsedDomain?.name ||
        parsedDomain?.domain ||
        "Unknown Domain";
    } else {
      // Single object
      displayText =
        domain.trait || domain.name || domain.domain || "Unknown Domain";
    }
    // console.log("Extracted displayText from object:", displayText);
  } else {
    // Handle other types (number, boolean, etc.)
    // console.log("Other type domain:", { domain, type: typeof domain });
    displayText = String(domain);
  }

  //   console.log("parseDomainForDisplay result:", { displayText, parsedDomain });
  return {
    displayText,
    parsedDomain,
  };
}

// Helper function to generate unique key for domain items
export function generateDomainKey(
  domain: any,
  parsedDomain: any,
  index: number
): string {
  // If it's a simple string that's not JSON, use it as key
  if (
    typeof domain === "string" &&
    !domain.trim().startsWith("{") &&
    !domain.trim().startsWith("[")
  ) {
    return `domain-${domain}-${index}`;
  }

  // Try to get a meaningful key from parsed domain
  const key =
    parsedDomain?.trait ||
    parsedDomain?.name ||
    parsedDomain?.domain ||
    parsedDomain?.id ||
    `domain-${index}`;

  return `domain-${key}-${index}`;
}
