import { useSession, signIn, signOut } from "next-auth/react"
import AvatarLogic from "@/functions/avatar-logic"


export default function MyAvatar() {

    const { data: session } = useSession()
    if (session) {
        return (
            <>
                <h3>
                    <img src={session.user.image} style={{ width: '100px', borderRadius: '50%' }} />
                    Signed in as {session.user.name}
                </h3>
                <div className="container">
                    <div className="container">
                        <div className="sprite link">
                        </div>
                    </div>
                    <br />
                    <div className="container">
                        <div className="sprite default">
                        </div>
                    </div>
                </div>
                <br />
                <div className="sprite link"></div>
                <br />
                <div className="sprite default"></div>
                <br />
                <button onClick={() => signOut({ callbackUrl: '/' })}>Sign out</button>
            </>
        )
    }
    return (
        <>
            Not signed in <br />
            <button onClick={() => signIn()}>Sign in</button>
        </>
    )
    AvatarLogic();
}