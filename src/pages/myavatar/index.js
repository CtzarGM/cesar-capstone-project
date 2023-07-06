import { useSession, signIn, signOut } from "next-auth/react"
import AvatarLogic from "@/functions/avatar-logic"


export default function MyAvatar() {

    const { data: session } = useSession()
    AvatarLogic();
    if (session) {
        return (
            <>
                <h3>
                    <img src={session.user.image} style={{ width: '100px', borderRadius: '50%' }} />
                    Signed in as {session.user.name}
                </h3>
                <div className="sprite link">aaa</div>
                <div className="sprite default">aaa</div>
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
}