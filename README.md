# 🦷 App de Rastreamento de Hábitos Bucais - UNISAGRADO

Aplicativo mobile desenvolvido para auxiliar pacientes e a comunidade acadêmica da **UNISAGRADO – Centro Universitário Sagrado Coração (Bauru/SP)** no rastreamento e controle de hábitos bucais parafuncionais, como bruxismo, mordida de objetos, entre outros.

---

## 📌 Objetivo do Projeto

- Substituir métodos tradicionais de controle de hábitos por um **aplicativo interativo**.
- Auxiliar a **Universidade de Odontologia da UNISAGRADO** na **coleta de dados para estudos acadêmicos**.
- Proporcionar aos usuários **dicas e conteúdos educativos** sobre saúde bucal.
- Permitir o envio de **relatórios anônimos ou identificados**.
- Facilitar o acompanhamento da **evolução dos hábitos ao longo do tempo**.

---

## 🧱 Estrutura do Projeto

O projeto segue uma arquitetura modular e escalável, baseada em separação de responsabilidades e reutilização de componentes.

```bash
habitos/
├── App.tsx              # Ponto de entrada da aplicação
├── src/
│   ├── @types/              # Tipos globais TypeScript
│   ├── api/                 # Integrações com Firebase ou backend
│   ├── assets/              # Imagens, ícones e fontes
│   ├── components/          # Componentes reutilizáveis da UI
│   │   ├── Header/
│   │   ├── Button/
│   │   ├── Card/
│   │   └── ...
│   ├── screens/             # Telas principais da aplicação
│   ├── services/            # Lógica de autenticação, armazenamento, notificações
│   ├── theme/               # Tema global de cores e tipografia
│   ├── utils/               # Funções auxiliares reutilizáveis
```

---

## 🎨 Cores

| Uso               | Valor HEX       | Preview |
|-------------------|-----------------|--------------|
| Primária          | `#F5841A`        | ![#F5841A](https://dummyimage.com/20/F5841A/000000?text=+) |
| Secundária        | `#7C9AD6`        | ![#7C9AD6](https://dummyimage.com/20/7C9AD6/000000?text=+) |
| Terciária         | `#516B9D`        | ![#516B9D](https://dummyimage.com/20/516B9D/000000?text=+) |
| Fundo claro       | `#FFFAFF`        | ![#FFFAFF](https://dummyimage.com/20/FFFAFF/000000?text=+) |
| Fundo escuro      | `#111315`        | ![#111315](https://dummyimage.com/20/111315/FFFFFF?text=+) |
| Texto principal   | `#6D6E71`        | ![#6D6E71](https://dummyimage.com/20/6D6E71/000000?text=+) |
| Texto secundário  | `#777777`        | ![#777777](https://dummyimage.com/20/777777/000000?text=+) |

---

## 🔤 Tipografia

- **Fonte principal:** `Dosis`

#### 📏 Tamanhos

| Descrição | Tamanho |
|-----------|---------|
| Pequeno   | `14px`  |
| Médio     | `16px`  |
| Grande    | `18px`  |
| Extra     | `24px`  |

---

## 🧩 Como criar novos componentes

Para manter a organização do projeto e facilitar a escalabilidade aqui está uma dica de como criar um novo componente para aplicação:

- Dentro da pasta `src/components` Crie uma nova pasta com o nome do componente desejado aqui está o passo a passo `(via terminal)`:
- - ```bash
    mkdir MyComponent
    touch MyComponent/index.tsx
    touch MyComponent/styles.ts
    ```
- Estrutura base:
- - ```tsx
    // index.tsx
    import React from 'react';
    import { Container, Title } from './styles';
    
    type Props = {
      title: string;
    }
    
    export function MyComponent({ title }: Props) {
      return (
        <Container>
          <Title>{title}</Title>
        </Container>
      );
    }

    ```
> ❗️ Para os estilos evite usar styled-components direto no index.tsx. Sempre crie um styles.ts.
```tsx
// styles.ts
import styled from 'styled-components/native';

export const Container = styled.View`
  padding: 16px;
  background-color: ${({ theme }) => theme.COLORS.LIGHT};
`;

export const Title = styled.Text`
  color: ${({ theme }) => theme.COLORS.TEXT_DARK};
  font-size: ${({ theme }) => theme.FONT_SIZE.MD}px;
  font-family: ${({ theme }) => theme.FONT_FAMILY.BOLD};
`;

```

---

## 🏛️ Instituição

Este projeto é uma iniciativa acadêmica e tecnológica desenvolvida com apoio da: UNISAGRADO – Centro Universitário Sagrado Coração (Bauru/SP) Curso de Odontologia + Núcleo de Inovação em Tecnologia
