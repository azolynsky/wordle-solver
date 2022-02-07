import { LetterStatus, Word } from '../App';

import LetterComponent from './Letter';

type WordProps = {
  word: Word,
  updateWord: Function,
}

const WordComponent = ({ word, updateWord }: WordProps) => {
  function LetterClicked(i: number) {
    let newStatus = word.letters[i].status;

    switch (newStatus) {
      case LetterStatus.undefined:
        newStatus = LetterStatus.unused
        break;
      case LetterStatus.unused:
        newStatus = LetterStatus.used
        break;
      case LetterStatus.used:
        newStatus = LetterStatus.correct
        break;
      case LetterStatus.correct:
        newStatus = LetterStatus.undefined
        break;
      default:
        console.log('something went wrong in Word.tsx.');
        break;
    }

    const newWord = { ...word };
    newWord.letters[i].status = newStatus;

    updateWord(newWord);
  }

  return <div>{word.letters.map((l, index) => <LetterComponent onClick={() => LetterClicked(index)} letter={l} />)}</div>;
}

export default WordComponent
