// Constants: คลังคำศัพท์ (Private scope)
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
  "aliquip",
  "ex",
  "ea",
  "commodo",
  "consequat",
  "duis",
  "aute",
  "irure",
  "in",
  "reprehenderit",
  "voluptate",
  "velit",
  "esse",
  "cillum",
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

const LOREM_START = "Lorem ipsum dolor sit amet, consectetur adipiscing elit.";

// Types: Export ให้โลกภายนอกใช้
export type LoremType = "paragraph" | "sentence" | "word";

// Helpers: แยกออกมาเพื่อ Performance (สร้างครั้งเดียว) และ Unit Test ง่าย
const getRandomInt = (min: number, max: number) =>
  Math.floor(Math.random() * (max - min + 1)) + min;

const getRandomWord = () => WORDS[Math.floor(Math.random() * WORDS.length)];

const capitalize = (str: string) => str.charAt(0).toUpperCase() + str.slice(1);

const generateSentence = (minWords = 5, maxWords = 15): string => {
  const length = getRandomInt(minWords, maxWords);
  const words = Array.from({ length }, getRandomWord);
  return capitalize(words.join(" ")) + ".";
};

// Main Function
export function generateLorem(
  count: number,
  type: LoremType,
  startWithLorem: boolean
): string {
  const result: string[] = [];
  switch (type) {
    case "word": {
      for (let i = 0; i < count; i++) {
        result.push(getRandomWord());
      }

      // Override start logic for words
      if (startWithLorem && count >= 2) {
        result[0] = "lorem";
        result[1] = "ipsum";
      }
      return result.join(" ");
    }

    case "sentence": {
      for (let i = 0; i < count; i++) {
        result.push(generateSentence());
      }

      // Override start logic for sentences
      if (startWithLorem && result.length > 0) {
        // แทนที่ประโยคแรกด้วย Standard Start ไปเลย เพื่อความสวยงาม
        const firstSentence = result[0];
        // ถ้าประโยคแรกสั้นกว่า Standard ให้แทนที่เลย
        // ถ้ายาวกว่า ให้แทนที่ส่วนต้น
        if (firstSentence.length < LOREM_START.length) {
          result[0] = LOREM_START;
        } else {
          // ง่ายๆ คือแทนที่ประโยคแรกไปเลย เป็นวิธีที่ Clean ที่สุดสำหรับ Lorem Ipsum Generator
          result[0] = LOREM_START;
        }
      }
      return result.join(" ");
    }

    case "paragraph": {
      for (let i = 0; i < count; i++) {
        const numSentences = getRandomInt(3, 7); // 3-7 sentences per paragraph
        const sentences = Array.from({ length: numSentences }, () =>
          generateSentence()
        );
        result.push(sentences.join(" "));
      }

      // Override start logic for paragraphs
      if (startWithLorem && result.length > 0) {
        // วิธี: แทนที่ประโยคแรกของ paragraph แรกด้วย LOREM_START
        const sentencesInFirstPara = result[0].split(". ");
        sentencesInFirstPara[0] = LOREM_START.replace(".", "");
        result[0] = sentencesInFirstPara.join(". ");
      }

      return result.join("\n\n");
    }

    default:
      return "";
  }
}
