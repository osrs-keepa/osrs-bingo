import Head from "next/head";
import styles from "../styles/Home.module.css";

export default function Home() {
  return (
    <div className={styles.container}>
      <Head>
        <title>RSBingo</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <h1 className={styles.title}>Welcome to RSBingo</h1>

        <p className={styles.description}>Enter your group password</p>

        <div className={styles.inputContainer}>
          <form
            action="/api/password"
            method="post"
            className={styles.formField}
          >
            <input
              className={styles.password}
              type="text"
              id="password"
              name="password"
            />
          </form>
        </div>
      </main>
    </div>
  );
}
