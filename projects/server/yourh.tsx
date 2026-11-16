import "server-only";
import "./yourh.css";
import { CaseDivider } from "@/components/cases/case-media";
import { CaseVideo } from "@/components/cases/case-video";
import { CaseDecisions } from "@/components/cases/case-decisions";
import { CaseNavigation } from "@/components/cases/case-navigation";
import { CaseIntro } from "@/components/cases/case-intro";
import { CaseContentRow } from "@/components/cases/case-content-row";
import { CaseCaption } from "@/components/cases/case-caption";
import { HomeFooter } from "@/components/home/home-footer";
import { homeTextFont, homeTitleFont } from "@/components/home/fonts";
import { YouRHAccessComparison } from "./yourh-access-comparison";

const imgSearch = "/api/cases/educacao-corporativa/files/imgSearch.svg";
const imgCirclePlay = "/api/cases/educacao-corporativa/files/imgCirclePlay.svg";
const imgBookOpen = "/api/cases/educacao-corporativa/files/imgBookOpen.svg";

const sections = [
  { id: "yourh-contexto", label: "Contexto" },
  { id: "yourh-investigacao", label: "Investigação e diagnóstico" },
  { id: "yourh-solucoes", label: "Soluções relevantes" },
  { id: "yourh-entrega", label: "Entrega e aprendizados" },
] as const;

