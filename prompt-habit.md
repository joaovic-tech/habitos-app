Estou desenvolvendo um app de hábitos (parafuncionais) onde o usuário irar criar seu hábito cotidiano e o app irar ajuda-lo a parar com esse hábito. O app vai ser meio que um sistema de alertas que irar alerta ele a parar de tantos e tantos tempo. Vamos supor que um usuário tem Bruxismo então ele vai criar esse hábito no app com essas informações:

titulo: Bruxismo
período: das 08:00 até as 21:00
quantidade de alertas: 4 / dia

com essas informações o app irar saber quantas vezes tera que alerta o usuário para ele não fazer o determinado hábito.

com isso, crie um aplicativo react native usando typescript (expo-navigator) com nativecn-ui/nativewind que terar esses requisitos:

frontend:

- Criar componentes separados em src/components
- Os componentes deverão ser todos do nativecn
- Cadastro de novo hábito
 	- Deverar ser um componente onde aparecera na tela de listagem quando o usuario clicar em "adicionar"
  		- icone de X para cancelar o cadastro e voltar para o src/app/Habits.tsx
  		- nessa tela o usuario irar selecionar um habito pré definido ou um outro habito que ele mesmo definirar o titulo
  		- depois que escolher irar definir o periodo do habito e quantidade e alertas [2, 4 ou 6]
  		- botão de adicionar
- tela de Informações - src/app/Info.tsx
 	- informações sobre o app
 	- quem desenvolveu
 	- qual a finalidade
 	- link para termos e etc
- tela de questionário (formulario) src/app/Quest.tsx ou src/app/Form.tsx
 	- Escolher qual dos seus habito praticou (opcional)
 	- Escolher qual a intensidade de dor do habito  (opcional)
 	- o que ele está achando do app  (obrigatorio)
- tela de listagem de habitos: src/app/Habits.tsx
 	- Nome do habito
 	- Descrição do habito
 	- Componente de switch para saber se está ativo ou não
 	- Botão de trash para exclusão
 	- depois da lista de hábitos irar ter um botão para adicionar um novo hábito
- tela de perfil - src/app/Profile.tsx
 	- imagem do usuario
 	- Nome do usuário
 	- E-mail do usuario
 	- habitos ativos/inativos
 	- botão de editar perfil (abri um modal)
  		- icone de seta para a esquerda para cancelar a edição
  		- modal para editar o nome de sobrenome
  		- trocar a foto de perfil
  		- botão de salvar
 	- botão de sair/logout
- tela de Login - src/app/Login.tsx
 	- botão para entrar com o goole
 	- input de email
 	- input de senha
 	- botão para entrar
- tela de Register - src/app/Register.tsx
 	- input de nome e sobrenome
 	- data de nascimento
 	- input de email
 	- input de senha
 	- botão para registrar
- Menu de navegação:
 	- icone de informações
 	- icone de questionário
 	- icone de alerta (componente de listagem de hábitos)
 	- icone de user (onde irar mostrar seu perfil)
  		- Caso o usuário não estiver logado irar aparecer a tela de src/app/login
 	- icone de troca de tema (sol/lua)
 
dados dos habito deverar ser salvos em armazenamento local do celular (por em quanto)
tela de login e register somente o frontend não precisar criar a logica por enquanto pois o login é opcional

Implementar acessibilidade (fontes, contraste, etc.)

### 🎨 Cores para o mode dark

| Uso               | Valor HEX        |
|-------------------|------------------|
| Primária          | `#155DFC`        |
| Secundária        | `#03A9F4`        |
| Terciária         | `#002A86`        |
| Texto             | `#FFFAFF`        |
| Texto 2           | `#6D6E71`        |
| Back              | `#121214`        |
| Back 2            | `#1A1A1E`        |
| Back 2            | `#202024`        |

---

### 🔤 Tipografia

- **Fonte principal:** `Dosis`

#### 📏 Tamanhos

| Descrição | Tamanho |
|-----------|---------|
| title      | text-base  |
| subtitle   | text-sm    |
| small-text | text-xs    |
