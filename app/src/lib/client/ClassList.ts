export class ClassList extends Set {
  constructor(...classes: string[]) {
    super(classes);
  }

  toString() {
    return Array.from(this).filter(Boolean).join(" ");
  }
}
