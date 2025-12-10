const WORDS = [
  "lorem",
  "ipsum",
  "dolor",
  "sit",
  "amet",
  "consectetur",
  "adipiscing",
  "elit",
  "sed",
  "do",
  "eiusmod",
  "tempor",
  "incididunt",
  "ut",
  "labore",
  "et",
  "dolore",
  "magna",
  "aliqua",
  "ut",
  "enim",
  "ad",
  "minim",
  "veniam",
  "quis",
  "nostrud",
  "exercitation",
  "ullamco",
  "laboris",
  "nisi",
  "ut",
  "aliquip",
  "ex",
  "ea",
  "commodo",
  "consequat",
  "duis",
  "aute",
  "irure",
  "dolor",
  "in",
  "reprehenderit",
  "in",
  "voluptate",
  "velit",
  "esse",
  "cillum",
  "dolore",
  "eu",
  "fugiat",
  "nulla",
  "pariatur",
  "excepteur",
  "sint",
  "occaecat",
  "cupidatat",
  "non",
  "proident",
  "sunt",
  "in",
  "culpa",
  "qui",
  "officia",
  "deserunt",
  "mollit",
  "anim",
  "id",
  "est",
  "laborum",
];

export type LoremType = "paragraph" | "sentence" | "word";

export function generateLorem(
  count: number,
  type: LoremType,
  startWithLorem: boolean
): string {
  // Helper to get random word
  const randomWord = () => WORDS[Math.floor(Math.random() * WORDS.length)];

  // Helper to capitalize
  const capitalize = (str: string) =>
    str.charAt(0).toUpperCase() + str.slice(1);

  const result: string[] = [];

  if (type === "word") {
    for (let i = 0; i < count; i++) {
      result.push(randomWord());
    }
    if (startWithLorem && count > 2) {
      result[0] = "lorem";
      result[1] = "ipsum";
    }
    return result.join(" ");
  }

  // Generate Sentences
  const generateSentence = (minWords = 5, maxWords = 15) => {
    const length =
      Math.floor(Math.random() * (maxWords - minWords + 1)) + minWords;
    const words = Array.from({ length }, randomWord);
    return capitalize(words.join(" ")) + ".";
  };

  if (type === "sentence") {
    for (let i = 0; i < count; i++) {
      result.push(generateSentence());
    }
    // Handle startWithLorem for sentences logic if needed (simplified here)
    return result.join(" ");
  }

  // Generate Paragraphs
  if (type === "paragraph") {
    for (let i = 0; i < count; i++) {
      const numSentences = Math.floor(Math.random() * 5) + 3; // 3-7 sentences per para
      const sentences = Array.from({ length: numSentences }, () =>
        generateSentence()
      );
      result.push(sentences.join(" "));
    }

    if (startWithLorem && result.length > 0) {
      // Force replace start of first paragraph
      result[0] =
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. " +
        result[0].split(".").slice(1).join(".");
    }

    return result.join("\n\n");
  }

  return "";
}
