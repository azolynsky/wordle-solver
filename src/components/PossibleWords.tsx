type PossibleWordsProps = {
  words: string[],
  onClick: Function,
}

const PossibleWords = ({words, onClick}: PossibleWordsProps) => {
  return (<div>
    {words.map(w => <><div style={{
      cursor: 'pointer',
      fontSize: 30,
      display: 'inline-block',
    }} onClick={() => onClick(w)}>{w}</div><br/></>)}  
  </div>);
}

export default PossibleWords
