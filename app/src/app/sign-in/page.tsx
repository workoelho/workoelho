export default function Page() {
  return (
    <main>
      <form>
        <fieldset>
          <legend>Sign In</legend>
          <div>
            <input name="email" type="email" />
          </div>
          <div>
            <input name="password" type="password" />
          </div>
          <footer>
            <button type="submit">Sign In</button>
          </footer>
        </fieldset>
      </form>
    </main>
  );
}
