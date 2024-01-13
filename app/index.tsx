import React from "react";
import styles from "./index.module.css";
import Link from "next/link";



const IndexPage = () => {
  const org_id = process.env.NEXT_PUBLIC_REACT_APP_ORG_ID;
  return (
    <main><h1>Home</h1>
      {/*<a href = "/users">Users</a> will reload everything;
    <Link href = "/users">Users</Link> will not reload everything; called client-side navigation
    */}
      <Link href={`/projectlist/${org_id}`}>projectlist</Link><br></br>
      <Link href="/createproject">Create A Project</Link>

    </main>

  )
}

export default IndexPage;
