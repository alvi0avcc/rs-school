import type { Option } from '../utils/storage';
import type { ColoredOption } from '../picker/picker';

export const cleanedList = (
  listOptions: Option[] | undefined,
  shuffle = false
): ColoredOption[] => {
  if (listOptions) {
    let cleanedList: Option[] = listOptions.filter(
      (item) => item.title !== '' && item.weight !== undefined
    );
    if (shuffle) cleanedList = cleanedList.sort(() => Math.random() - 0.5);

    const coloredList: ColoredOption[] = cleanedList.map((element) => ({
      id: element.id,
      title: element.title,
      weight: element.weight,
      color: getRandomColor(),
    }));

    return coloredList;
  }

  return [];
};

const getRandomColor = (): string => {
  const r = Math.floor(Math.random() * 256);
  const g = Math.floor(Math.random() * 256);
  const b = Math.floor(Math.random() * 256);
  return `rgb(${r}, ${g}, ${b})`;
};
