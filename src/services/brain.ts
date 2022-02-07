import { LetterStatus, Word } from "../App";

import _ from 'lodash';
import wordList from './wordList.json'

export function calculatePossibleWords(words: Word[]){
  let returnList = [...wordList];

  let excludedLetters: string[] = []
  let mustContainLetters: string[] = []
  let notHereLetters: string[][] = [[], [], [], [], []]
  let correctLetters: string[] = ['.', '.', '.', '.', '.']

  words.forEach(W => {
    W.letters.forEach((L, index) => {
      if (L.status === LetterStatus.unused){
        excludedLetters.push(L.letter);
      }
      if (L.status === LetterStatus.used){
        mustContainLetters.push(L.letter);
        notHereLetters[index].push(L.letter);
      }
      if (L.status === LetterStatus.correct){
        correctLetters[index] = L.letter
      }
    })
  })

  debugger;

  returnList = returnList.filter(w => {
    for(let i=0; i<excludedLetters.length; i++){
      let el = excludedLetters[i];
      if(w.includes(el)) return false;
    }

    for(let i=0; i<mustContainLetters.length; i++){
      let mcl = mustContainLetters[i];
      if(!w.includes(mcl)) return false;
    }

    for(let i=0; i<notHereLetters.length; i++){
      let letters = notHereLetters[i];

      for(let j=0; j<letters.length; j++){
        let nhl = letters[j];
        if(w[i] === nhl) return false;
      }
    }

    _.forEach(notHereLetters, (letters, index) => {
      letters.forEach(nhl => {
        if(w[index] === nhl) return false;
      })
    })

    for(let i=0; i<correctLetters.length; i++){
      let cl = correctLetters[i];
      if(cl !== '.' && w[i] !== cl) return false;
    }
    
    return true;
  });

  return returnList
}