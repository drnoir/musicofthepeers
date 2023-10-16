function generateRandomSentence() {
    // Define arrays for various sentence components: subjects, verbs, objects, etc.
    const subjects = ["The brave knight", "A curious cat", "In a distant land", "Once upon a time"];
    const verbs = ["discovered", "explored", "encountered", "embarked on", "journeyed to"];
    const objects = ["a hidden treasure", "an ancient temple", "a mysterious forest", "a secret cave"];
    const adjectives = ["mysterious", "enchanted", "ancient", "forbidden"];
    const places = ["in the heart of the jungle", "under the starry night", "on a remote island"];
  
    // Generate a random sentence using components from the arrays.
    const randomSentence = `${getRandomElement(subjects)} ${getRandomElement(verbs)} ${getRandomElement(adjectives)} ${getRandomElement(objects)} ${getRandomElement(places)}.`;
  
    return randomSentence;
  }
  
  function generateShortStory() {
    let storyContent = "";
    let wordCount = 0;
  
    while (wordCount < 500) {
      const sentence = generateRandomSentence();
      const sentenceWords = sentence.split(" ");
      
      if (wordCount + sentenceWords.length <= 500) {
        storyContent += sentence + " ";
        wordCount += sentenceWords.length;
      } else {
        break;
      }
    }
  
    return storyContent;
  }
  
  function exportShortStoryAsJSON() {
    const shortStory = generateShortStory();
  
    const storyData = {
      title: "A Unique Short Story",
      content: shortStory.trim(),
    };
  
    const jsonOutput = JSON.stringify(storyData, null, 2);
  
    return jsonOutput;
  }
  
  function getRandomElement(array) {
    const randomIndex = Math.floor(Math.random() * array.length);
    return array[randomIndex];
  }
  
  // To generate and export the short story as JSON:
  const exportedStory = exportShortStoryAsJSON();
  console.log(exportedStory);

  
  
  
  
  
  