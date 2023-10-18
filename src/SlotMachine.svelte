<script>
    import { onMount, onDestroy } from 'svelte';
    import Wheel from './Wheel.svelte';
    import background from './assets/background.mp3';
    import win from './assets/win.mp3';

    import { Confetti } from "svelte-confetti"
    import coin from './assets/coin2.png';

    let background_audio;
    let win_audio;

    let col1;
    let col2;
    let col3;

    let wheel1;
    let wheel2;
    let wheel3;

    let col1Scroll = 0;
    let col2Scroll = 0;
    let col3Scroll = 0;

    let col1Speed = 3*3;
    let col2Speed = 2*3;
    let col3Speed = 1*3;

    let col1Height;
    let col2Height;
    let col3Height;

    let scale = 1;

    /* The following props are provided by the parent component */
    export let col1TargetID = 0;
    export let col2TargetID = 0;
    export let col3TargetID = 0;

    let col1FhashingID = 0;
    let col2FhashingID = 0;
    let col3FhashingID = 0;

    export let onSpin = () => {
    };

    export let getRandomNumber = async ( hook ) => {
        return 0;
    }

    export let onSpinFinished = (c1, c2, c3) => {
    }

    export let isSpinning = false;
    export let isFetching = false;
    export let isStopping = false;

    $: if (isSpinning) {
        setTimeout(() => {
            showOverlay = true;
        }, 3000);
    }

    let showOverlay = false;

    const mod = (n, m) => (n % m + m) % m;
    const ICON_HEIGHT = 100;

    $: if (col1) {
            col1Scroll = mod((col1TargetID - 1), 8) * ICON_HEIGHT,
            col1?.scrollTo({
                top: mod((col1TargetID - 1), 8) * ICON_HEIGHT,
                behavior: 'auto'
            });
    }
    
    $: if (col2) {
            col2Scroll = mod((col2TargetID - 1), 8) * ICON_HEIGHT,
            col2?.scrollTo({
                top: mod((col2TargetID - 1), 8) * ICON_HEIGHT,
                behavior: 'auto'
            });
    }

    $: if (col3) {
            col3Scroll = mod((col3TargetID - 1), 8) * ICON_HEIGHT,
            col3?.scrollTo({
                top: mod((col3TargetID - 1), 8) * ICON_HEIGHT,
                behavior: 'auto'
            });
    }


    let main_loop_interval;
    let revealResult = false;

    
    $: SPEED = isFetching ? 2 : 0;
    
    //If isFetching has changed to true, then start spinning
    $: if (isFetching) {
        doSpin();
    }

    let doSpin = async () => {
        main_loop_interval = setInterval(() => {
            if (isSpinning) {
                col1Scroll += SPEED * col1Speed;
                col2Scroll += SPEED * col2Speed;
                col3Scroll += SPEED * col3Speed;
            }

            if (!revealResult) {
                col1Scroll = col1Scroll % (col1Height / 11 * 8);
                col2Scroll = col2Scroll % (col2Height / 11 * 8);
                col3Scroll = col3Scroll % (col3Height / 11 * 8);
            }
            
            col1.scrollTo({
                top: col1Scroll,
                behavior: 'auto'
            });

            col2.scrollTo({
                top: col2Scroll,
                behavior: 'auto'
            });

            col3.scrollTo({
                top: col3Scroll,
                behavior: 'auto'
            });

            //If we have reached bottom of the wheel, then reset the wheel to the top
            if (col1Scroll >= col1Height && col2Scroll >= col2Height && col3Scroll >= col3Height) {
                clearInterval(main_loop_interval);

                //If has winning combination
                if (col1FhashingID == col2FhashingID || col2FhashingID == col3FhashingID || col1FhashingID == col3FhashingID) {
                    win_audio.play();
                    
                    setTimeout(() => {
                        onSpinFinished(wheel1.targetItem, wheel2.targetItem, wheel3.targetItem);
                    }, 5000);

                    showOverlay = false;

                    setInterval(() => {
                        //Alternate scale between 1 and 1.2
                        scale = scale == 1 ? 1.2 : 1;
                    }, 100)
                } else {
                    setTimeout(() => {
                        onSpinFinished(wheel1.targetItem, wheel2.targetItem, wheel3.targetItem);
                    }, 2000);

                    showOverlay = false;
                }
                isFetching = false;
                
            }

        }, 20);

        let randomNumber = await getRandomNumber( () => {
            //Spin while waiting for block to be added
            isSpinning = true;
        });
        const c1 = randomNumber & 0b111;
        const c2 = (randomNumber >> 3) & 0b111;
        const c3 = (randomNumber >> 6) & 0b111;

        col1FhashingID = c1;
        col2FhashingID = c2;
        col3FhashingID = c3;

        setTimeout(() => {
            let speed_interval = setInterval(() => {
                if (isStopping) {
                    col1Speed = Math.max(3, col1Speed - 3);
                    col2Speed = Math.max(2, col2Speed - 2);
                    col3Speed = Math.max(2, col3Speed - 1);
                }

                if (col1Speed == 3 && col2Speed == 2 && col3Speed == 2) {
                    clearInterval(speed_interval);
                    revealResult = true;

                    wheel1.with_extraScroll = true;
                    wheel2.with_extraScroll = true;
                    wheel3.with_extraScroll = true;

                    //Random number between 0 and 7
                    wheel1.targetItem = c1;
                    wheel2.targetItem = c2;
                    wheel3.targetItem = c3;
                    //wheel1.targetItem = Math.floor(Math.random() * 8);
                    //wheel2.targetItem = Math.floor(Math.random() * 8);
                    //wheel3.targetItem = Math.floor(Math.random() * 8);
                }

            }, 1000);
        }, 3000);
    }

    onMount(() => {
        win_audio.volume = 0.05;

        background_audio.volume = 0.06;
        background_audio.loop = true;

        background_audio.play();      
    })
