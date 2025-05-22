#!/bin/bash

REPO="joaovic-tech/habitos"

# Criação das labels necessárias
gh label create "design" --repo $REPO --color "1abc9c" --description "Questões relacionadas ao design" || true
gh label create "documentação" --repo $REPO --color "3498db" --description "Documentação do projeto" || true
gh label create "progresso" --repo $REPO --color "f1c40f" --description "Acompanhamento do progresso" || true
gh label create "planejamento" --repo $REPO --color "e67e22" --description "Planejamento do projeto" || true
gh label create "funcional" --repo $REPO --color "2ecc71" --description "Requisito funcional" || true
gh label create "não funcional" --repo $REPO --color "e74c3c" --description "Requisito não funcional" || true
gh label create "feature" --repo $REPO --color "007bff" --description "Nova funcionalidade do app" || true
gh label create "bug" --repo $REPO --color "d73a4a" --description "Erro ou problema no app" || true

# Configurações iniciais de milestones
MILESTONE0_TITLE="Milestone 0: Em construção"
MILESTONE0_DESC="Milestone para controle inicial do projeto, incluindo design do sistema e progresso das telas."
MILESTONE_APP_TITLE="Milestone 1: Requisitos do App"
MILESTONE_APP_DESC="Milestone contendo as issues relacionadas aos requisitos funcionais e não funcionais do app."

# Criar Milestone 0
echo "Criando Milestone 0..."
MILESTONE0_ID=$(gh api -X POST repos/$REPO/milestones -f title="$MILESTONE0_TITLE" -f description="$MILESTONE0_DESC" --jq '.number')

# Criar Milestone para Requisitos do App
echo "Criando Milestone para requisitos do app..."
MILESTONE_APP_ID=$(gh api -X POST repos/$REPO/milestones -f title="$MILESTONE_APP_TITLE" -f description="$MILESTONE_APP_DESC" --jq '.number')

# Criar Issue: Design do sistema na Milestone 0
echo "Criando issue: Design do sistema..."
gh issue create --repo $REPO --title "Design do sistema" --body "
- Cores, fontes e estilos do app.
- Link do Figma: [Design no Figma](https://www.figma.com/design/Itj9iP4Nwc83JwXFOWerJX/Habitos-?node-id=107-283&t=33I2dCbkpaPZ9A17-0)
" --milestone $MILESTONE0_ID --label "design, documentação"

# Criar Issue: Progresso das telas na Milestone 0 com checklist
echo "Criando issue: Progresso das telas..."
gh issue create --repo $REPO --title "Progresso das telas do app" --body "
## Telas criadas
- [ ] Tela 1 - Login
- [ ] Tela 2 - Cadastro
- [ ] Tela 3 - Listagem de hábitos
- [ ] Tela 4 - Cadastro de hábito
- [ ] Tela 5 - Perfil
- [ ] Tela 6 - Informações do app

## Funcionalidades por tela (checkbox para cada requisito)
### Tela 1 - Login
- [ ] RF13 - Inputs para nome, sobrenome, data de nascimento, email e senha
- [ ] RF14 - Login via conta Google

### Tela 3 - Listagem de hábitos
- [ ] RF03 - Exibir lista de hábitos com nome, descrição, status e opções
- [ ] RF15 - Botão para adicionar novo hábito

### Tela 4 - Cadastro de hábito
- [ ] RF01 - Cadastrar novo hábito com título, período e alertas
- [ ] RF16 - Cancelar cadastro e retornar à listagem

### Tela 5 - Perfil
- [ ] RF08 - Editar perfil e visualizar hábitos ativos/inativos
- [ ] RF09 - Logout

### Tela 6 - Informações do app
- [ ] RF07 - Tela de informações sobre o app, desenvolvedores e termos

(Adicione mais telas e funcionalidades conforme o progresso)
" --milestone $MILESTONE0_ID --label "progresso, planejamento"

# Criar issues para alguns requisitos funcionais e não funcionais na Milestone do app (exemplo)
echo "Criando issues para requisitos funcionais e não funcionais..."

gh issue create --repo $REPO --title "RF01: Cadastro de novo hábito" --body "O usuário deve poder cadastrar um novo hábito, informando título, período de ocorrência e quantidade de alertas diários." --milestone $MILESTONE_APP_ID --label "funcional, feature"

gh issue create --repo $REPO --title "RF02: Seleção de hábito pré-definido ou personalizado" --body "O usuário deve poder selecionar um hábito pré-definido ou criar um hábito personalizado." --milestone $MILESTONE_APP_ID --label "funcional, feature"

gh issue create --repo $REPO --title "RF03: Exibir lista de hábitos cadastrados" --body "O sistema deve exibir uma lista de hábitos cadastrados, mostrando nome, descrição, status (ativo/inativo) e opções de edição/exclusão." --milestone $MILESTONE_APP_ID --label "funcional, feature"

gh issue create --repo $REPO --title "RNF01: Desenvolvimento com React Native e TypeScript" --body "O aplicativo deve ser desenvolvido em React Native com TypeScript, utilizando Expo e Expo Navigation." --milestone $MILESTONE_APP_ID --label "não funcional"

gh issue create --repo $REPO --title "RNF02: Componentes visuais com NativeCN-UI/NativeWind" --body "Todos os componentes visuais devem ser implementados com NativeCN-UI/NativeWind." --milestone $MILESTONE_APP_ID --label "não funcional"

gh issue create --repo $REPO --title "RNF03: Armazenamento local com AsyncStorage" --body "O armazenamento dos hábitos deve ser realizado localmente no dispositivo utilizando AsyncStorage." --milestone $MILESTONE_APP_ID --label "não funcional"

echo "Script finalizado. Milestones e issues criados com sucesso."
