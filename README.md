#  GymFlow — App de Treino & Gestão Fitness

O **GymFlow** é um aplicativo mobile desenvolvido em **React Native com Expo** e backend no **Supabase**, projetado para atletas e treinadores gerenciarem treinos organizados, acompanharem alunos e registrarem a evolução de cargas com resultados reais.

O design do projeto é baseado em um protótipo de alta fidelidade desenvolvido no **Figma**, com identidade visual moderna, paleta escura esportiva com verde esmeralda (`#16A34A`) e navegação intuitiva.

---

## 👥 Estrutura da Equipe & Branches (GitFlow)

O projeto adota o modelo de versionamento **GitFlow**, com as branches principais `main` (produção) e `develop` (integração). Cada integrante é responsável por uma branch de feature independente:

| Integrante | Branch | Telas Figma | Escopo e Responsabilidades |
| :--- | :--- | :---: | :--- |
| **👤 Gustavo** | `feature/login` | **Telas 1 e 2** | **Autenticação, Sessão & Dashboard:** Tela de Splash/Boas-vindas, autenticação completa (Login, Cadastro e Modo Convidado), estrutura base da barra de navegação (Bottom Tabs) e Dashboard com KPI cards e treinos recentes. |
| **👤 Ícaro** | `feature/workout-builder` | **Telas 5, 6 e 7** | **Criador de Treinos (Wizard 3 Etapas):** Stepper numerado de progresso, seleção de aluno com radio button, listagem de exercícios com seleção múltipla (checkboxes) e configuração fina de cargas (kg), repetições e tempo de descanso. |
| **👤 Guilherme** | `feature/exercises` | **Telas 3 e 4** | **Catálogo & Cadastro de Exercícios:** Catálogo filtrável por chips de grupo muscular, busca em tempo real com debounce e formulário de cadastro de novo exercício com captura de imagem via câmera/galeria. |
| **👤 Jeann** | `feature/workout-tracker` | **Telas 8 e 9** | **Acompanhamento ao Vivo & Evolução:** Tela de treino ativo com contagem de séries, barra de progresso da sessão, cronômetro de descanso com alertas e tela de métricas com gráficos de evolução de carga e Recordes Pessoais (PRs). |

---

##  Conteúdos de React Native Aplicados no Projeto

O projeto contempla todos os tópicos fundamentais do desenvolvimento mobile:

* **Persistência de Dados Local:**
  * Uso do `@react-native-async-storage/async-storage` para persistência de tokens de autenticação, cache offline de exercícios favoritos e salvamento de rascunhos de treinos em andamento.
* **Requisição de Web Services:**
  * Integração com **Supabase** via API REST para autenticação de usuários, carregamento de métricas em tempo real e operações completas de CRUD (Create, Read, Update, Delete) de alunos, exercícios e treinos.
* **Notificações:**
  * Implementação de notificações locais com `expo-notifications`, acionadas em segundo plano para avisar o término do tempo de descanso entre séries e lembretes de treinos agendados.
* **Navegação Avançada:**
  * Utilização do `@react-navigation/bottom-tabs` para as 5 abas principais (*Início*, *Alunos*, *Exercícios*, *Treinos*, *Mais*) e `@react-navigation/native-stack` para transição entre telas e modais.
* **Hooks (Nativos e Customizados):**
  * Hooks do React (`useState`, `useEffect`, `useCallback`, `useMemo`) aliados a Custom Hooks que isolam as regras de negócio da interface: `useAuth`, `useDashboard`, `useCriadorTreino`, `useExercises` e `useRestTimer`.
* **Componentes Dinâmicos & Listas:**
  * Uso de `FlatList` otimizada, Stepper dinâmico de etapas, chips selecionáveis de filtro, checkboxes customizados, barras de progresso reativas e gráficos visuais.
* **Acesso a Recursos de Hardware:**
  * Integração com `expo-image-picker` para captura e upload de fotos direto da câmera ou galeria do dispositivo no cadastro de exercícios.

---


