interface Habit {
  name: string;
  description: string;
}

interface HabitsData {
  habitos: Habit[];
}

export const habitsData: HabitsData = {
  habitos: [
    {
      name: "Bruxismo",
      description: "Apertar ou Ranger os Dentes"
    },
    {
      name: "Onicofagia",
      description: "Roer Unhas"
    },
    {
      name: "Morder Objetos",
      description: "Morder canetas, lápis ou outros objetos"
    },
    {
      name: "Morder os lábios",
      description: "Morder constantemente os lábios"
    },
    {
      name: "Morder as bochechas",
      description: "Morder o interior das bochechas"
    },
    {
      name: "Projeção Lingual",
      description: "Empurrar a língua contra os dentes"
    },
    {
      name: "Respiração Bucal",
      description: "Respirar pela boca ao invés do nariz"
    },
    {
      name: "Chupar Dedo",
      description: "Manter o hábito de chupar o dedo"
    },
    {
      name: "Mastigação Unilateral",
      description: "Mastigar apenas de um lado da boca"
    },
    {
      name: "Mordedura de Objetos",
      description: "Morder canetas, lápis ou outros objetos"
    },
    {
      name: "Ranger de Dentes Diurno",
      description: "Ranger os dentes durante o dia"
    }
  ]
};
