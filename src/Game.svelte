<script>
    import { Confetti } from "svelte-confetti";

    import hangman_0 from './assets/hangman_0.png';
    import hangman_1 from './assets/hangman_1.png';
    import hangman_2 from './assets/hangman_2.png';
    import hangman_3 from './assets/hangman_3.png';
    import hangman_4 from './assets/hangman_4.png';
    import hangman_5 from './assets/hangman_5.png';
    import hangman_6 from './assets/hangman_6.png';
    import hangman_7 from './assets/hangman_7.png';
    import hangman_8 from './assets/hangman_8.png';
    import hangman_9 from './assets/hangman_9.png';
    import hangman_10 from './assets/hangman_10.png';
    import hangman_11 from './assets/hangman_11.png';

    const drawings = [
        hangman_0,
        hangman_1,
        hangman_2,
        hangman_3,
        hangman_4,
        hangman_5,
        hangman_6,
        hangman_7,
        hangman_8,
        hangman_9,
        hangman_10,
        hangman_11
    ];

    export let wrongGuesses = [];
    export let lives = 11;
    export let hasWon = false;

    export let currentWord = "____";

    $: splitWord = currentWord.split('');

    $: drawingId = wrongGuesses.length;

    $: wrongWords = wrongGuesses.flatMap(
    (v, i, array) =>
        array.length - 1 !== i ? [v, ","] : v
    );
</script>

<div>
    <div>
        <div class="WrongGuesses">
        {#each wrongWords as letter}
            <span class="Letter">{letter}</span>
        {/each}
        </div>
        <img src={drawings[drawingId]} alt="item" class="Scaled"/>
    </div>
    
    <div>
        <div class="Row">
            {#each splitWord as letter}
            <div class="Underscore">
                <p>{letter}</p>
            </div>
            {/each}
        </div>
    </div>
    {#if hasWon}
    <div class="Confetti">
        <Confetti size=30 x={[-5, 5]} y={[0, 0.1]} delay={[200, 3500]} duration=5000 amount=500 fallDistance="100vh" />
    </div>
    {/if}
</div>

<style type="scss">
    .Scaled {
        width: 75%;
        height: 75%;
    }
    .Row {
        display: flex;
        flex-direction: row;
        flex-wrap: wrap;
        justify-content: center;
        align-items: center;
        align-content: center;
    }

    .WrongGuesses {
        display: flex;
        flex-direction: row;
        flex-wrap: wrap;
        justify-content: center;
        align-items: center;
        align-content: center;
        font-family: "SketchScript";
        font-size: medium;
    }

    .Letter {
        font-family: "SketchScript";
        font-size: x-large;
        color: red;
        margin: 0.2em;
    }

    .Underscore {
        font-family: "SketchScript";
        font-size: xx-large;
        color: white;
        margin-left: 0.45em;
        margin-right: 0.45em;
        height: 2em;
    }

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
</style>