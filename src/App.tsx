import './App.css';

import PossibleWords from './components/PossibleWords';
import Words from './components/Words';
import { useState } from 'react';
import wordList from '../public/wordList.json';

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
  const [words, setWords] = useState<Word[]>([new Word('booty'), new Word('party')]);

  return (
    <div className="App">
      <Words updateWords={(newWords: Word[]) => setWords(newWords)} words={words}/>
      <PossibleWords onClick={(word: string) => setWords([...words, new Word(word)])} words={['hello', 'drips']} />
    </div>
  );
}

export default App;
