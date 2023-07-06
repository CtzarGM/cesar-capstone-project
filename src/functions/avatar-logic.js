
import { useEffect } from 'react'

export default function AvatarLogic() {

    useEffect(() => {

        const navAv = document.createElement('div');
        navAv.tabIndex = 10;
        navAv.autofocus = true;
        navAv.id = "navAvatar";
        navAv.className = "navAvatar";
        navAv.style.top = "50px";
        navAv.style.left = "200px";
        document.body.prepend(navAv);

        const menu1 = document.createElement('div');
        menu1.className = "menu"
        menu1.id = "menu"
        menu1.innerHTML = "r: action / q: close"
        menu1.style.top = "100px";
        menu1.style.left = "550px";
        menu1.style.display = "none";

        const menuInnerText1 = document.createElement('div');
        menuInnerText1.innerHTML = "menu inner text";
        menuInnerText1.id = "menu-inner-text";
        menu1.appendChild(menuInnerText1);

        document.body.prepend(menu1);
        document.body.prepend(navAv);


        if (document) {
            const navAvatar = document.getElementById("navAvatar");
            let canMove = true;
            let isAvatarMoving = false;
            let isAvatarInteracting = false;

            const menu = document.getElementById("menu");
            const menuInnerText = document.getElementById("menu-inner-text")
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
                        currentBlock.style.background = 'darkgreen';
                        menuInnerText.innerHTML = currentBlock.innerHTML;
                        if (currentBlock.classList.contains('clickable') && currentKeys[ACTION] && isMenuOpen && !performedAction) {
                            performAction(currentBlock);
                        }
                    }
                    else {
                        currentBlock.style.background = 'darkblue'
                    }
                })
            }

            function detectPlayerCollision() {
                let me = navAvatar.getBoundingClientRect();

                if (Array.from(allDetectableBlocks).some(currentBlock => {
                    let block = currentBlock.getBoundingClientRect();
                    return isColliding(me, block)
                })) {
                    if (currentBlock.classList.contains('clickable') && currentBlock.classList.contains('sprite') && currentKeys[ACTION] && isMenuOpen && !performedAction) {
                        navAvatar.background = currentBlock.background;
                    }
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
        return () => {
            document.body.removeChild(navAv);
        };
    }, [])
}