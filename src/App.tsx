import './App.css';

import { useEffect, useState } from 'react';

import CustomEntry from './components/CustomEntry';
import PossibleWords from './components/PossibleWords';
import Words from './components/Words';
import _ from 'lodash';
import { getOptimalAnswers } from './services/brain';
import { getPossibleSolutions } from './services/solutionService';
import wordList from './services/wordList.json'

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

  const [secretWord, setSecretWord] = useState('');
  const [words, setWords] = useState<Word[]>(startingWords);
  const [possibleAnswers, setPossibleAnswers] = useState<string[]>([]);
  const [optimalAnswers, setOptimalAnswers] = useState<string[]>([]);

  useEffect(() => {
    setPossibleAnswers(getPossibleSolutions(words));
    setOptimalAnswers(getOptimalAnswers(words));

    if (secretWord !== '' && _.every(_.last(words)?.letters, L => L.status === LetterStatus.undefined)) {
      let newWord = { ..._.last(words) };

      if (newWord.letters) {
        newWord.letters.forEach((L, i) => {
          if (secretWord[i] === L.letter) {
            L.status = LetterStatus.correct;
          } else if (secretWord.includes(L.letter)) {
            L.status = LetterStatus.used;
          } else {
            L.status = LetterStatus.unused;
          }
        })

        setWords([...words.slice(0, words.length-1), newWord as Word])
      }
    }
  }, [words, secretWord]);

  useEffect(() => {
    setWords(startingWords);
  }, [secretWord])

  return (
    <div className="App">
      {secretWord} <br />
      <button onClick={() => { setSecretWord(wordList[_.random(wordList.length, false)]) }}>set new secret word</button>
      <Words updateWords={(newWords: Word[]) => setWords(newWords)} words={words} />
      <CustomEntry addWord={(word: string) => setWords([...words, new Word(word)])} />
      {possibleAnswers.length} possible answers
      <PossibleWords onClick={(word: string) => setWords([...words, new Word(word)])} words={_.take(optimalAnswers, possibleAnswers.length <= 1 ? possibleAnswers.length : 5)} />
      <button onClick={() => { setWords(startingWords) }}>reset</button>
    </div>
  );
}

export default App;
