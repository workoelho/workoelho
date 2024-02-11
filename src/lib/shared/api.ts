export function getShortName(name: string) {
  return name.trim().split(" ")[0];
  // const parts = name.trim().split(" ");
  // if (parts.length < 2) {
  //   return name;
  // }
  // return `${parts[0]} ${parts[parts.length - 1][0]}.`;
}
