const punctuationRegex = /[!,.:;]/g;

export class ReversedIndex {
    static index = {};
    static createIndex(recipes) {
        console.time("CREATE INDEX");
        recipes.forEach((recipe) => {
            const { id, name, description, ingredients } = recipe;
            const words = `${name} ${description} ${ingredients.map((i) => i.ingredient).join(" ")}`
                .toLowerCase()
                .replace(punctuationRegex, '')
                .split(" ");
            words.forEach((word) => {
                for (let i = 0; i < word.length; i++) {
                    for (let j = i + 1; j <= word.length; j++) {
                        const subWord = word.slice(i, j);
                        if (!ReversedIndex.index[subWord]) {
                            ReversedIndex.index[subWord] = [id];
                        } else if (!ReversedIndex.index[subWord].includes(id)) {
                            ReversedIndex.index[subWord].push(id);
                        }
                    }
                }
            });
        });
        console.timeEnd("CREATE INDEX")
    }


    static search(data, query){
        const words = query.toLowerCase().split(' ');
        const indices = words.map(word => ReversedIndex.index[word]).filter(Boolean);

        if(words.length !== indices.length){
            return [];
        }

        const intersection = indices.reduce((prev, curr) => {
            const set = new Set(curr);
            return prev.filter(index => set.has(index));
        });

        return  intersection.map(index => data[index - 1]);
    }
}