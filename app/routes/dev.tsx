import { HomeLayout } from "fumadocs-ui/layouts/home"
import { baseOptions } from "@/lib/layout.shared";

export default function DevProjects() {
    return (
        <HomeLayout {...baseOptions()}>
            <h1>Dev Projects</h1>
            <p>Welcome to the Dev Projects page!</p>
        </HomeLayout>
    )
}