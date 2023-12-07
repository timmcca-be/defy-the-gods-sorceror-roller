import React from "react";
import styles from "./App.module.css";

type Spell = {
    name: string;
    matchesRolls: (diceRolls: Array<number>) => boolean;
};

export function App() {
    const [spellSelections, setSpellSelections] = React.useState<
        Array<boolean>
    >(availableSpells.map(() => false));
    const [diceCount, setDiceCount] = React.useState(2);
    const [lastRolls, setLastRolls] = React.useState<Array<number> | null>(
        null
    );

    const matchingSpells = React.useMemo(() => {
        if (lastRolls == null) {
            return [];
        }

        const selectedSpells = availableSpells.filter(
            (_, i) => spellSelections[i]
        );

        return selectedSpells
            .concat(defaultSpells)
            .filter(({ matchesRolls }) => matchesRolls(lastRolls))
            .map(({ name }) => name);
    }, [spellSelections, lastRolls]);

    return (
        <div className={styles.app}>
            {availableSpells.map(({ name }, i) => (
                <label key={name}>
                    <input
                        type="checkbox"
                        checked={spellSelections[i]}
                        onChange={() =>
                            setSpellSelections((prevSelections) => {
                                const selections = [...prevSelections];
                                selections[i] = !selections[i];
                                return selections;
                            })
                        }
                    />
                    {name}
                </label>
            ))}
            <div>
                dice count:{" "}
                <button
                    onClick={() => setDiceCount(diceCount - 1)}
                    disabled={diceCount === 2}
                    aria-label="decrement dice count"
                >
                    -
                </button>
                {diceCount}
                <button
                    onClick={() => setDiceCount(diceCount + 1)}
                    aria-label="increment dice count"
                >
                    +
                </button>
            </div>
            <button
                onClick={() =>
                    setLastRolls(
                        Array(diceCount)
                            .fill(0)
                            .map(() => Math.floor(Math.random() * 6) + 1)
                    )
                }
            >
                roll
            </button>
            {lastRolls && (
                <>
                    <div>
                        {lastRolls
                            .map((value) => value.toString())
                            .reduce((a, b) => a + " " + b)}
                    </div>
                    {matchingSpells.length === 0 ? (
                        "miss :("
                    ) : (
                        <>
                            {lastRolls[0] + lastRolls[1] >= 11 && (
                                <div>burning success!</div>
                            )}
                            <div>can use:</div>
                            <ul>
                                {matchingSpells.map((spellName) => (
                                    <li key={spellName}>{spellName}</li>
                                ))}
                            </ul>
                        </>
                    )}
                </>
            )}
        </div>
    );
}

function hasSubsetMatchingSum(
    values: Array<number>,
    subsetSize: number,
    targetSum: number
): boolean {
    if (subsetSize < 1) {
        throw new Error("subsetSize must be positive");
    }
    if (subsetSize === 1) {
        return values.indexOf(targetSum) !== -1;
    }

    return values.some((value, i) =>
        hasSubsetMatchingSum(
            values.slice(0, i).concat(values.slice(i + 1)),
            subsetSize - 1,
            targetSum - value
        )
    );
}

function hasSequentialSubset(
    values: Array<number>,
    subsetSize: number,
    sequenceStart?: number
): boolean {
    if (subsetSize < 1) {
        throw new Error("subsetSize must be positive");
    }
    if (subsetSize === 1) {
        return sequenceStart == null || values.indexOf(sequenceStart) !== -1;
    }

    return values.some(
        (value) =>
            (sequenceStart == null || value === sequenceStart) &&
            hasSequentialSubset(
                // including the current value will never trigger a false positive,
                // since we will only be looking for values exceeding it,
                // so we can just pass down the whole values array instead of slicing it up
                values,
                subsetSize - 1,
                value + 1
            )
    );
}

function hasEqualValues(values: Array<number>, targetNumDice: number): boolean {
    if (targetNumDice < 2) {
        throw new Error("targetNumDice must be >= 2");
    }

    const valueCounts: Record<number, number> = {};
    for (const value of values) {
        valueCounts[value] = (valueCounts[value] ?? 0) + 1;
        if (valueCounts[value] === targetNumDice) {
            return true;
        }
    }

    return false;
}

const defaultSpells: Array<Spell> = [
    {
        name: "Enchant",
        matchesRolls: (diceRolls) => hasSubsetMatchingSum(diceRolls, 2, 6),
    },
    {
        name: "Light and Shadow",
        matchesRolls: (diceRolls) => diceRolls.reduce((a, b) => a + b, 0) <= 6,
    },
    {
        name: "Metamorphosis",
        matchesRolls: (diceRolls) => hasEqualValues(diceRolls, 2),
    },
];

const availableSpells: Array<Spell> = [
    {
        name: "Chaos",
        matchesRolls: (diceRolls) => hasSubsetMatchingSum(diceRolls, 2, 2),
    },
    {
        name: "Scrying",
        matchesRolls: (diceRolls) => hasSubsetMatchingSum(diceRolls, 2, 8),
    },
    {
        name: "Phantasm",
        matchesRolls: (diceRolls) => hasSubsetMatchingSum(diceRolls, 2, 10),
    },
    {
        name: "Might",
        matchesRolls: (diceRolls) => hasSequentialSubset(diceRolls, 2),
    },
    {
        name: "Ensoulment",
        matchesRolls: (diceRolls) => hasSequentialSubset(diceRolls, 3),
    },
    {
        name: "Elements",
        matchesRolls: (diceRolls) => diceRolls.reduce((a, b) => a + b, 0) >= 12,
    },
    {
        name: "Summoning",
        matchesRolls: (diceRolls) => hasEqualValues(diceRolls, 3),
    },
    {
        name: "Shaping",
        matchesRolls: (diceRolls) => hasEqualValues(diceRolls, 4),
    },
    {
        name: "Dreamwalker",
        matchesRolls: (diceRolls) => hasSubsetMatchingSum(diceRolls, 2, 7),
    },
    {
        name: "Chthonic Being",
        matchesRolls: (diceRolls) =>
            diceRolls.filter((roll) => roll === 1).length >= 2,
    },
];
