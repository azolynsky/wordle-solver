import { Word } from "../App";
import _ from "lodash";
import { getPossibleSolutions } from "./solutionService";
import wordList from "./wordList.json";

type WeightedAlphabet = WeightedLetter[];
type WeightedMatrix = WeightedAlphabet[];

// this must be positive or the correct answer will end up having value 0.
const KNOWN_LETTER_WEIGHT = 0.1;
const IGNORE_KNOWN_LETTERS = true;

type WeightedLetter = {
  letter: string;
  weight: number;
};

export function getOptimalAnswers(words: Word[]): string[] {
  const possibleSolutions = getPossibleSolutions(words);

  // the system tries to answer with 100% certainty.
  // since it will take 2 moves to get to the correct answer with 2 possible solutions,
  // it's best to guess one of them and maybe get lucky.
  if (possibleSolutions.length === 2) return possibleSolutions;

  let weightedAnswers = weighAnswers(possibleSolutions);
  let sortedAnswers = _.orderBy(weightedAnswers, (wa) => wa.weight, "desc");
  return sortedAnswers.map((wa) => wa.word);
}

function weighMatrix(words: string[]): WeightedMatrix {
  let weightedMatrix: WeightedMatrix = [[], [], [], [], []];

  _.forEach(words, (word) => {
    _.forEach(word, (l, i) => {
      let alphabetLetter = _.find(
        weightedMatrix[i],
        (alphabetLetter) => alphabetLetter.letter === l
      );
      if (alphabetLetter === undefined) {
        weightedMatrix[i] = [
          ...weightedMatrix[i],
          { letter: l, weight: 1 } as WeightedLetter,
        ];
      } else {
        let alphabetLetter = _.find(
          weightedMatrix[i],
          (alphabetLetter) => alphabetLetter.letter === l
        );
        if (alphabetLetter) alphabetLetter.weight++;
      }
    });
  });

  if (IGNORE_KNOWN_LETTERS) {
    // critical: we want to try to get the weight to be as close to 99% as possible.
    // a certain letter being featured every time is just as useless as it being featured 0 times.
    _.forEach(weightedMatrix, (letterPosition) => {
      _.forEach(letterPosition, (letterWeight) => {
        if (letterWeight.weight === words.length) {
          letterWeight.weight = KNOWN_LETTER_WEIGHT;
        }
      });
    });
  }

  return weightedMatrix;
}

const convertMatrixToWeightedAlphabet = (matrix: WeightedMatrix) => {
  let returnAlphabet = [] as WeightedAlphabet;
  let concatenatedWeights = [
    ...matrix[0],
    ...matrix[1],
    ...matrix[2],
    ...matrix[3],
    ...matrix[4],
  ];

  _.forEach(concatenatedWeights, (matrixWeight) => {
    let alphabetWeight = _.find(
      returnAlphabet,
      (alphabetWeight) => alphabetWeight.letter === matrixWeight.letter
    );
    if (!alphabetWeight) {
      returnAlphabet = [...returnAlphabet, matrixWeight];
    } else {
      if (
        alphabetWeight.weight === KNOWN_LETTER_WEIGHT ||
        matrixWeight.weight === KNOWN_LETTER_WEIGHT
      ) {
        alphabetWeight.weight = KNOWN_LETTER_WEIGHT;
      } else {
        alphabetWeight.weight += matrixWeight.weight;
      }
    }
  });

  return returnAlphabet;
};

type WeightedWord = {
  word: string;
  weight: number;
};

function weighAnswers(possibleSolutions: string[]): WeightedWord[] {
  let possibleAnswers = wordList;

  const weightedMatrix = weighMatrix(possibleSolutions);
  const weightedAlphabet = convertMatrixToWeightedAlphabet(weightedMatrix);

  let weightedAnswers: WeightedWord[] = [];

  _.forEach(possibleAnswers, (answer) => {
    let weightedAnswer: WeightedWord = { word: answer, weight: 0 };

    let uniqWord = _.uniq(answer);

    _.forEach(uniqWord, (letter) => {
      const alphabetLetter = _.find(
        weightedAlphabet,
        (alphabetLetter) => alphabetLetter.letter === letter
      );
      if (alphabetLetter) weightedAnswer.weight += alphabetLetter.weight * 10;
    });

    weightedAnswers = [...weightedAnswers, weightedAnswer];
  });

  _.forEach(weightedAnswers, (Word) => {
    Word.word.split("").forEach((letter, i) => {
      const matrixLetterWeight = _.find(
        weightedMatrix[i],
        (matrixWeight) => matrixWeight.letter === letter
      );
      if (matrixLetterWeight !== undefined) {
        Word.weight += matrixLetterWeight.weight;
      }
    });
  });

  return weightedAnswers;
}
