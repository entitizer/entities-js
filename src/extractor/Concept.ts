
import { Concept as ConceptBase } from 'concepts-parser';

export class Concept extends ConceptBase {
    public key?: string;
    public entityId?: string;
    public parent?: Concept;
    public childs?: Concept[];
}
