import { Letter, LetterStatus } from "../App";

type LetterProps = {
  letter: Letter,
  onClick: Function,
}

const LetterComponent = ({ letter, onClick }: LetterProps) => {
  let backgroundColor = undefined

  switch (letter.status) {
    case LetterStatus.correct:
      backgroundColor = 'lightgreen'
      break;
    case LetterStatus.unused:
      backgroundColor = 'lightgray'
      break;
    case LetterStatus.used:
      backgroundColor = 'orange'
      break;
    default:
      backgroundColor = 'white'
      break;
  }

  return <span 
  onClick={() => onClick()}
  style={{
    cursor: 'pointer',
    display: 'inline-block',
    width: 35,
    height: 35,
    fontSize: 30,
    border: '1px solid black',
    borderRadius: 3,
    margin: 5,
    backgroundColor,
  }}>{letter.letter.toUpperCase()}</span>;
}

export default LetterComponent
