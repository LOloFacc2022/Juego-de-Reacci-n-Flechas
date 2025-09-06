import {
  ArrowUpIcon,
  ArrowDownIcon,
  ArrowRightIcon,
  ArrowLeftIcon,
  StopIcon,
  TurnIcon,
  JumpIcon,
  CrouchIcon,
  TurnX2Icon,
  TurnX3Icon
} from './components/icons';
import { Sign, SignName, Level } from './types';

export const GAME_DURATION = 60; // seconds

export const LEVEL_1_SIGNS: Sign[] = [
  {
    name: SignName.Adelante,
    keys: ['ArrowUp', 'w', 'W'],
    label: 'Adelante (↑)',
    Icon: ArrowUpIcon
  },
  {
    name: SignName.Atras,
    keys: ['ArrowDown', 's', 'S'],
    label: 'Atrás (↓)',
    Icon: ArrowDownIcon
  },
  {
    name: SignName.Derecha,
    keys: ['ArrowRight', 'd', 'D'],
    label: 'Derecha (→)',
    Icon: ArrowRightIcon
  },
  {
    name: SignName.Izquierda,
    keys: ['ArrowLeft', 'a', 'A'],
    label: 'Izquierda (←)',
    Icon: ArrowLeftIcon
  },
  {
    name: SignName.Frene,
    keys: [' ', 'f', 'F'],
    label: 'Frene (Espacio)',
    Icon: StopIcon
  },
  {
    name: SignName.Gire,
    keys: ['g', 'G', 'r', 'R'],
    label: 'Gire (G)',
    Icon: TurnIcon
  },
];

const NEW_LEVEL_2_SIGNS: Sign[] = [
    {
        name: SignName.Saltar,
        keys: ['j', 'J'],
        label: 'Saltar (J)',
        Icon: JumpIcon,
    },
    {
        name: SignName.Agacharse,
        keys: ['c', 'C'],
        label: 'Agacharse (C)',
        Icon: CrouchIcon,
    },
    {
        name: SignName.GirarX2,
        keys: ['2'],
        label: 'Girar x2 (2)',
        Icon: TurnX2Icon,
    },
    {
        name: SignName.GirarX3,
        keys: ['3'],
        label: 'Girar x3 (3)',
        Icon: TurnX3Icon,
    },
];

export const LEVEL_2_SIGNS: Sign[] = [...LEVEL_1_SIGNS, ...NEW_LEVEL_2_SIGNS];

export const SIGNS_BY_LEVEL: Record<Level, Sign[]> = {
  [Level.Normal]: LEVEL_1_SIGNS,
  [Level.Dificil]: LEVEL_2_SIGNS,
};
