import './App.css';

import { useEffect, useState } from 'react';

import CustomEntry from './components/CustomEntry';
import PossibleWords from './components/PossibleWords';
import Words from './components/Words';
import _ from 'lodash';
import { getOptimalAnswers } from './services/brain';
import { getPossibleSolutions } from './services/solutionService';

export enum LetterStatus{
  'undefined',
  'correct',
  'used',
  'unused'
}

export class Letter{
  letter: string;
  status: LetterStatus;

  constructor(letter: string){
    this.letter = letter;
    this.status = LetterStatus.undefined;
  }
}

export class Word{
  letters: Letter[];

  constructor(word: string){
    this.letters = word.split('').map(l => new Letter(l))
  }

  getDisplayString(){
    return this.letters.map(l => l.letter);
  }
}

function App() {
  const [words, setWords] = useState<Word[]>([]);
  const [possibleAnswers, setPossibleAnswers] = useState<string[]>([]);
  const [optimalAnswers, setOptimalAnswers] = useState<string[]>([]);

  useEffect(() => {
    setPossibleAnswers(getPossibleSolutions(words));
    setOptimalAnswers(getOptimalAnswers(words));

  }, [words]);
  
  return (
    <div className="App">
      <Words updateWords={(newWords: Word[]) => setWords(newWords)} words={words}/>
      <CustomEntry addWord={(word: string) => setWords([...words, new Word(word)])}/>
      {possibleAnswers.length} possible answers
      <PossibleWords onClick={(word: string) => setWords([...words, new Word(word)])} words={_.take(optimalAnswers, 5)} />
      <button onClick={() => {setWords([])}}>reset</button>
    </div>
  );
}

export default App;
