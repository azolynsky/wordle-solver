import { LetterStatus, Word } from "../App";

import _ from 'lodash';

export function checkAnswer(answer: Word, secretWord: string): Word{
  let newWord = {...answer};

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
  }

  return newWord as Word;
}