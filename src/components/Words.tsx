import React from 'react';
import { Word } from '../App';
import WordComponent from './Word';

type WordsProps = {
  words: Word[],
  updateWords: Function,
}

const Words = ({words, updateWords}: WordsProps) => {
  function wordUpdated(index: number, newWord: Word){
    const newWords = [...words]
    newWords[index] = newWord

    updateWords(newWords);
  }

  return (<div>
    {words.map((w, index) => <WordComponent updateWord={(newWord: Word) => wordUpdated(index, newWord)} word={w} />)}  
  </div>);
}

export default Words
