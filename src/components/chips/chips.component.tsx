import {FC, useState} from "react";
import styles from "./chips.component.styles.module.css";

export interface IChipsProps {
  items: IChip[];
  onItemClick: (id: string) => void;
}

export interface IChip {
  id: string;
  title: string;
}

export const ChipsComponent: FC<IChipsProps> = ({ items, onItemClick }) => {
  const [selectedChip, setSelectedChip] = useState(items[0])

  const handleChangeChip = (id: string): void => {
    const targetChip: IChip | undefined = items.find((item) => item.id === id);

    if (!targetChip) {
      throw new Error('Selected chip not exist in props');
    }

    setSelectedChip(targetChip);
    onItemClick(targetChip.id);
  }

  return (
    <div className={styles.chipList}>
      {items.map((item: IChip, idx: number) => {
        return <div
          key={idx}
          onClick={() => handleChangeChip(item.id)}
          className={`${styles.chip} ${selectedChip.id === item.id ? styles.activeWrapper : styles.inActiveWrapper}`}
        >
          <p className={`regularText text12 ${selectedChip.id === item.id ? styles.activeText : '' }`}>{item.title}</p>
        </div>
      })}
    </div>
  )
}
