import './App.css';

import { useEffect, useState } from 'react';

import CustomEntry from './components/CustomEntry';
import PossibleWords from './components/PossibleWords';
import Words from './components/Words';
import _ from 'lodash';
import { checkAnswer } from './services/gameplayService';
import { getOptimalAnswers } from './services/brain';
import { getPossibleSolutions } from './services/solutionService';
import solutionList from './services/solutionList.json';
import wordList from './services/wordList.json';

export enum LetterStatus {
  'undefined',
  'correct',
  'used',
  'unused'
}

export class Letter {
  letter: string;
  status: LetterStatus;

  constructor(letter: string) {
    this.letter = letter;
    this.status = LetterStatus.undefined;
  }
}

export class Word {
  letters: Letter[];

  constructor(word: string) {
    this.letters = word.split('').map(l => new Letter(l))
  }

  getDisplayString() {
    return this.letters.map(l => l.letter);
  }
}

function App() {
  //const startingWords: Word[] = [new Word('arose')];
  const startingWords: Word[] = [];

  const [numberOfSteps, setNumberOfSteps] = useState(0);
  const [iterations, setIterations] = useState(0);
  const [mostSteps, setMostSteps] = useState<number | undefined>(undefined);
  const [fewestSteps, setFewestSteps] = useState<number | undefined>(undefined);
  const [secretWord, setSecretWord] = useState('');
  const [words, setWords] = useState<Word[]>(startingWords);
  const [possibleAnswers, setPossibleAnswers] = useState<string[]>([]);
  const [optimalAnswers, setOptimalAnswers] = useState<string[]>([]);

  function resetGameplay() {
    setNumberOfSteps(numberOfSteps + words.length);
    setIterations(iterations + 1);

    if (!fewestSteps || fewestSteps > words.length){
      setFewestSteps(words.length);
    }

    if (!mostSteps || mostSteps < words.length){
      setMostSteps(words.length);
    }

    setWords([]);
    generateSecretWord();
  }

  function generateSecretWord() {
    setSecretWord(solutionList[_.random(solutionList.length, false)]);
  }

  useEffect(() => {
    setPossibleAnswers(getPossibleSolutions(words));
    setOptimalAnswers(getOptimalAnswers(words));

    let lastWord = _.last(words);

    if (secretWord !== '' && lastWord && _.every(lastWord.letters, L => L.status === LetterStatus.undefined)) {
      let checkedWord = checkAnswer(lastWord, secretWord)
      setWords([...words.slice(0, words.length - 1), checkedWord as Word])
    }
  }, [words, secretWord]);

  useEffect(() => {
    setWords(startingWords);
  }, [secretWord])

  return (
    <div className="App">
      secret word: {secretWord} <br />
      {iterations > 0 && <>
        iterations: {iterations} <br />
        average steps: {numberOfSteps / iterations}<br />
        most steps: {mostSteps}<br/>
        fewest steps: {fewestSteps}<br/>
      </>}
      <button onClick={generateSecretWord}>set new secret word</button>
      {secretWord !== '' && (words.length === 0 || !_.every(_.last(words)?.letters, l => l.status === LetterStatus.correct)) && <button onClick={() => { setWords([...words, new Word(optimalAnswers[0])]) }}>step through</button>}
      {secretWord && words.length > 0 && _.every(_.last(words)?.letters, l => l.status === LetterStatus.correct) && <button onClick={resetGameplay}>reset</button>}
      <Words updateWords={(newWords: Word[]) => setWords(newWords)} words={words} />
      <CustomEntry addWord={(word: string) => setWords([...words, new Word(word)])} />
      {possibleAnswers.length} possible answers
      <PossibleWords onClick={(word: string) => setWords([...words, new Word(word)])} words={_.take(optimalAnswers, possibleAnswers.length <= 1 ? possibleAnswers.length : 5)} />
      <button onClick={() => { setWords(startingWords) }}>reset</button>
    </div>
  );
}

export default App;
