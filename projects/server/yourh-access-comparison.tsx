import "server-only";

const base = "/api/cases/educacao-corporativa/files/";

/* eslint-disable @next/next/no-img-element */
function Icon({ name }: { name: string }) {
  return <img src={base + name + ".svg"} alt="" loading="lazy" />;
}

export function YouRHAccessComparison() {
  return (
    <div className="yourh-comparison" data-node-id="145:60">
      <figure className="yourh-access-panel" data-node-id="145:52">
        <figcaption className="yourh-eyebrow">[ Antes ]</figcaption>
        <div className="yourh-before">
          <div className="yourh-group yourh-training">Grupo de treinamento</div>
          <div className="yourh-before-arrows" aria-hidden="true">
            <span className="yourh-arrow-branches"><span /><span /></span>
          </div>
          <div className="yourh-before-groups">
            <div className="yourh-group"><Icon name="imgUsers" /><span>Colaboradores</span></div>
            <div className="yourh-group"><Icon name="imgBook" /><span>Treinamentos</span></div>
          </div>
        </div>
        <p>Pessoas e conteúdos no mesmo grupo</p>
      </figure>
      <figure className="yourh-access-panel" data-node-id="145:66">
        <figcaption className="yourh-eyebrow">[ Depois ]</figcaption>
        <div className="yourh-after">
          <div className="yourh-group"><Icon name="imgBookMarked" /><strong>Grupos de treinamento</strong><span>Organizam conjuntos de conteúdos</span></div>
          <div className="yourh-after-arrow" aria-hidden="true"><img src={base + "imgArrow3.svg"} alt="" /></div>
          <div className="yourh-group"><Icon name="imgShieldCheck" /><strong>Grupos de acesso</strong><span>Definem permissões para grupos e treinamentos específicos</span></div>
        </div>
        <p>Organização e permissões separadas</p>
      </figure>
    </div>
  );
}
