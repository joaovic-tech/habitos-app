interface Habit {
  name: string;
  description: string;
  messageNotification: string;
}

interface HabitsData {
  habitos: Habit[];
}

export const habitsData: HabitsData = {
  habitos: [
    {
      name: "Bruxismo",
      description: "Apertar ou Ranger os Dentes",
      messageNotification:
        "Lembre-se de relaxar a mandíbula e não apertar os dentes.",
    },
    {
      name: "Onicofagia",
      description: "Roer Unhas",
      messageNotification:
        "Mantenha as mãos longe da boca e evite roer as unhas.",
    },
    {
      name: "Morder Objetos",
      description: "Morder canetas, lápis ou outros objetos",
      messageNotification:
        "Evite morder objetos. Que tal um chiclete sem açúcar?",
    },
    {
      name: "Morder os lábios",
      description: "Morder constantemente os lábios",
      messageNotification:
        "Cuidado para não morder os lábios. Mantenha-os hidratados.",
    },
    {
      name: "Morder as bochechas",
      description: "Morder o interior das bochechas",
      messageNotification:
        "Relaxe a boca e evite morder o interior das bochechas.",
    },
    {
      name: "Projeção Lingual",
      description: "Empurrar a língua contra os dentes",
      messageNotification:
        "Posicione a língua corretamente no céu da boca, atrás dos dentes.",
    },
    {
      name: "Respiração Bucal",
      description: "Respirar pela boca ao invés do nariz",
      messageNotification:
        "Lembre-se de respirar pelo nariz. Isso é importante para sua saúde.",
    },
    {
      name: "Chupar Dedo",
      description: "Manter o hábito de chupar o dedo",
      messageNotification: "Mantenha o dedo longe da boca. Você consegue!",
    },
    {
      name: "Mastigação Unilateral",
      description: "Mastigar apenas de um lado da boca",
      messageNotification:
        "Procure mastigar dos dois lados da boca para um desgaste equilibrado.",
    },
    {
      name: "Ranger de Dentes Diurno",
      description: "Ranger os dentes durante o dia",
      messageNotification:
        "Percebeu que está rangendo os dentes? Relaxe a mandíbula.",
    },
  ],
};
