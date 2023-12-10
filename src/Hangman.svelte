<script>
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
        undefined,
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

    export let wrongGuesses = ["B", "C", "E"];
    export let lives = 11;

    $: drawingId = wrongGuesses.length;
</script>

<div>
    <div>
        <div style="font-style: italic;">Wrong guesses:</div>
        <div class="WrongGuesses">
        {#each wrongGuesses as letter}
            <span class="Letter">{letter}</span>
        {/each}
        </div>
        <img src={drawings[drawingId]} alt="item" class="Scaled"/>
    </div>
    
    <div>
        <div class="Row">
            <div class="Underscore">
                <p>A</p>
            </div>
            <div class="Underscore">
                <p>?</p>
            </div>
            <div class="Underscore">
                <p>?</p>
            </div>
            <div class="Underscore">
                <p>?</p>
            </div>
        </div>
    </div>

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
    }

    .Letter {
        font-family: "SketchScript";
        font-size: medium;
        color: white;
        margin: 0.2em;
        text-decoration: line-through;
    }

    .Underscore {
        font-family: "SketchScript";
        font-size: xx-large;
        color: white;
        margin-left: 0.45em;
        margin-right: 0.45em;
        text-decoration: underline;
    }
</style>