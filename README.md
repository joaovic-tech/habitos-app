# Habits App

Aplicativo de gerenciamento de hábitos desenvolvido com React Native, TypeScript e Expo.

## Tecnologias

- React Native
- TypeScript
- Expo
- NativeWind
- AsyncStorage
- Phosphor Icons

## Instalação

1. Clone o repositório
2. Instale as dependências:
   ```bash
   npm install
   ```
3. Execute o projeto:
   ```bash
   npx expo start
   ```

## Funcionalidades

- Seleção de hábitos predefinidos
- Configuração de horários para alertas
- Definição de quantidade de alertas diários
- Armazenamento persistente de hábitos
- Exclusão de hábitos com animação
- Suporte a tema claro/escuro

## Estrutura do Projeto

- `/src/app` - Telas do aplicativo
- `/src/components` - Componentes reutilizáveis
- `/src/storage` - Gerenciamento de armazenamento
- `/src/data` - Dados estáticos
- `/src/utils` - Utilitários e helpers

## Como Usar

1. Na tela inicial, clique em "Adicionar Novo Hábito"
2. Selecione um hábito da lista e clique em "Continuar"
3. Configure os horários de início e fim dos alertas
4. Defina a quantidade de alertas por dia
5. Clique em "Adicionar Hábito" para salvar
6. Para excluir um hábito, deslize-o para a esquerda e toque no botão "Excluir"

# 🦷 App de Rastreamento de Hábitos Bucais - UNISAGRADO

Aplicativo mobile desenvolvido para auxiliar pacientes e a comunidade acadêmica da **UNISAGRADO – Centro Universitário Sagrado Coração (Bauru/SP)** no rastreamento e controle de hábitos bucais parafuncionais, como bruxismo, mordida de objetos, entre outros.

---

## 📌 Objetivo do Projeto

- Substituir métodos tradicionais de controle de hábitos por um **aplicativo interativo**.
- Auxiliar a **Universidade de Odontologia da UNISAGRADO** na **coleta de dados para estudos acadêmicos**.
- Proporcionar aos usuários **dicas e conteúdos educativos** sobre saúde bucal.
- Permitir o envio de **relatórios anônimos ou identificados**.
- Facilitar o acompanhamento da **evolução dos hábitos ao longo do tempo**.

## Requisitos do Sistema

| Categoria | Código  | Descrição |
| --------- | ------- | --------- |
| Funcional | RF01    | O usuário deve poder cadastrar um novo hábito, informando título, período de ocorrência e quantidade de alertas diários. |
| Funcional | RF02    | O usuário deve poder selecionar um hábito pré-definido ou criar um hábito personalizado. |
| Funcional | RF03    | O sistema deve exibir uma lista de hábitos cadastrados, mostrando nome, descrição, status (ativo/inativo) e opções de edição/exclusão. |
| Funcional | RF04    | O usuário deve poder ativar/desativar hábitos individualmente através de um componente switch. |
| Funcional | RF05    | O sistema deve emitir alertas ao usuário, conforme a configuração de cada hábito (quantidade e período). |
| Funcional | RF06    | O usuário deve poder excluir hábitos cadastrados. |
| Funcional | RF07    | O usuário deve poder acessar uma tela de informações sobre o app, finalidade, desenvolvedores e termos de uso. |
| Funcional | RF08    | O usuário deve poder acessar e editar seu perfil, incluindo nome, sobrenome, foto e visualizar hábitos ativos/inativos. |
| Funcional | RF09    | O usuário deve poder sair/logout do perfil. |
| Funcional | RF10    | O sistema deve apresentar um questionário/formulário para feedback, permitindo informar hábitos praticados, intensidade de dor (opcional) e opinião sobre o app (obrigatório). |
| Funcional | RF11    | O usuário deve poder navegar entre as telas principais através de um menu de navegação com ícones (info, questionário, hábitos, perfil, troca de tema). |
| Funcional | RF12    | O usuário deve poder alternar entre tema claro e escuro pelo menu. |
| Funcional | RF13    | O usuário deve poder acessar telas de login e cadastro (frontend), com inputs para nome, sobrenome, data de nascimento, email e senha. |
| Funcional | RF14    | O usuário deve poder realizar login via conta Google (frontend). |
| Funcional | RF15    | O sistema deve exibir um botão para adicionar novo hábito na tela de listagem. |
| Funcional | RF16    | O cadastro de hábito deve permitir cancelar a operação e retornar à tela de listagem. |
| Não Funcional | RNF01  | O aplicativo deve ser desenvolvido em React Native com TypeScript, utilizando Expo e Expo Navigation. |
| Não Funcional | RNF02  | Todos os componentes visuais devem ser implementados com NativeCN-UI/NativeWind. |
| Não Funcional | RNF03  | O armazenamento dos hábitos deve ser realizado localmente no dispositivo utilizando AsyncStorage. |
| Não Funcional | RNF04  | O app deve funcionar offline para todas as funcionalidades relacionadas a hábitos. |
| Não Funcional | RNF05  | O frontend deve ser modularizado, com componentes reutilizáveis em components. |
| Não Funcional | RNF06  | O sistema deve seguir princípios de acessibilidade: contraste, legibilidade, tamanho de fonte e navegação por teclado/voz. |
| Não Funcional | RNF07  | A interface deve ser responsiva, adaptando-se a diferentes tamanhos e orientações de tela. |
| Não Funcional | RNF08  | O app deve apresentar boa performance em dispositivos de entrada e intermediários. |
| Não Funcional | RNF09  | O projeto deve seguir uma arquitetura limpa e modular, facilitando manutenção e evolução. |
| Não Funcional | RNF10  | O app deve utilizar a fonte Dosis para todos os textos, com tamanhos: text-base (title), text-sm (subtitle), text-xs (small-text). |
| Não Funcional | RNF11  | O modo escuro deve utilizar a paleta de cores especificada na documentação. |
| Não Funcional | RNF12  | As telas de login e cadastro devem ser apenas frontend, sem lógica de autenticação obrigatória inicialmente. |

---

## 🏛️ Instituição

Este projeto é uma iniciativa acadêmica e tecnológica desenvolvida com apoio da: UNISAGRADO – Centro Universitário Sagrado Coração (Bauru/SP) Curso de Odontologia + Núcleo de Inovação em Tecnologia
