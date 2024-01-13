"use client";
import Link from "next/link";
import React from 'react'
import { Button } from "antd";
import styles from "../../../components/projectcomponents/styles/Dashboard.module.css"
import { ProjectLists } from "../../../components/projectcomponents/projectlists"
import Search from "../../../components/projectcomponents/search"

const page = () => {
    const handleSearch = (query: string) => {
        //route.push(`../projectlist/${model_id}/edit`);
        console.log("handleSearch", query);
    };

    const owner = true;


    return (
        <div>
            <div >
                <h1 className={styles.title}>OpenAI Dashboard</h1>

            </div>
            <div className={styles.Navbar}>
                <h3 className={styles.admin}>OpenAI Admin</h3>
                {owner && <Button type="text" className={styles.createProjectButton}>
                    <Link href="/createproject">
                        + Create a New Project
                    </Link>
                </Button>}
                <div className={styles.searchBar}>
                    <Search onSearch={handleSearch} />
                </div>
                <ProjectLists />
            </div>

        </div>
    );
};

export default page