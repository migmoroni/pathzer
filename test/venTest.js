function orgType(type, words) {
    // Remove colchetes dos parâmetros e separa os elementos
    const typesArray = type.replace(/\[|\]/g, '').split(',').map(t => t.trim());
    const wordsArray = words.match(/\[[^\]]*\]/g) ? words.match(/\[[^\]]*\]/g).map(group => group.replace(/\[|\]/g, '').split(',').map(word => word.trim())) : [words.split(',').map(word => word.trim())];
  
    // Caso todos os types tenham correspondência em words
    if (typesArray.length === wordsArray.length) {
      for (let i = 0; i < typesArray.length; i++) {
        const currentType = typesArray[i];
        const currentWords = wordsArray[i];
        console.log(`1Ação de type ${currentType} com palavras: ${currentWords.join(', ')}`);
      }
    } else if (typesArray.length < wordsArray.length) {
      // Se houver mais grupos de palavras do que types
      for (let i = 0; i < typesArray.length - 1; i++) {
        const currentType = typesArray[i];
        const currentWords = wordsArray[i];
        console.log(`2Ação de type ${currentType} com palavras: ${currentWords.join(', ')}`);
      }
      const lastType = typesArray[typesArray.length - 1];
      const remainingWords = wordsArray.slice(typesArray.length - 1).flat();
      console.log(`3Ação de type ${lastType} com palavras: ${remainingWords.join(', ')}`);
    } else {
      // Se houver mais types do que grupos de palavras
      for (let i = 0; i < wordsArray.length; i++) {
        const currentType = typesArray[i];
        const currentWords = wordsArray[i];
        console.log(`4Ação de type ${currentType} com palavras: ${currentWords.join(', ')}`);
      }
      const lastType = typesArray[typesArray.length - 1];
      const remainingWords = wordsArray.flat();
      console.log(`5Ação de type ${lastType} com palavras: ${remainingWords.join(', ')}`);
    }
  }
  
  // Exemplos de uso:
  
  // Caso 1: type="aaa" e words="w1"
  orgType("aaa", "w1"); 
  // Output: Ação de type aaa com palavras: w1
  
  // Caso 2: type="aaa" e words="[w1,w2]"
  orgType("aaa", "[w1,w2]"); 
  // Output: Ação de type aaa com palavras: w1, w2
  
  // Caso 3: type="[aaa,bbb]" e words="[w1,w2]"
  orgType("[aaa,bbb]", "[w1,w2]"); 
  // Output: Ação de type aaa com palavras: w1, w2
  // Output: Ação de type bbb com palavras: w1, w2
  
  // Caso 4: type="[aaa,bbb]" e words="[[w1,w2],[w3,w4]]"
  orgType("[aaa,bbb]", "[[w1,w2],[w3,w4]]");
  // Output: Ação de type aaa com palavras: w1, w2
  // Output: Ação de type bbb com palavras: w3, w4
  
  // Caso 5: type="[aaa,bbb,ccc]" e words="[[w1,w2],[w3,w4]]"
  orgType("[aaa,bbb,ccc]", "[[w1,w2],[w3,w4]]");
  // Output: Ação de type aaa com palavras: w1, w2
  // Output: Ação de type bbb com palavras: w3, w4
  // Output: Ação de type ccc com palavras: w1, w2, w3, w4
  
  orgType("[aaa]", "[[w1,w2],[w3,w4]]");