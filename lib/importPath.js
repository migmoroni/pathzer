function parseJsonToNestedArray(jsonObject) {
    // Função recursiva para transformar objetos JSON em arrays aninhados
    function traverse(obj) {
      const result = [];
  
      // Percorre as chaves do objeto
      for (const key in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, key)) {
          // Se o valor for um objeto, chamamos a função recursivamente
          if (typeof obj[key] === 'object' && Object.keys(obj[key]).length > 0) {
            result.push(key, traverse(obj[key]));
          } else {
            // Se o valor não for um objeto (ou o objeto estiver vazio), apenas adiciona o nome
            result.push(key);
          }
        }
      }
  
      return result;
    }

    // Inicia a recursão a partir da raiz do objeto JSON
    return traverse(jsonObject);
}