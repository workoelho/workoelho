import Layout from "./layout";

type Props = {
  id: number;
};

export default function Page(props: Props) {
  return (
    <Layout>
      <h1>Project #{props.id}</h1>
      <p>
        Lorem ipsum dolor, sit amet consectetur adipisicing elit. Sapiente
        aperiam eaque necessitatibus illo impedit nulla minima nostrum inventore
        tempore. Ea placeat eaque architecto debitis dolor consectetur
        voluptatibus odio explicabo illo.
      </p>
    </Layout>
  );
}
