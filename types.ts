import type React from 'react';

export enum GameState {
  Start,
  Playing,
}

export enum Level {
  Normal = 'Normal',
  Dificil = 'Dificil',
}

export enum SignName {
  Adelante = 'Adelante',
  Atras = 'Atrás',
  Derecha = 'Derecha',
  Izquierda = 'Izquierda',
  Frene = 'Frene',
  Gire = 'Gire',
  Saltar = 'Saltar',
  Agacharse = 'Agacharse',
  GirarX2 = 'Girar x2',
  GirarX3 = 'Girar x3',
}

export interface Sign {
  name: SignName;
  keys: string[];
  label: string;
  Icon: React.FC<React.SVGProps<SVGSVGElement>>;
}
