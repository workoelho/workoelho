export class ClassList extends Set {
  constructor(...classes: unknown[]) {
    super(classes);
  }

  toString() {
    return Array.from(this).filter(Boolean).join(" ");
  }
}