</script>

<audio src={background} bind:this={background_audio}></audio>
<audio src={win} bind:this={win_audio}></audio>
<h1>Inco Slots (Demo)</h1>
<div class="SlotMachineScreen">
    <div class="col" bind:this={col1}>
        <div bind:clientHeight={col1Height}>
            <Wheel
                scale={scale}
                index={0}
                bind:this={wheel1} 
                hasStopped={revealResult && col1Scroll >= col1Height}
                isFlashing={col1FhashingID == col2FhashingID || col1FhashingID == col3FhashingID}
            />
        </div>
    </div>
    <div class="col" bind:this={col2}>
        <div bind:clientHeight={col2Height}>
            <Wheel
                scale={scale}
                index={1}
                bind:this={wheel2} 
                hasStopped={revealResult && col2Scroll >= col2Height}
                isFlashing={col2FhashingID  == col1FhashingID || col2FhashingID == col3FhashingID}
            />
        </div>
    </div>
    <div class="col" bind:this={col3}>
        <div bind:clientHeight={col3Height}>
            <Wheel
                scale={scale}
                index={2}
                bind:this={wheel3}
                hasStopped={revealResult && col3Scroll >= col3Height}
                isFlashing={col3FhashingID == col1FhashingID || col3FhashingID == col2FhashingID}
            />
        </div>
    </div>
    
    {#if !isFetching && revealResult && (col1FhashingID == col2FhashingID || col1FhashingID == col3FhashingID || col2FhashingID == col3FhashingID) }
    <div class="Confetti">
    <Confetti size=30 colorArray={["url("+coin+")"]} x={[-5, 5]} y={[0, 0.1]} delay={[200, 3500]} duration=5000 amount=500 fallDistance="100vh" />
   </div>
   {/if}

    <div class={"Overlay " + (showOverlay ? "visible" : "hidden") }>
        <div class="TopGradient"></div>
        <div class="BottomGradient"></div>
    </div>
    

</div>

<style>
    .Confetti {
        position: fixed;
        top: -50px;
        left: 0;
        height: 100vh;
        width: 100vw;
        display: flex;
        justify-content: center;
        overflow: hidden;
        pointer-events: none;
    }

    .SlotMachineScreen {
        display: flex;
        flex-direction: row;
        flex-wrap: wrap;
        justify-content: center;
        align-items: center;
        align-content: center;
        height: auto;
    }

    h1 {
        margin: 0;
        margin-top: 0.2em;
        padding: 0;
        font-size: large;
    }

    .col {
        width: 100px;
        height: 300px;
        background: linear-gradient(0deg, rgba(190,211,222,1) 0%, rgba(255,255,255,1) 63%, rgba(255,255,255,1) 72%, rgba(220,233,240,1) 100%);
        margin: 10px;
        /* display: flex; */
        flex-direction: column;
        justify-content: center;
        align-items: center;
        font-size: 50px;
        overflow: hidden;
        border-radius: 0.25em;

        box-shadow: inset 0 0 4px #000000cc;
    }

    .Overlay {
        position: fixed;
        margin-left: 2em;
        margin-right: 2em;
        
        width: 100%;
        height: 100px;

        display: flex;
        flex-direction: column;

        opacity: 0;
        transition: opacity 2s;

        margin-bottom: 200px;
    }

    .Overlay.visible {
        opacity: 1;
    }

    .Overlay.hidden {
        opacity: 0;
    }

    .TopGradient {
        position: fixed;
        height: 100px;
        width: 100%;
        margin-bottom: 200px;
        background: 
        linear-gradient(
            to top,
            #2b344ebc,
            #99999900
        ),
        repeating-linear-gradient(
            -65deg,
            transparent,
            transparent 20px,
            rgba(24,54,85,0.1) 20px,
            rgba(24,54,85,0.1) 40px
        );

    }

    .BottomGradient {
        position: fixed;
        height: 100px;
        width: 100%;
        margin-top: 200px;
        background:   repeating-linear-gradient(
            -65deg,
            transparent,
            transparent 20px,
            rgba(24,54,85,0.1) 20px,
            rgba(24,54,85,0.1) 40px
        ),
        linear-gradient(
            to bottom,
            #2b344ebc,
            #99999900
        );

    }

</style>