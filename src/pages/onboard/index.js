import AvatarLogic from "@/functions/avatar-logic"
import { useState } from "react";
import { useRouter } from 'next/router';
import { signIn } from 'next-auth/react';

export default function Onboard() {
    AvatarLogic()

    const router = useRouter();

    const goToHomePage = () => {
        router.push('/')
    };

    const handleSignIn = async () => {
        const result = await signIn('github', { callbackUrl: '/myavatar' });
        if (result?.error) {
        } else if (result?.url) {
            router.push(result.url);
        }
    };

    const [buttonText, setButtonText] = useState("");
    const [showText, setShowText] = useState(false);

    const handleButtonClick = () => {
        if (showText) {
            setButtonText("");
        } else {
            setButtonText("Button clicked!");
        }
        setShowText(!showText);
    };

    return (
        <div className="container">
            <h1 className="title">Welcome to Web-Avatar!</h1>
            <h3>If you are tired of the old point-and-click browsing experience, you have arrived at the right place!</h3>
            <h3>Here you can navigate through your own in-browser avatar</h3>
            <h4>First, try to move it</h4>
            <h4>Use W, A, S, D to move the avatar around</h4>
            <h4>Your avatar can interact with webpages</h4>
            <h4>Move the avatar closer to the button until it turns green</h4>
            <h5>Then, press E to display an action menu</h5>
            <h4>You can then press R to click on the button or press Q to close the menu</h4>
            <br />
            <button className="action-button" onClick={handleButtonClick}>
                Come here!
            </button>
            {buttonText && <p>{buttonText}</p>}
            <br />
            <h4>You can interact with all sorts of things on the webpage. Give it atry!</h4>

            <fieldset>
                <label htmlFor="c1">Check Me</label>
                <input type='checkbox' id='c1' className="checkbox" />
                <label htmlFor="c2">And Me</label>
                <input type='checkbox' id='c2' className="checkbox" />
            </fieldset>

            <br />
            <fieldset>
                <input type="radio" id="r1" name="drone" value="r1" className="radio" />
                <label htmlFor="r1">Pick Me!</label>

                <input type="radio" id="r2" name="drone" value="r2" className="radio" />
                <label htmlFor="r2">No Me!</label>

                <input type="radio" id="r3" name="drone" value="r3" className="radio" />
                <label htmlFor="r3">Me Better</label>
            </fieldset>
            <br />
            <a id='l1' href='./empty' className="pixel-art-link">Go from here...</a>

            <h4>That is basically it!</h4>
            <h5>You are almost ready to browse the web using your own web avatar</h5>
            <h5>Log-in to customize your own and get the web extension</h5>
            <button onClick={goToHomePage}>Go to Home</button>
            <button onClick={handleSignIn}>Sign in</button>
        </div>
    );
}