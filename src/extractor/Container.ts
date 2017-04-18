
import { Concept } from './Concept';

export type ConceptKey = {
    concepts: Concept[]
}

type Index<T> = {
    [index: string]: T
}

export class Container {
    private keys: Index<ConceptKey> = {};

    getKeys(): string[] {
        return Object.keys(this.keys);
    }

    addConcept(concept: Concept, parent?: Concept) {
        const key = concept.key;

        if (!this.keys[key]) {
            this.keys[key] = { concepts: [] };
        }
        this.keys[key].concepts.push(concept);
        if (parent) {
            concept.parent = parent;
            parent.childs = parent.childs || [];
            parent.childs.push(concept);
        }
    }
}