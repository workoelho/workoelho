// Since @modal is parallel route when a hard navigation occurs the router
// can't determine if the slot is active so it renders its default instance.
export default function Default() {
  return null;
}
