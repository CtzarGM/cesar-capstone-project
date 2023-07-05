import Head from 'next/head'
import Image from 'next/image'
import { Inter } from 'next/font/google'
import styles from '@/styles/Home.module.css'
import { useEffect } from 'react'

const inter = Inter({ subsets: ['latin'] })

export default function Home() {

  useEffect(() => {
    if (document) {
      const navAvatar = document.getElementById("navAvatar");
      let canMove = true;
      let isAvatarMoving = false;
      let isAvatarInteracting = false;

      const menu = document.getElementById("menu");
      const menuInnerText = document.getElementById("menuInnerText")
      let isMenuOpen = false;
      let performedAction = false;

      let allDetectableBlocks = [];

      let currentKeys = [];
      const UP = 'w';
      const LEFT = 'a';
      const DOWN = 's';
      const RIGHT = 'd';
      const MENU = 'e'
      const ACTION = 'r';
      const BACK = 'q';

      function avatarAtTopOfScreen() {
        var avatar = navAvatar.getBoundingClientRect();
        var currentWindow = window.innerHeight;
        return (currentWindow * .4 > avatar.top + avatar.height);
      }

      function avatarAtBottomOfScreen() {
        var avatar = navAvatar.getBoundingClientRect();
        var currentWindow = window.innerHeight;
        return (currentWindow * .6 < avatar.top);
      }

      function getLinks() {
        let links = document.querySelectorAll("a");
        for (let i = 0; i < links.length; i++) {
          links[i].classList.add("detectable")
          links[i].classList.add("clickable")
        }
      };

      function getInteractions() {
        let inputs = document.querySelectorAll("input");
        for (let i = 0; i < inputs.length; i++) {
          inputs[i].classList.add("detectable")
          inputs[i].classList.add("clickable")
        }
      }

      function getButtons() {
        let buttons = document.querySelectorAll("button");
        for (let i = 0; i < buttons.length; i++) {
          buttons[i].classList.add("detectable")
          buttons[i].classList.add("clickable")
        }
      }

      function addClassToElements(callback) {
        getLinks();
        getInteractions();
        getButtons();
        allDetectableBlocks = document.querySelectorAll(".detectable");
        callback();
      }

      addClassToElements(function () {
        console.log(allDetectableBlocks);
      });

      function isColliding(block1, block2) {
        return !(
          block1.bottom < block2.top ||
          block1.top > block2.bottom ||
          block1.right < block2.left ||
          block1.left > block2.right
        );
      }

      function openMenu() {
        let menuLeftPos = parseInt(navAvatar.style.left);
        let menuTopPos = parseInt(navAvatar.style.top);

        menu.style.left = menuLeftPos + 51 + 'px';
        menu.style.top = menuTopPos - 51 + 'px';
        menu.style.display = 'block';

        canMove = false;
        performedAction = false;
        isMenuOpen = true;
        isAvatarInteracting = true;
      }

      function closeMenu() {
        menu.style.display = 'none';

        canMove = true;
        isMenuOpen = false;
        performedAction = true;
      }

      function performAction(block) {
        block.click();
        performedAction = true;
        closeMenu();
      }

      function detectCollision() {
        let me = navAvatar.getBoundingClientRect();
        let blockCollisions = {};

        Array.prototype.forEach.call(allDetectableBlocks, (currentBlock) => {
          var collidingWithThisBlock = false;
          let block = currentBlock.getBoundingClientRect();

          if (isColliding(me, block)) {
            currentBlock.style.background = 'green';
            menuInnerText.innerHTML = currentBlock.innerHTML;
            if (currentBlock.classList.contains('clickable') && currentKeys[ACTION] && isMenuOpen && !performedAction) {
              performAction(currentBlock);
            }
          }
          else {
            currentBlock.style.background = 'red'
          }
        })
      }

      function detectPlayerCollision() {
        let me = navAvatar.getBoundingClientRect();

        if (Array.from(allDetectableBlocks).some(currentBlock => {
          let block = currentBlock.getBoundingClientRect();
          return isColliding(me, block)
        })) {
          isAvatarInteracting = true;
        }
        else {
          isAvatarInteracting = false;
        }
      }

      function moveLoop() {
        if (currentKeys[LEFT] || currentKeys[RIGHT] || currentKeys[UP] || currentKeys[DOWN]) {
          if (!isAvatarMoving) { navAvatar.setAttribute('data-moving', true); isAvatarMoving = true; }
        } else {
          if (isAvatarMoving) { navAvatar.setAttribute('data-moving', false); isAvatarMoving = false; }
        }

        let leftPos = parseInt(navAvatar.style.left);
        let topPos = parseInt(navAvatar.style.top);

        if (currentKeys[LEFT] && canMove) {
          navAvatar.style.left = leftPos - 3 + 'px';
        }
        if (currentKeys[RIGHT] && canMove) {
          navAvatar.style.left = leftPos + 3 + 'px';
        }
        if (currentKeys[UP] && canMove) {
          navAvatar.style.top = topPos - 3 + 'px';
          if (avatarAtTopOfScreen()) {
            window.scrollBy(0, -3);
          }
        }
        if (currentKeys[DOWN] && canMove) {
          navAvatar.style.top = topPos + 3 + 'px';
          if (avatarAtBottomOfScreen()) {
            window.scrollBy(0, 3);
          }
        }

        if (currentKeys[MENU] && isAvatarInteracting && !isMenuOpen) {
          openMenu()
        }

        if (currentKeys[BACK] && isAvatarInteracting && isMenuOpen) {
          closeMenu();
        }

        if (isAvatarMoving || isAvatarInteracting) {
          detectCollision();
          detectPlayerCollision();
        }


        window.requestAnimationFrame(moveLoop);
      }
      window.requestAnimationFrame(moveLoop);

      document.body.addEventListener("keydown", (infoAboutKey) => {
        currentKeys[infoAboutKey.key] = true;
        if ([UP, LEFT, DOWN, RIGHT].indexOf(infoAboutKey.key) < 0) {
          return;
        };
        navAvatar.setAttribute('data-key-' + infoAboutKey.key, true);
      });
      document.body.addEventListener("keyup", (infoAboutKey) => {
        currentKeys[infoAboutKey.key] = false;
        if ([UP, LEFT, DOWN, RIGHT].indexOf(infoAboutKey.key) < 0) {
          return;
        };
        navAvatar.setAttribute('data-key-' + infoAboutKey.key, '');
        navAvatar.setAttribute('data-lastdirection', infoAboutKey.key);
      })
      window.addEventListener("DOMContentLoaded", () => { moveLoop() });
    }
  }, [])

  return (
    <>
      <Head>
        <title>Web Avatar</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={`${styles.main} ${inter.className}`}>
        <div className={styles.container}>
          <p>Use wasd to move up, left, down or right</p>
          <div id='menu' className={styles.menu} style={{ display: 'none', top: '250px', left: '550px' }}><div id='menuInnerText'>Menu inner text</div>r: interact / q: go back</div>
          <div id='navAvatar' className={styles.navAvatar} style={{ top: '200px', left: '500px' }}></div>
          <div id='block1' className={`detectable ${styles.testBlock}`} style={{ top: '600px', left: '70px', background: 'red' }}>block1</div>
          <div id='block2' className={`detectable ${styles.testBlock}`} style={{ top: '600px', left: '200px', background: 'red' }}>block2</div>
          <div id='block3' className={`detectable ${styles.testBlock}`} style={{ top: '600px', left: '400px', background: 'red' }}>block3</div>
          <button type='button' onClick={() => { console.log("button pressed") }}>Click Me</button>
          <label htmlFor="coding">Check Me</label>
          <input type='checkbox' id='coding' />
          <label htmlFor="rcoding">Radio Me</label>
          <input type='radio' id='rcoding' />
          <a href='https://developer.mozilla.org/en-US/'>link me</a>

        </div>
      </main >
    </>
  )
}