/* eslint-disable @next/next/no-img-element */
export default function YouRHContent() {
  return <div lang="pt-BR" style={{ "--case-title-font": homeTitleFont.style.fontFamily } as React.CSSProperties} className={`portfolio-home yourh-case ${homeTextFont.className} bg-home-white text-home-brown min-h-screen`}>
    <CaseNavigation items={sections} />
    <main id="conteudo" className="content-stretch flex flex-col gap-[56px] items-start justify-center case-main relative shrink-0 w-full" data-node-id="131:11431">
        <CaseIntro id="yourh-contexto" nodeId="131:11432">
          <div className="md:col-span-4 content-stretch flex items-start justify-self-stretch relative self-stretch shrink-0" data-node-id="131:11433" data-name="Name">
            <h1 id="yourh-contexto-title" className="[word-break:break-word] case-title font-normal leading-[68px] relative shrink-0 text-[48px] text-[color:var(--brown,#3a230a)] " data-node-id="131:11434">
              YouRH
            </h1>
          </div>
          <div className="[word-break:break-word] md:col-span-8 content-stretch flex flex-col gap-[24px] items-center justify-center justify-self-stretch relative self-start shrink-0" data-node-id="131:11435" data-name="About">
            <div className=" font-normal leading-[0] relative shrink-0 text-[16px] text-[color:var(--brown-lighter,#6d563d)] w-full" data-node-id="131:11436">
              <p className="leading-[24px] mb-[8px]">A YouRH queria transformar sua plataforma de educação corporativa em uma experiência mais moderna, com inteligência artificial, gamificação e novas possibilidades de aprendizagem. Mas havia um problema: antes de incorporar novas funcionalidades, a plataforma precisava resolver dificuldades muito mais básicas de usabilidade.</p>
              <p className="leading-[24px]">Durante seis meses, fui responsável por repensar essa experiência, desde a forma como os colaboradores encontravam treinamentos até como assistiam às aulas e acompanhavam seu progresso.</p>
            </div>
            <div className="content-stretch flex gap-[56px] items-center relative shrink-0 w-full " data-node-id="131:11437" data-name="Infos">
              <div className="content-stretch flex flex-col gap-[4px] items-start justify-center relative shrink-0" data-node-id="131:11438">
                <CaseCaption nodeId="131:11439" variant="metadata">[ Papel ]</CaseCaption>
                <p className=" font-normal leading-[0] relative shrink-0 text-[16px] text-[color:var(--brown,#3a230a)]" data-node-id="131:11440">
                  <span className="leading-[24px]">Product Designe</span>
                  <span className="leading-[24px]">r</span>
                </p>
              </div>
              <div className="content-stretch flex flex-col gap-[4px] items-start justify-center relative shrink-0" data-node-id="131:11441">
                <CaseCaption nodeId="131:11442" variant="metadata">[ Duração ]</CaseCaption>
                <p className=" font-normal leading-[24px] relative shrink-0 text-[16px] text-[color:var(--brown,#3a230a)]" data-node-id="131:11443">
                  Jan. 2026 - Jul. 2026
                </p>
              </div>
              <div className="content-stretch flex flex-col gap-[4px] items-start justify-center relative shrink-0" data-node-id="131:11444">
                <CaseCaption nodeId="131:11445" variant="metadata">[ Escopo ]</CaseCaption>
                <p className=" font-normal leading-[24px] relative shrink-0 text-[16px] text-[color:var(--brown,#3a230a)]" data-node-id="131:11446">
                  Definição · Protótipos · Especificações do produto
                </p>
              </div>
            </div>
          </div>
        </CaseIntro>
        <figure className="yourh-hero" data-node-id="134:11647"><CaseVideo slug="educacao-corporativa" filename="video-educorp-01.mp4" label="Visão geral da plataforma de educação corporativa" /></figure>
        <div className="content-stretch flex gap-[40px] items-start relative shrink-0 w-full" data-node-id="131:11448" data-name="Context">
          <div className="content-stretch flex flex-[1_0_0] flex-col gap-[16px] items-start min-w-px relative" data-node-id="131:11449" data-name="Text Div">
            <div className="content-stretch flex flex-col gap-[8px] items-start justify-center relative shrink-0 w-full" data-node-id="131:11450" data-name="Section Title">
              <CaseCaption nodeId="131:11451" variant="section">[ Contexto ]</CaseCaption>
            </div>
            <div className="[word-break:break-word]  font-normal leading-[0] relative shrink-0 text-[16px] text-[color:var(--brown,#3a230a)] w-full" data-node-id="131:11453">
              <p className="leading-[24px] mb-[8px]">A YouRH oferece soluções digitais para gestão de pessoas, incluindo uma plataforma de educação corporativa para disponibilizar treinamentos e acompanhar o desenvolvimento dos colaboradores.</p>
              <p className="leading-[24px]">Apesar de contar com diversas funcionalidades, a plataforma apresentava problemas de navegação, organização e consistência visual, dificultando desde a experiência de aprendizagem até a gestão dos treinamentos. A Laon foi contratada para redesenhar essa experiência, tornando-a mais intuitiva e consistente.</p>
            </div>
          </div>
          <span className="case-decision-rule" aria-hidden="true" />
          <div className="content-stretch flex flex-[1_0_0] flex-col gap-[16px] items-start min-w-px relative" data-node-id="131:11454" data-name="Text Div">
            <div className="content-stretch flex flex-col gap-[8px] items-start justify-center relative shrink-0 w-full" data-node-id="131:11455" data-name="Section Title">
              <CaseCaption nodeId="131:11456" variant="section">[ Desafio ]</CaseCaption>
            </div>
            <div className="[word-break:break-word]  font-normal leading-[0] relative shrink-0 text-[16px] text-[color:var(--brown,#3a230a)] w-full" data-node-id="131:11458">
              <p className="leading-[24px] mb-[8px]">O primeiro contato com a plataforma mostrou que os problemas iam além da aparência. Era necessário repensar fluxos, interações e estruturas já consolidadas, sem comprometer o funcionamento do produto.</p>
              <p className="leading-[24px]">Ao mesmo tempo, havia expectativas diferentes: enquanto a liderança desejava incorporar IA e gamificação, a equipe técnica priorizava resolver problemas existentes. O desafio era equilibrar essas necessidades, identificando o que realmente precisava mudar e propondo soluções viáveis dentro do escopo do projeto.</p>
            </div>
          </div>
          <span className="case-decision-rule" aria-hidden="true" />
          <div className="content-stretch flex flex-[1_0_0] flex-col gap-[16px] items-start min-w-px relative" data-node-id="131:11595" data-name="Text Div">
            <div className="content-stretch flex flex-col gap-[8px] items-start justify-center relative shrink-0 w-full" data-node-id="131:11596" data-name="Section Title">
              <CaseCaption nodeId="131:11597" variant="section">[ Meu papel ]</CaseCaption>
            </div>
            <div className="[word-break:break-word]  font-normal leading-[0] relative shrink-0 text-[16px] text-[color:var(--brown,#3a230a)] w-full" data-node-id="131:11599">
              <p className="leading-[24px] mb-[8px]">Atuei como a única Product Designer do projeto, responsável pelo diagnóstico de UX, benchmarking, arquitetura da informação, fluxos, protótipos de alta fidelidade e especificações funcionais.</p>
              <p className="leading-[24px]">Com apoio de um Key Account Manager da Laon, trabalhei diretamente com o time de produto e tecnologia da YouRH em validações semanais. Também colaborei com a equipe de Sucesso do Cliente para incorporar necessidades reais dos clientes e orientar a priorização das melhorias.</p>
            </div>
          </div>
        </div>
        <CaseDivider />
        <div id="yourh-investigacao" className="content-stretch flex flex-col gap-[40px] items-start relative shrink-0 w-full" data-node-id="131:11619">
          <div className="content-stretch flex flex-col gap-[16px] items-start relative shrink-0 w-full" data-node-id="131:11464">
            <CaseCaption nodeId="131:11465" variant="section">[ Investigação e diagnóstico ]</CaseCaption>
            <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-node-id="131:11466">
              <CaseContentRow nodeId="131:11467">
                <div className="md:col-span-4 content-stretch flex items-center justify-self-stretch relative self-start shrink-0" data-node-id="131:11468">
                  <h2 className="[word-break:break-word] flex-[1_0_0] case-title font-semibold leading-[36px] min-w-px relative text-[24px] text-[color:var(--brown,#3a230a)]" data-node-id="131:11469">
                    Como eu identifiquei os problemas antes de propor as soluções
                  </h2>
                </div>
                <div className="md:col-span-8 content-stretch flex flex-col items-center justify-center justify-self-stretch relative self-start shrink-0" data-node-id="131:11470">
                  <div className="[word-break:break-word]  font-normal leading-[0] relative shrink-0 text-[16px] text-[color:var(--brown,#3a230a)] w-full" data-node-id="131:11471">
                    <p className="leading-[24px] mb-[8px]">Sem dados consolidados sobre as dificuldades dos usuários, comecei explorando a plataforma existente para entender seus fluxos, limitações e oportunidades de melhoria.</p>
                    <p className="leading-[24px] mb-[8px]">Em paralelo, conduzi um benchmarking de plataformas educacionais, analisando padrões de navegação, organização de conteúdos e funcionalidades que poderiam melhorar a experiência da YouRH. A pesquisa tinha dois objetivos: identificar soluções familiares aos usuários e questionar funcionalidades ou estruturas que já não faziam sentido.</p>
                    <p className="leading-[24px]">Esse processo revelou problemas importantes na jornada de aprendizagem, principalmente na descoberta de treinamentos, na continuidade dos estudos e na experiência durante as aulas. Os achados se tornaram o ponto de partida para as primeiras propostas de redesign.</p>
                  </div>
                </div>
              </CaseContentRow>
            </div>
          </div>
          <CaseDecisions nodeId="131:11605" className="case-decisions bg-[var(--subtle,#f8f7f4)] content-stretch flex flex-col items-start p-[32px] relative rounded-[16px] shrink-0 w-full">
            <div className="content-stretch flex gap-[40px] items-start relative shrink-0 w-full" data-node-id="131:11607">
              <div className="content-stretch flex flex-[1_0_0] flex-col gap-[24px] items-start min-w-px relative" data-node-id="131:11608">
                <div className="relative shrink-0 size-[24px]" data-node-id="131:11622" data-name="search">
                  <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgSearch} />
                </div>
                <div className="[word-break:break-word] content-stretch flex flex-col gap-[8px] items-start relative shrink-0 w-full" data-node-id="131:11627">
                  <h3 className="case-title font-semibold leading-[30px] relative shrink-0 text-[20px] text-[color:var(--brown,#3a230a)] w-full" data-node-id="131:11609">
                    Descobrir conteúdos era trabalhoso
                  </h3>
                  <p className=" font-normal leading-[22px] relative shrink-0 text-[14px] text-[color:var(--brown-lighter,#6d563d)] w-full" data-node-id="131:11610">
                    A pesquisa exigia termos exatos e a organização dos treinamentos dificultava a exploração do catálogo.
                  </p>
                </div>
              </div>
              <span className="case-decision-rule" aria-hidden="true" />
              <div className="content-stretch flex flex-[1_0_0] flex-col gap-[24px] items-start min-w-px relative" data-node-id="131:11612">
                <div className="relative shrink-0 size-[24px]" data-node-id="131:11631" data-name="circle-play">
                  <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgCirclePlay} />
                </div>
                <div className="[word-break:break-word] content-stretch flex flex-col gap-[8px] items-start relative shrink-0 w-full" data-node-id="131:11628">
                  <h3 className="case-title font-semibold leading-[30px] relative shrink-0 text-[20px] text-[color:var(--brown,#3a230a)] w-full" data-node-id="131:11613">
                    Retomar um curso exigia procurar novamente
                  </h3>
                  <p className=" font-normal leading-[22px] relative shrink-0 text-[14px] text-[color:var(--brown-lighter,#6d563d)] w-full" data-node-id="131:11614">
                    A plataforma não oferecia uma maneira direta de continuar um treinamento em andamento.
                  </p>
                </div>
              </div>
              <span className="case-decision-rule" aria-hidden="true" />
              <div className="content-stretch flex flex-[1_0_0] flex-col gap-[24px] items-start min-w-px relative" data-node-id="131:11616">
                <div className="relative shrink-0 size-[24px]" data-node-id="131:11634" data-name="book-open">
                  <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgBookOpen} />
                </div>
                <div className="[word-break:break-word] content-stretch flex flex-col gap-[8px] items-start relative shrink-0 w-full" data-node-id="131:11630">
                  <h3 className="case-title font-semibold leading-[30px] relative shrink-0 text-[20px] text-[color:var(--brown,#3a230a)] w-full" data-node-id="131:11617">
                    Experiência de estudo limitada
                  </h3>
                  <p className=" font-normal leading-[22px] relative shrink-0 text-[14px] text-[color:var(--brown-lighter,#6d563d)] w-full" data-node-id="131:11618">
                    As aulas eram apresentadas essencialmente como vídeos, sem um ambiente dedicado que reunisse os recursos de aprendizagem.
                  </p>
                </div>
              </div>
            </div>
          </CaseDecisions>
        </div>
        <CaseDivider />
        <div id="yourh-solucoes" className="content-stretch flex flex-col gap-[16px] items-start relative shrink-0 w-full" data-node-id="131:11474">
          <CaseCaption nodeId="131:11475" variant="section">[ Solução 1/3 ]</CaseCaption>
          <div className="content-stretch flex flex-col gap-[80px] items-start relative shrink-0 w-full" data-node-id="131:11476">
            <CaseContentRow nodeId="131:11477">
              <div className="md:col-span-4 content-stretch flex items-center justify-self-stretch relative self-start shrink-0" data-node-id="131:11478">
                <h2 className="[word-break:break-word] flex-[1_0_0] case-title font-semibold leading-[36px] min-w-px relative text-[24px] text-[color:var(--brown,#3a230a)]" data-node-id="131:11479">
                  Redesenhando a experiência de aprendizagem
                </h2>
              </div>
              <div className="md:col-span-8 content-stretch flex flex-col items-center justify-center justify-self-stretch relative self-start shrink-0" data-node-id="131:11480">
                <div className="[word-break:break-word]  font-normal leading-[0] relative shrink-0 text-[16px] text-[color:var(--brown,#3a230a)] w-full" data-node-id="131:11481">
                  <p className="leading-[24px] mb-[8px]">A investigação mostrou que os maiores problemas estavam em momentos fundamentais da jornada: encontrar um treinamento, acompanhar uma aula e retomar os estudos.</p>
                  <p className="leading-[24px]">Em vez de apenas atualizar as interfaces existentes, reorganizei essas experiências com base nos problemas identificados e nos padrões observados durante o benchmarking.</p>
                </div>
              </div>
            </CaseContentRow>
            <CaseContentRow nodeId="137:7">
              <div className="[word-break:break-word] lg:col-span-4 content-stretch flex flex-col gap-[16px] items-start justify-center justify-self-stretch relative self-stretch shrink-0 text-[color:var(--brown,#3a230a)]" data-node-id="137:10">
                <h2 className="case-title font-semibold leading-[36px] relative shrink-0 text-[24px] w-full" data-node-id="137:12">
                  Encontrar o conteúdo certo
                </h2>
                <div className=" font-normal leading-[0] relative shrink-0 text-[16px] w-full" data-node-id="137:13">
                  <p className="leading-[24px] mb-[8px]">A busca anterior dependia de termos exatos, dificultando a descoberta de treinamentos. Redesenhei o catálogo com categorias, filtros e uma pesquisa mais flexível, considerando nomes de cursos, instrutores e diferentes formas de escrita.</p>
                  <p className="leading-[24px]">Também defini comportamentos para situações como buscas sem resultados, tornando a experiência mais previsível.</p>
                </div>
              </div>
              <figure className="yourh-video-card yourh-solution-media lg:col-span-8" data-node-id="137:8"><CaseVideo slug="educacao-corporativa" filename="video-educorp-02.mp4" label="Catálogo com categorias, filtros e pesquisa" /></figure>
            </CaseContentRow>
            <CaseContentRow nodeId="235:38" className="yourh-continuity-row">
              <figure className="yourh-video-card yourh-solution-media lg:col-span-8" data-node-id="235:42"><CaseVideo slug="educacao-corporativa" filename="video-educorp-04.mp4" label="Continuidade dos treinamentos na página inicial" /></figure>
              <div className="[word-break:break-word] lg:col-span-4 content-stretch flex flex-col gap-[16px] items-start justify-center justify-self-stretch relative self-stretch shrink-0 text-[color:var(--brown,#3a230a)]" data-node-id="235:39">
                <h2 className="case-title font-semibold leading-[36px] relative shrink-0 text-[24px] w-full" data-node-id="235:40">
                  Continuar de onde parou
                </h2>
                <div className=" font-normal leading-[0] relative shrink-0 text-[16px] w-full" data-node-id="235:41">
                  <p className="leading-[24px] mb-[8px]">Na plataforma original, retomar um treinamento exigia procurá-lo novamente no catálogo, mesmo quando já estava em andamento.</p>
                  <p className="leading-[24px]">Para resolver isso, introduzi uma seção de continuidade na página inicial, destacando os treinamentos iniciados e permitindo que o colaborador retornasse diretamente aos estudos.</p>
                </div>
              </div>
            </CaseContentRow>
            <div className="content-stretch flex flex-col gap-[40px] items-start relative shrink-0 w-full" data-node-id="139:15" data-name="Text Div">
              <CaseContentRow nodeId="139:21">
                <div className="md:col-span-4 content-stretch flex flex-col items-start justify-center justify-self-stretch relative self-start shrink-0" data-node-id="139:22">
                  <h2 className="[word-break:break-word] case-title font-semibold leading-[36px] relative shrink-0 text-[24px] text-[color:var(--brown,#3a230a)] w-full" data-node-id="139:23">
                    Uma experiência dedicada ao aprendizado
                  </h2>
                </div>
                <div className="md:col-span-8 content-stretch flex flex-col items-center justify-center justify-self-stretch relative self-start shrink-0" data-node-id="139:24">
                  <div className="[word-break:break-word]  font-normal leading-[0] relative shrink-0 text-[16px] text-[color:var(--brown,#3a230a)] w-full" data-node-id="139:25">
                    <p className="leading-[24px] mb-[8px]">Antes, assistir a uma aula significava acessar uma tela com um vídeo, sem uma estrutura adequada para acompanhar o conteúdo.</p>
                    <p className="leading-[24px]">Inspirada em plataformas como a Coursera, propus uma sessão de estudos dedicada, reunindo vídeo, navegação entre aulas, materiais complementares, anotações, comentários e avaliações em um único ambiente, com menos distrações.</p>
                  </div>
                </div>
              </CaseContentRow>
              <figure className="yourh-study" data-node-id="139:16"><CaseVideo slug="educacao-corporativa" filename="video-educorp-03.mp4" label="Sessão de estudos com vídeo, materiais, anotações e avaliações" /></figure>
            </div>
          </div>
        </div>
        <CaseDivider />
        <div className="content-stretch flex flex-col gap-[16px] items-start relative shrink-0 w-full" data-node-id="145:32">
          <CaseCaption nodeId="145:33" variant="section">[ Solução 2/3 ]</CaseCaption>
          <div className="content-stretch flex flex-col gap-[80px] items-start relative shrink-0 w-full" data-node-id="145:34">
            <CaseContentRow nodeId="145:35">
              <div className="md:col-span-4 content-stretch flex items-center justify-self-stretch relative self-start shrink-0" data-node-id="145:36">
                <h2 className="[word-break:break-word] flex-[1_0_0] case-title font-semibold leading-[36px] min-w-px relative text-[24px] text-[color:var(--brown,#3a230a)]" data-node-id="145:37">
                  Repensando a lógica de acesso aos treinamentos
                </h2>
              </div>
              <div className="md:col-span-8 content-stretch flex flex-col items-center justify-center justify-self-stretch relative self-start shrink-0" data-node-id="145:38">
                <div className="[word-break:break-word]  font-normal leading-[0] relative shrink-0 text-[16px] text-[color:var(--brown,#3a230a)] w-full" data-node-id="145:39">
                  <p className="leading-[24px] mb-[8px]">Nem todos os problemas estavam na experiência do colaborador. Algumas regras existentes também dificultavam o trabalho dos administradores.</p>
                  <p className="leading-[24px] mb-[8px]">Na plataforma original, colaboradores e treinamentos eram vinculados em um mesmo grupo. Isso tornava a gestão de exceções trabalhosa: liberar um treinamento adicional para uma única pessoa podia exigir a criação de novos grupos e configurações redundantes.</p>
                  <p className="leading-[24px] mb-[8px]">Propus separar os grupos de treinamento, responsáveis por organizar conteúdos, dos grupos de acesso, responsáveis por definir quem poderia acessá-los.</p>
                  <p className="leading-[24px] mb-[8px]">A mudança encontrou resistência inicial, principalmente pela familiaridade da equipe com a estrutura anterior e pelas preocupações técnicas. Para defender a proposta, apresentei cenários concretos comparando as duas abordagens e seus impactos na administração dos treinamentos.</p>
                  <p className="leading-[24px]">Após as discussões, chegamos a um acordo para seguir com a nova estrutura, mantendo a recomendação de validá-la posteriormente com usuários reais.</p>
                </div>
              </div>
            </CaseContentRow>
            <YouRHAccessComparison />
          </div>
        </div>
        <CaseDivider />
        <div className="content-stretch flex flex-col gap-[16px] items-start relative shrink-0 w-full" data-node-id="145:126">
          <CaseCaption nodeId="145:127" variant="section">[ Solução 3/3 ]</CaseCaption>
          <div className="content-stretch flex flex-col gap-[80px] items-start relative shrink-0 w-full" data-node-id="145:128">
            <CaseContentRow nodeId="145:129">
              <div className="md:col-span-4 content-stretch flex items-center justify-self-stretch relative self-start shrink-0" data-node-id="145:130">
                <h2 className="[word-break:break-word] flex-[1_0_0] case-title font-semibold leading-[36px] min-w-px relative text-[24px] text-[color:var(--brown,#3a230a)]" data-node-id="145:131">
                  Equilibrando inovação e prioridades
                </h2>
              </div>
              <div className="md:col-span-8 content-stretch flex flex-col items-center justify-center justify-self-stretch relative self-start shrink-0" data-node-id="145:132">
                <div className="[word-break:break-word]  font-normal leading-[0] relative shrink-0 text-[16px] text-[color:var(--brown,#3a230a)] w-full" data-node-id="145:133">
                  <p className="leading-[24px] mb-[8px]">Além de melhorar a experiência existente, a YouRH queria incorporar inteligência artificial e gamificação à plataforma.</p>
                  <p className="leading-[24px] mb-[8px]">Desenhei duas experiências com IA: um assistente para apoiar os colaboradores durante os estudos e outro para auxiliar na criação de treinamentos. Durante o processo, identificamos questões sobre os limites das respostas, a responsabilidade pelos conteúdos gerados e a certificação dos cursos, que exigiam decisões técnicas e de negócio além do design.</p>
                  <p className="leading-[24px] mb-[8px]">A gamificação, por outro lado, foi adiada. Embora fosse uma prioridade inicial da liderança, defendi que uma experiência de engajamento mais elaborada exigiria uma investigação própria e que, naquele momento, era mais importante consolidar a jornada de aprendizagem.</p>
                  <p className="leading-[24px]">Assim, conseguimos explorar possibilidades de inovação sem perder o foco nas melhorias fundamentais da plataforma.</p>
                </div>
              </div>
            </CaseContentRow>
            <div className="content-stretch flex gap-[24px] items-start relative shrink-0 w-full" data-node-id="145:134" data-name="AI">
              <figure className="yourh-video-card yourh-ai-card" data-node-id="145:135"><CaseVideo slug="educacao-corporativa" filename="video-educorporativa-08.mp4" label="Assistente de inteligência artificial para os estudos" /></figure>
              <figure className="yourh-video-card yourh-ai-card" data-node-id="145:149"><CaseVideo slug="educacao-corporativa" filename="video-educorporativa-07.mp4" label="Inteligência artificial na criação de treinamentos" /></figure>
            </div>
          </div>
        </div>
        <CaseDivider />
        <div id="yourh-entrega" className="content-stretch flex flex-col gap-[24px] items-start relative shrink-0 w-full" data-node-id="151:207">
          <CaseCaption nodeId="151:183" variant="section">[ Entrega e aprendizados ]</CaseCaption>
          <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-node-id="151:180">
            <CaseContentRow nodeId="151:181">
              <div className="md:col-span-4 content-stretch flex flex-col items-start justify-self-stretch relative self-start shrink-0" data-node-id="151:182">
                <h2 className="[word-break:break-word] case-title font-semibold leading-[36px] relative shrink-0 text-[24px] text-[color:var(--brown,#3a230a)] w-full" data-node-id="151:184">
                  Ao final de seis meses, entreguei uma experiência redesenhada, com fluxos, protótipos de alta fidelidade e especificações funcionais
                </h2>
              </div>
              <div className="md:col-span-8 content-stretch flex flex-col items-end justify-center justify-self-stretch relative self-start shrink-0" data-node-id="151:186">
                <div className="[word-break:break-word]  font-normal leading-[0] relative shrink-0 text-[16px] text-[color:var(--brown,#3a230a)] w-full whitespace-pre-wrap" data-node-id="151:187">
                  <p className="leading-[24px] mb-[8px]">{`As soluções foram discutidas e aprovadas pela equipe da YouRH, que assumiu o desenvolvimento internamente. Como não acompanhei a implementação após a entrega, não tenho dados sobre o impacto das mudanças em produção. `}</p>
                  <p className="leading-[24px] mb-[8px]">Ainda assim, o projeto representou uma evolução significativa na experiência projetada, especialmente na descoberta de treinamentos, na sessão de estudos e na continuidade da aprendizagem.</p>
                  <p>
                    <span className="leading-[24px]">{`Meu maior aprendizado foi `}</span>
                    <span className="[word-break:break-word]  font-semibold leading-[24px]">entender que modernizar um produto existente não significa necessariamente adicionar novas funcionalidades.</span>
                    <span className="leading-[24px]">{` Muitas vezes, `}</span>
                    <span className="[word-break:break-word]  font-semibold leading-[24px]">as mudanças mais importantes surgem ao questionar estruturas consolidadas, simplificar jornadas e priorizar o que realmente faz diferença para o usuário.</span>
                  </p>
                </div>
              </div>
            </CaseContentRow>
          </div>
        </div>
      </main>
    <HomeFooter />
  </div>;
}

