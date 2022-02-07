type PossibleWordsProps = {
  words: string[],
  onClick: Function,
}

const PossibleWords = ({words, onClick}: PossibleWordsProps) => {
  return (<div>
    {words.map(w => <div style={{
      cursor: 'pointer',
      fontSize: 30,
    }} onClick={() => onClick(w)}>{w}</div>)}  
  </div>);
}

export default PossibleWords
