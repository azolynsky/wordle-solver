import { useState } from "react";

type CustomEntryProps = {
  addWord: Function,
}

const CustomEntry = ({addWord}: CustomEntryProps) => {
  const [word, setWord] = useState<string>('');

  function handleSubmit(e: React.FormEvent<HTMLFormElement>){
    addWord(word);
    e.preventDefault();
    setWord('');
  }

  return (
    <form onSubmit={(e) => handleSubmit(e)}>
      <input type='text' value={word} onChange={e => setWord(e.target.value)} />
    </form>
  );
}

export default CustomEntry