{/* <div className={styles.description}>
          <p>
            Get started by editing&nbsp;
            <code className={styles.code}>src/pages/index.js</code>
          </p>
          <div>
            <a
              href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
              target="_blank"
              rel="noopener noreferrer"
            >
              By{' '}
              <Image
                src="/vercel.svg"
                alt="Vercel Logo"
                className={styles.vercelLogo}
                width={100}
                height={24}
                priority
              />
            </a>
          </div>
        </div>

        <div className={styles.center}>
          <Image
            className={styles.logo}
            src="/next.svg"
            alt="Next.js Logo"
            width={180}
            height={37}
            priority
          />
        </div>

        <div className={styles.grid}>
          <a
            href="https://nextjs.org/docs?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
            className={styles.card}
            target="_blank"
            rel="noopener noreferrer"
          >
            <h2>
              Docs <span>-&gt;</span>
            </h2>
            <p>
              Find in-depth information about Next.js features and&nbsp;API.
            </p>
          </a>

          <a
            href="https://nextjs.org/learn?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
            className={styles.card}
            target="_blank"
            rel="noopener noreferrer"
          >
            <h2>
              Learn <span>-&gt;</span>
            </h2>
            <p>
              Learn about Next.js in an interactive course with&nbsp;quizzes!
            </p>
          </a>

          <a
            href="https://vercel.com/templates?framework=next.js&utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
            className={styles.card}
            target="_blank"
            rel="noopener noreferrer"
          >
            <h2>
              Templates <span>-&gt;</span>
            </h2>
            <p>
              Discover and deploy boilerplate example Next.js&nbsp;projects.
            </p>
          </a>

          <a
            href="https://vercel.com/new?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
            className={styles.card}
            target="_blank"
            rel="noopener noreferrer"
          >
            <h2>
              Deploy <span>-&gt;</span>
            </h2>
            <p>
              Instantly deploy your Next.js site to a shareable URL
              with&nbsp;Vercel.
            </p>
          </a>
        </div> */}




