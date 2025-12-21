import { withAuth } from "next-auth/middleware";

const isStaging =
    process.env.FLY_APP_NAME === "brainloop-staging";

const middleware = isStaging
    ? () => { }
    : withAuth({
        pages: {
            signIn: "/login",
        },
    });

export default middleware;
