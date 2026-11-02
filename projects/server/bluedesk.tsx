import "server-only";
import "./bluedesk.css";
import { CaseDecisions } from "@/components/cases/case-decisions";
import { CaseHeader } from "@/components/cases/case-header";
import { HomeFooter } from "@/components/home/home-footer";
import { homeTextFont, homeTitleFont } from "@/components/home/fonts";
import { CaseMedia, CaseDivider } from "@/components/cases/case-media";
import { CaseVideo } from "@/components/cases/case-video";

export default function BluedeskContent() {
  return (
    <div lang="pt-BR" style={{ "--case-title-font": homeTitleFont.style.fontFamily } as React.CSSProperties} className={`${homeTextFont.className} portfolio-home bluedesk-case bg-home-white text-home-brown`} data-node-id="41:4" data-name="1.1 Case">
      <CaseHeader />
      
      <main id="conteudo" className="content-stretch flex flex-col gap-[56px] items-start justify-center case-main relative shrink-0 w-full" data-node-id="41:28">
        <div className="gap-x-[24px] gap-y-[10px] grid grid-cols-1 md:grid-cols-12 grid-rows-[repeat(1,fit-content(100%))] relative shrink-0 w-full" data-node-id="41:29" data-name="Intro">
          <div className="md:col-span-4 content-stretch flex items-start justify-self-stretch relative self-stretch shrink-0" data-node-id="85:4" data-name="Name">
            <h1 className="[word-break:break-word] case-title font-normal leading-[68px] relative shrink-0 text-[48px] text-[color:var(--brown,#3a230a)]" data-node-id="41:30">
              Bluedesk</h1>
          </div>
          <div className="[word-break:break-word] md:col-span-8 content-stretch flex flex-col gap-[24px] items-center justify-center justify-self-stretch relative self-start shrink-0" data-node-id="82:16" data-name="About">
            <p className="font-normal leading-[24px] relative shrink-0 text-[16px] text-[color:var(--brown-lighter,#6d563d)] w-full" data-node-id="55:481">{`A Bluedesk nasceu de uma ideia relativamente simples: tornar a contratação de filmmakers mais previsível, usando um preço fixo em vez das negociações tradicionais do mercado audiovisual. O cliente sabia quanto cobrar, como queria receber uma proposta e até como pretendia proteger pagamentos e entregas. Eu fiquei responsável por tirar esta ideia do papel e transformá-la em um produto pronto para ser desenvolvido. `}</p>
            <div className="content-stretch flex gap-[56px] items-center relative shrink-0 w-full" data-node-id="82:17" data-name="Infos">
              <div className="content-stretch flex flex-col gap-[4px] items-start justify-center relative shrink-0" data-node-id="82:18">
                <p className="font-medium leading-[20px] relative shrink-0 text-[12px] text-[color:var(--brown-lighter,#6d563d)] tracking-[0.6px] uppercase" data-node-id="82:19">
                  [ Papel ]
                </p>
                <p className="font-normal leading-[0] relative shrink-0 text-[16px] text-[color:var(--brown,#3a230a)]" data-node-id="82:20">
                  <span className="leading-[24px]">Product Designe</span>
                  <span className="leading-[24px]">r</span>
                </p>
              </div>
              <div className="content-stretch flex flex-col gap-[4px] items-start justify-center relative shrink-0" data-node-id="82:21">
                <p className="font-medium leading-[20px] relative shrink-0 text-[12px] text-[color:var(--brown-lighter,#6d563d)] tracking-[0.6px] uppercase" data-node-id="82:22">
                  [ Duração ]
                </p>
                <p className="font-normal leading-[24px] relative shrink-0 text-[16px] text-[color:var(--brown,#3a230a)]" data-node-id="82:23">
                  Out. 2025 - Nov. 2025
                </p>
              </div>
              <div className="content-stretch flex flex-col gap-[4px] items-start justify-center relative shrink-0" data-node-id="82:24">
                <p className="font-medium leading-[20px] relative shrink-0 text-[12px] text-[color:var(--brown-lighter,#6d563d)] tracking-[0.6px] uppercase" data-node-id="82:25">
                  [ Escopo ]
                </p>
                <p className="font-normal leading-[24px] relative shrink-0 text-[16px] text-[color:var(--brown,#3a230a)]" data-node-id="82:26">
                  Definição · Protótipos · Especificações do produto
                </p>
              </div>
            </div>
          </div>
        </div>
        <CaseMedia filename="img-filmmaker-01.png" alt="Busca, perfil, detalhes do job e conversa na Bluedesk." width={3600} height={1200} />
        <div className="content-stretch flex flex-col gap-[40px] items-start relative shrink-0 w-full" data-node-id="91:33" data-name="Text">
          <div className="gap-x-[24px] gap-y-[24px] grid grid-cols-1 md:grid-cols-12 grid-rows-[repeat(1,fit-content(100%))] relative shrink-0 w-full" data-node-id="55:506" data-name="Text Div">
            <div className="md:col-span-3 content-stretch flex flex-col gap-[8px] items-start justify-center justify-self-stretch relative self-start shrink-0" data-node-id="91:35" data-name="Section Title">
              <p className="[word-break:break-word] font-medium leading-[22px] relative shrink-0 text-[14px] text-[color:var(--brown-lighter,#6d563d)] tracking-[0.7px] uppercase" data-node-id="91:37">
                [ o modelo ]
              </p>
            </div>
            <div className="[word-break:break-word] md:col-span-9 font-normal justify-self-stretch leading-[0] relative self-start shrink-0 text-[16px] text-[color:var(--brown,#3a230a)]" data-node-id="55:498">
              <p className="mb-[8px]">
                <span className="leading-[24px]">{`A `}</span>
                <span className="[word-break:break-word] font-semibold leading-[24px]">Bluedesk</span>
                <span className="leading-[24px]">{` foi pensada como um marketplace para conectar pessoas que precisam produzir conteúdo audiovisual a filmmakers disponíveis na sua região.`}</span>
              </p>
              <p className="leading-[24px] mb-[8px]">A principal diferença estava no modelo de contratação. Em vez de cada profissional definir seu próprio preço ou negociar uma proposta, todos os jobs partiriam de uma diária fixa de US$120.</p>
              <p className="leading-[24px]">O contratante escolheria o profissional, definiria o briefing e os entregáveis, realizaria o pagamento e enviaria a proposta. O filmmaker poderia então aceitar ou recusar o job.</p>
            </div>
          </div>
          <div className="gap-x-[24px] gap-y-[24px] grid grid-cols-1 md:grid-cols-12 grid-rows-[repeat(1,fit-content(100%))] relative shrink-0 w-full" data-node-id="85:5" data-name="Text Div">
            <div className="md:col-span-3 content-stretch flex flex-col gap-[8px] items-start justify-center justify-self-stretch relative self-start shrink-0" data-node-id="91:39" data-name="Section Title">
              <p className="[word-break:break-word] font-medium leading-[22px] relative shrink-0 text-[14px] text-[color:var(--brown-lighter,#6d563d)] tracking-[0.7px] uppercase" data-node-id="91:40">
                [ a experiência ]
              </p>
            </div>
            <div className="[word-break:break-word] md:col-span-9 font-normal justify-self-stretch leading-[0] relative self-start shrink-0 text-[16px] text-[color:var(--brown,#3a230a)]" data-node-id="85:7">
              <p className="mb-[8px]">
                <span className="leading-[24px]">{`A intenção era concentrar toda a jornada dentro da plataforma: `}</span>
                <span className="[word-break:break-word] font-semibold leading-[24px]">descoberta do profissional, contratação, pagamento, comunicação, entrega dos materiais, revisão e avaliação.</span>
              </p>
              <p className="leading-[24px] mb-[8px]">Para reduzir o risco dos dois lados, o pagamento seria realizado antecipadamente e mantido em escrow até a conclusão do trabalho. Durante a revisão, o contratante teria acesso ao material com marca d’água, enquanto os arquivos originais só seriam liberados após a aprovação.</p>
              <p className="font-semibold leading-[24px]">Como o preço seria o mesmo para todos, qualidade, reputação e adequação ao job precisariam assumir um papel central na escolha do filmmaker.</p>
            </div>
          </div>
        </div>
        <CaseDivider />
        <div className="content-stretch flex flex-col gap-[16px] items-start relative shrink-0 w-full" data-node-id="98:63">
          <p className="[word-break:break-word] font-medium leading-[22px] relative shrink-0 text-[14px] text-[color:var(--brown-lighter,#6d563d)] tracking-[0.7px] uppercase" data-node-id="91:45">
            [ desafios ]
          </p>
          <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-node-id="98:68">
            <div className="gap-x-[24px] gap-y-[24px] grid grid-cols-1 md:grid-cols-12 grid-rows-[repeat(1,fit-content(100%))] relative shrink-0 w-full" data-node-id="91:30" data-name="Text Div">
              <div className="md:col-span-4 content-stretch flex items-center justify-self-stretch relative self-start shrink-0" data-node-id="103:153">
                <h2 className="[word-break:break-word] flex-[1_0_0] case-title font-semibold leading-[36px] min-w-px relative text-[24px] text-[color:var(--brown,#3a230a)]" data-node-id="91:46">{`O produto parecia simples, mas havia muito para definir `}</h2>
              </div>
              <div className="md:col-span-8 content-stretch flex flex-col items-center justify-center justify-self-stretch relative self-start shrink-0" data-node-id="97:62">
                <div className="[word-break:break-word] font-normal leading-[0] relative shrink-0 text-[16px] text-[color:var(--brown,#3a230a)] w-full" data-node-id="91:32">
                  <p className="leading-[24px] mb-[8px]">Quando o projeto começou, não havia fluxos, wireframes ou documentação. Existia uma visão de negócio relativamente clara e algumas regras já definidas, mas muitas decisões só apareceram quando comecei a conectar todas as partes da jornada.</p>
                  <p className="leading-[24px] mb-[8px]">Perguntas aparentemente pequenas passaram a ter impacto direto no funcionamento da plataforma:</p>
                  <ul className="list-disc mb-[8px]">
                    <li className="mb-0 ms-[24px]">
                      <span className="leading-[24px]">Quanto tempo o filmmaker teria para aceitar uma proposta?</span>
                    </li>
                    <li className="mb-0 ms-[24px]">
                      <span className="leading-[24px]">O que aconteceria se ele não entregasse no prazo?</span>
                    </li>
                    <li className="mb-0 ms-[24px]">
                      <span className="leading-[24px]">Como lidar com revisões, disputas e estornos?</span>
                    </li>
                    <li className="mb-0 ms-[24px]">
                      <span className="leading-[24px]">Em que momento o pagamento seria liberado?</span>
                    </li>
                    <li className="mb-0 ms-[24px]">
                      <span className="leading-[24px]">Contratante e filmmaker precisariam conversar dentro da plataforma?</span>
                    </li>
                    <li className="ms-[24px]">
                      <span className="leading-[24px]">O que o administrativo poderia fazer quando algo desse errado?</span>
                    </li>
                  </ul>
                  <p>
                    <span className="[word-break:break-word] font-semibold leading-[24px]">Meu trabalho passou a ser menos sobre “desenhar uma interface” e mais sobre transformar essas lacunas em regras, estados e decisões de produto</span>
                    <span className="leading-[24px]">{` que fizessem a Bluedesk funcionar de ponta a ponta.`}</span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <CaseDivider />
        <div className="content-stretch flex flex-col gap-[16px] items-start relative shrink-0 w-full" data-node-id="98:69">
          <p className="[word-break:break-word] font-medium leading-[22px] relative shrink-0 text-[14px] text-[color:var(--brown-lighter,#6d563d)] tracking-[0.7px] uppercase" data-node-id="98:70">
            [ antes dos protótipos ]
          </p>
          <div className="content-stretch flex flex-col gap-[40px] items-start relative shrink-0 w-full" data-node-id="98:71">
            <div className="gap-x-[24px] gap-y-[24px] grid grid-cols-1 md:grid-cols-12 grid-rows-[repeat(1,fit-content(100%))] relative shrink-0 w-full" data-node-id="98:72" data-name="Text Div">
              <div className="md:col-span-4 content-stretch flex items-center justify-self-stretch relative self-start shrink-0" data-node-id="103:154">
                <h2 className="[word-break:break-word] flex-[1_0_0] case-title font-semibold leading-[36px] min-w-px relative text-[24px] text-[color:var(--brown,#3a230a)]" data-node-id="103:155">
                  Antes dos protótipos, eu precisava enxergar o sistema inteiro
                </h2>
              </div>
              <div className="md:col-span-8 content-stretch flex flex-col items-center justify-center justify-self-stretch relative self-start shrink-0" data-node-id="98:74">
                <div className="[word-break:break-word] font-normal leading-[0] relative shrink-0 text-[16px] text-[color:var(--brown,#3a230a)] w-full" data-node-id="98:75">
                  <p className="leading-[24px] mb-[8px]">Comecei transformando tudo o que havia entendido no kickoff em um fluxograma modular da plataforma.</p>
                  <p className="leading-[24px] mb-[8px]">Ele não era um user flow tradicional. Misturava módulos, estados, regras e caminhos possíveis para criar uma visão macro do produto antes de avançarmos para protótipos.</p>
                  <p className="leading-[24px]">A vantagem era simples: era rápido de construir, fácil de discutir e bom para revelar lacunas cedo.</p>
                </div>
              </div>
            </div>
            <figure className="case-video-scroll w-full" tabIndex={0} aria-label="Fluxograma: role horizontalmente para explorar os detalhes">
              <CaseVideo filename="video-filmmaker-01.mp4" label="Fluxograma modular da plataforma Bluedesk" className="case-diagram" />
            </figure>
            <div className="gap-x-[24px] gap-y-[24px] grid grid-cols-1 md:grid-cols-12 grid-rows-[repeat(1,fit-content(100%))] relative shrink-0 w-full" data-node-id="98:76" data-name="Text Div">
              <h2 className="[word-break:break-word] md:col-span-4 case-title font-semibold justify-self-stretch leading-[36px] relative self-start shrink-0 text-[24px] text-[color:var(--brown,#3a230a)]" data-node-id="99:113">
                O diagrama ajudou a tomar decisões importantes
              </h2>
              <div className="md:col-span-8 content-stretch flex flex-col items-end justify-center justify-self-stretch relative self-start shrink-0" data-node-id="98:78">
                <div className="[word-break:break-word] font-normal leading-[0] relative shrink-0 text-[16px] text-[color:var(--brown,#3a230a)] w-full" data-node-id="98:79">
                  <p className="leading-[24px] mb-[8px]">Enquanto eu estruturava cada módulo dentro deste diagrama, novas perguntas apareciam. Algumas delas mudaram decisões importantes do produto.</p>
                  <p className="leading-[24px]">O fluxograma não serviu apenas para registrar decisões. Ele foi a ferramenta que usamos para descobrir quais decisões ainda precisavam existir.</p>
                </div>
              </div>
            </div>
            <CaseDecisions className="case-decisions bg-[var(--subtle,#f8f7f4)] content-stretch flex flex-col gap-[24px] items-start p-6 lg:p-8 relative rounded-[16px] shrink-0 w-full" nodeId="99:85">
              <p className="[word-break:break-word] font-medium leading-[20px] relative shrink-0 text-[12px] text-[color:var(--brown-lighter,#6d563d)] tracking-[0.6px] uppercase" data-node-id="99:114">
                [ decisões ]
              </p>
              <div className="content-stretch flex gap-[40px] items-start relative shrink-0 w-full" data-node-id="99:96">
                <div className="[word-break:break-word] content-stretch flex flex-[1_0_0] flex-col gap-[8px] items-start min-w-px relative" data-node-id="99:92">
                  <h3 className="case-title font-semibold leading-[30px] relative shrink-0 text-[20px] text-[color:var(--brown,#3a230a)] w-full" data-node-id="99:83">
                    O lançamento estava grande demais
                  </h3>
                  <div className="font-normal leading-[0] relative shrink-0 text-[14px] text-[color:var(--brown-lighter,#6d563d)] w-full" data-node-id="99:84">
                    <p className="leading-[22px] mb-[8px]">A ideia inicial era lançar a Bluedesk simultaneamente na Flórida, no Brasil e na Espanha.</p>
                    <p className="leading-[22px]">Recomendamos começar por uma única região para reduzir escopo e acelerar o lançamento. A Flórida foi escolhida como mercado inicial.</p>
                  </div>
                </div>
                <span className="case-decision-rule" aria-hidden="true" />
                <div className="[word-break:break-word] content-stretch flex flex-[1_0_0] flex-col gap-[8px] items-start min-w-px relative" data-node-id="99:93">
                  <h3 className="case-title font-semibold leading-[30px] relative shrink-0 text-[20px] text-[color:var(--brown,#3a230a)] w-full" data-node-id="99:94">
                    E se o filmmaker simplesmente não responder?
                  </h3>
                  <div className="font-normal leading-[0] relative shrink-0 text-[14px] text-[color:var(--brown-lighter,#6d563d)] w-full" data-node-id="99:95">
                    <p className="leading-[22px] mb-[8px]">O fluxo de contratação já previa que o profissional poderia aceitar ou recusar um job, mas não existia uma regra para inatividade.</p>
                    <p className="leading-[22px]">Definimos então um prazo de 5 dias para resposta. Depois disso, o job seria cancelado automaticamente e o valor estornado ao contratante.</p>
                  </div>
                </div>
                <span className="case-decision-rule" aria-hidden="true" />
                <div className="[word-break:break-word] content-stretch flex flex-[1_0_0] flex-col gap-[8px] items-start min-w-px relative" data-node-id="99:97">
                  <h3 className="case-title font-semibold leading-[30px] relative shrink-0 text-[20px] text-[color:var(--brown,#3a230a)] w-full" data-node-id="99:98">
                    Faltava um lugar para combinar o trabalho
                  </h3>
                  <div className="font-normal leading-[0] relative shrink-0 text-[14px] text-[color:var(--brown-lighter,#6d563d)] w-full" data-node-id="99:99">
                    <p className="leading-[22px] mb-[8px]">Ao mapear a jornada completa, ficou claro que contratante e filmmaker precisariam continuar alinhando detalhes depois da contratação.</p>
                    <p className="leading-[22px]">Foi daí que surgiu a necessidade de um chat dentro da plataforma.</p>
                  </div>
                </div>
              </div>
            </CaseDecisions>
          </div>
        </div>
        <CaseDivider />
        <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-node-id="103:115">
          <div className="content-stretch flex flex-col gap-12 md:gap-20 items-start relative shrink-0 w-full" data-node-id="103:117">
            <div className="gap-x-10 xl:gap-x-20 gap-y-[24px] grid grid-cols-1 md:grid-cols-2 grid-rows-[repeat(1,fit-content(100%))] relative shrink-0 w-full" data-node-id="103:118" data-name="Text Div">
              <div className="case-briefing"><CaseVideo filename="video-filmmaker-02.mp4" label="Etapas do briefing de contratação" className="case-phone-video" /></div>
              <div className="[word-break:break-word] content-stretch flex flex-col gap-[16px] items-start justify-center justify-self-stretch relative self-stretch shrink-0" data-node-id="103:120">
                <p className="font-medium leading-[22px] relative shrink-0 text-[14px] text-[color:var(--brown-lighter,#6d563d)] tracking-[0.7px] uppercase" data-node-id="103:116">
                  [ solução 1/3 ]
                </p>
                <h2 className="case-title font-semibold leading-[36px] min-w-full relative shrink-0 text-[24px] text-[color:var(--brown,#3a230a)] w-full" data-node-id="103:119">
                  O briefing precisava fazer mais do que coletar informações
                </h2>
                <div className="font-normal leading-[0] min-w-full relative shrink-0 text-[16px] text-[color:var(--brown,#3a230a)] w-full whitespace-pre-wrap" data-node-id="103:121">
                  <p className="mb-[8px]">
                    <span className="leading-[24px]">{`O cliente já sabia quais informações precisava receber antes de aceitar um job. `}</span>
                    <span className="[word-break:break-word] font-semibold leading-[24px]">Minha responsabilidade foi transformar esse conteúdo em uma experiência clara de contratação.</span>
                  </p>
                  <p className="mb-[8px]">
                    <span className="leading-[24px]">{`Dividi o briefing em etapas menores para evitar um formulário longo e difícil de preencher. Mas, durante a criação do restante da jornada, ficou claro que aquele briefing poderia fazer mais do que apenas descrever o trabalho. Ele poderia `}</span>
                    <span className="[word-break:break-word] font-semibold leading-[24px]">estruturar o próprio job.</span>
                    <span className="leading-[24px]">{` `}</span>
                  </p>
                  <p className="leading-[24px]">Se o contratante solicitasse, por exemplo, dois vídeos principais e três short cuts (cortes do vídeo original) por vídeo, o sistema geraria automaticamente os campos correspondentes para o filmmaker na etapa de entrega. A mesma estrutura seria mantida na revisão do contratante. Isso reduzia ambiguidades dos dois lados e mantinha o acordo feito no início visível até a conclusão do trabalho.</p>
                </div>
              </div>
            </div>
            <div className="content-stretch flex flex-col gap-[40px] items-start relative shrink-0 w-full" data-node-id="108:19516" data-name="Text Div">
              <div className="content-stretch flex flex-col items-start justify-center relative shrink-0 w-full" data-node-id="108:19519">
                <div className="gap-x-[24px] gap-y-[24px] grid grid-cols-1 md:grid-cols-12 grid-rows-[repeat(1,fit-content(100%))] relative shrink-0 w-full" data-node-id="108:19523" data-name="Text Div">
                  <div className="[word-break:break-word] md:col-span-4 content-stretch flex flex-col items-start justify-self-stretch relative self-start shrink-0" data-node-id="108:19531">
                    <p className="font-medium leading-[22px] relative shrink-0 text-[14px] text-[color:var(--brown-lighter,#6d563d)] tracking-[0.7px] uppercase" data-node-id="108:19528">
                      [ solução 2/3 ]
                    </p>
                    <h2 className="case-title font-semibold leading-[36px] min-w-full relative shrink-0 text-[24px] text-[color:var(--brown,#3a230a)] w-full" data-node-id="108:19529">
                      Se todos custam o mesmo, como escolher quem contratar?
                    </h2>
                  </div>
                  <div className="md:col-span-8 content-stretch flex flex-col items-end justify-center justify-self-stretch relative self-start shrink-0" data-node-id="108:19526">
                    <div className="[word-break:break-word] font-normal leading-[0] relative shrink-0 text-[16px] text-[color:var(--brown,#3a230a)] w-full" data-node-id="108:19527">
                      <p className="mb-[8px]">
                        <span className="leading-[24px]">{`Ao remover a negociação de preço, a Bluedesk também removia um dos critérios mais comuns de comparação entre profissionais. Isso tornava outra coisa muito mais importante: `}</span>
                        <span className="[word-break:break-word] font-semibold leading-[24px]">dar ao contratante sinais suficientes de qualidade e confiança para tomar uma decisão.</span>
                      </p>
                      <p className="leading-[24px] mb-[8px]">Por isso, organizei a descoberta dos filmmakers em torno de três elementos principais:</p>
                      <ul className="leading-[24px] list-disc mb-[8px]">
                        <li className="mb-0 ms-[24px]">
                          <span className="[word-break:break-word] font-semibold">expertise</span>, para indicar o tipo de trabalho em que cada profissional atua;
                        </li>
                        <li className="mb-0 ms-[24px]">
                          <span className="[word-break:break-word] font-semibold">localização</span>, para ajudar na escolha por proximidade;
                        </li>
                        <li className="ms-[24px]">
                          <span className="[word-break:break-word] font-semibold">reviews</span>, como sinal de confiança e histórico de entrega.
                        </li>
                      </ul>
                      <p className="leading-[24px] mb-[8px]">Além disso, defini a lógica de relevância da listagem. A ordenação priorizava a maior média de avaliações e, em caso de empate, o maior número de jobs concluídos. O usuário também poderia ordenar os resultados por distância, caso autorizasse o acesso à localização.</p>
                      <p>
                        <span className="leading-[24px]">{`A intenção era simples: `}</span>
                        <span className="[word-break:break-word] font-semibold leading-[24px]">se preço não diferencia os profissionais, a interface precisa tornar qualidade e reputação fáceis de comparar.</span>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <CaseMedia filename="img-filmmaker-02.png" alt="Listagem, perfil e ranking de filmmakers." width={2400} height={1120} />
            </div>
            <div className="content-stretch flex flex-col gap-[40px] items-start relative shrink-0 w-full" data-node-id="116:11275" data-name="Text Div">
              <div className="content-stretch flex flex-col items-start justify-center relative shrink-0 w-full" data-node-id="116:11276">
                <div className="gap-x-[24px] gap-y-[24px] grid grid-cols-1 md:grid-cols-12 grid-rows-[repeat(1,fit-content(100%))] relative shrink-0 w-full" data-node-id="116:11277" data-name="Text Div">
                  <div className="[word-break:break-word] md:col-span-4 content-stretch flex flex-col items-start justify-self-stretch relative self-start shrink-0" data-node-id="116:11278">
                    <p className="font-medium leading-[22px] relative shrink-0 text-[14px] text-[color:var(--brown-lighter,#6d563d)] tracking-[0.7px] uppercase" data-node-id="116:11279">
                      [ solução 3/3 ]
                    </p>
                    <h2 className="case-title font-semibold leading-[36px] min-w-full relative shrink-0 text-[24px] text-[color:var(--brown,#3a230a)] w-full" data-node-id="116:11280">
                      E quando alguma coisa dá errado?
                    </h2>
                  </div>
                  <div className="md:col-span-8 content-stretch flex flex-col items-end justify-center justify-self-stretch relative self-start shrink-0" data-node-id="116:11282">
                    <div className="[word-break:break-word] font-normal leading-[0] relative shrink-0 text-[16px] text-[color:var(--brown,#3a230a)] w-full" data-node-id="116:11283">
                      <p className="leading-[24px] mb-[8px]">Até aqui, o fluxo parece simples: contratar, produzir, entregar e aprovar. Mas um marketplace precisa continuar funcionando quando uma das partes atrasa, não responde ou pede alterações.</p>
                      <p className="leading-[24px] mb-[8px]">Por isso, estruturei o ciclo do job em estados claros:</p>
                      <p className="font-semibold leading-[24px] mb-[8px]">Pending Acceptance → In Progress → Awaiting Approval → Revision → Completed</p>
                      <p className="mb-[8px]">
                        <span className="leading-[24px]">{`Além desses, ainda existia o `}</span>
                        <span className="[word-break:break-word] font-semibold leading-[24px]">Refunded</span>
                        <span className="leading-[24px]">{` como saída em diferentes pontos do processo.`}</span>
                      </p>
                      <p className="leading-[24px]">Cada estado definia quais ações estavam disponíveis para contratante e filmmaker e o que o sistema deveria fazer quando ninguém agisse.</p>
                    </div>
                  </div>
                </div>
              </div>
              <CaseDecisions className="case-decisions bg-[var(--subtle,#f8f7f4)] content-stretch flex flex-col gap-[24px] items-start p-6 lg:p-8 relative rounded-[16px] shrink-0 w-full" nodeId="103:128">
                <p className="[word-break:break-word] font-medium leading-[20px] relative shrink-0 text-[12px] text-[color:var(--brown-lighter,#6d563d)] tracking-[0.6px] uppercase" data-node-id="103:129">
                  [ decisões ]
                </p>
                <div className="content-stretch flex gap-[24px] items-start relative shrink-0 w-full" data-node-id="103:130">
                  <div className="[word-break:break-word] content-stretch flex flex-[1_0_0] flex-col gap-[8px] items-start min-w-px relative" data-node-id="103:131">
                    <h3 className="case-title font-semibold leading-[30px] relative shrink-0 text-[20px] text-[color:var(--brown,#3a230a)] w-full" data-node-id="103:132">
                      Se o filmmaker não responder
                    </h3>
                    <p className="font-normal leading-[22px] relative shrink-0 text-[14px] text-[color:var(--brown-lighter,#6d563d)] w-full" data-node-id="103:133">
                      Depois do pagamento, o filmmaker tinha 5 dias para aceitar ou recusar o job. Sem resposta, a contratação era cancelada e o valor estornado.
                    </p>
                  </div>
                  <span className="case-decision-rule" aria-hidden="true" />
                  <div className="[word-break:break-word] content-stretch flex flex-[1_0_0] flex-col gap-[8px] items-start min-w-px relative" data-node-id="103:135">
                    <h3 className="case-title font-semibold leading-[30px] relative shrink-0 text-[20px] text-[color:var(--brown,#3a230a)] w-full" data-node-id="103:136">
                      Se a entrega atrasar
                    </h3>
                    <p className="font-normal leading-[22px] relative shrink-0 text-[14px] text-[color:var(--brown-lighter,#6d563d)] w-full" data-node-id="103:137">
                      Ao atingir o prazo, o sistema concedia um período adicional de 24 horas. Se o material ainda não fosse enviado, o job era cancelado e o pagamento devolvido ao contratante.
                    </p>
                  </div>
                  <span className="case-decision-rule" aria-hidden="true" />
                  <div className="[word-break:break-word] content-stretch flex flex-[1_0_0] flex-col gap-[8px] items-start min-w-px relative" data-node-id="103:139">
                    <h3 className="case-title font-semibold leading-[30px] relative shrink-0 text-[20px] text-[color:var(--brown,#3a230a)] w-full" data-node-id="103:140">
                      Se o cliente não revisar
                    </h3>
                    <p className="font-normal leading-[22px] relative shrink-0 text-[14px] text-[color:var(--brown-lighter,#6d563d)] w-full" data-node-id="103:141">
                      Depois da entrega, o contratante tinha 3 dias para aprovar ou solicitar alterações. Sem ação, o job era concluído automaticamente e o pagamento liberado ao filmmaker.
                    </p>
                  </div>
                  <span className="case-decision-rule" aria-hidden="true" />
                  <div className="[word-break:break-word] content-stretch flex flex-[1_0_0] flex-col gap-[8px] items-start min-w-px relative" data-node-id="116:11297">
                    <h3 className="case-title font-semibold leading-[30px] relative shrink-0 text-[20px] text-[color:var(--brown,#3a230a)] w-full" data-node-id="116:11298">
                      Se houver revisão
                    </h3>
                    <p className="font-normal leading-[22px] relative shrink-0 text-[14px] text-[color:var(--brown-lighter,#6d563d)] w-full" data-node-id="116:11299">
                      O filmmaker tinha 36 horas para enviar uma nova versão. Sugeri que esse limite fosse configurável por filmmaker, em vez de fixo para toda a plataforma.
                    </p>
                  </div>
                </div>
              </CaseDecisions>
            </div>
          </div>
        </div>
        <CaseDivider />
        <div className="content-stretch flex flex-col gap-[40px] items-start relative shrink-0 w-full" data-node-id="127:11388">
          <div className="gap-x-[24px] gap-y-[24px] grid grid-cols-1 md:grid-cols-12 grid-rows-[repeat(1,fit-content(100%))] relative shrink-0 w-full" data-node-id="121:11352" data-name="Text Div">
            <div className="[word-break:break-word] md:col-span-4 content-stretch flex flex-col items-start justify-self-stretch relative self-start shrink-0" data-node-id="121:11359">
              <p className="font-medium leading-[22px] relative shrink-0 text-[14px] text-[color:var(--brown-lighter,#6d563d)] tracking-[0.7px] uppercase" data-node-id="121:11360">
                [ hand-off ]
              </p>
              <h2 className="case-title font-semibold leading-[36px] min-w-full relative shrink-0 text-[24px] text-[color:var(--brown,#3a230a)] w-full" data-node-id="121:11361">
                Quando as telas deixaram de ser suficientes
              </h2>
            </div>
            <div className="md:col-span-8 content-stretch flex flex-col items-end justify-center justify-self-stretch relative self-start shrink-0" data-node-id="121:11355">
              <div className="[word-break:break-word] font-normal leading-[0] relative shrink-0 text-[16px] text-[color:var(--brown,#3a230a)] w-full" data-node-id="121:11356">
                <p className="mb-[8px]">
                  <span className="leading-[24px]">{`À medida que o produto ganhava estados, exceções e automações, `}</span>
                  <span className="[word-break:break-word] font-semibold leading-[24px]">{`o protótipo deixou de ser suficiente para explicar sozinho como a Bluedesk deveria funcionar. `}</span>
                  <span className="leading-[24px]">Algumas regras não estavam visíveis em uma tela específica. Elas dependiam de tempo, comportamento anterior ou da relação entre diferentes partes do sistema.</span>
                </p>
                <p className="leading-[24px] mb-[8px]">Por isso, complementei os fluxos com uma documentação de regras de negócio e comportamento. Ali registrei, por exemplo:</p>
                <ul className="list-disc mb-[8px]">
                  <li className="mb-0 ms-[24px]">
                    <span className="leading-[24px]">prazos de aceite, entrega, revisão e aprovação;</span>
                  </li>
                  <li className="mb-0 ms-[24px]">
                    <span className="leading-[24px]">condições de cancelamento e estorno;</span>
                  </li>
                  <li className="mb-0 ms-[24px]">
                    <span className="leading-[24px]">mudanças de status do job;</span>
                  </li>
                  <li className="mb-0 ms-[24px]">
                    <span className="leading-[24px]">regras de acesso por tipo de usuário;</span>
                  </li>
                  <li className="mb-0 ms-[24px]">
                    <span className="leading-[24px]">automações em casos de inatividade;</span>
                  </li>
                  <li className="mb-0 ms-[24px]">
                    <span className="leading-[24px]">condições para liberação do pagamento;</span>
                  </li>
                  <li className="ms-[24px]">
                    <span className="leading-[24px]">relação entre briefing, entrega e revisão.</span>
                  </li>
                </ul>
                <p>
                  <span className="leading-[24px]">{`A ideia era simples: `}</span>
                  <span className="[word-break:break-word] font-semibold leading-[24px]">a interface mostrava o que o usuário via; a documentação explicava o que o sistema precisava fazer.</span>
                </p>
              </div>
            </div>
          </div>
          <CaseMedia filename="img-filmmaker-03.png" alt="Regras de negócio de revisão e prazo de entrega relacionadas aos estados do job." width={2022} height={944} complex />
        </div>
        <CaseDivider />
        <div className="content-stretch flex flex-col gap-[40px] items-start relative shrink-0 w-full" data-node-id="127:11391">
          <div className="gap-x-[24px] gap-y-[24px] grid grid-cols-1 md:grid-cols-12 grid-rows-[repeat(1,fit-content(100%))] relative shrink-0 w-full" data-node-id="127:11392" data-name="Text Div">
            <div className="[word-break:break-word] md:col-span-4 content-stretch flex flex-col items-start justify-self-stretch relative self-start shrink-0" data-node-id="127:11393">
              <p className="font-medium leading-[22px] relative shrink-0 text-[14px] text-[color:var(--brown-lighter,#6d563d)] tracking-[0.7px] uppercase" data-node-id="127:11394">
                [ Resultados ]
              </p>
              <h2 className="case-title font-semibold leading-[36px] min-w-full relative shrink-0 text-[24px] text-[color:var(--brown,#3a230a)] w-full" data-node-id="127:11395">
                O produto ficou pronto. O desenvolvimento não aconteceu
              </h2>
            </div>
            <div className="md:col-span-8 content-stretch flex flex-col items-end justify-center justify-self-stretch relative self-start shrink-0" data-node-id="127:11397">
              <div className="[word-break:break-word] font-normal leading-[0] relative shrink-0 text-[16px] text-[color:var(--brown,#3a230a)] w-full" data-node-id="127:11398">
                <p className="leading-[24px] mb-[8px]">Depois de aproximadamente seis semanas, a Bluedesk tinha seus principais fluxos, estados, regras e interfaces definidos e aprovados pelo cliente.</p>
                <p className="leading-[24px] mb-[8px]">O projeto estava pronto para seguir para desenvolvimento, mas essa etapa não foi contratada pelo cliente. Por isso, este case não apresenta métricas de uso, conversão ou impacto pós-lançamento.</p>
                <p>
                  <span className="leading-[24px]">{`O resultado que consigo atribuir diretamente ao meu trabalho foi outro: `}</span>
                  <span className="[word-break:break-word] font-semibold leading-[24px]">transformar uma ideia inicial em um produto estruturado o suficiente para ser discutido, validado e implementado.</span>
                </p>
              </div>
            </div>
          </div>
          <div className="gap-x-[24px] gap-y-[24px] grid grid-cols-1 md:grid-cols-12 grid-rows-[repeat(1,fit-content(100%))] relative shrink-0 w-full" data-node-id="127:11415" data-name="Text Div">
            <h2 className="[word-break:break-word] md:col-span-4 case-title font-semibold justify-self-stretch leading-[36px] relative self-start shrink-0 text-[24px] text-[color:var(--brown,#3a230a)]" data-node-id="127:11416">
              O que eu validaria antes de lançar
            </h2>
            <div className="md:col-span-8 content-stretch flex flex-col items-end justify-center justify-self-stretch relative self-start shrink-0" data-node-id="127:11418">
              <div className="[word-break:break-word] font-normal leading-[0] relative shrink-0 text-[16px] text-[color:var(--brown,#3a230a)] w-full" data-node-id="127:11419">
                <p className="leading-[24px] mb-[8px]">Como não tivemos acesso a usuários finais durante a fase de design, algumas decisões ainda precisariam ser testadas antes de colocar o produto no mercado.</p>
                <p className="leading-[24px]">Eu priorizaria três pontos:</p>
              </div>
            </div>
          </div>
          <CaseDecisions className="case-decisions bg-[var(--subtle,#f8f7f4)] content-stretch flex flex-col gap-[24px] items-start p-6 lg:p-8 relative rounded-[16px] shrink-0 w-full" nodeId="127:11400">
            <p className="[word-break:break-word] font-medium leading-[20px] relative shrink-0 text-[12px] text-[color:var(--brown-lighter,#6d563d)] tracking-[0.6px] uppercase" data-node-id="127:11401">
              [ PARA O FUTURO ]
            </p>
            <div className="content-stretch flex gap-[40px] items-start relative shrink-0 w-full" data-node-id="127:11402">
              <div className="[word-break:break-word] content-stretch flex flex-[1_0_0] flex-col gap-[8px] items-start min-w-px relative" data-node-id="127:11403">
                <h3 className="case-title font-semibold leading-[30px] relative shrink-0 text-[20px] text-[color:var(--brown,#3a230a)] w-full" data-node-id="127:11404">
                  O modelo de preço fixo
                </h3>
                <p className="font-normal leading-[22px] relative shrink-0 text-[14px] text-[color:var(--brown-lighter,#6d563d)] w-full" data-node-id="127:11405">
                  Entender se contratantes percebem o valor como simples e previsível — e não como uma limitação.
                </p>
              </div>
              <span className="case-decision-rule" aria-hidden="true" />
              <div className="[word-break:break-word] content-stretch flex flex-[1_0_0] flex-col gap-[8px] items-start min-w-px relative" data-node-id="127:11407">
                <h3 className="case-title font-semibold leading-[30px] relative shrink-0 text-[20px] text-[color:var(--brown,#3a230a)] w-full" data-node-id="127:11408">
                  A escolha do filmmaker
                </h3>
                <p className="font-normal leading-[22px] relative shrink-0 text-[14px] text-[color:var(--brown-lighter,#6d563d)] w-full" data-node-id="127:11409">
                  Validar se reviews, reel, expertise e ranking oferecem informação suficiente para alguém se sentir seguro ao contratar um profissional.
                </p>
              </div>
              <span className="case-decision-rule" aria-hidden="true" />
              <div className="[word-break:break-word] content-stretch flex flex-[1_0_0] flex-col gap-[8px] items-start min-w-px relative" data-node-id="127:11411">
                <h3 className="case-title font-semibold leading-[30px] relative shrink-0 text-[20px] text-[color:var(--brown,#3a230a)] w-full" data-node-id="127:11412">
                  O briefing
                </h3>
                <p className="font-normal leading-[22px] relative shrink-0 text-[14px] text-[color:var(--brown-lighter,#6d563d)] w-full" data-node-id="127:11413">
                  Verificar se uma pessoa sem experiência em produção audiovisual consegue definir corretamente o que precisa contratar e entregar.
                </p>
              </div>
            </div>
          </CaseDecisions>
        </div>
      </main>
      <HomeFooter />
    </div>
  );
}
